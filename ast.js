
import SyntacticTypes from './syntactic-types.js'
import { escapeRegExp } from './utilities.js'

/**
 * An abstract syntax tree (AST) is a data structure typically created by
 * parsing text using a grammar.  We create this class for that purpose.  It is
 * quite lightweight, subclassing `Array` and storing the operator and operands
 * in the elements of the array as `[operator,...operands]`.  The only other
 * attributes the AST has are the {@link Converter} instance that created it
 * (through parsing) and the language from which it was parsed (i.e., the
 * grammar).
 * 
 * Any AST object then has methods that make it easier to work with than a
 * simple JavaScript array, for workflows that involve parsing, representing,
 * and classifying.
 */
export class AST extends Array {

    /**
     * Construct a new AST.  The first two parameters are described below.  The
     * final parameter must be a nonempty list of components, each of which is
     * one of the following:
     * 
     *  * a string (meaning a leaf of the AST, treated as a symbol/identifier)
     *  * an AST, so that ASTs can be recursive, since they are trees
     *  * an array of any of these, which will be converted into an AST
     * 
     * @param {Converter} converter - the converter that created this AST
     * @param {Object} language - the language from which it was parsed (which
     *   must be one of the values in `converter.languages`)
     * @param  {...any} components - the operator and operands of this AST, in
     *   that order (operator first, operands in the order appropriate for the
     *   operator)
     */
    constructor ( converter, language, ...components ) {
        super()
        this.converter = converter
        this.language = language
        components.forEach( component =>
            this.push( ( component instanceof Array ) && !( component instanceof AST ) ?
                new AST( converter, language, ...component ) : component ) )
    }

    /**
     * An AST is an array with additional functionality.  The first element of
     * the array is the operator of the AST, often called its head.  This
     * function returns that entry.  (It does not shift the head off the array,
     * but only returns it, leaving the AST unaltered.)
     * 
     * @returns {AST|String} the operator of this AST, which is its first entry
     * @see {@link AST#args}
     */
    head () { return this[0] }

    /**
     * An AST is an array with additional functionality.  The first element of
     * the array is the operator of the AST and the remaining elements are its
     * operands.  This function returns the list of operands, as a JavaScript
     * array (not an AST).  The elements of that array will each be either a
     * string or an AST.
     * 
     * @returns {...(String|AST)} the operands of this AST
     * @see {@link AST#head}
     */
    args () { return Array.from( this ).slice( 1 ) }

    /**
     * An AST is an array with additional functionality.  The first element of
     * the array is the operator of the AST and the remaining elements are its
     * operands.  This function returns the number of operands.
     * 
     * @returns {number} the number of operands
     * @see {@link AST#args}
     */
    numArgs () { return this.length - 1 }

    /**
     * An AST is an array with additional functionality.  The first element of
     * the array is the operator of the AST and the remaining elements are its
     * operands.  This function returns the operand at the given index, where 0
     * is the first index, and refers to the first operand (the one that follows
     * immediately after the operator).  In fact, `ast[1] == ast.arg(0)`.
     * 
     * @param {number} index - the index of the operand to return
     * @returns {AST|String} the operand at the given index
     * @see {@link AST#args}
     */
    arg ( index ) { return this[index+1] }

    /**
     * The {@link module:SyntacticTypes SyntacticTypes module} defines a set of
     * syntactic types common to mathematical notation.  Each {@link Converter}
     * instance can define a set of semantic types to add to the set of
     * syntactic types.  Those semantic types are called *concepts.*  This
     * function asks whether the head/operator of this AST is a concept.
     * 
     * For example, if this AST's operator were the word `"expression"`, that
     * would indicate that this AST represents an instance of the syntactic type
     * `"expression"`, and this AST would not be a concept, and this function
     * would return false.  But if this AST had been created by a
     * {@link Converter} that defined the concept `"factorial"` to be a specific
     * type of expression, and this AST began with the operator `"factorial"`,
     * then this function would return true, because this AST is not an instance
     * of a syntactic type (expression), but an instance of a semantic type
     * (factorial).
     * 
     * @returns {boolean} `true` if this AST is a concept
     * @see {@link Converter#isConcept}
     * @see {@link AST#concept}
     */
    isConcept () { return this.converter.isConcept( this.head() ) }

