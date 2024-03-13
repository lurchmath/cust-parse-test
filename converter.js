
// To dos:
//  - expand set of tests for many new mathematical expressions in many languages,
//    including expressions that bind variables
//     - sum, difference (as sum of negation), associative lists of these
//     - product, quotient (as product of reciprocal), fraction, associative lists
//     - exponents, factorial
//     - set membership and its negation
//     - subseteq, union, intersection, complement
//     - cartesian product of sets, ordered pair of elements
//     - function from A to B, function application, composition, and inverses
//     - <, >, <=, >=, =, neq
//     - |, congruence mod m, generic relation ~, equivalence class (for a relation)
//     - X is a[n] Y, X is a[n] Y of Z, for a specific finite set of Ys
//     - assumptions and declarations (but no need for Declare--we can do that
//       in each doc just by listing concept.putdown for each concept)
//     - EFAs
//     - naked binding?
//  - expand all languages to support many new mathematical features, tests for each
//    (note that set theory notation will need analogs to sum, product, ...)
//  - define new language of Lurch notation and verify all (or almost all) of its
//    features can be supported
//  - add support for features like associativity (in all conversion directions)
//  - test whether all MathLive output can be parsed by this LaTeX parser

import { Grammar, Tokenizer } from 'earley-parser'
import { AST } from './ast.js'

const defaultVarNames = 'ABC'

export const escapeRegExp = ( str ) =>
    str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' )

const putdownLeaves = putdown => {
    if ( putdown.length == 0 ) return [ ]
    const match = /^[^()\s,]+/.exec( putdown )
    return match ?
        [ match[0], ...putdownLeaves( putdown.substring( match[0].length ) ) ] :
        putdownLeaves( putdown.substring( 1 ) )
}

export class Converter {

    constructor () {
        Converter.computeSupertypeGraph()
        this.languages = new Map()
        this.concepts = new Map()
        Converter.syntacticTypeHierarchies.forEach( hierarchy => {
            if ( hierarchy[0] != 'expression' ) return
            const last = hierarchy[hierarchy.length-1]
            if ( Converter.isAtomicType( last ) )
                this.addConcept( `grouped${last}`, last, hierarchy[1] )
        } )
        this.addLanguage( 'putdown', null, x =>
            x.replaceAll( '( ', '(' ).replaceAll( ' )', ')' ) )
    }

    addLanguage ( name, groupers = [ '(', ')' ], linter = x => x ) {
        if ( !groupers ) groupers = [ ] // support passing null
        // Create both things the language needs--a tokenizer and a grammar--and
        // store them in this converter's languages map.
        const tokenizer = new Tokenizer()
        tokenizer.addType( /\s/, () => null )
        const grammar = new Grammar()
        grammar.START = Converter.syntacticTypeHierarchies[0][0]
        this.languages.set( name,
            { name, tokenizer, grammar, groupers, linter } )
        // If the concept is atomic and has a putdown form, use that as the
        // default notation in the new language; this can be overridden by any
        // later call to addNotation().
        Array.from( this.concepts.keys() ).forEach( conceptName => {
            const concept = this.concepts.get( conceptName )
            if ( Converter.isAtomicType( concept.parentType ) )
                this.addNotation( name, conceptName, concept.putdown )
        } )
        // Add subtyping rules and grouping rules to the grammar.
        Converter.syntacticTypeHierarchies.forEach( hierarchy => {
            for ( let i = 0 ; i < hierarchy.length - 1 ; i++ )
                grammar.addRule( hierarchy[i], hierarchy[i+1] )
            if ( groupers.length > 0 && hierarchy[0] == 'expression' ) {
                const last = hierarchy[hierarchy.length-1]
                if ( Converter.isAtomicType( last ) ) {
                    for ( let i = 0 ; i < groupers.length - 1 ; i += 2 ) {
                        const left = groupers[i]
                        const right = groupers[i+1]
                        this.addNotation( name, `grouped${last}`,
                            `${left} A ${right}` )
                    }
                }
            }
        } )
    }

    languages () {
        return Array.from( this.languages.keys() )
    }

    isLanguage ( name ) {
        return this.languages.has( name )
    }

