
import { Grammar, Tokenizer } from 'earley-parser'
import { AST } from './ast.js'
import SyntacticTypes from './syntactic-types.js'
import { notationStringToArray } from './utilities.js'

export class Language {

    /**
     * To add a new language to a {@link Conveter}, just call this constructor,
     * passing the converter object as one of the parameters, and this
     * constructor will add this language to that converter.
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
     * For example, when installing putdown as the initial language in the
     * constructor for this class, it provides a linter that removes unnecessary
     * spaces around parentheses.
     * 
     * @param {String} name - the name of the new language (e.g., "latex")
     * @param {Converter} converter - the converter into which to install this
     *   language
     * @param {String[]} groupers - any pairs of grouping symbols used by the
     *   language (as documented above)
     * @param {Function?} linter - a function that cleans up notation in this
     *   language (as documented above)
     * @see {@link Converter#convert convert}
     * @see {@link Converter#languages languages}
     * @see {@link Converter#isLanguage isLanguage}
     */
    constructor ( name, converter, groupers = [ '(', ')' ], linter = x => x ) {
        // allow clients to pass "null" for groupers:
        if ( !groupers ) groupers = [ ]
        // store all parameters:
        this.name = name
        this.converter = converter
        this.groupers = groupers
        this.linter = linter
        // also create a tokenizer and grammar and store them:
        this.tokenizer = new Tokenizer()
        this.tokenizer.addType( /\s/, () => null )
        this.grammar = new Grammar()
        this.grammar.START = SyntacticTypes.hierarchies[0][0]
        // If the concept is atomic and has a putdown form, use that as the
        // default notation in the new language; this can be overridden by any
        // later call to addNotation().
        Array.from( converter.concepts.keys() ).forEach( conceptName => {
            const concept = converter.concepts.get( conceptName )
            if ( SyntacticTypes.isAtomic( concept.parentType ) )
                this.addNotation( conceptName, concept.putdown )
        } )
        // Add subtyping rules and grouping rules to the grammar.
        SyntacticTypes.hierarchies.forEach( hierarchy => {
            for ( let i = 0 ; i < hierarchy.length - 1 ; i++ )
                this.grammar.addRule( hierarchy[i], hierarchy[i+1] )
            if ( groupers.length > 0 && hierarchy[0] == 'expression' ) {
                const last = hierarchy[hierarchy.length-1]
                if ( SyntacticTypes.isAtomic( last ) ) {
                    for ( let i = 0 ; i < groupers.length - 1 ; i += 2 ) {
                        const left = groupers[i]
                        const right = groupers[i+1]
                        this.addNotation( `grouped${last}`, `${left} A ${right}` )
                    }
                }
            }
        } )
        // register ourselves with our converter
        converter.languages.set( name, this )
    }

