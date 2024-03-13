
// chains of syntactic type inclusions in mathematical writing
export const hierarchies = [
    [ 'expression', 'numberexpr', 'sum', 'product', 'factor', 'atomicnumber' ],
    [ 'expression', 'sentence', 'conditional', 'disjunct', 'conjunct', 'atomicprop' ],
    // [ 'conjunct', 'equation', 'inequality' ],
    // [ 'set', 'union', 'intersection', 'atomicset' ]
]

export const types = Array.from( new Set(
    hierarchies.flat() ) )

export const includes = name =>
    hierarchies.some( hierarchy => hierarchy.includes( name ) )

export const isAtomic = name => name.startsWith( 'atomic' )

export const lowestSubtype = name => {
    const relevant = hierarchies.filter(
        hierarchy => hierarchy.includes( name ) )
    if ( relevant.length != 1 ) return name
    return relevant[0][relevant[0].length-1]
}

export const supertypeGraph = { }

export const computeSupertypeGraph = () => {
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

export const isSupertype = ( a, b ) => {
    computeSupertypeGraph()
    return supertypeGraph[a]?.includes( b )
}
export const isSupertypeOrEqual = ( a, b ) => a == b || isSupertype( a, b )

export default {
    hierarchies, types, includes, isAtomic, lowestSubtype,
    supertypeGraph, isSupertype, isSupertypeOrEqual
}