    //  - parentType : string, name of syntactic type in which this concept fits
    //    (required)
    //  - putdown : string or regexp, behaving as follows:
    //     - For a nonatomic concept, this must be a string, and is the name of
    //       the operator that will be used when representing the concept in the
    //       putdown language (if omitted, defaults to concept name)
    //     - For an atomic concept, if this is a string, it will be the symbol
    //       that will to represent the concept in the putdown language (if
    //       omitted, defaults to concept name)
    //     - For an atomic concept, it can be a regexp instead, and anything
    //       matching that regexp can count as the representation of itself in
    //       the putdown langauge, so that entire infinite categories of things
    //       (e.g., integers, words) can be made into atomic concepts.
    // (this list can grow later if needed)
    addConcept ( name, parentType, putdown ) {
        if ( !putdown ) putdown = name
        const data = { parentType, putdown }
        data.typeSequence = putdown instanceof RegExp ? [ ] :
            putdownLeaves( putdown ).filter( leaf =>
                Converter.isSyntacticType( leaf ) || this.isConcept( leaf ) )
        this.concepts.set( name, data )
        if ( this.isLanguage( 'putdown' ) ) {
            if ( putdown instanceof RegExp ) {
                this.addNotation( 'putdown', name, putdown )
            } else if ( typeof( putdown ) == 'string' ) {
                const variables = Array.from( defaultVarNames )
                let putdownForParsing = putdown.replace( /([()])/g, ' $1 ' ).trim()
                data.typeSequence.forEach( ( type, index ) =>
                    putdownForParsing = putdownForParsing.replace(
                        new RegExp( `\\b${type}\\b` ), variables[index] ) )
                this.addNotation( 'putdown', name, putdownForParsing, variables )
            } else {
                throw new Error( 'Invalid putdown content: ' + putdown )
            }
        }
    }

    isConcept ( name ) {
        return this.concepts.has( name )
    }

    addNotation ( languageName, conceptName, notation, options = { } ) {
        const originalNotation = notation
        Object.assign( options, {
            variables : Array.from( defaultVarNames )
        } )
        // ensure language is valid
        if ( !this.isLanguage( languageName ) )
            throw new Error( `Not a valid language: ${languageName}` )
        const language = this.languages.get( languageName )
        // ensure concept is valid
        if ( !this.isConcept( conceptName ) )
            throw new Error( `Not a valid concept: ${conceptName}` )
        const concept = this.concepts.get( conceptName )
        // if this is an atomic concept, delete any previous notation it had
        // (since that was probably the putdown default installed at language
        // creation time, which the user is now overriding)
        // but this does not apply to groupers; there can be more than one
        // set of groupers in a language, and thus more than one way to form an
        // atomic concept using groupers
        if ( Converter.isAtomicType( concept.parentType )
          && !conceptName.startsWith( 'grouped' ) )
            delete language.grammar.rules[conceptName]
        // convert notation to array if needed and extract its tokens
        if ( notation instanceof RegExp )
            notation = [ notation ]
        const notationToPutdown = [ ]
        if ( !( notation instanceof Array ) ) {
            notation = Converter.notationStringToArray(
                notation, options.variables
            ).map(
                piece => {
                    const variableIndex = options.variables.indexOf( piece )
                    if ( variableIndex > -1 ) {
                        notationToPutdown.push( variableIndex )
                        return concept.typeSequence[variableIndex]
                    } else {
                        return piece
                    }
                }
            )
        }
        const putdownToNotation = notationToPutdown.slice()
        notationToPutdown.forEach( ( pi, ni ) => putdownToNotation[pi] = ni )
        notation.forEach( piece => {
            if ( piece instanceof RegExp )
                this.addTokenType( languageName, piece )
        } )
        // add notation to grammar (which can modify the array in-place, so
        // it is necessary to do this only after using it to make tokens, above)
        let parentType = concept.parentType
        if ( languageName == 'putdown' )
            parentType = Converter.lowestSubtype( parentType )
        language.grammar.addRule( parentType, conceptName )
        language.grammar.addRule( conceptName, notation )
        const rhss = language.grammar.rules[conceptName]
        const newRule = rhss[rhss.length - 1]
        newRule.notationToPutdown = notationToPutdown
        newRule.putdownToNotation = putdownToNotation
        newRule.notation = originalNotation
        newRule.variables = options.variables
        newRule.notationName = options.name
    }

    convert ( sourceLang, destLang, data ) {
        if ( sourceLang == destLang ) return data
        if ( sourceLang == 'ast' ) {
            return data.writeIn( destLang )
        } else if ( this.isLanguage( sourceLang ) ) {
            const language = this.languages.get( sourceLang )
            if ( destLang == 'ast' ) {
                const tokens = language.tokenizer.tokenize( data )
                if ( !tokens ) return undefined
                const result = language.grammar.parse( tokens, {
                    showDebuggingOutput : this._debug
                } )[0]
                return result ? AST.fromJSON( this, language, result ) : undefined
            } else if ( this.isLanguage( destLang ) ) {
                return this.convert( sourceLang, 'ast', data )?.compact()
                    ?.writeIn( destLang )
            }
        }
    }

