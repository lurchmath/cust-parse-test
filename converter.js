
import { AST } from './ast.js'
import SyntacticTypes from './syntactic-types.js'
import { putdownLeaves } from './utilities.js'
import { Language } from './language.js'

/**
 * ## Class overview
 * 
 * A converter is an object in which you can define mathematical languages with
 * greater ease than defining a grammar from scratch, because a lot of the work
 * is already built into the class.  After defining one or more languages, you
 * can use the class to convert between any two of the languages, or between any
 * one of the languages and an {@link AST abstract syntax tree} representing the
 * meaning of the expression that was parsed.
 * 
 * The workflow for using the class is as follows.
 * 
 *  * Construct one using {@link Converter#constructor the constructor}.  Doing
 *    so automatically installs in the converter a language named "putdown".
 *  * Add any other languages you want by calling the {@link Language}
 *    constructor.  (You almost certainly want to add at least one language,
 *    because otherwise you can parse only putdown, which is not interesting.)
 *  * Add all concepts that you want your language(s) to be able to represent by
 *    making repeated calls to {@link Converter#addConcept addConcept()}.  (See
 *    below for detailed explanation of concepts.)
 *  * For each concept you add, specify how it is written in each of the
 *    language(s) you added, with calls to {@link Language#addNotation
 *    addNotation()}.
 *  * Convert between any two languages using the
 *    {@link Converter#convert convert()} function.
 * 
 * ## Core definitions
 * 
 * **Using this class requires understanding the distinction among syntactic
 * types, primitive concepts, and derived concepts.**  We explain these here.  A
 * key distinction in the definitions below is whether a concept has an assigned
 * meaning.  The Converter class (and all other classes in this repository)
 * single out the putdown language as the one in which meaning will be
 * represented, and thus any concept with an assigned putdown notation has a
 * meaning, and any concept without an assigned putdown notation has no meaning.
 * As you read the definitions below, you will need to remember that "having a
 * meaning" is synonymous with "having an assigned putdown form."
 * 
 *  * **Syntactic types are those that have no meaning.**  They exist to provide
 *    a skeleton that represents the relationships among the most common
 *    mathematical notations, so that defining a new language can just put flesh
 *    onto this skeleton and not have to start from scratch.  For example, all
 *    common mathematical notations expect `1+2*3` to be interpreted with the
 *    `2*3` taking precedence and sitting inside the `1+...`.  For more details
 *    on syntactic types, see the {@link module:SyntacticTypes SyntacticTypes
 *    module}.  The other two categories below have assigned meanings, and thus
 *    are disjoint from the syntactic types; we call those two categories
 *    together the *semantic* types, or for short, *concepts.*  They come in two
 *    types, *primitive* and *derived,* which we will explain now.
 *  * **A *primitive concept* is one whose putdown meaning introduces a new
 *    operator specifically for that concept.**  For example, if one of the
 *    concepts in our language were addition, and we expressed it in putdown as
 *    `(+ arg1 arg2)`, where `+` had not been used before, then addition is a
 *    primitive concept.  Other concepts later may choose to represent
 *    themselves in terms of addition (for example, perhaps subtraction will be
 *    represented as `(+ arg1 (- arg2))`, where unary negation is another
 *    primitive concept distinct from subtraction).  But subtraction could also
 *    be its own primitive concept if its putdown form were specified as
 *    `(- arg1 arg2)`, for example.
 *  * **A *derived concept* is one whose putdown meaning uses the operators
 *    introduced by earlier primitive concepts.**  In the previous bullet point,
 *    we saw an example of how one could introduce subtraction in such a way.
 *    Here we provide two additional examples for why this feature can be
 *    useful.
 *     * Imagine you are creating a Converter that will translate among three
 *       languages, putdown and two others, called A and B.  Now imagine that
 *       both A and B allow you to use the symbols `*` and `x` to both mean
 *       multiplication.  When translating `7*4` from A to B, we want the result
 *       to use the `*` operator, but when translating `7x4` from A to B, we
 *       want the result to use the `x` operator, even though the meanings are
 *       the same.  When translating either one into putdown, we want it to use
 *       the one, unique putdown operator that means multiplication (perhaps it
 *       is `(mul 7 4)`, as an example).  To solve this problem, create one
 *       primitive concept, `multiplication`, whose putdown form is
 *       `(* arg1 arg2)`.  Then create one derived concept, `x-multiplication`,
 *       whose putdown form is the same.  Now when defining languages A and B,
 *       the notation `7*4` can map to the multiplication concept, while the
 *       notation `7x4` can map to the x-multiplication concept.  When
 *       translating between A and B, those concepts will mediate correct
 *       conversion of notation, but when translating to putdown, to compute the
 *       meaning of either expression, both will render as `(mul 7 4)`.  Note
 *       that derived concepts will never be the target of a translation that
 *       comes *out of* putdown, and thus if you ask the Converter to translate
 *       `(mul 7 4)` into language A or B, it will always use the `*` operator,
 *       because that is the primitive concept associated with the `mul`
 *       operator.
 *     * Imagine you are creating a Converter that will translate LaTeX to and
 *       from putdown.  You want `x\in A` to mean `(in x A)` in putdown, but you
 *       do not want a separate operator for `x\notin A`.  Instead, you want
 *       that notation to be shorthand for the internal meaning
 *       `(not (in x A))`.  To solve this, make a primitive `setmembership`
 *       concept whose putdown meaning is `(in arg1 arg2)`, and assign the
 *       `x\in A` notation to map to that concept.  Then create a derived
 *       `notsetmembership` concept whose putdown meaning is
 *       `(not (in arg1 arg2))`, and assign the `x\notin A` notation to map to
 *       that concept.  As in the previous example, if you have the expression
 *       `(not (in x A))` in putdown and ask the Converter to translate to
 *       LaTeX, because `notsetmembership` is a derived concept, it will not be
 *       used for parsing putdown.  That is, the expanded form `(not (in x A))`
 *       will not be collapsed back into the notation `x\notin A`, but rather
 *       the expanded form (which you can view as a canonical form) will be
 *       preserved in the conversion to LaTeX, presumably as something like
 *       `\neg(x\in A)`, depending on the LaTeX notation you have specified for
 *       negation and grouping symbols.
 * 
 * Syntactic types are fixed, defined in the {@link module:SyntacticTypes
 * SyntacticTypes module}, and are not designed to be altered by clients of this
 * class.  All semantic types (both primitive and derived concepts) are
 * completely up to the user of this class to introduce, including which
 * concepts to introduce, what notation to use for each, and thus which ones are
 * primitive vs. derived.  Each instance of this class is a separate semantic
 * universe, in the sense that you can create one Converter instance and add to
 * it one set of concepts, then create another Converter instance and add to it
 * a completely different set of concepts.  The two instances will not share
 * concepts, but they will both share the same underlying set of syntactic
 * types.
 */
