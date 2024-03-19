
export const escapeRegExp = ( str ) =>
    str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' )

export const putdownLeaves = putdown => {
    if ( putdown.length == 0 ) return [ ]
    const match = /^[^:{}()\[\]\s,]+/.exec( putdown )
    return match ?
        [ match[0], ...putdownLeaves( putdown.substring( match[0].length ) ) ] :
        putdownLeaves( putdown.substring( 1 ) )
}

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
