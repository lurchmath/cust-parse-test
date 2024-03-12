
import { Converter } from './converter.js'

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
            } else if ( this.converter.isConcept( inner.head() ) ) {
                return inner.compact()
            }
        }
        return new AST( this.converter, this.language,
            ...this.map( x => x instanceof AST ? x.compact() : x ) )
    }

}
