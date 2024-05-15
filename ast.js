
import SyntacticTypes from './syntactic-types.js'
import { escapeRegExp } from './utilities.js'

/**
 * An abstract syntax tree (AST) is a data structure typically created by
 * parsing text using a grammar.  We create this class for that purpose.  It has
 * the following attributes:
 * 
 *  * Its contents, which may be a string to indicate that this AST is a leaf
 *    of the tree, or it may be an array of other ASTs, which would be the
 *    operator and operands, in that order.
 *  * The {@link Language} from which it was parsed.
 * 
 * Any AST object then has methods for workflows that involve parsing,
 * representing, and classifying.
 */
export class AST {

    /**
     * Construct a new AST from two ingredients, the {@link Language} from which
     * it was parsed, and its contents (which can be a string if this AST is a
     * leaf, or an array of ASTs otherwise).  Also, the second parameter can be
     * a JSON structure of nested arrays and strings, which will be recursively
     * passed to AST constructors to convert it to an AST.
     * 
     * Note that constructing an AST from a JSON structure takes it as given,
     * and does not alter it.  To construct an AST that performs changes based
     * on associativity of concepts, see {@link AST.fromJSON fromJSON()}.
     * 
     * In an AST, every head (i.e., operator) must be a leaf AST.  Even if, for
     * example, you plan to use ASTs to represent function application, you must
     * use a leaf AST to represent the idea of function application.  Thus, for
     * example, "f composed with g, applied to x" should not be represented as
     * the structure
     * `[ [ 'compose', 'f', 'g' ], 'x' ]`, but rather as the structure
     * `[ 'apply', [ 'compose', 'f', 'g' ], 'x' ]`.
     * 
     * @param {Language} language - the language from which this AST was parsed
     * @param {String|Array} contents - see explanation above
     * @see {@link AST.fromJSON fromJSON()}
     */
    constructor ( language, contents ) {
        this.language = language
        if ( contents instanceof Array ) {
            if ( contents.length == 0 )
                throw new Error( 'An empty AST is not allowed' )
            this.contents = contents.map( item =>
                item instanceof AST ? item : new AST( language, item ) )
            if ( this.contents[0].isCompound() )
                throw new Error(
                    `Non-leaf operator in AST: ${this.contents[0].toString()}` )
        } else if ( typeof( contents ) == 'string' ) {
            this.contents = contents
        } else {
            throw new Error( 'AST contents must be a string or an array' )
        }
    }

    /**
     * An AST may be a leaf or it may have subtrees, that is to say, it may be
     * *compound.*  This function detects which is the case, and returns true
     * iff this AST is compound.
     * 
     * @return {boolean} whether this AST is a non-leaf (i.e., is compound)
     * @see {@link AST#isLeaf isLeaf()}
     */
    isCompound () { return this.contents instanceof Array }

    /**
     * An AST may be a leaf or it may have subtrees.  This function detects
     * which is the case, and returns true iff this AST is a leaf.  This is
     * equivalent to `!this.isCompound()`, and is therefore just a convenience
     * function.
     * 
     * @return {boolean} whether this AST is a leaf
     * @see {@link AST#isCompound isCompound()}
     */
    isLeaf () { return !this.isCompound() }

    /**
     * A non-leaf AST has a nonempty array of children, beginning with the
     * operator of the AST, often called its head.  This function returns that
     * entry.  (It does not shift the head off the array, but only returns it,
     * leaving the AST unaltered.)  If this AST is a leaf, this function
     * returns undefined.
     * 
     * @returns {AST} the operator of this AST, if one exists
     * @see {@link AST#args args()}
     */
    head () { return this.isCompound() ? this.contents[0] : undefined }

    /**
     * A non-leaf AST has a nonempty array of children, beginning with the
     * operator of the AST, often called its head.  This function returns the
     * rest of that list, the operands, as a JavaScript array (not an AST).  If
     * this AST is a leaf, this function returns undefined.
     * 
     * @returns {...AST} the operands of this AST
     * @see {@link AST#head head()}
     */
    args () { return this.isCompound() ? this.contents.slice( 1 ) : undefined }

