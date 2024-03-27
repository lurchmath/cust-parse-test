
/**
 * This constant stores a collection of hierarchies of syntactic types used in
 * mathematical writing.  We distinguish "syntactic types" from "semantic types"
 * in the following way.
 * 
 * Mathematics notation tends to use certain precedences regardless of the
 * meaning of the symbols.  For example, the LaTeX expression `x+y\cdot z` will
 * be read by a reader as a sum of x and the product of y and z, regardless of
 * whether those operations are standard addition and multiplication of numbers
 * or some other operations, such as string concatenation and repetition, or
 * matrices, or ordinary addition of a number with a dot product of vectors, or
 * anything else.
 * 
 * Therefore this repository factors out of the definition of any one parser the
 * general notions of precedence that are used across mathematical notation, so
 * that each parser does not need to redefine such precedences (as inclusions of
 * types in one another) for itself.  This makes the definition of each parser
 * easier for the author, less error-prone, and more predicatable for the end
 * user of that parser.
 * 
 * In the example above, sums and products are syntactic types, because we can
 * speak of their relative precedence regardless of what "sum" or "product"
 * means in any particular situation.  A product can always be one of the
 * summands in a sum, but sums cannot be any of the factors in a product, unless
 * the writer of the expression puts some grouping symbol (such as parentheses)
 * around them to change the default precedence.  This has nothing to do with
 * what adding or multiplying means, so we call them syntactic types.
 * 
 * A user of this repository can define notations by adding semantic types as
 * subtypes of the syntactic types.  For example, the language author might say
 * that `number_multiplication` is a subtype of `product` and is written using
 * such-and-such notation.  Then `number_multiplication` will be a semantic
 * type, while `product` always remains a syntactic type.  The language author
 * does not need to specify the precedence of semantic types, because the
 * semantic types are situated within syntactic types, from which they get their
 * behavior.
 * 
 * This particular variable stores chains of parent-child relationships.  That
 * is, if it contains `[[A_1,...,A_n],[B_1,...,B_n],...]` then `A_1` is a parent
 * type of `A_2`, which is a parent type of `A_3`, and so on.  Similarly, `B_1`
 * is a parent type of `B_2`, which is a parent type of `B_3`, and so on, but
 * there is no assumed relationship between any `A_i` and `B_j` unless the same
 * type appears in both chains.
 * 
 * The topmost type in the hierarchy is `expression`, and there should be no
 * types above it.  The lowest types in the hierarchy must all begin with the
 * word `atomic`, as in `atomic_proposition` or `atomicint` or `atomicnumber`.
 * 
 * @see {@link module:SyntacticTypes.types}
 * @see {@link module:SyntacticTypes.isAtomic}
 * @module SyntacticTypes
 */
export const hierarchies = [
    [
        'expr',
        'numberexpr',
        'sumexpr',
        'prodexpr',
        'factorexpr',
        'atomicnumberexpr'
    ],
    [
        'expr',
        'sentenceexpr',
        'condexpr',
        'disjunctexpr',
        'conjunctexpr',
        'atomicpropexpr'
    ],
    [
        'expr',
        'setexpr',
        'unionexpr',
        'intersectionexpr',
        'atomicsetexpr'
    ]
]

/**
 * A single JavaScript array containing all types mentioned in the syntactic
 * types hierarchies defined in the {@link module:SyntacticTypes.hierarchies}
 * variable.  Unlike the hierarchies variable, this array is flat, containing
 * only strings, and containing each type exactly once.  Its order does not
 * matter; the order matters in the {@link module:SyntacticTypes.hierarchies}
 * variable, but not here.
 * 
 * One common use of this variable is to check whether a given identifier is the
 * name of a syntactic type, by checking `.includes()` with respect to this
 * array.
 * 
 * @see {@link module:SyntacticTypes.hierarchies}
 */
export const types = Array.from( new Set( hierarchies.flat() ) )

