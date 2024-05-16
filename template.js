
import { escapeRegExp } from './utilities.js'

/**
 * A string such as `"x+y"` can be viewed as a template to fill in by replacing
 * the x and y with new values.  For example, if we substitute x=3 and y=f(x) we
 * get `"3+f(x)"`.  This class represents a template that can be filled in.  One
 * constructs the template by providing the string like `"x+y"` together with
 * the list of variable names that are to be treated as placeholders.  See the
 * constructor for more details.
 */
export class Template {

    /**
     * The default set of variables used when parsing templates.  That is, every
     * one-letter variable mentioned in this string will be used as a "hole" in
     * the template, and all other letters will not be treated as variables.
     */
    static defaultVariableNames = 'ABC'

    /**
     * A template is constructed from a string and a list of variable names.  By
     * default, the variables are the names A, B, and C, so one can write
     * templates such as `"A+B"` and `"sin^{-1}(A)"` and `"A=B mod C"` and so
     * on.  If one needs to write a template that contains one of those three
     * letters (such as `"Assume P"` which contains the letter A) then one can
     * specify a different set of variables to be recognized instead.  (In that
     * example, one could provide just the letter `"P"`.)
     * 
     * @param {string} text - the text that functions as a template, once the
     *   variables within it have been recognized as placeholders to be filled
     *   in later with values
     * @param {string|string[]} variables - the names of the variables in the
     *   template, which can be provided as a single string (meaning that each
     *   of its characters is a one-letter variable) or as an array of strings,
     *   each of whose entries is a variable
     * @see {@link Template#defaultVariableNames defaultVariableNames}
     */
    constructor( text, variables = Template.defaultVariableNames ) {
        if ( typeof variables == 'string' )
            variables = Array.from( variables )
        this.original = text
        this.variables = variables
        this.parts = [ ]
        const splitter = new RegExp( variables.map( escapeRegExp ).join( '|' ) )
        while ( text.length > 0 ) {
            const match = splitter.exec( text )
            if ( match ) {
                if ( match.index > 0 )
                    this.parts.push( text.substring( 0, match.index ) )
                this.parts.push( match[0] )
                text = text.substring( match.index + match[0].length )
            } else {
                this.parts.push( text )
                text = ''
            }
        }
    }

    /**
     * The arity of a template is the number of variables in it.  This
     * determines the number of arguments that the template accepts when one
     * calls {@link Template#fillIn fillIn()}.
     * 
     * This is not the same as the number of variables provided at construction
     * time, because not all variables provided at construction time may have
     * been included in the text of the template.  For example, the default list
     * of variables is `"ABC"` but templates may be simple, such as `"A^2"`,
     * using only one variable and thus having arity 1.
     * 
     * @returns {number} the number of variables used in the template
     * @see {@link Template#defaultVariableNames defaultVariableNames}
     */
    arity () {
        return new Set(
            this.parts.filter( part => this.variables.includes( part ) )
        ).size
    }

    /**
     * Assuming that the variables used when constructing the template were
     * A, B, and C, then calling this function with an array of values will
     * replace all occurrences of A in the template with the first entry in the
     * values list, all occurrences of B with the second entry, and so on.
     * 
     * Obviously, if a different list of variables were used, then the values
     * will be substituted for those variables, in whatever order they appeared
     * in the list of variables provided to the constructor.
     *
     * Example: `new Template( "A+B" ).fillIn( [ 3, 4 ] )` returns `"3+4"`.
     * 
     * If the wrong number of valeus are provided (that is, the length of the
     * values array is not the {@link Template#arity arity} of the template)
     * then one of two actions is taken.  If the length of the values array is
     * greater than the arity of the template, and that arity is at least 2,
     * then we assume that the template represents a binary operator, and we
     * repeat its second section as many times as required (e.g., `A+B` becoming
     * `A+B+C+D` or whatever is needed).  If those conditions do not hold, then
     * an error is thrown.
     * 
     * @param {string[]} values - the values to fill into the template
     * @returns {string} the result of filling in the template
     * @see {@link Template#arity arity()}
     * @see {@link Template#defaultVariableNames defaultVariableNames}
     */
    fillIn ( values ) {
        if ( values.length < this.arity()
          || ( values.length > this.arity() && this.arity() < 2 ) )
            throw new Error(
                `Template of arity ${this.arity()} received ${values.length} values` )
        const result = this.parts.slice()
        let operatorIndex = this.variables.includes( result[0] ) ? 1 : 2
        for ( let i = 0 ; i < values.length ; i++ ) {
            if ( i < this.arity() ) {
                result.forEach( ( item, index ) => {
                    if ( item == this.variables[i] ) result[index] = values[i]
                } )
            } else {
                result.splice( operatorIndex + 2, 0,
                    result[operatorIndex], values[i] )
                operatorIndex += 2
            }
        }
        return result.join( '' )
        // return this.parts.map( part => {
        //     const variableIndex = this.variables.indexOf( part )
        //     return variableIndex > -1 ? values[variableIndex] : part
        // } ).join( '' )
    }

    /**
     * The string representation of the template is the JSON representation of
     * the template as an array of strings that is equal to the original text
     * given at construction time, split at the boundaries around variable
     * names.  E.g., `new Template( "\\frac{A}{B}" ).toString()` returns
     * `["\\frac{", "A", "}{", "B", "}"]`.
     * 
     * @returns {string} a string representation of this template
     * @see {@link Template#defaultVariableNames defaultVariableNames}
     */
    toString () { return JSON.stringify( this.parts ) }
    
}