    /**
     * A non-leaf AST has a nonempty array of children, beginning with the
     * operator of the AST, often called its head, followed by the operands.
     * This function returns the number of operands (which is one less than the
     * length of the array).  If this AST is a leaf, this function returns
     * undefined.
     * 
     * @returns {number} the number of operands
     * @see {@link AST#args args()}
     */
    numArgs () { return this.isCompound() ? this.contents.length - 1 : undefined }

    /**
     * A non-leaf AST has a nonempty array of children, beginning with the
     * operator of the AST, often called its head, followed by the operands.
     * This function returns the operand at the given index, where the first
     * operand after the head has index 0, and the last operand has index
     * `this.numArgs() - 1`.  If this AST is a leaf, this function returns
     * undefined.
     * 
     * @param {number} index - the index of the operand to return
     * @returns {AST} the operand at the given index
     * @see {@link AST#args args()}
     * @see {@link AST#numArgs numArgs()}
     */
    arg ( index ) { return this.isCompound() ? this.contents[index+1] : undefined }

    /**
     * The {@link module:SyntacticTypes SyntacticTypes module} defines a set of
     * syntactic types common to mathematical notation.  Each {@link Converter}
     * instance can define a set of semantic types to add to the set of
     * syntactic types.  Those semantic types are called *concepts.*  This
     * function asks whether this AST represents a concept.  This can happen in
     * two ways.
     * 
     *  * First, if this AST is {@link AST#isCompound compound}, then its
     *    {@link AST#head head} may represent a concept.  Consider two examples:
     *     * If the operator were the leaf `"expression"`, that would indicate
     *       that this AST represents an instance of the syntactic type
     *       `"expression"`, and this AST would not be a concept, and this
     *       function would return false.
     *     * If this AST were for a {@link Language} whose {@link Converter}
     *       defined the concept `"factorial"` to be a specific type of
     *       expression, and this AST began with the operator `"factorial"`,
     *       then this function would return true, because this AST is not an
     *       instance of a syntactic type (expression), but an instance of a
     *       semantic type (factorial).
     *  * Second, if this AST is a {@link AST#isLeaf leaf}, then its contents
     *    (as a string) may represent a concept.  For example, if this AST were
     *    for a {@link Language} whose {@link Converter} defined the constant
     *    `"pi"` as a concept, and this AST is a leaf containing just the string
     *    `"pi"`, then this function would return true.
     * 
     * @returns {boolean} `true` if this AST represents a concept
     * @see {@link Converter#isConcept isConcept()}
     * @see {@link AST#concept concept()}
     */
    isConcept () {
        return this.language.converter.isConcept(
            this.isCompound() ? this.head().contents : this.contents )
    }

    /**
     * The {@link module:SyntacticTypes SyntacticTypes module} defines a set of
     * syntactic types common to mathematical notation.  Each {@link Converter}
     * instance can define a set of semantic types to add to the set of
     * syntactic types.  Those semantic types are called *concepts.*  An AST can
     * represent a concept in either of two ways, as documented in the
     * {@link AST#isConcept isConcept()} method.
     * 
     * When an AST represents a concept, this function returns that concept as
     * an object with the following properties.
     * 
     *  * `parentType`, the name of the parent syntactic type
     *  * `putdown`, the putdown representation of the concept (for example, it
     *    might be `(+ summand summand)` for the concept `addition`)
     *  * `typeSequence`, an array of the syntactic types of each of the
     *    arguments extracted from the putdown notation (for example, it would
     *    be `["summand","summand"]` in the example above)
     * 
     * @returns {Object} the data about the concept represented in this AST
     */
    concept () {
        return this.language.converter.concept(
            this.isCompound() ? this.head().contents : this.contents )
    }

    /**
     * A simple string representation of this AST, useful for debugging.  For
     * example, if this AST represented the addition of x and the product of y
     * and z, the representation might be `addition(x,multiplication(y,z))`.
     * 
     * @returns {String} a simple string representation of this AST
     */
    toString () {
        if ( this.isLeaf() ) return this.contents
        const headRepr = this.head().toString()
        const argsReprs = this.args().map( arg => arg.toString() )
        return `${headRepr}(${argsReprs.join( ',' )})`
    }

