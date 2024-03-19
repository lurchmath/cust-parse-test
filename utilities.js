
/**
 * Escape all characters in the given string so that it can be used as a regular
 * expression that will match only the literal string given.  For example, if
 * the input is `"[x]"`, this function will escape it to `"\[x\]"`, so that if a
 * regular expression is constructed from the result, it will match only the
 * original string `"[x]"`, rather than the string `"x"`.
 * 
 * @param {String} str - the string to escape
 * @returns {String} the escaped version of `str`
 */
export const escapeRegExp = ( str ) =>
    str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' )

/**
 * A putdown expression represents a syntax tree in a straightforward way.  The
 * leaves of that tree are the symbols appearing in it, because they have no
 * children.  This function extracts the list of leaves (as an array, not a set,
 * so they are ordered and may repeat) from the given putdown expression.
 * 
 * It does so via a trivial string processing operation that does not involve
 * parsing the putdown code into a string.  Consequently, this function can
 * accept partial putdown code that is not a fully syntactically correct
 * expression (such as `(+ 1 2` for example) and will still return the leaves
 * (in that case, the array `["+", "1", "2"]`]).
 * 
 * @param {String} putdown - the putdown code whose leaves should be extracted
 * @returns {String[]} the leaves appearing in the given putdown code
 */
export const putdownLeaves = putdown => {
    if ( putdown.length == 0 ) return [ ]
    const match = /^[^:{}()\[\]\s,]+/.exec( putdown )
    return match ?
        [ match[0], ...putdownLeaves( putdown.substring( match[0].length ) ) ] :
        putdownLeaves( putdown.substring( 1 ) )
}

/**
 * The Earley parsing library used in this repository expects grammar rules to
 * be defined by an array containing a mixture of strings and regular
 * expressions.  A string is used to represent a non-terminal symbol, and a
 * regular expression is used to represent a terminal symbol.  But it is
 * typically more convenient to write a rule as a single string.  For example, a
 * standard summation of two variables is more convenient to write as `"x+y"`
 * instead of as `["x",/\+/,"y"]`.  This function converts strings in the
 * simpler form to arrays of strings and regular expressions in the more
 * complex form.  It treats any identifier mentioned in the `variables` array as
 * a nonterminal, and represents it as a string, and any other sequence of
 * non-space characters as a terminal, and represents it as a regular
 * expression.
 * 
 * @param {String} str - the notation to convert into an array
 * @param {String[]} variables - the names of the variables used in the notation
 * @returns {Array} the notation in the more complex form documented
 */
export const notationStringToArray = ( str, variables ) => {
    const result = [ ]
    let match
    let mayNotContinueString
    while ( str.length > 0 ) {
        if ( match = /^\s+/.exec( str ) ) {
            str = str.substring( match[0].length )
            mayNotContinueString = true
            continue
        }
        let justSawType = false
        for ( let i = 0 ; !justSawType && i < variables.length ; i++ ) {
            const startsWithThis = new RegExp( `^${variables[i]}\\b` )
            if ( startsWithThis.test( str ) ) {
                result.push( variables[i] )
                str = str.substring( variables[i].length )
                justSawType = true
            }
        }
        if ( justSawType ) {
            mayNotContinueString = true
            continue
        }
        if ( result.length == 0 || mayNotContinueString )
            result.push( str[0] )
        else
            result[result.length-1] += str[0]
        mayNotContinueString = false
        str = str.substring( 1 )
    }
    return result.map( piece =>
        variables.includes( piece ) ? piece :
            new RegExp( escapeRegExp( piece ) ) )
}
