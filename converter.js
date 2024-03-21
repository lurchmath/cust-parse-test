
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
     *    `/-?[0-9]+/` as the putdown notation.
     *  * If it is a string, it should be appropriate putdown code for an
     *    application or binding, and its leaves may include any syntactic or
     *    semantic type name, to restrict parsing appropriately.  For example,
     *    if you want your language to include addition of integers, you might
     *    call this function, passing the word "intsum" as the concept name,
     *    "sum" as the parent type, and the putdown notation
     *    `"(+ integer integer)"`.
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
     * Use this converter to convert any language it knows (or data represented
     * in an {@link AST abstract syntax tree}) into any of the other languages
     * it knows (or an abstract syntax tree).  Example usages:
     * 
     *  * `converter.convert( 'putdown', 'ast', input )` parses the given input
     *    as putdown notation and returns an abstract syntax tree
     *  * `converter.convert( 'putdown', 'latex', input )` parses the given
     *    input as putdown notation and returns LaTeX (assuming that you have
     *    defined a LaTeX language in this converter; you can use any language
     *    you have defined in place of LaTeX)
     *  * `converter.convert( 'ast', 'asciimath', input )` treat the given input
     *    as an {@link AST} instance and express it in Python notation (assuming
     *    that you have defined AsciiMath as a language in this converter; as in
     *    the previous bullet, it is just an example)
     * 
     * @param {String} sourceLang - the name of the language in which the input
     *   is expressed
     * @param {String} destLang - the name of the language into which to convert
     *   the input
     * @param {String|AST} data - the input to be converter
     * @returns {String|AST} the converted output
     */
    convert ( sourceLang, destLang, data ) {
        if ( sourceLang == destLang ) return data
        if ( sourceLang == 'ast' ) {
            return data.writeIn( destLang )
        } else if ( this.isLanguage( sourceLang ) ) {
            const language = this.languages.get( sourceLang )
            if ( destLang == 'ast' ) {
                const tokens = language.tokenizer.tokenize( data )
                if ( !tokens ) return undefined
                const result = language.grammar.parse( tokens, {
                    showDebuggingOutput : this._debug
                } )[0]
                return result ? AST.fromJSON( language, result ) : undefined
            } else if ( this.isLanguage( destLang ) ) {
                return this.convert( sourceLang, 'ast', data )?.compact()
                    ?.writeIn( destLang )
            } else {
                throw new Error( 'Unknown language: ' + destLang )
            }
        } else {
            throw new Error( 'Unknown language: ' + sourceLang )
        }
    }

}    