    /**
     * Add a new notation to this language, for one of its converter's concepts.
     * Specify the name of the concept being represented, then the notation
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
     *    to specify `{ variables : [ 'x', 'y' ] }`.  Note that every occurrence
     *    a variable counts as the variable (except inside another word) even if
     *    used multiple times.  So choose variable names that do not show up
     *    in the new notation you are introducing.
     *  * If you want to assign this notation a name, that name will be stored
     *    in any AST parsed from this notation.  If you assign the same name to
     *    a notation for the same concept *in a different language in the same
     *    converter,* then when translating among languages, the
     *    {@link Converter} will attempt to map this notation to the notation of
     *    the same name in another language.  Without giving names to notations,
     *    the converter just uses the default way to represent a concept in each
     *    language, preserving meaning only, not any details of the way that
     *    meaning was written.
     * 
     * There are no other options at this time besides those documented above,
     * but the options object is available for future expansion.
     * 
     * @param {String} conceptName - the name of the concept represented by this
     *   new notation
     * @param {String} notation - the notation being added
     * @param {Object?} options - any additional options, as documented above
     */
    addNotation ( conceptName, notation, options = { } ) {
        const originalNotation = notation
        Object.assign( options, {
            variables : Array.from( Language.defaultVarNames )
        } )
        // ensure concept is valid
        const concept = this.converter.concept( conceptName )
        if ( !concept )
            throw new Error( `Not a valid concept: ${conceptName}` )
        // if this is an atomic concept, delete any previous notation it had
        // (since that was probably the putdown default installed at language
        // creation time, which the user is now overriding)
        // but this does not apply to groupers; there can be more than one
        // set of groupers in a language, and thus more than one way to form an
        // atomic concept using groupers
        if ( SyntacticTypes.isAtomic( concept.parentType )
          && !conceptName.startsWith( 'grouped' ) )
            delete this.grammar.rules[conceptName]
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
            if ( piece instanceof RegExp ) this.addTokenType( piece )
        } )
        // add notation to grammar (which can modify the array in-place, so
        // it is necessary to do this only after using it to make tokens, above)
        let parentType = concept.parentType
        // putdown is a special language in which every notation counts as a
        // grouper, so everything has high precedence (lowest subtype)
        if ( this.name == 'putdown' )
            parentType = SyntacticTypes.lowestSubtype( parentType )
        this.grammar.addRule( parentType, conceptName )
        this.grammar.addRule( conceptName, notation )
        const rhss = this.grammar.rules[conceptName]
        const newRule = rhss[rhss.length - 1]
        // record in the new rule RHS several data about how the rule was made
        newRule.notationToPutdown = notationToPutdown
        newRule.putdownToNotation = putdownToNotation
        newRule.notation = originalNotation
        newRule.variables = options.variables
        newRule.notationName = options.name
    }

    /**
     * Treat the given text as an expression in this language and attempt to
     * parse it.  Return an abstract syntax tree ({@link AST}) on success, or
     * `undefined` on failure.
     * 
     * @param {String} text - the input text to parse
     * @returns {AST} - the parsed AST, or undefined if parsing failed
     * @see {@link AST#compact compact}
     */
    parse ( text ) {
        const tokens = this.tokenizer.tokenize( text )
        if ( !tokens ) return undefined
        const json = this.grammar.parse( tokens, {
            showDebuggingOutput : this._debug
        } )[0]
        if ( !json ) return undefined
        return AST.fromJSON( this, json ).compact()
    }

    /**
     * Convert text in this language to text in another language.  If the text
     * cannot be parsed in this language, then undefined is returned instead.
     * Note that this object and `language` must have the same {@link Converter}
     * instance associated with them, or this function will throw an error.
     * 
     * @param {String} text - the text in this language to be converter to the
     *   other language
     * @param {Language} language - the destination language
     * @returns {String} the converted text, if the conversion was possible, and
     *   undefined otherwise
     */
    convertTo ( text, language ) {
        if ( this.converter != language.converter )
            throw new Error( 'The two languages do not share a Converter' )
        return this.parse( text )?.toLanguage( language )
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
    // Does this language have a token in its tokenizer that is equal to the
    // given regular expression?
    hasTokenType ( regexp ) {
        return this.tokenizer.tokenTypes.find( tokenType =>
            tokenType.regexp.source == `^(?:${regexp.source})` )
    }

    // Internal use only
    // Add a given regular expression to our tokenizer, iff such a token is not
    // already present, and then sort the list of tokens in a way that
    // prioritizes built-in regular expressions lower (because they are infinite
    // sets) and that prioritizes other regular expressions by reverse
    // alphabetical order (so that subwords can't be prioritized over full words
    // that contain them).
    addTokenType ( regexp ) {
        if ( this.hasTokenType( regexp ) ) return
        this.tokenizer.addType( regexp )
        const lowPriority = Object.keys( Language.regularExpressions )
            .map( key => `^(?:${Language.regularExpressions[key].source})` )
        const shouldBeLater = re => lowPriority.includes( re.source ) ? 1 : 0
        this.tokenizer.tokenTypes.sort( ( a, b ) => {
            const aLater = shouldBeLater( a.regexp )
            const bLater = shouldBeLater( b.regexp )
            if ( aLater != bLater ) return aLater - bLater
            return -a.regexp.source.localeCompare( b.regexp.source )
        } )
    }

}
