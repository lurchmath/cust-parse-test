
import { Grammar, Tokenizer } from 'earley-parser'
import { AST } from './ast.js'
import SyntacticTypes from './syntactic-types.js'
import { notationStringToArray } from './utilities.js'

/**
 * The Language class represents one of the languages among which a
 * {@link Converter} can convert notation.  To add a new language to a
 * {@link Converter} instance, just call the constructor of this class, passing
 * the {@link Converter} instance.  Every Language instance needs a
 * {@link Converter} instance to which it belongs, because the purpose of this
 * class is to enable conversions among languages, by working together with a
 * {@link Converter} instance.
 * 
 * Each instance of this class contains the data passed to its constructor, plus
 * a reference to its {@link Converter}, plus a tokenizer and parser for reading
 * notation written in the language represented by this instance.  After
 * creating an instance of this class, you specify the language itself by
 * repeated calls to the {@link Language#addNotation addNotation()} function.
 * This is necessary in order for the language to have any definition at all,
 * before using it to parse text.
 * 
 * Although you can call methods in this class directly to parse text, such as
 * {@link Language#parse parse()} and {@link Language#convertTo convertTo()}, it
 * is simpler if you instead use the {@link Converter#convert convert()} method
 * of the corresponding {@link Converter} instance.  Using the {@link Converter}
 * will save you from having to deal with intermediate forms like {@link AST
 * abstract syntax trees}, but you can create and work with such objects if you
 * wish.
 */
export class Language {

