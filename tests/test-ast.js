
import { expect } from 'chai'
import { AST } from '../ast.js'
import { Language } from '../language.js'
import { Converter } from '../converter.js'

// This file tests all members of the AST class except for fromJSON() and
// toLanguage(), because those are tested extensively in other test files,
// and testing them here would add unnecessary complexity.

describe( 'Abstract Syntax Tree class (AST)', () => {

    const converter = new Converter()
    const dummy = new Language( 'dummy', converter )

    it( 'should be constructable from a list of strings', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 0 )
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
    } )

    it( 'should be constructable from a JSON array hierarchy', () => {
        let ast
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
        expect( ast.arg( 0 ).numArgs() ).to.equal( 2 )
        expect( ast.arg( 1 ) ).to.equal( '10' )
    } )

    it( 'should yield the correct head in every case', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.head() ).to.equal( 'rand' )
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.head() ).to.equal( 'a' )
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.head() ).to.equal( '*' )
        expect( ast.arg( 0 ).head() ).to.equal( '+' )
        expect( ast.arg( 1 ) ).to.equal( '10' )
    } )

    it( 'should yield the correct arguments list in every case', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.args() ).to.eql( [ ] )
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.args().length ).to.equal( 2 )
        expect( ast.args()[0] ).to.equal( 'b' )
        expect( ast.args()[1] ).to.equal( 'c' )
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.args().length ).to.equal( 2 )
        expect( ast.args()[0] ).to.be.instanceOf( AST )
        expect( ast.args()[0].head() ).to.equal( '+' )
        expect( ast.args()[0].args().length ).to.equal( 2 )
        expect( ast.args()[0].args()[0] ).to.equal( 'a' )
        expect( ast.args()[0].args()[1] ).to.equal( 'b' )
        expect( ast.args()[1] ).to.equal( '10' )
    } )

    it( 'should yield the correct number of arguments in every case', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 0 )
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
        expect( ast.args()[0].numArgs() ).to.equal( 2 )
    } )

    it( 'should let us look up arguments by index', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.arg( 0 ) ).to.be.undefined
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.arg( 0 ) ).to.equal( 'b' )
        expect( ast.arg( 1 ) ).to.equal( 'c' )
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.arg( 0 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 0 ).arg( 0 ) ).to.equal( 'a' )
        expect( ast.arg( 0 ).arg( 1 ) ).to.equal( 'b' )
        expect( ast.arg( 1 ) ).to.equal( '10' )
    } )

    it( 'should be able to look up concepts in its converter', () => {
        // add some concepts to the converter
        converter.addConcept( 'test1', 'sum', '(## A B)' )
        converter.addConcept( 'test3', 'expr', '(@@ A B)' )
        // make an AST whose head is one of those concepts and test
        let ast = new AST( dummy, 'test1', 'foo', 'bar' )
        expect( ast.isConcept() ).to.equal( true )
        expect( ast.concept().parentType ).to.equal( 'sum' )
        expect( ast.concept().putdown ).to.equal( '(## A B)' )
        // make an AST whose head is NOT one of those concepts and test
        ast = new AST( dummy, 'test2', 'sugar bowl' )
        expect( ast.isConcept() ).to.equal( false )
        expect( ast.concept() ).to.be.undefined
        // make an AST whose head is a different one of those concepts and test
        ast = new AST( dummy, 'test3', '-10', '10' )
        expect( ast.isConcept() ).to.equal( true )
        expect( ast.concept().parentType ).to.equal( 'expr' )
        expect( ast.concept().putdown ).to.equal( '(@@ A B)' )
    } )

    it( 'should compute the correct string representation in every case', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'rand()' )
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'a(b,c)' )
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.toString() ).to.equal( '*(+(a,b),10)' )
    } )

    it( 'should compute the correct JSON representation in every case', () => {
        let ast
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.toJSON() ).to.eql( [ 'rand' ] )
        expect( () => ast = new AST( dummy, 'a', 'b', 'c' ) ).to.not.throw()
        expect( ast.toJSON() ).to.eql( [ 'a', 'b', 'c' ] )
        expect( () => ast = new AST( dummy,
            ...[ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.toJSON() ).to.eql( [ '*', [ '+', 'a', 'b' ], '10' ] )
    } )

} )