export class Converter {

    /**
     * Creates a new converter.  No arguments are required.  To customize the
     * converter to your needs, refer to the documentation {@link Converter at
     * the top of the class}, which lists a workflow for how you should call the
     * other functions in this class to set an instance up for your needs.
     */
    constructor () {
        this.languages = new Map()
        this.concepts = new Map()
        SyntacticTypes.hierarchies.forEach( hierarchy => {
            const last = hierarchy[hierarchy.length-1]
            if ( SyntacticTypes.isAtomic( last ) )
                this.addConcept( `grouped${last}`, last, hierarchy[1] )
        } )
        new Language( 'putdown', this, null, x =>
            x.replaceAll( '( ', '(' ).replaceAll( ' )', ')' ) )
    }

    /**
     * Does this converter have a language of the given name?
     * 
     * @param {String} name - the name of the language to check
     * @returns {boolean} whether a language with that name has been added to
     *   this converter
     * @see {@link Language}
     * @see {@link Converter#language language}
     */
    isLanguage ( name ) {
        return this.languages.has( name )
    }

    /**
     * Returns the language with the given name, if any.  Languages are added by
     * calls to the {@link Language} constructor.
     * 
     * @param {String} name - the name of the language to retrieve
     * @returns {Language} the language with the given name
     * @see {@link Language}
     * @see {@link Converter#isLanguage isLanguage()}
     */
    language ( name ) {
        return this.languages.get( name )
    }