    // chains of syntactic type inclusions in mathematical writing
    static syntacticTypeHierarchies = [
        [ 'expression', 'numberexpr', 'sum', 'product', 'factor', 'atomicnumber' ],
        [ 'expression', 'sentence', 'conditional', 'disjunct', 'conjunct', 'atomicprop' ],
        // [ 'conjunct', 'equation', 'inequality' ],
        // [ 'set', 'union', 'intersection', 'atomicset' ]
    ]

    static syntacticTypes = Array.from( new Set(
        Converter.syntacticTypeHierarchies.flat() ) )

    static isSyntacticType = name =>
        Converter.syntacticTypeHierarchies.some( hierarchy =>
            hierarchy.includes( name ) )

    static isAtomicType = name => name.startsWith( 'atomic' )

    static lowestSubtype = name => {
        const hierarchies = Converter.syntacticTypeHierarchies.filter(
            hierarchy => hierarchy.includes( name ) )
        if ( hierarchies.length != 1 ) return name
        return hierarchies[0][hierarchies[0].length-1]
    }

    static supertypeGraph = { }

    static computeSupertypeGraph = () => {
        if ( Object.keys( Converter.supertypeGraph ).length > 0 ) return
        Converter.syntacticTypeHierarchies.forEach( chain =>
            chain.forEach( type => Converter.supertypeGraph[type] = [ ] ) )
            Converter.syntacticTypeHierarchies.forEach( chain => {
            for ( let i = 0 ; i < chain.length - 1 ; i++ )
            Converter.supertypeGraph[chain[i]].push( chain[i+1] )
        } )
        let closureAchieved
        do {
            closureAchieved = true
            Object.keys( Converter.supertypeGraph ).forEach( a => {
                Converter.supertypeGraph[a].forEach( b => {
                    Converter.supertypeGraph[b].forEach( c => {
                        if ( !Converter.supertypeGraph[a].includes( c ) ) {
                            Converter.supertypeGraph[a].push( c )
                            closureAchieved = false
                        }
                    } )
                } )
            } )
        } while ( !closureAchieved )
    }

    static isSupertype = ( a, b ) => Converter.supertypeGraph[a]?.includes( b )
    static isSupertypeOrEqual = ( a, b ) => a == b || Converter.isSupertype( a, b )

    static notationStringToArray = ( str, variables ) => {
        const result = [ ]
        let match
        let mayNotContinueString
        while ( str.length > 0 ) {
            if ( match = /^\s+/.exec( str ) ) {
                str = str.substring( match[0].length )
                mayNotContinueString = true
                continue
            }
            let justSawType = false
            for ( let i = 0 ; !justSawType && i < variables.length ; i++ ) {
                const startsWithThis = new RegExp( `^${variables[i]}\\b` )
                if ( startsWithThis.test( str ) ) {
                    result.push( variables[i] )
                    str = str.substring( variables[i].length )
                    justSawType = true
                }
            }
            if ( justSawType ) {
                mayNotContinueString = true
                continue
            }
            if ( result.length == 0 || mayNotContinueString )
                result.push( str[0] )
            else
                result[result.length-1] += str[0]
            mayNotContinueString = false
            str = str.substring( 1 )
        }
        return result.map( piece =>
            variables.includes( piece ) ? piece :
                new RegExp( escapeRegExp( piece ) ) )
    }

    static regularExpressions = {
        oneLetterVariable : /[a-zA-Z]/, // can be upgraded later with Greek, etc.
        integer : /\d+/,
        number : /\.[0-9]+|[0-9]+\.?[0-9]*/
    }

    hasTokenType ( language, regexp ) {
        if ( !this.isLanguage( language ) )
            throw new Error( 'Not a language: ' + language )
        language = this.languages.get( language )
        return language.tokenizer.tokenTypes.find( tokenType =>
            tokenType.regexp.source == `^(?:${regexp.source})` )
    }

    addTokenType ( language, regexp ) {
        if ( this.hasTokenType( language, regexp ) ) return
        language = this.languages.get( language )
        language.tokenizer.addType( regexp )
        const lowPriority = Object.keys( Converter.regularExpressions )
            .map( key => `^(?:${Converter.regularExpressions[key].source})` )
        const shouldBeLater = re => lowPriority.includes( re.source ) ? 1 : 0
        language.tokenizer.tokenTypes.sort( ( a, b ) => {
            const aLater = shouldBeLater( a.regexp )
            const bLater = shouldBeLater( b.regexp )
            if ( aLater != bLater ) return aLater - bLater
            return -a.regexp.source.localeCompare( b.regexp.source )
        } )
    }

}    
