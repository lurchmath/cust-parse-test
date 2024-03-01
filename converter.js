
// To dos:
//  - Fix design problem preventing legitimate conversion from putdown:
//     - When converting JSON to a non-putdown language, if an atomic concept is
//       being converted, its contents may not look like the notation used in
//       the language in question, so they will need to be replaced with the
//       way to write the same concept in the target language.  Look it up in
//       the notation data specified at language definition time, unless we do
//       not currently store that, in which case fix that problem first.
//  - add tests for the static functions in the class
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

const escapeRegExp = ( str ) =>
    str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' )

export class Converter {

    constructor () {
        Converter.computeSupertypeGraph()
        this.languages = new Map()
        this.concepts = new Map()
        Converter.syntacticTypeHierarchies.forEach( hierarchy => {
            const last = hierarchy[hierarchy.length-1]
            if ( Converter.isAtomicType( last ) )
                this.addConcept( `grouped${last}`, { parentType : last } )
        } )
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
            if ( hierarchy[0] == 'expression' ) {
                const top = hierarchy[1]
                const bottom = hierarchy[hierarchy.length-1]
                if ( Converter.isAtomicType( bottom ) ) {
                    this.addNotation( name, `grouped${bottom}`,
                        `${leftGrouper} ${top} ${rightGrouper}` )
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

    // fields that can be in the data object:
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
    //  - body : integer index of the child that is the body in a quantified
    //    expression (meaning all other children are bound variables); if omitted,
    //    then the concept is not one that binds any variables
    // (this list can grow later if needed)
    addConcept ( name, data ) {
        if ( !data.hasOwnProperty( 'parentType' ) )
            throw new Error( `Cannot add concept ${name} with no parentType` )
        if ( !Converter.isSyntacticType( data.parentType ) )
            throw new Error( `Not a valid syntactic type: ${data.parentType}` )
        if ( !data.hasOwnProperty( 'putdown' ) )
            data.putdown = name
        this.concepts.set( name, data )
    }

    isConcept ( name ) {
        return this.concepts.has( name )
    }

    addNotation ( languageName, conceptName, notation ) {
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
        if ( !( notation instanceof Array ) )
            notation = Converter.notationStringToArray( language.grammar, notation )
        notation.forEach( piece => {
            if ( piece instanceof RegExp ) language.tokenizer.addType( piece )
        } )
        // add notation to grammar (which can modify the array in-place, so
        // it is necessary to do this only after using it to make tokens, above)
        language.grammar.addRule( concept.parentType, conceptName )
        language.grammar.addRule( conceptName, notation )
    }

    // Note:  This never produces putdown with attributes, which is obviously
    // limiting (e.g., it can never produce givens) but this is just a
    // simplification to view putdown in a trivial, LISP-like way.  You can just
    // use a constant and create (GIVEN x) and then post-process using LC tree
    // traversals to create what you want.
    jsonToPutdown ( json ) {
        if ( !( json instanceof Array ) )
            throw new Error(
                `Not a valid semantic JSON expression: ${JSON.stringify(json)}` )
        const head = json.shift()
        if ( this.isConcept( head ) ) {
            // Handle case with potentially complex interior
            const concept = this.concepts.get( head )
            const recur = json.filter( piece => piece instanceof Array )
                .map( piece => this.jsonToPutdown( piece ) )
            if ( Converter.isAtomicType( concept.parentType ) )
                return concept.putdown instanceof RegExp ? json[0] : concept.putdown
            if ( !concept.hasOwnProperty( 'body' ) )
                return `(${concept.putdown} ${recur.join( ' ' )})`
            const bodyIndex = concept.body - 1 // already popped head, so -1
            const body = recur[bodyIndex]
            recur.splice( bodyIndex, 1 )
            return `(${concept.putdown} (${recur.join( ' ' )} , ${body}))`
        } else if ( Converter.isSyntacticType( head ) ) {
            // Handle subtype case--just a wrapper around one thing
            return this.jsonToPutdown( json[0] )
        } else {
            throw new Error(
                `Not a valid semantic JSON expression: ${JSON.stringify(json)}` )
        }
    }

    // may return multiple JSON structures; result will always be an array, even
    // if it contains only one JSON structure
    putdownToJson ( putdown ) {
        const stack = [ [ ] ]
        const focus = () => stack[stack.length-1]
        let match
        while ( putdown.length > 0 ) {
            if ( match = /^\s+/.exec( putdown ) ) {
                putdown = putdown.substring( match[0].length )
                continue
            } else if ( putdown[0] == '(' ) {
                const newFrame = [ ]
                focus().push( newFrame )
                stack.push( newFrame )
                putdown = putdown.substring( 1 )
            } else if ( putdown[0] == ')' ) {
                const target = focus()
                const head = target[0]
                if ( !this.isConcept( head ) )
                    throw new Error( `Not a known concept: ${head}` )
                const concept = this.concepts.get( head )
                if ( concept.hasOwnProperty( 'body' ) )
                    target.splice( concept.body, 0, target.pop() )
                target.unshift( target.slice() )
                target.unshift( concept.parentType )
                target.splice( 2, target.length )
                stack.pop()
                putdown = putdown.substring( 1 )
            } else if ( putdown[0] == ',' ) {
                putdown = putdown.substring( 1 )
            } else if ( match = /^[^\s()]+/.exec( putdown ) ) {
                const conceptNames = this.concepts.keys()
                let found = false
                for ( let i = 0 ; i < conceptNames.length ; i++ ) {
                    if ( conceptNames[i].putdown == match[0] ) {
                        focus().push( [ conceptNames[i], match[0] ] )
                        found = true
                        break
                    }
                    if ( ( conceptNames[i].putdown instanceof RegExp )
                        && conceptNames[i].putdown.test( match[0] ) ) {
                        focus().push( [ conceptNames[i], match[0] ] )
                        found = true
                        break
                    }
                }
                if ( !found )
                    throw new Error( `Did not match any concept: ${match[0]}` )
                putdown = putdown.substring( match[0].length )
            }
        }
        return stack[0]
    }

    jsonRepresentation ( json, langName ) {
        // console.log( JSON.stringify( json ) )
        const language = this.languages.get( langName )
        if ( !( json instanceof Array ) )
            throw new Error(
                `Not a valid semantic JSON expression: ${JSON.stringify(json)}` )
        const head = json.shift()
        if ( Converter.isSyntacticType( head ) ) {
            if ( json.length != 1 )
                throw new Error( 'Invalid semantic JSON structure: '
                    + JSON.stringify( [ head, ...json ] ) )
            // console.log( `\tpopping: ${head}...` )
            let result = this.jsonRepresentation( json[0], langName )
            return Converter.isSyntacticType( json[0] )
                && !Converter.isSupertype( head, json[0] ) ?
                `${language.leftGrouper} ${result} ${language.rightGrouper}` :
                result
        }
        if ( !this.isConcept( head ) )
            throw new Error( 'Not a syntactic type nor a concept: ' + head )
        // console.log( `\trule categories: ${Object.keys( language.grammar.rules )}` )
        const rules = language.grammar.rules[head].filter(
            rule => rule.length == json.length )
        // console.log( `\tchecking rules for ${head}: ${rules}` )
        for ( let i = 0 ; i < rules.length ; i++ ) {
            // console.log( `\t\tchecking rule: ${rules[i]}` )
            const result = [ ]
            for ( let j = 0 ; j < json.length ; j++ ) {
                if ( rules[i][j] instanceof RegExp ) {
                    if ( typeof( json[j] ) != 'string' ) {
                        break
                    } else if ( !rules[i][j].test( json[j] ) ) {
                        break
                    } else {
                        result.push( json[j] )
                    }
                } else if ( Converter.isSyntacticType( rules[i][j] ) ) {
                    if ( !( json[j] instanceof Array ) ) {
                        break
                    } else if ( rules[i][j] == json[j][0] ) {
                        result.push( this.jsonRepresentation( json[j], langName ) )
                    } else if ( Converter.isSupertype( rules[i][j], json[j][0] ) ) {
                        result.push( this.jsonRepresentation( json[j], langName ) )
                    } else {
                        result.push( this.jsonRepresentation( [
                            'group', language.leftGrouper, json[j], language.rightGrouper
                        ], langName ) )
                    }
                } else {
                    throw new Error( 'Not a syntactic type or RegExp: ' + rules[i][j] )
                }
            }
            if ( result.length == json.length ) return result.join( ' ' )
        }
        throw new Error(
            `Cannot be written in ${langName}: ${JSON.stringify([head,...json])}` )
    }

    convert ( sourceLang, destLang, data ) {
        if ( sourceLang == 'json' ) {
            if ( destLang == 'putdown' ) {
                return this.jsonToPutdown( data )
            } else if ( this.isLanguage( destLang ) ) {
                return this.jsonRepresentation( data, destLang )
            }
        } else if ( sourceLang == 'putdown' ) {
            if ( destLang == 'json' ) {
                return this.putdownToJson( data )
            } else if ( this.isLanguage( destLang ) ) {
                return this.convert( 'json', destLang, this.putdownToJson( data ) )
            }
        } else if ( this.isLanguage( sourceLang ) ) {
            const language = this.languages.get( sourceLang )
            if ( destLang == 'json' ) {
                const tokens = language.tokenizer.tokenize( data )
                if ( !tokens ) return undefined
                return language.grammar.parse( tokens, {
                    showDebuggingOutput : this._debug
                } )[0]
            } else if ( destLang = 'putdown' ) {
                return this.jsonToPutdown( this.convert( sourceLang, 'json', data ) )
            } else if ( this.isLanguage( destLang ) ) {
                return this.jsonRepresentation(
                    this.convert( sourceLang, 'json', data ), destLang )
            }
        }
        throw new Error(
            `Feature not implemented: converting ${sourceLang} to ${destLang}` )
    }

    compact ( json ) {
        if ( !( json instanceof Array ) ) return json
        if ( json.length == 0 )
            throw new Error( `Empty arrays not allowed in semantic JSON` )
        if ( json.length == 4 && json[0].startsWith( 'groupedatomic' ) )
            return this.compact( json[2] )
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
                const concept = this.concepts.get( inner[0] )
                if ( concept.parentType != json[0]
                  && !Converter.isSupertype( json[0], concept.parentType ) )
                    throw new Error(
                        `Invalid semantic JSON, concept ${inner[0]} not a(n) ${json[0]}` )
                return this.compact( inner )
            }
        }
        return json.map( piece => this.compact( piece ) )
    }

    // chains of syntactic type inclusions in mathematical writing
    static syntacticTypeHierarchies = [
        [ 'expression', 'numberexpr', 'sum', 'product', 'factor', 'atomicnumber' ],
        [ 'expression', 'sentence', 'conditional', 'disjunct', 'conjunct', 'atomicprop' ],
        // [ 'conjunct', 'equation', 'inequality' ],
        // [ 'set', 'union', 'intersection', 'atomicset' ]
    ]

    static isSyntacticType = name =>
        Converter.syntacticTypeHierarchies.some( hierarchy =>
            hierarchy.includes( name ) )

    static isAtomicType = name => name.startsWith( 'atomic' )

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

    static isSupertype = ( a, b ) => Converter.supertypeGraph[a].includes( b )

    static notationStringToArray = ( grammar, str ) => {
        const typeNames = Object.keys( grammar.rules )
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
            for ( let i = 0 ; !justSawType && i < typeNames.length ; i++ ) {
                const startsWithThis = new RegExp( `^${typeNames[i]}\\b` )
                if ( startsWithThis.test( str ) ) {
                    result.push( typeNames[i] )
                    str = str.substring( typeNames[i].length )
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
            typeNames.includes( piece ) ? piece :
                new RegExp( escapeRegExp( piece ) ) )
    }

    static regularExpressions = {
        oneLetterVariable : /[a-zA-Z]/, // can be upgraded later with Greek, etc.
        integer : /\d+/,
        number : /\.[0-9]+|[0-9]+\.?[0-9]*/
    }
    
}    