/**
 * This function embodies the convention mentioned in the documentation for the
 * {@link module:SyntacticTypes.hierarchies} variable, which is that atomic
 * types must begin with the word `atomic`.  This function just checks to see if
 * that prefix is present.
 * 
 * @param {String} name - whether this name is the name of an atomic type
 * @returns {boolean} `true` if `name` is the name of an atomic type
 * 
 * @see {@link module:SyntacticTypes.hierarchies}
 */
export const isAtomic = name => name.startsWith( 'atomic' )

/**
 * A syntactic type has a lowest subtype if that syntactic type appears in
 * exactly one of the chains in the {@link module:SyntacticTypes.hierarchies}
 * variable.  If there is such a chain, this function returns the name of the
 * lowest subtype in that chain (which is often atomic).  If not, this function
 * returns its input, so that the result is always a valid type name.
 * 
 * @param {String} name - the name of the type whose lowest subtype we want
 * @returns {String} the name of its lowest subtype
 */
export const lowestSubtype = name => {
    const relevant = hierarchies.filter(
        hierarchy => hierarchy.includes( name ) )
    if ( relevant.length != 1 ) return name
    return relevant[0][relevant[0].length-1]
}

// Internal use only
// Maps type names to the array of names of their proper subtypes
// Begins empty, and is populated by the function below
const supertypeGraph = { }

// Internal use only
// Fills the supertype graph with all pairs of neighbors in the hierarchies
// variable, then applies transitivity to generate new pairs, until closure.
// Note: If the supertype graph is already computed, this function is a no-op,
// so it's safe to call this in every function that references the supertype
// graph data structure, with near-zero overhead (except the first time).
const computeSupertypeGraph = () => {
    if ( Object.keys( supertypeGraph ).length > 0 ) return
    hierarchies.forEach( chain =>
        chain.forEach( type => supertypeGraph[type] = [ ] ) )
        hierarchies.forEach( chain => {
        for ( let i = 0 ; i < chain.length - 1 ; i++ )
        supertypeGraph[chain[i]].push( chain[i+1] )
    } )
    let closureAchieved
    do {
        closureAchieved = true
        Object.keys( supertypeGraph ).forEach( a => {
            supertypeGraph[a].forEach( b => {
                supertypeGraph[b].forEach( c => {
                    if ( !supertypeGraph[a].includes( c ) ) {
                        supertypeGraph[a].push( c )
                        closureAchieved = false
                    }
                } )
            } )
        } )
    } while ( !closureAchieved )
}

/**
 * Is the syntactic type `a` a proper supertype of the syntactic type `b`?  This
 * function uses the data in the {@link module:SyntacticTypes.hierarchies}
 * variable to answer that question.  Note that this function is not reflexive,
 * but the {@link module:SyntacticTypes.isSupertypeOrEqual} version is.
 * 
 * @param {String} a - the name of the potential supertype
 * @param {String} b - the name of the potential subtype
 * @returns {boolean} `true` if `a` is a supertype of `b`
 * 
 * @see {@link module:SyntacticTypes.isSupertypeOrEqual}
 */
export const isSupertype = ( a, b ) => {
    computeSupertypeGraph()
    return supertypeGraph[a]?.includes( b )
}

/**
 * Is the syntactic type `a` a supertype of the syntactic type `b`, whicn
 * includes the possibility that `a` and `b` may be equal?  This function is the
 * same as the {@link module:SyntacticTypes.isSupertype} function, except that
 * it includes the possibility that `a` and `b` may be equal.  That is, this
 * function is reflexive.
 * 
 * @param {String} a - the name of the potential supertype
 * @param {String} b - the name of the potential subtype
 * @returns {boolean} `true` if `a` is a supertype of `b` or if `a` and `b` are
 *   equal
 */
export const isSupertypeOrEqual = ( a, b ) => a == b || isSupertype( a, b )

export default {
    hierarchies, types, isAtomic, lowestSubtype, isSupertype, isSupertypeOrEqual
}
