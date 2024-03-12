
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
