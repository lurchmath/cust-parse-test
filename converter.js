
import { AST } from './ast.js'
import SyntacticTypes from './syntactic-types.js'
import { putdownLeaves } from './utilities.js'
import { Language } from './language.js'

/**
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
 *    making repeated calls to {@link Converter#addConcept addConcept}.  (A
 *    concept is also called a "semantic type", in contrast to the syntactic
 *    types supported by the {@link SyntacticTypes SyntacticTypes module}.)
 *  * For each concept you add, specify how it is written in each of the
 *    language(s) you added, with calls to {@link Language#addNotation
 *    addNotation()}.
 *  * Convert between any two languages (or to/from AST form) using the
 *    {@link Converter#convert convert} function.
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
            if ( hierarchy[0] != 'expression' ) return
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
     * @see {@link Converter#languages languages}
     */
    isLanguage ( name ) {
        return this.languages.has( name )
    }

    /**
     * Returns the language with the given name, if any.  Languages are added by
     * calls to the {@link Language} constructor.
     * 
     * @returns {Language} the language with the given name
     * @see {@link Language}
     * @see {@link Converter#isLanguage isLanguage}
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
     *    {@link Language#addNotation addNotation}.
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
     * calls to {@link Language#addNotation addNotation}.
     * 
     * @param {String} name - the name of the concept to add
     * @param {String} parentType - the name of the parent type, which must be a
     *   {@link module:SyntacticTypes syntactic type}
     * @param {String|RegExp} putdown - the notation for this concept in the
     *   putdown language
     */
    addConcept ( name, parentType, putdown ) {
        if ( !putdown ) putdown = name
        const data = { parentType, putdown }
        data.typeSequence = putdown instanceof RegExp ? [ ] :
            putdownLeaves( putdown ).filter( leaf =>
                SyntacticTypes.types.includes( leaf ) || this.isConcept( leaf ) )
        this.concepts.set( name, data )
        if ( this.isLanguage( 'putdown' ) ) {
            if ( putdown instanceof RegExp ) {
                this.languages.get( 'putdown' ).addNotation( name, putdown )
            } else if ( typeof( putdown ) == 'string' ) {
                const variables = Array.from( Language.defaultVarNames )
                let putdownForParsing = putdown.replace( /([()])/g, ' $1 ' ).trim()
                data.typeSequence.forEach( ( type, index ) =>
                    putdownForParsing = putdownForParsing.replace(
                        new RegExp( `\\b${type}\\b` ), variables[index] ) )
                this.languages.get( 'putdown' ).addNotation( name,
                    putdownForParsing, { variables } )
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
     * @see {@link Converter#addConcept addConcept}
     * @see {@link Converter#concept concept}
     */
    isConcept ( name ) {
        return this.concepts.has( name )
    }

    /**
     * Returns the concept with the given name, if any.  Concepts are added by
     * calls to {@link Converter#addConcept addConcept}.
     * 
     * @returns {Object} the concept with the given name
     * @see {@link Converter#addConcept addConcept}
     * @see {@link Converter#isConcept isConcept}
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
     * @see {@link Language#convertTo convertTo}
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
