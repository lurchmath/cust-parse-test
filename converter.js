
// To dos:
//  - add tests for the static functions in the class
//  - expand set of tests for many new mathematical expressions in many languages,
//    including expressions that bind variables
//     - universal, existential, and existential unique quantifiers
//     - naked binding?
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
        const tokenizer = new Tokenizer()
        tokenizer.addType( /\s/, () => null )
        const grammar = new Grammar()
        grammar.START = Converter.syntacticTypeHierarchies[0][0]
        this.languages.set( name,
            { tokenizer, grammar, leftGrouper, rightGrouper } )
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
    //  - putdown : string, name of putdown operator to use when converting to
    //    that language (required unless parentType is atomic, but if omitted,
    //    the concept name will be used as the putdown operator)
    //  - body : integer index of the child that is the body in a quantified
    //    expression (meaning all other children are bound variables); if omitted,
    //    then the concept is not one that binds any variables
    // (this list can grow later if needed)
    addConcept ( name, data ) {
        if ( !data.hasOwnProperty( 'parentType' ) )
            throw new Error( `Cannot add concept ${name} with no parentType` )
        if ( !Converter.isSyntacticType( data.parentType ) )
            throw new Error( `Not a valid syntactic type: ${data.parentType}` )
        if ( !Converter.isAtomicType( data.parentType )
          && !data.hasOwnProperty( 'putdown' ) )
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
            // TODO: handle boundVars
            const concept = this.concepts.get( head )
            const recur = json.filter( piece => piece instanceof Array )
                .map( piece => this.jsonToPutdown( piece ) )
            if ( Converter.isAtomicType( concept.parentType ) ) return json[0]
            if ( !concept.hasOwnProperty( 'body' ) )
                return `(${concept.putdown} ${recur.join( ' ' )})`
            const body = recur[concept.body]
            recur.splice( concept.body, 1 )
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
                focus().push( match[0] )
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
            for ( let i = 0 ; !justSawType && i < typeNames.length ; i++ )
                if ( str.startsWith( typeNames[i] ) ) {
                    result.push( typeNames[i] )
                    str = str.substring( typeNames[i].length )
                    justSawType = true
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
    
}    
