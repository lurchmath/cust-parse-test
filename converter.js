
// To dos:
//  - Remove spaces around groupers and remove >1 conecutive space as part of
//    the conversion process, so test files don't have to do it after the fact
//  - Add tests for the static functions in the class
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
//  - expand tests to include more than one language, and converting between them
//  - add support for features like associativity (in all conversion directions)

import { Grammar, Tokenizer } from 'earley-parser'

const defaultVarNames = 'ABC'

const escapeRegExp = ( str ) =>
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
        this.addLanguage( 'putdown', null, null )
    }

    addLanguage ( name, leftGrouper = '(', rightGrouper = ')' ) {
        // Create both things the language needs--a tokenizer and a grammar--and
        // store them in this converter's languages map.
        const tokenizer = new Tokenizer()
        tokenizer.addType( /\s/, () => null )
        const grammar = new Grammar()
        grammar.START = Converter.syntacticTypeHierarchies[0][0]
        this.languages.set( name,
            { tokenizer, grammar, leftGrouper, rightGrouper } )
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
            if ( leftGrouper && rightGrouper && hierarchy[0] == 'expression' ) {
                const last = hierarchy[hierarchy.length-1]
                if ( Converter.isAtomicType( last ) ) {
                    this.addNotation( name, `grouped${last}`,
                        `${leftGrouper} A ${rightGrouper}` )
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

    addNotation ( languageName, conceptName, notation, variables ) {
        const originalNotation = notation
        if ( !variables ) variables = Array.from( defaultVarNames )
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
        if ( Converter.isAtomicType( concept.parentType ) )
            delete language.grammar.rules[conceptName]
        // convert notation to array if needed and extract its tokens
        if ( notation instanceof RegExp )
            notation = [ notation ]
        const notationToPutdown = [ ]
        if ( !( notation instanceof Array ) ) {
            notation = Converter.notationStringToArray( notation, variables ).map(
                piece => {
                    const variableIndex = variables.indexOf( piece )
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
        newRule.variables = variables
    }

    // Note:  When using this with langName == 'putdown', it never produces
    // putdown with attributes, which is obviously limiting (e.g., it can never
    // produce givens) but this is just a simplification to view putdown in a
    // trivial, LISP-like way.  You can just use a constant and create (GIVEN x)
    // and then post-process using LC tree traversals to create what you want.
    jsonRepresentation ( json, langName ) {
        // find the language in question
        const language = this.languages.get( langName )
        if ( !( json instanceof Array ) )
            throw new Error(
                `Not a valid semantic JSON expression: ${JSON.stringify(json)}` )
        // if it's just a syntactic type wrapper, ensure it's around exactly 1 item
        const head = json[0]
        const args = json.slice( 1 )
        if ( Converter.isSyntacticType( head ) ) {
            if ( args.length != 1 )
                throw new Error( 'Invalid semantic JSON structure: '
                    + JSON.stringify( [ head, ...args ] ) )
            // return the interior, possibly with groupers if the type
            // hierarchy requires it (the inner is not a subtype of the outer)
            const result = this.jsonRepresentation( args[0], langName )
            return Converter.isSyntacticType( args[0] )
                && !Converter.isSupertypeOrEqual( head, args[0] ) ?
                `${language.leftGrouper} ${result} ${language.rightGrouper}` :
                result
        }
        // since it's not a syntactic type, it better be a concept
        if ( !this.isConcept( head ) )
            throw new Error( 'Not a syntactic type nor a concept: ' + head )
        // if it's an atomic concept with one argument, defined by a regular
        // expression, just return the argument, because this is a base case
        const concept = this.concepts.get( head )
        if ( concept.putdown instanceof RegExp ) {
            if ( args.length != 1 )
                throw new Error( 'Invalid semantic JSON structure: '
                    + JSON.stringify( [ head, ...args ] ) )
            return args[0]
        }
        // recursively compute the representation of the arguments, wrapping
        // them in groupers if necessary
        if ( concept.typeSequence.length != args.length )
            throw new Error( 'Invalid semantic JSON structure: '
                + JSON.stringify( [ head, ...args ] ) )
        const recur = args.map( ( piece, index ) => {
            const result = this.jsonRepresentation( piece, langName )
            const outerType = concept.typeSequence[index]
            let innerType = piece[0]
            if ( this.isConcept( innerType ) )
                innerType = this.concepts.get( innerType ).parentType
            const correctNesting = outerType == piece[0]
                                || outerType == innerType
                                || Converter.isSupertype( outerType, innerType )
            if ( language.leftGrouper && language.rightGrouper && !correctNesting ) {
                return `${language.leftGrouper} ${result} ${language.rightGrouper}`
            } else {
                return result
            }
        } )
        // get the default way to write that concept in this language
        // and split it into an array to make template substitution easier
        const rhs = language.grammar.rules[head][0]
        let notation = rhs.notation
        const template = [ ]
        const splitter = new RegExp(
            rhs.variables.map( escapeRegExp ).join( '|' ) )
        while ( notation.length > 0 ) {
            const match = splitter.exec( notation )
            if ( match ) {
                template.push( notation.substring( 0, match.index ) )
                template.push( match[0] )
                notation = notation.substring( match.index + match[0].length )
            } else {
                template.push( notation )
                notation = ''
            }
        }
        // fill the recursively computed results into the template
        return template.map( piece => {
            const variableIndex = rhs.variables.indexOf( piece )
            return variableIndex > -1 ? recur[variableIndex] : piece
        } ).map(
            piece => piece.trim()
        ).filter(
            piece => piece.length > 0
        ).join( ' ' )
    }

    convert ( sourceLang, destLang, data ) {
        if ( sourceLang == destLang ) return data
        if ( sourceLang == 'json' ) {
            return this.jsonRepresentation( data, destLang )
        } else if ( this.isLanguage( sourceLang ) ) {
            const language = this.languages.get( sourceLang )
            if ( destLang == 'json' ) {
                const tokens = language.tokenizer.tokenize( data )
                if ( !tokens ) return undefined
                const result = language.grammar.parse( tokens, {
                    showDebuggingOutput : this._debug
                } )[0]
                return result ? this.buildArgsList( result, language ) : undefined
            } else if ( this.isLanguage( destLang ) ) {
                return this.jsonRepresentation(
                    this.convert( sourceLang, 'json', data ), destLang )
            }
        }
    }

    buildArgsList ( json, language ) {
        // console.log( 'buildArgsList', json )
        if ( !( json instanceof Array ) ) return json
        const head = json.shift()
        const concept = this.concepts.get( head )
        if ( !concept ) {
            json.unshift( head )
            return json.map( piece => this.buildArgsList( piece, language ) )
        }
        const rhss = language.grammar.rules[head]
        for ( let i = 0 ; i < rhss.length ; i++ ) {
            if ( rhss[i].length != json.length ) continue
            const matches = rhss[i].every( ( piece, index ) => {
                const isNotation = piece instanceof RegExp
                const isText = !( json[index] instanceof Array )
                return isNotation == isText
                    && ( !isNotation || piece.test( json[index] ) )
            } )
            if ( !matches ) continue
            if ( rhss[i].notation instanceof RegExp )
                return [ head, this.buildArgsList( json[0] ) ]
            json = json.filter(
                ( _, index ) => !( rhss[i][index] instanceof RegExp ) )
            // console.log( json, rhss[i], json )
            const result = [
                head,
                ...json.map( ( _, index ) => this.buildArgsList(
                    json[rhss[i].putdownToNotation[index]], language ) )
            ]
            // console.log( '\t\t-->', result )
            return result
        }
        throw new Error( `No notational match for ${JSON.stringify( json )}` )
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

    // This is not used by this class.
    // It is here to make testing easier; it is a function that takes gigantic
    // JSON structures representing syntax and makes the much simpler.
    compact ( json ) {
        if ( !( json instanceof Array ) ) return json
        if ( json.length == 0 )
            throw new Error( `Empty arrays not allowed in semantic JSON` )
        if ( json.length == 2 && json[0].startsWith( 'groupedatomic' ) )
            return this.compact( json[1] )
        if ( Converter.isSyntacticType( json[0] ) ) {
            if ( json.length != 2 )
                throw new Error( `Invalid semantic JSON structure: ${JSON.stringify(json)}` )
            const inner = json[1]
            if ( !( inner instanceof Array ) ) return json[1]
            if ( Converter.isSyntacticType( inner[0] ) ) {
                if ( inner.length != 2 )
                    throw new Error(
                        `Invalid semantic JSON structure: ${JSON.stringify(inner)}` )
                if ( !Converter.isSupertype( json[0], inner[0] ) )
                    throw new Error(
                        `Invalid semantic JSON, ${json[0]} not a supertype of ${inner[0]}` )
                return this.compact( inner )
            } else if ( this.isConcept( inner[0] ) ) {
                return this.compact( inner )
            }
        }
        return json.map( piece => this.compact( piece ) )
    }
    
}    