    /**
     * To add a new language to a {@link Converter}, just call this constructor,
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
     * the {@link Converter#convert convert()} function, upon creating an
     * expression in this language, to apply to it any specific formatting
     * conventions you would like to see in the output, you can specify a
     * linter, which will be run before {@link Converter#convert convert()}
     * returns its result.  Add such a function only if you see output from
     * {@link Converter#convert convert()} that doesn't meet your standards,
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
     * @see {@link Converter#convert convert()}
     * @see {@link Converter#language language()}
     * @see {@link Converter#isLanguage isLanguage()}
     */
    constructor ( name, converter, groupers = [ '(', ')' ], linter = x => x ) {
        // Allow clients to pass "null" for groupers:
        if ( !groupers ) groupers = [ ]
        // Store all parameters:
        this.name = name
        this.converter = converter
        this.groupers = groupers
        this.linter = linter
        // Also create a tokenizer and grammar and store them:
        this.tokenizer = new Tokenizer()
        this.tokenizer.addType( /\s/, () => null )
        this.grammar = new Grammar()
        this.grammar.START = SyntacticTypes.hierarchies[0][0]
        // For storing derived concepts' putdown forms:
        this.derivedNotation = new Map()
        // For each concept in the converter, if it is atomic and has a putdown
        // form that is a single regular expression, use that as the default
        // notation in the new language; this can be overridden by any later
        // call to addNotation().  So we mark it here as the default, so they
        // know they can delete it later.
        Array.from( converter.concepts.keys() ).forEach( conceptName => {
            const concept = converter.concepts.get( conceptName )
            if ( SyntacticTypes.isAtomic( concept.parentType ) ) {
                if ( concept.putdown instanceof Array ) {
                    if ( concept.putdown.length != 1 ) return
                    if ( !( concept.putdown[0] instanceof RegExp ) ) return
                }
                if ( !( concept.putdown instanceof RegExp ) ) {
                    const array = notationStringToArray( concept.putdown,
                        Array.from( Language.defaultVarNames ) )
                    if ( array.length != 1 ) return
                    if ( !( array[0] instanceof RegExp ) ) return
                }
                this.addNotation( conceptName, concept.putdown )
                const rhss = this.rulesFor( conceptName )
                rhss[rhss.length-1].putdownDefault = true
            }
        } )
        // Add subtyping rules and grouping rules to the grammar.
        // Also, for each atomic type, give it zero rules, to avoid Earley
        // throwing an error about the type not existing, if the client doesn't
        // choose to include that atomic type in their language.
        SyntacticTypes.hierarchies.forEach( hierarchy => {
            for ( let i = 0 ; i < hierarchy.length - 1 ; i++ )
                this.grammar.addRule( hierarchy[i], hierarchy[i+1] )
            if ( groupers.length > 0 && hierarchy[0] == this.grammar.START ) {
                const last = hierarchy[hierarchy.length-1]
                if ( SyntacticTypes.isAtomic( last ) ) {
                    for ( let i = 0 ; i < groupers.length - 1 ; i += 2 ) {
                        const left = groupers[i]
                        const right = groupers[i+1]
                        this.addNotation( `grouped${last}`, `${left} A ${right}` )
                    }
                }
            }
            const lowest = hierarchy[hierarchy.length-1]
            if ( !this.grammar.rules.hasOwnProperty( lowest ) )
                this.grammar.rules[lowest] = [ ]
        } )
        // Register ourselves with our converter
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
     *  * If this notation should be used only for representing the concept in
     *    this language, but not for parsing from this language into an AST,
     *    then you can set `writeOnly : true`.  This can be useful in two cases.
     *      1. If you have multiple notations for the same concept in some
     *         languages, but not in others.  You can map each notation to a
     *         separate concept, then map all concepts to one notation in the
     *         smaller language, marking all but one as write-only, thus
     *         establishing a canonical form.  And yet between any two languages
     *         that support all the notations, translation can preserve the
     *         notational subtleties.
     *      2. If you have some notation that is just a shorthand for a more
     *         complex notation, you can parse the notation to a concept named
     *         for that notation, but convert to putdown form in a write-only
     *         way, expanding the notation to its underlying (compound) meaning.
     *         Then the converter will not attempt to invert that expansion when
     *         parsing putdown, but will preserve its expanded meaning.
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
        options = Object.assign( {
            variables : Array.from( Language.defaultVarNames )
        }, options )
        // ensure concept is valid
        const concept = this.converter.concept( conceptName )
        if ( !concept )
            throw new Error( `Not a valid concept: ${conceptName}` )
        // if this is an atomic concept, and the only previous notation it had
        // was the putdown default installed at language creation time, then the
        // user is now overriding that, so we should delete it.
        if ( SyntacticTypes.isAtomic( concept.parentType )
          && this.grammar.rules.hasOwnProperty( conceptName )
          && this.grammar.rules[conceptName].length == 1
          && this.grammar.rules[conceptName][0].putdownDefault )
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
        // If this notation is write-only, add it to the derived notations list:
        if ( options.writeOnly ) {
            this.derivedNotation.set( conceptName, notation )
            // record in that notation array several data needed for rendering
            notation.notationToPutdown = notationToPutdown
            notation.putdownToNotation = putdownToNotation
            notation.notation = originalNotation
            notation.variables = options.variables
        // But if it is NOT write-only, add it to the parser:
        } else {
            // putdown is a special language in which every notation counts as a
            // grouper, so everything has high precedence (lowest subtype)
            if ( this.name == 'putdown' )
                parentType = SyntacticTypes.lowestSubtype( parentType )
            this.grammar.addRule( parentType, conceptName )
            this.grammar.addRule( conceptName, notation )
            const rhss = this.rulesFor( conceptName )
            const newRule = rhss[rhss.length - 1]
            // record in the new rule RHS several data about how the rule was made
            newRule.notationToPutdown = notationToPutdown
            newRule.putdownToNotation = putdownToNotation
            newRule.notation = originalNotation
            newRule.variables = options.variables
        }
    }