    /**
     * The {@link module:SyntacticTypes SyntacticTypes module} defines a set of
     * types called "syntactic types" (explained in greater detail in that
     * module) that make it easier to define a language.  Converter instances
     * define their own set of "semantic types" that sit within the hierarchy
     * established by those syntactic types.  Such "semantic types" are called
     * "concepts" and you add them to a converter using this function.
     * 
     * The most complex parameter here is the third one, which specifies the
     * putdown notation for the concept.  This can be one of two things:
     * 
     *  * If it is a regular expression, it will be used during tokenization, to
     *    find portions of input in this language that represent this concept.
     *    For example, if you want your language to include integers, you might
     *    call this function, passing the word "integer" as the concept name,
     *    "atomicnumber" as the parent type, and a regular expression like
     *    `/-?[0-9]+/` as the putdown notation.  This not only makes that
     *    regular expression the putdown notation, but it also makes it the
     *    default notation for all future languages added to this converter.
     *    Clients can override that default with later calls to
     *    {@link Language#addNotation addNotation()}.
     *  * If it is a string, it should be appropriate putdown code for an
     *    application or binding, and its leaves may include any syntactic or
     *    semantic type name, to restrict parsing appropriately.  For example,
     *    if you want your language to include addition of integers, you might
     *    call this function, passing the word "intsum" as the concept name,
     *    "sum" as the parent type, and the putdown notation
     *    `"(+ integer integer)"`.
     *  * If you omit the third argument, the concept name is used as the
     *    default putdown notation.  This is useful in some cases, such as
     *    `addConcept('infinity','number')`, which will make the default putdown
     *    notation just the word "infinity".
     * 
     * Note that this function does not allow you to specify how the concept is
     * written in any language other than putdown.  To do so, you must make
     * calls to {@link Language#addNotation addNotation()}.
     * 
     * The final parameter is an options object, which supports the following
     * fields.
     * 
     *  * `primitive` - this allows you to specify whether this concept is a
     *    primitive concept (the default) or a derived concept (by setting the
     *    option to `false`).  See the documentation for this class for an
     *    overview of primitive vs. derived concepts.  The final parameter is
     *    ignored in the case where `putdown` is a regular expression, because
     *    such a value makes sense only if the concept is primitive.
     *  * `associative` - this allows you to specify whether this concept
     *    functions as an associative operator, in the sense that nested copies
     *    of it should be flattened out into a single copy with more arguments.
     *    If true, then whenever an {@link AST} is created with this concept as
     *    its head, any children that have the same head will be merged with
     *    their parent to perform that flattening.  The default is false, which
     *    will cause most operators to associate to the right, so that, for
     *    example, `A -> B -> C` is stored internally as `A -> (B -> C)`.
     * 
     * @param {String} name - the name of the concept to add
     * @param {String} parentType - the name of the parent type, which must be a
     *   {@link module:SyntacticTypes syntactic type}
     * @param {String|RegExp} putdown - the notation for this concept in the
     *   putdown language
     * @param {Object?} options - see supported fields above
     */
    addConcept ( name, parentType, putdown, options = { } ) {
        if ( !putdown ) putdown = name
        options = Object.assign( {
            primitive : true,
            associative : false
        }, options )
        const conceptData = {
            parentType,
            putdown,
            associative : options.associative,
            typeSequence : putdown instanceof RegExp ? [ ] :
                putdownLeaves( putdown ).filter( leaf => this.isConcept( leaf )
                    || SyntacticTypes.types.includes( leaf ) )
        }
        this.concepts.set( name, conceptData )
        if ( this.isLanguage( 'putdown' ) ) {
            if ( putdown instanceof RegExp ) {
                this.languages.get( 'putdown' ).addNotation( name, putdown )
            } else if ( typeof( putdown ) == 'string' ) {
                const variables = Array.from( Language.defaultVarNames )
                let putdownForParsing = putdown.replace( /([()])/g, ' $1 ' ).trim()
                conceptData.typeSequence.forEach( ( type, index ) =>
                    putdownForParsing = putdownForParsing.replace(
                        new RegExp( `\\b${type}\\b` ), variables[index] ) )
                this.languages.get( 'putdown' ).addNotation( name,
                    putdownForParsing, {
                        variables,
                        writeOnly : !options.primitive
                    } )
            } else {
                throw new Error( 'Invalid putdown content: ' + putdown )
            }
        }
    }

    /**
     * Does this converter know a concept with the given name?
     * 
     * @param {String} name - the name of the concept to check
     * @returns {boolean} whether a concept with that name has been added to
     *   this converter
     * @see {@link Converter#addConcept addConcept()}
     * @see {@link Converter#concept concept()}
     */
    isConcept ( name ) {
        return this.concepts.has( name )
    }

    /**
     * Returns the concept with the given name, if any.  Concepts are added by
     * calls to {@link Converter#addConcept addConcept()}.
     * 
     * @param {String} name - the name of the concept to retrieve
     * @returns {Object} the concept with the given name
     * @see {@link Converter#addConcept addConcept()}
     * @see {@link Converter#isConcept isConcept()}
     */
    concept ( name ) {
        return this.concepts.get( name )
    }

    /**
     * Use this converter to convert text in any language it knows into text in
     * any of the other languages it knows.  For example,
     * `converter.convert( 'putdown', 'latex', input )` parses the given input
     * as putdown notation and returns LaTeX (assuming that you have defined a
     * LaTeX language in this converter; you can use any language you have
     * defined in place of LaTeX).  Similarly, you can convert into putdown from
     * LaTeX, or between two non-putdown languages.
     * 
     * @param {String} sourceLang - the name of the language in which the input
     *   is expressed
     * @param {String} destLang - the name of the language into which to convert
     *   the input
     * @param {String} text - the input to be converter
     * @returns {String} the converted output
     * @see {@link Language#convertTo convertTo()}
     */
    convert ( sourceLang, destLang, data ) {
        if ( sourceLang == destLang ) return data
        const source = this.language( sourceLang )
        if ( !source )
            throw new Error( 'Unknown language: ' + sourceLang )
        const destination = this.language( destLang )
        if ( !destination )
            throw new Error( 'Unknown language: ' + destLang )
        return source.convertTo( data, destination )
    }

}    
