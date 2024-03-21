
import { Grammar, Tokenizer } from 'earley-parser'
import { AST } from './ast.js'
import SyntacticTypes from './syntactic-types.js'
import { notationStringToArray, putdownLeaves } from './utilities.js'

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
 *  * Add any other languages you want by calling {@link Converter#addLanguage
 *    addLanguage}.  (You almost certainly want to add at least one language,
 *    because otherwise you can parse only putdown, which is not interesting.)
 *  * Add all concepts that you want your language(s) to be able to represent by
 *    making repeated calls to {@link Converter#addConcept addConcept}.  (A
 *    concept is also called a "semantic type", in contrast to the syntactic
 *    types supported by the {@link SyntacticTypes SyntacticTypes module}.)
 *  * For each concept you add, specify how it is written in each of the
 *    language(s) you added, with calls to {@link Converter#addNotation
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
        this.addLanguage( 'putdown', null, x =>
            x.replaceAll( '( ', '(' ).replaceAll( ' )', ')' ) )
    }

    /**
     * To add a new language, you need only call this function with the name of
     * the language.  However, there are two optional parameters you may also
     * wish to provide.
     * 
     * The default grouping symbols for any newly installed language are `(` and
     * `)`.  You may wish to override this default for a number of reasons.  For
     * example, internally, when this class adds the putdown language, it
     * specifies the empty array, since putdown uses no grouping symbols.  And
     * if you were to define a parser for LaTeX, you might want to add the
     * symbols `{` and `}` to the list, since they are groupers in LaTeX.  Note
     * that the array must be of even length, pairs of open and close groupers,
     * in that order, as in `[ '(', ')', '{', '}' ]` for LaTeX.
     * 
     * The default linter for any language is the identity function, meaning
     * that no cleanup is needed for expressions of that language.  If you want
     * the {@link Converter#convert convert} function, upon creating an
     * expression in this language, to apply to it any specific formatting
     * conventions you would like to see in the output, you can specify a
     * linter, which will be run before {@link Converter#convert convert}
     * returns its result.  Add such a function only if you see output from
     * {@link Converter#convert convert} that doesn't meet your standards,
     * aesthetically or for some functional reason.
     * 
     * @param {String} name - the name of the new language (e.g., "latex")
     * @param {String[]} groupers - any pairs of grouping symbols used by the
     *   language (as documented above)
     * @param {Function?} linter - a function that cleans up notation in this
     *   language (as documented above)
     * @see {@link Converter#convert convert}
     * @see {@link Converter#languages languages}
     * @see {@link Converter#isLanguage isLanguage}
     */
    addLanguage ( name, groupers = [ '(', ')' ], linter = x => x ) {
        if ( !groupers ) groupers = [ ] // support passing null
        // Create both things the language needs--a tokenizer and a grammar--and
        // store them in this converter's languages map.
        const tokenizer = new Tokenizer()
        tokenizer.addType( /\s/, () => null )
        const grammar = new Grammar()
        grammar.START = SyntacticTypes.hierarchies[0][0]
        this.languages.set( name,
            { name, tokenizer, grammar, groupers, linter } )
        // If the concept is atomic and has a putdown form, use that as the
        // default notation in the new language; this can be overridden by any
        // later call to addNotation().
        Array.from( this.concepts.keys() ).forEach( conceptName => {
            const concept = this.concepts.get( conceptName )
            if ( SyntacticTypes.isAtomic( concept.parentType ) )
                this.addNotation( name, conceptName, concept.putdown )
        } )
        // Add subtyping rules and grouping rules to the grammar.
        SyntacticTypes.hierarchies.forEach( hierarchy => {
            for ( let i = 0 ; i < hierarchy.length - 1 ; i++ )
                grammar.addRule( hierarchy[i], hierarchy[i+1] )
            if ( groupers.length > 0 && hierarchy[0] == 'expression' ) {
                const last = hierarchy[hierarchy.length-1]
                if ( SyntacticTypes.isAtomic( last ) ) {
                    for ( let i = 0 ; i < groupers.length - 1 ; i += 2 ) {
                        const left = groupers[i]
                        const right = groupers[i+1]
                        this.addNotation( name, `grouped${last}`,
                            `${left} A ${right}` )
                    }
                }
            }
        } )
    }

    /**
     * Returns the names of all languages added to this converter via
     * {@link Converter#addLanguage addLanguage}.  This will include the name
     * of the default language, "putdown", which is installed during the
     * constructor.
     * 
     * @returns {String[]} the names of the installed languages
     * @see {@link Converter#addLanguage addLanguage}
     * @see {@link Converter#isLanguage isLanguage}
     */
    languages () {
        return Array.from( this.languages.keys() )
    }

    /**
     * Does this converter have a language of the given name?
     * 
     * @param {String} name - the name of the language to check
     * @returns {boolean} whether a language with that name has been added to
     *   this converter
     * @see {@link Converter#addLanguage addLanguage}
     * @see {@link Converter#languages languages}
     */
    isLanguage ( name ) {
        return this.languages.has( name )
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
     * calls to {@link Converter#addNotation addNotation}.
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
                this.addNotation( 'putdown', name, putdown )
            } else if ( typeof( putdown ) == 'string' ) {
                const variables = Array.from( Converter.defaultVarNames )
                let putdownForParsing = putdown.replace( /([()])/g, ' $1 ' ).trim()
                data.typeSequence.forEach( ( type, index ) =>
                    putdownForParsing = putdownForParsing.replace(
                        new RegExp( `\\b${type}\\b` ), variables[index] ) )
                this.addNotation( 'putdown', name, putdownForParsing, { variables } )
            } else {
                throw new Error( 'Invalid putdown content: ' + putdown )
            }
        }
    }

    /**
     * Returns the names of all concepts added to this converter via
     * {@link Converter#addConcept addConcept}.
     * 
     * @returns {String[]} the names of the installed concepts
     * @see {@link Converter#addConcept addConcept}
     * @see {@link Converter#isConcept isConcept}
     */
    concepts () {
        return Array.from( this.concepts.keys() )
    }

    /**
     * Does this converter know a concept with the given name?
     * 
     * @param {String} name - the name of the concept to check
     * @returns {boolean} whether a concept with that name has been added to
     *   this converter
     * @see {@link Converter#addConcept addConcept}
     * @see {@link Converter#concepts concepts}
     */
    isConcept ( name ) {
        return this.concepts.has( name )
    }

    /**
     * Add a new notation to one of the languages installed in this converter.
     * Specify the name of the language you're extending and the name of the
     * concept being represented by the language.  Then specify the notation
     * using a string in which the letters `A`, `B`, and `C` represent the
     * first, second, and third arguments, respectively.  (You can omit any
     * arguments you do not need.  For example, you might write `A+B` for
     * addition, `-A` for negation, or just `\\bot` for the logical constant
     * "false" in LaTeX.)
     * 
     * The options object supports the following fields.
     * 
     *  * If you need to use one of the letters `A`, `B`, or `C` in the notation
     *    itself, or if you need to use more than three parameters in your
     *    notation (continuing on to `D`, `E`, etc.) then you can use the
     *    options object to specify the variables in your notation.  For
     *    example, you could use notation `x+y` and then use the options object
     *    to specify `{ variables : [ 'x', 'y' ] }`.  Note that *every*
     *    occurrence of a variable counts as the variable, *even inside a word*
     *    or even if used multiple times.  So choose variable names that do not
     *    show up anywhere in your new notation.
     *  * If you want to assign this notation a name, that name will be stored
     *    in the AST whenever this notation is parsed.  If you assign the same
     *    name to a notation for the same concept *in a different language,*
     *    then when translating among languages, the converter will attempt to
     *    map this notation to the notation of the same name in another
     *    language.  Without giving names to notations, the converter just uses
     *    the default way to represent a concept in each language, preserving
     *    meaning only, not any details of the way that meaning was written.
     * 
     * There are no other options at this time besides those documented above,
     * but the options object is available for future expansion.
     * 
     * @param {String} languageName - the name of the language in which this new
     *   notation is expressed
     * @param {String} conceptName - the name of the concept represented by this
     *   new notation
     * @param {String} notation - the notation being added
     * @param {Object?} options - any additional options, as documented above
     */
    addNotation ( languageName, conceptName, notation, options = { } ) {
        const originalNotation = notation
        Object.assign( options, {
            variables : Array.from( Converter.defaultVarNames )
        } )
        // ensure language is valid
        if ( !this.isLanguage( languageName ) )
            throw new Error( `Not a valid language: ${languageName}` )
        const language = this.languages.get( languageName )
        // ensure concept is valid
        if ( !this.isConcept( conceptName ) )
            throw new Error( `Not a valid concept: ${conceptName}` )
        const concept = this.concepts.get( conceptName )
        // if this is an atomic concept, delete any previous notation it had
        // (since that was probably the putdown default installed at language
        // creation time, which the user is now overriding)
        // but this does not apply to groupers; there can be more than one
        // set of groupers in a language, and thus more than one way to form an
        // atomic concept using groupers
        if ( SyntacticTypes.isAtomic( concept.parentType )
          && !conceptName.startsWith( 'grouped' ) )
            delete language.grammar.rules[conceptName]
        // convert notation to array if needed and extract its tokens
        if ( notation instanceof RegExp )
            notation = [ notation ]
        const notationToPutdown = [ ]
        if ( !( notation instanceof Array ) ) {
            notation = notationStringToArray( notation, options.variables ).map(
                piece => {
                    const variableIndex = options.variables.indexOf( piece )
                    if ( variableIndex > -1 ) {
                        notationToPutdown.push( variableIndex )
                        return concept.typeSequence[variableIndex]
                    } else {
                        return piece
                    }
                }
            )
        }
        const putdownToNotation = notationToPutdown.slice()
        notationToPutdown.forEach( ( pi, ni ) => putdownToNotation[pi] = ni )
        notation.forEach( piece => {
            if ( piece instanceof RegExp )
                this.addTokenType( languageName, piece )
        } )
        // add notation to grammar (which can modify the array in-place, so
        // it is necessary to do this only after using it to make tokens, above)
        let parentType = concept.parentType
        if ( languageName == 'putdown' )
            parentType = SyntacticTypes.lowestSubtype( parentType )
        language.grammar.addRule( parentType, conceptName )
        language.grammar.addRule( conceptName, notation )
        const rhss = language.grammar.rules[conceptName]
        const newRule = rhss[rhss.length - 1]
        newRule.notationToPutdown = notationToPutdown
        newRule.putdownToNotation = putdownToNotation
        newRule.notation = originalNotation
        newRule.variables = options.variables
        newRule.notationName = options.name
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
                return result ? AST.fromJSON( this, language, result ) : undefined
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

    /**
     * This static member of the class contains regular expressions for some
     * common types of notation.  The following regular expressions are
     * available to make it easier to define new concepts or notations.
     * 
     *  * `oneLetterVariable` - a single letter variable expressed in Roman
     *    letters (lower-case or upper-case A, B, C, ...)
     *  * `nonnegativeInteger` - an integer expressed using just the digits 0-9
     *  * `integer` - same as the previous, but possibly preceded by a `-`
     *  * `nonnegativeNumber` - a number expressed using the digits 0-9 and a
     *    decimal point (optional)
     *  * `number` - same as the previous, but possibly preceded by a `-`
     */
    static regularExpressions = {
        oneLetterVariable : /[a-zA-Z]/, // can be upgraded later with Greek, etc.
        nonnegativeInteger : /\d+/,
        integer : /-?\d+/,
        nonnegativeNumber : /\.[0-9]+|[0-9]+\.?[0-9]*/,
        number : /-?\.[0-9]+|[0-9]+\.?[0-9]*/
    }

    // Internal use only
    // The default variable names, as documented in the addNotation() function
    static defaultVarNames = 'ABC'

    // Internal use only
    // Does the given language have a token in its tokenizer that is equal to
    // the given regular expression?
    hasTokenType ( language, regexp ) {
        if ( !this.isLanguage( language ) )
            throw new Error( 'Not a language: ' + language )
        language = this.languages.get( language )
        return language.tokenizer.tokenTypes.find( tokenType =>
            tokenType.regexp.source == `^(?:${regexp.source})` )
    }

    // Internal use only
    // Add a given regular expression to the tokenizer of the given language,
    // iff such a token is not already present, and then sort the list of tokens
    // in a way that prioritizes built-in regular expressions lower (because
    // they are infinite sets) and that prioritizes other regular expressions by
    // reverse alphabetical order (so that subwords can't be prioritized over
    // full words that contain them).
    addTokenType ( language, regexp ) {
        if ( this.hasTokenType( language, regexp ) ) return
        language = this.languages.get( language )
        language.tokenizer.addType( regexp )
        const lowPriority = Object.keys( Converter.regularExpressions )
            .map( key => `^(?:${Converter.regularExpressions[key].source})` )
        const shouldBeLater = re => lowPriority.includes( re.source ) ? 1 : 0
        language.tokenizer.tokenTypes.sort( ( a, b ) => {
            const aLater = shouldBeLater( a.regexp )
            const bLater = shouldBeLater( b.regexp )
            if ( aLater != bLater ) return aLater - bLater
            return -a.regexp.source.localeCompare( b.regexp.source )
        } )
    }

}    
