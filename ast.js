
import { Converter } from './converter.js'
import { escapeRegExp } from './utilities.js'

// To dos:
//  - In writeIn(), rather than just choosing notation 0 as the
//    canonical form, choose the one named in the AST, if any, or fall back on
//    the one at index 0 if not.
//  - Test to be sure that this can be used to preserve notational specifics
//    even through the conversion to JSON (now ASTs)
//  - Create test suite for AST class, including all the functions you moved
//    into it from the Converter class.

export class AST extends Array {

    constructor ( converter, language, ...components ) {
        super()
        this.converter = converter
        this.language = language
        components.forEach( component =>
            this.push( component instanceof Array ?
                new AST( converter, language, ...component ) : component ) )
    }

    head () { return this[0] }

    args () { return this.slice( 1 ) }

    numArgs () { return this.length - 1 }

    arg ( index ) { return this[index+1] }

    isConcept () { return this.converter.isConcept( this.head() ) }

    concept () { return this.converter.concepts.get( this.head() ) }

    toString () {
        const recur = x => x instanceof AST ? x.toString() : x
        return `AST(${this.map( recur ).join( ',' )})`
    }

    toJSON () {
        return this.map( x => x instanceof AST ? x.toJSON() : x )
    }

    // convert a parsed result into the minimal AST that is actually needed.
    // for instance, if we parsed ['multiplication','x','*','y'], we will not
    // include the '*' operator when converting to an AST, since the head is
    // sufficient to identify the concept.
    static fromJSON ( converter, language, json ) {
        // console.log( `fromJSON( ${JSON.stringify(json)} )` )
        if ( !( json instanceof Array ) ) return json
        const head = json.shift()
        const concept = converter.concepts.get( head )
        if ( !concept )
            return new AST( converter, language,
                ...[ head, ...json ].map( piece =>
                    AST.fromJSON( converter, language, piece ) ) )
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
                return [ head, AST.fromJSON( converter, language, json[0] ) ]
            json = json.filter( ( _, index ) =>
                !( rhss[i][index] instanceof RegExp ) )
            const result = new AST( this, language, head,
                ...json.map( ( _, index ) => AST.fromJSON( converter, language,
                    json[rhss[i].putdownToNotation[index]] ) ) )
            if ( rhss[i].notationName )
                result.notationName = rhss[i].notationName
            return result
        }
        throw new Error( `No notational match for ${JSON.stringify( json )}` )
    }

    compact () {
        // console.log( 'compactifying:' + ast )
        if ( this.length == 0 )
            throw new Error( `Empty ASTs not allowed` )
        if ( this.head().startsWith( 'groupedatomic' ) && this.numArgs() == 1 )
            return this.arg( 0 ).compact()
        if ( Converter.isSyntacticType( this.head() ) ) {
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            const inner = this.arg( 0 )
            if ( !( inner instanceof AST ) ) return inner
            if ( Converter.isSyntacticType( inner.head() ) ) {
                if ( inner.numArgs() != 1 )
                    throw new Error( `Invalid AST: ${inner}` )
                if ( !Converter.isSupertype( this.head(), inner.head() ) )
                    throw new Error(
                        `Invalid AST, ${this.head()} not a supertype of ${inner.head()}` )
                return inner.compact()
            } else if ( inner.isConcept() ) {
                return inner.compact()
            }
        }
        return new AST( this.converter, this.language,
            ...this.map( x => x instanceof AST ? x.compact() : x ) )
    }

    // Note 1:  When using this with langName == 'putdown', it never produces
    // putdown with attributes, which is obviously limiting (e.g., it can never
    // produce givens) but this is just a simplification to view putdown in a
    // trivial, LISP-like way.  You can just use a constant and create (GIVEN x)
    // and then post-process using LC tree traversals to create what you want.
    // Note 2:  This expects this object to be in compact form, as produced by the
    // compact() member of this class.  May not function correctly if this object
    // is not in compact form.  Hence, when this function is called by
    // Converter.convert(),/ it applies compact() before calling this function.
    writeIn ( langName ) {
        // find the language in question
        const language = this.converter.languages.get( langName )
        if ( !language )
            throw new Error( `Not a valid language: ${langName}` )
        // if it's just a syntactic type wrapper, ensure it's around exactly 1 item
        if ( Converter.isSyntacticType( this.head() ) ) {
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            // return the interior, possibly with groupers if the type
            // hierarchy requires it (the inner is not a subtype of the outer)
            const result = this.arg( 0 ).writeIn( langName )
            if ( !Converter.isSyntacticType( this.arg( 0 ) )
              || Converter.isSupertypeOrEqual( this.head(), this.arg( 0 ) ) )
                return result
            if ( language.groupers.length == 0 )
                throw new Error( 'Cannot fix precedence in language without groupers' )
            const left = language.groupers[0]
            const right = language.groupers[1]
            return left + result + right
        }
        // since it's not a syntactic type, it better be a concept
        if ( !this.isConcept() )
            throw new Error( 'Not a syntactic type nor a concept: ' + ast.head() )
        // if it's an atomic concept with one argument, defined by a regular
        // expression, just return the argument, because this is a base case
        const concept = this.concept()
        if ( concept.putdown instanceof RegExp ) {
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            return this.arg( 0 )
        }
        // recursively compute the representation of the arguments, wrapping
        // them in groupers if necessary
        if ( concept.typeSequence.length != this.numArgs() )
            throw new Error( `Invalid AST: ${this}` )
        const recur = this.args().map( ( piece, index ) => {
            const result = piece.writeIn( langName )
            const outerType = concept.typeSequence[index]
            let innerType = piece[0]
            if ( piece.isConcept() )
                innerType = piece.concept().parentType
            const correctNesting = outerType == piece[0]
                                || outerType == innerType
                                || Converter.isSupertype( outerType, innerType )
            if ( language.groupers.length > 0 && !correctNesting ) {
                const left = language.groupers[0]
                const right = language.groupers[1]
                return left + result + right
            } else {
                return result
            }
        } )
        // get the default way to write that concept in this language
        // and split it into an array to make template substitution easier
        const rhs = language.grammar.rules[this.head()][0]
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
        return language.linter(
            template.map( piece => {
                const variableIndex = rhs.variables.indexOf( piece )
                return variableIndex > -1 ? recur[variableIndex] : piece
            } ).map(
                piece => piece.trim()
            ).filter(
                piece => piece.length > 0
            ).join( ' ' ).replace( /\s+/g, ' ' )
        )
    }

}