    /**
     * Converts this AST into a nested hierarchy of JavaScript arrays, which is
     * isomorphic to the AST hierarchy itself, but without any of the data or
     * features provided by the AST class.  For example, the {@link
     * AST#isCompound compound} AST whose {@link AST#toString string
     * representation} is `addition(x,multiplication(y,z))` would have the JSON
     * form `[ 'addition', 'x', [ 'multiplication', 'y', 'z' ] ]`.  But a leaf
     * AST has its string contents as its JSON form (i.e., it is not an array).
     * 
     * @returns {Array|String} a JSON representation of this AST
     * @see {@link AST.fromJSON fromJSON()}
     * @see {@link AST#toString toString()}
     */
    toJSON () {
        return this.isLeaf() ? this.contents : this.contents.map( x => x.toJSON() )
    }

    /**
     * The {@link Language} class can parse text into hierarchies of JavaScript
     * arrays.  Those arrays sometimes contain unnecessary information about the
     * details of the parsing.  For instance, if `x*y` were the notation for
     * multiplication in some language, then that {@link Language} class's
     * {@link Language#parse parsing function} would return an array with
     * contents something like `['multiplication','x','*','y']`.  In other
     * words, all tokens that were parsed become part of the parsing result,
     * even though one of them is redundant now that the semantic type (in this
     * example `"multiplication"`) has been added.
     * 
     * This function not only converts such an array into an AST instance, but
     * also removes the unnecessary tokens (the `'*'` entry in the example
     * above), since the meaning is clear from the first element of the array,
     * the name of the semantic type parsed from the `'*'` infix operator.
     * 
     * This function also flattens any nested ASTs for concepts that are
     * classified as associative.  For example, if the JSON representation of
     * the AST were `['addition','x',['addition','y','z']]`, and the concept of
     * addition were marked associative (in the {@link Converter}'s list of
     * concepts), then this function will not create a nested tree imitating
     * that JSON, but will create one isomorphic to `['addition','x','y','z']`
     * instead.  (Note that associativity is actually a predicate about each
     * operator separately, but a binary relation between the outer and inner
     * operators, so this example is a special case.)
     * 
     * @param {Language} language - the language from which the JSON was parsed,
     *   and which should be used when constructing the AST
     * @param {Array} json - a hierarchy of JavaScript Arrays (with strings as
     *   leaves) representing an AST
     * @param {boolean?} top - `true` if this is the top-level call, for internal
     *   use only; clients should omit this parameter
     * @returns {AST} the AST represented by the JSON
     */
    static fromJSON ( language, json, top = true ) {
        // Base case: Leaf AST
        if ( !( json instanceof Array ) ) {
            if ( typeof( json ) != 'string' )
                throw new Error( `Invalid JSON for conversion to AST: ${json}` )
            return new AST( language, json )
        }
        // If the head does not represent a concept, then it must be a syntactic
        // type only, so the only processing we do is call .compact() iff this
        // is the top-level call (which incluedes associativity flattening).
        if ( json.length == 0 )
            throw new Error( 'Cannot build AST from empty array' )
        const concept = language.converter.concepts.get( json[0] )
        if ( !concept ) {
            const result = new AST( language, json.map(
                piece => AST.fromJSON( language, piece, false ) ) )
            return top ? result.compact() : result
        }
        // The head represents a concept, so find which grammar rule matches
        // that concept.
        const head = json.shift()
        const rhss = language.rulesFor( head )
        for ( let i = 0 ; i < rhss.length ; i++ ) {
            // Does this rule have the correct size and contents?
            if ( rhss[i].length != json.length ) continue
            const matches = rhss[i].every( ( piece, index ) => {
                const isNotation = piece instanceof RegExp
                const isText = !( json[index] instanceof Array )
                return isNotation == isText
                    && ( !isNotation || piece.test( json[index] ) )
            } )
            if ( !matches ) continue
            // Yes, it does, and the rule is defined by a single RegExp, and
            // thus has just one argument.  We apply the head to that one
            // argument when building the AST.  Again, call .compact() iff
            // this is the top-level call (which includes associativity
            // flattening).
            if ( rhss[i].notation instanceof RegExp ) {
                const result = new AST( language, [
                    new AST( language, head ),
                    AST.fromJSON( language, json[0], false )
                ] )
                return top ? result.compact() : result
            }
            // Yes, it does, and the rule is defined by a notation array, so we
            // lift out the arguments that are not constants, and adjust indices
            // to remove those constants (such as the '*' in the example in the
            // docs above).
            json = json.filter( ( _, index ) =>
                !( rhss[i][index] instanceof RegExp ) )
            const result = new AST( language, [
                new AST( language, head ),
                ...json.map( ( _, index ) => AST.fromJSON( language,
                    json[rhss[i].putdownToNotation[index]], false ) )
            ] )
            return top ? result.compact() : result
        }
        // The concept in the head was not in the grammar, so that's an error.
        throw new Error( `No notational match for ${JSON.stringify( json )}` )
    }

