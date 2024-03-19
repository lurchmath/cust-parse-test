
import { expect } from 'chai'
import {
    escapeRegExp, putdownLeaves, notationStringToArray
} from '../utilities.js'

describe( 'Utility functions', () => {

    it( 'should correctly escape regular expression', () => {
        expect( escapeRegExp( 'a^b' ) ).to.equal( 'a\\^b' )
        expect( escapeRegExp( '(a+b)' ) ).to.equal( '\\(a\\+b\\)' )
        expect( escapeRegExp( '[x]_1' ) ).to.equal( '\\[x\\]_1' )
        expect( escapeRegExp( '12-3=9' ) ).to.equal( '12\\-3=9' )
        expect( escapeRegExp( '\\frac{1}{2x}' ) ).to.equal( '\\\\frac\\{1\\}\\{2x\\}' )
        expect( escapeRegExp( '3hr*$5/hr' ) ).to.equal( '3hr\\*\\$5\\/hr' )
    } )

    it( 'should correctly compute leaves from putdown expressions', () => {
        expect( putdownLeaves( '(^ e x)' ) ).to.eql( [ '^', 'e', 'x' ] )
        expect( putdownLeaves( '(forall x , (P x))' ) )
            .to.eql( [ 'forall', 'x', 'P', 'x' ] )
        expect( putdownLeaves( '(and (not A) (or (not B) C))' ) )
            .to.eql( [ 'and', 'not', 'A', 'or', 'not', 'B', 'C' ] )
        expect( putdownLeaves( '{ :(in a RR) (= a (+ a 0)) }' ) )
            .to.eql( [ 'in', 'a', 'RR', '=', 'a', '+', 'a', '0' ] )
        expect( putdownLeaves( '[x y] (= x y)' ) )
            .to.eql( [ 'x', 'y', '=', 'x', 'y' ] )
    } )

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