    /**
     * The {@link module:SyntacticTypes SyntacticTypes module} defines a set of
     * syntactic types common to mathematical notation.  Each {@link Converter}
     * instance can define a set of semantic types to add to the set of
     * syntactic types.  Those semantic types are called *concepts.*  You can
     * check whether this AST's operator is a concept using the
     * {@link AST#isConcept} function, and if it returns true, call this
     * function to get the data about the concept.
     * 
     * The result will be an object with the following properties:
     * 
     *  * `parentType`, the name of the parent syntactic type
     *  * `putdown`, the putdown representation of the concept (for example, it
     *    might be `(+ A B)` for the concept `addition`)
     *  * `typeSequence`, an array of the syntactic types of each of the
     *    arguments (for example, it might be `["summand","summand"]` for the
     *    concept `addition`)
     * 
     * @returns {Object} the data about the concept represented in this AST
     */
    concept () { return this.converter.concepts.get( this.head() ) }

    /**
     * A simple string representation of this AST, useful for debugging.  For
     * example, if this AST represented the addition of x and the product of y
     * and z, the representation might be
     * `AST(addition,x,AST(multiplication,y,z))`.
     * 
     * @returns {String} a simple string representation of this AST
     */
    toString () {
        const recur = x => x instanceof AST ? x.toString() : x
        return `AST(${this.map( recur ).join( ',' )})`
    }

    /**
     * Converts this AST into a nested hierarchy of JavaScript arrays, which is
     * essentially the exact same data structure, but without any of the data or
     * features provided by the AST class beyond what the built-in Array class
     * provides.  For example, the AST whose {@link AST#toString string
     * representation} is `AST(addition,x,AST(multiplication,y,z))` would become
     * the JavaScript array
     * `[ 'addition', 'x', [ 'multiplication', 'y', 'z' ] ]`.
     * 
     * @returns {Object|String} a JSON representation of this AST
     * @see {@link AST.fromJSON}
     * @see {@link AST#toString}
     */
    toJSON () {
        return Array.from( this ).map( x => x instanceof AST ? x.toJSON() : x )
    }