    // Internal use only
    // An AST created through parsing will typically not be in compact form.
    // Specifically, it will have a nested hierarchy of both syntactic and
    // semantic types.  For example, the expression `x+y` might not be
    // represented as the simple `[ 'addition', 'x', 'y' ]` array, but as the
    // unnecessarily complex array
    // `[ 'Expression', [ 'NumberExpression', [ 'SumExpression', [ 'addition', 'x', 'y' ] ] ] ]`.
    // Compact form removes all wrappers that serve only to label an AST with
    // its syntactic type, leaving only a hierarchy of semantic information.
    // This function also flattens associative operators, where an associative
    // operator is defined by those that have the "associative" option set to
    // a nonempty array in the concept's definition in Converter#addConcept().
    compact () {
        // console.log( `\t${this}` )
        // Ensure valid call:
        if ( this.length == 0 )
            throw new Error( `Empty ASTs not allowed` )
        // Base case: Leaves are already compact; return a copy
        if ( this.isLeaf() ) {
            // console.log( '\t\tleaf' )
            return new AST( this.language, this.contents )
        }
        // If it's just groupers around an expression, take them off:
        const head = this.head().contents
        if ( head.startsWith( 'GroupedAtomic' ) && this.numArgs() == 1 ) {
            // console.log( '\t\tgrouped atomic' )
            return this.arg( 0 ).compact()
        }
        // If it's a syntactic type, it should just be a wrapper around a subtype,
        // so we take the wrapper off:
        if ( SyntacticTypes.types.includes( head ) ) {
            // Ensure one argument only:
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            // If it's a leaf, recur on it:
            const inner = this.arg( 0 )
            if ( inner.isLeaf() ) {
                // console.log( '\t\tunwrapping syntactic type around leaf' )
                return inner.compact()
            }
            // Inner syntactic type?  Do a few sanity checks, then recur on it:
            const innerHead = inner.head().contents
            if ( SyntacticTypes.types.includes( innerHead ) ) {
                if ( inner.numArgs() != 1 )
                    throw new Error( `Invalid AST: ${inner}` )
                if ( !SyntacticTypes.isSupertype( head, innerHead ) )
                    throw new Error(
                        `Invalid AST, ${head} not a supertype of ${innerHead}` )
                // console.log( '\t\tunwrapping syntactic type around inner syntactic type' )
                return inner.compact()
                // Inner is a concept; no sanity checks required; just recur:
            } else if ( inner.isConcept() ) {
                // console.log( '\t\tunwrapping syntactic type around inner concept' )
                return inner.compact()
            }
        }
        // Now we know it's a semantic type, so it will have 0 or more arguments.
        // If it has 0, unwrap it so it doesn't look like a function application.
        const concept = this.concept()
        if ( concept.typeSequence.length == 0 && this.numArgs() == 0 ) {
            // console.log( '\t\tunwrapping concept w/no args to not look like a function' )
            return this.head().compact()
        }
        // console.log( `\t\trecurring on ${this.numArgs()} args...` )
        // It has at least 1 argument, so we need to recur on it/them:
        const recur = this.args().map( arg => arg.compact() )
        // Apply any associativity flattening permitted by the concept:
        for ( let i = recur.length - 1 ; i >= 0 ; i-- ) {
            if ( recur[i].isCompound()
              && concept.associative.includes( recur[i].head().contents ) ) {
                recur.splice( i, 1, ...recur[i].args() )
                // console.log( `\t\tassociativity flattening: ${recur}` )
            } else {
                // console.log( `\t\tno flattening: ${recur[i]} not in [${concept.associative}]` )
            }
        }
        // Done:
        const result = new AST( this.language, [ head, ...recur ] )
        // console.log( `\t\t\tbuilt from recursive results: ${result}` )
        return result
    }

