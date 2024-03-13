
import { expect } from 'chai'
import { notationStringToArray } from '../utilities.js'

describe( 'Utility functions', () => {

    it( 'should correctly convert notation strings to arrays', () => {
        expect( notationStringToArray( 'A^B', ['A','B','C'] ) )
            .to.eql( [ 'A', /\^/, 'B' ] )
        expect( notationStringToArray( '(A+B)', ['A','B','C'] ) )
            .to.eql( [ /\(/, 'A', /\+/, 'B', /\)/ ] )
        expect( notationStringToArray( 'A ^ B', ['A','B','C'] ) )
            .to.eql( [ 'A', /\^/, 'B' ] )
        expect( notationStringToArray( ' A  ^  B ', ['A','B','C'] ) )
            .to.eql( [ 'A', /\^/, 'B' ] )
        expect( notationStringToArray( 'A^B', ['x','y','z'] ) )
            .to.eql( [ /A\^B/ ] )
        expect( notationStringToArray( 'x^y', ['x','y','z'] ) )
            .to.eql( [ 'x', /\^/, 'y' ] )
    } )

} )