    /**
     * The {@link Converter} class can parse text into hierarchies of JavaScript
     * arrays.  Those arrays sometimes contain unnecessary information about the
     * details of the parsing.  For instance, if `x*y` were the notation for
     * multiplication, then the {@link Converter} class would produce an array
     * with contents something like `['multiplication','x','*','y']`.  This
     * function not only converts such an array into an AST instance, but also
     * removes the unnecessary `'*'` entry, since the meaning is clear from the
     * first element of the array anyway.
     * 
     * @param {Converter} converter - the converter that created the JSON in the
     *   `json` parameter
     * @param {Object} language - the language from which it was parsed (which
     *   must be one of the values in `converter.languages`)
     * @param {Array} json - a hierarchy of JavaScript Arrays (with strings as
     *   leaves) representing an AST
     * @returns {AST} the AST represented by the JSON
     */
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
            const result = new AST( converter, language, head,
                ...json.map( ( _, index ) => AST.fromJSON( converter, language,
                    json[rhss[i].putdownToNotation[index]] ) ) )
            if ( rhss[i].notationName )
                result.notationName = rhss[i].notationName
            return result
        }
        throw new Error( `No notational match for ${JSON.stringify( json )}` )
    }

    /**
     * An AST created through {@link AST.fromJSON} will typically not be in
     * compact form.  Specifically, it will have a nested hierarchy of both
     * syntactic and semantic types.  For example, the expression `x+y` might
     * not be represented as the simple `[ 'addition', 'x', 'y' ]` array, but as
     * the unnecessarily complex array
     * `[ 'expression', [ 'numberexpr', [ 'sum', [ 'addition', 'x', 'y' ] ] ] ]`.
     * The more complex form showcases exactly how `x+y` counts as an
     * expression, by virtue of being a sum, which is a type of number
     * expression, which is a type of expression.  That long chain of syntactic
     * types is typically not desirable, but rather just the semantic
     * information is of interest.  Compact form removes all wrappers that serve
     * only to label an AST with its syntactic type, leaving only a hierarchy
     * of semantic information in the AST.
     * 
     * @returns {AST} a copy of this AST that is in compact form
     */
    compact () {
        // console.log( 'compactifying:', this )
        if ( this.length == 0 )
            throw new Error( `Empty ASTs not allowed` )
        if ( this.head().startsWith( 'groupedatomic' ) && this.numArgs() == 1 )
            return this.arg( 0 ).compact()
        if ( SyntacticTypes.types.includes( this.head() ) ) {
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            const inner = this.arg( 0 )
            if ( !( inner instanceof AST ) ) return inner
            if ( SyntacticTypes.types.includes( inner.head() ) ) {
                if ( inner.numArgs() != 1 )
                    throw new Error( `Invalid AST: ${inner}` )
                if ( !SyntacticTypes.isSupertype( this.head(), inner.head() ) )
                    throw new Error(
                        `Invalid AST, ${this.head()} not a supertype of ${inner.head()}` )
                return inner.compact()
            } else if ( inner.isConcept() ) {
                return inner.compact()
            }
        }
        const result = new AST( this.converter, this.language,
            ...this.map( x => x instanceof AST ? x.compact() : x ) )
        if ( this.notationName )
            result.notationName = this.notationName
        return result
    }

    /**
     * Represent this AST in the named language.  For example, if the AST were
     * one whose {@link AST#toString string representation} were
     * `AST(addition,x,y)`, then we might call `.writeIn('latex')` on that
     * AST and expect to get `x+y`, or we might call `.writeIn('putdown')` and
     * expect to get `(+ x y)`.  The name of the language passed to `writeIn()`
     * must be one of the names known by the {@link Converter} instance given to
     * this AST (or its top-level ancestor) at its construction time.
     * 
     * This function requires the AST on which it is called to be in compact
     * form, as produced by the {@link AST#compact} member function.  The
     * behavior of this function is undefined if this requirement is not met.
     * 
     * @param {String} langName - the name of the language in which to write the
     *   expression stored in this AST
     * @returns {String} the representation, in the specified language, of this
     *   AST
     */
    writeIn ( langName ) {
        // find the language in question
        const language = this.converter.languages.get( langName )
        if ( !language )
            throw new Error( `Not a valid language: ${langName}` )
        // if it's just a syntactic type wrapper, ensure it's around exactly 1 item
        if ( SyntacticTypes.types.includes( this.head() ) ) {
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            // return the interior, possibly with groupers if the type
            // hierarchy requires it (the inner is not a subtype of the outer)
            const result = this.arg( 0 ).writeIn( langName )
            if ( !SyntacticTypes.types.includes( this.arg( 0 ) )
              || SyntacticTypes.isSupertypeOrEqual( this.head(), this.arg( 0 ) ) )
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
                                || SyntacticTypes.isSupertype( outerType, innerType )
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
        const rhss = language.grammar.rules[this.head()]
        const rhs = rhss.find( r => r.notationName === this.notationName )
                 || rhss[0]
        let notation = rhs.notation
        const template = [ ]
        const splitter = new RegExp(
            rhs.variables.map( escapeRegExp ).join( '|' ) )
        while ( notation.length > 0 ) {
            const match = splitter.exec( notation )
            if ( match ) {
                if ( match.index > 0 )
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