    /**
     * Represent this AST in the given language.  For example, if the AST were
     * one whose {@link AST#toString string representation} were
     * `addition(x,y)`, then we might call `.toLanguage(latex)` on that
     * AST and expect to get `x+y`, or we might call `.toLanguage(putdown)` and
     * expect to get `(+ x y)`.  The parameter passed to `toLanguage()` must be
     * a {@link Language} that shares the same {@link Converter} instance as
     * this AST's language.
     * 
     * This function requires the AST on which it is called to be in compact
     * form, as produced by the {@link AST#compact compact()} member function.
     * The behavior of this function is undefined if this requirement is not
     * met.
     * 
     * @param {Language} language - the language in which to write the
     *   expression stored in this AST
     * @returns {String} the representation, in the specified language, of this
     *   AST
     */
    toLanguage ( language ) {
        if ( language.converter != this.language.converter )
            throw new Error(
                `Not part of same Converter: ${language.name}, ${this.language.name}` )
        // console.log( `${this}.toLanguage( ${language.name} )` )
        // Base case: A leaf should match some concept in the source language
        if ( this.isLeaf() ) {
            const rhs = language.rulesFor( this )[0]
            // console.log( `\tleaf w/rhs = ${rhs}` )
            // If the RHS is just one RegExp, it might be a non-constant pattern.
            // In that case, if it can be re-used as is in the target language,
            // let's do that.
            if ( rhs.length == 1 && ( rhs[0] instanceof RegExp )
              && rhs[0].test( this.contents ) )
                return this.contents
            // We must use the language's notation for this concept:
            if ( typeof( rhs.notation ) != 'string' )
                throw new Error( `Invalid rule for ${this.contents}: ${rhs.notation}` )
            return rhs.notation
        }
        // if it's just a syntactic type wrapper, ensure it's around exactly 1 item
        const head = this.head().contents
        if ( SyntacticTypes.types.includes( head ) ) {
            // console.log( `\tsyntactic type w/head = ${head}` )
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            // return the interior, possibly with groupers if the type
            // hierarchy requires it (the inner is not a subtype of the outer)
            const result = this.arg( 0 ).toLanguage( language )
            const innerHead = this.arg( 0 ).head().contents
            if ( !SyntacticTypes.types.includes( innerHead )
              || SyntacticTypes.isSupertypeOrEqual( head, innerHead ) )
                return result
            if ( language.groupers.length == 0 )
                throw new Error( 'Cannot fix precedence in language without groupers' )
            const left = language.groupers[0]
            const right = language.groupers[1]
            return left + result + right
        }
        // since it's not a syntactic type, it better be a concept
        if ( !this.isConcept() )
            throw new Error( 'Not a syntactic type nor a concept: ' + head )
        // if it's an atomic concept with one argument, defined by a regular
        // expression, just return the argument, because this is a base case
        const concept = this.concept()
        if ( concept.putdown instanceof RegExp ) {
            // console.log( `\tatomic concept w/putdown = ${concept.putdown}` )
            if ( this.numArgs() != 1 )
                throw new Error( `Invalid AST: ${this}` )
            return this.arg( 0 ).contents
        }
        // recursively compute the representation of the arguments, wrapping
        // them in groupers if necessary
        // console.log( `\tnon-atomic concept ${head}...recurring...` )
        if ( concept.typeSequence.length != this.numArgs() )
            throw new Error( `Invalid type sequence for AST: ${this}` )
        const recur = this.args().map( ( piece, index ) => {
            const result = piece.toLanguage( language )
            const outerType = concept.typeSequence[index]
            const pieceType = piece.head()?.contents
            const innerType = piece.isConcept() ? piece.concept().parentType
                                                : pieceType
            const correctNesting = !pieceType
                                || outerType == pieceType
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
        const rhs = language.rulesFor( this )[0]
        let notation = rhs.notation
        // now split that into an array to make template substitution easier
        const template = [ ]
        const splitter = new RegExp( rhs.variables.map( escapeRegExp ).join( '|' ) )
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
        // console.log( `\tabout to use template = ${template}` )
        // fill the recursively computed results into the template
        return language.linter(
            template.map( piece => {
                const variableIndex = rhs.variables.indexOf( piece )
                return variableIndex > -1 ? recur[variableIndex] : piece
            } ).join( '' ).replace( /\s+/g, ' ' )
        )
    }

}