    /**
     * Treat the given text as an expression in this language and attempt to
     * parse it.  Return an abstract syntax tree ({@link AST}) on success, or
     * `undefined` on failure.
     * 
     * @param {String} text - the input text to parse
     * @returns {AST} - the parsed AST, or undefined if parsing failed
     * @see {@link AST#compact compact()}
     */
    parse ( text ) {
        const tokens = this.tokenizer.tokenize( text )
        if ( !tokens ) {
            if ( this._debug ) {
                console.log( `Tokenizer failed to tokenize "${text}"` )
                console.log( this.tokenizer.tokenTypes )
            }
            return
        }
        const all = this.grammar.parse( tokens, {
            showDebuggingOutput : this._debug
        } )
        if ( all.length > 0 ) {
            all.sort( ( a, b ) =>
                JSON.stringify( a ).localeCompare( JSON.stringify( b ) ) )
            return AST.fromJSON( this, all[0] )
        }
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
     * Get all grammar rules for the given concept or syntactic type.  The
     * result is an array of the right-hand sides of the grammar rules for the
     * concept or syntactic type.  Each such right-hand side is the array of
     * tokens or type names used internally by the parser.
     * 
     * @param {String|AST} target - if this is a string, it must be the name of
     *   the concept or syntactic type to look up; if it is a leaf AST, then its
     *   contents as a string are used; if it is a compound AST, then its head
     *   is used
     * @returns {Array} an array of the right-hand sides of the grammar rules
     */
    rulesFor ( type ) {
        if ( type instanceof AST )
            type = type.isCompound() ? type.head().contents : type.contents
        const result = this.grammar.rules[type] || [ ]
        if ( this.derivedNotation.has( type ) )
            result.push( this.derivedNotation.get( type ) )
        return result
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
    // Does this language have a token in its tokenizer that is a regular
    // expression matching the given string?  (Note that we add a $ to test for
    // a full-string match.)
    hasTokenMatching ( string ) {
        return this.tokenizer.tokenTypes.find( tokenType =>
            new RegExp( tokenType.regexp.source + '$' ).test( string ) )
    }

    // Internal use only
    // Add a given regular expression to our tokenizer, iff such a token is not
    // already present, and then sort the list of tokens in a way that
    // prioritizes built-in regular expressions lower (because they are infinite
    // sets) and that prioritizes other regular expressions by reverse
    // alphabetical order (so that subwords can't be prioritized over full words
    // that contain them).
    // Note that if the regexp has a property called "originalString", which
    // will have been put there by notationStringToArray(), then the regexp was
    // designed to match exactly one string.  In that case, if any existing
    // token matches that same string, then the new token will not be added.
    // This prevents bugs like the following:  If you define function inverse to
    // be f^{-1}, then the "1" doesn't become its own token, borking ordinary
    // decimal numbers like 1.5.  We make (in notationStringToArray()) an
    // exception for this for one-regexp notations, which clearly intend for
    // themselves to be tokenized as-is.
    addTokenType ( regexp ) {
        if ( this.hasTokenType( regexp ) ) return
        if ( regexp.hasOwnProperty( 'originalString' )
          && this.hasTokenMatching( regexp.originalString ) ) return
        this.tokenizer.addType( regexp )
        const lowPriority = Object.keys( Language.regularExpressions )
            .map( key => `^(?:${Language.regularExpressions[key].source})` )
        const shouldBeLater = re => lowPriority.includes( re.source ) ? 1 : 0
        const tokenSort = ( a, b ) => a == '' && b == '' ? 0 :
                                      a.length == 0 ? 1 : // sort Xsuffix < X
                                      b.length == 0 ? -1 : // sort Xsuffix < X
                                      a[0] < b[0] ? -1 :
                                      a[0] > b[0] ? 1 :
                                      tokenSort( a.substring( 1 ), b.substring( 1 ) )
        this.tokenizer.tokenTypes.sort( ( a, b ) => {
            const aLater = shouldBeLater( a.regexp )
            const bLater = shouldBeLater( b.regexp )
            if ( aLater != bLater ) return aLater - bLater
            a = a.regexp.source
            b = b.regexp.source
            a = a.substring( 4, a.length - 1 ) // turn ^(?:foo) into foo
            b = b.substring( 4, b.length - 1 ) // same
            return tokenSort( a, b )
        } )
    }

}
