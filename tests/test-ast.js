
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
        // Construct a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.isLeaf() ).to.equal( true )
        expect( ast.isCompound() ).to.equal( false )
        expect( ast.head() ).to.be.undefined
        expect( ast.numArgs() ).to.be.undefined
        // Construct a compound AST
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.isLeaf() ).to.equal( false )
        expect( ast.isCompound() ).to.equal( true )
        expect( ast.head() ).to.be.instanceOf( AST )
        expect( ast.head().isLeaf() ).to.equal( true )
        expect( ast.head().contents ).to.equal( 'a' )
        expect( ast.numArgs() ).to.equal( 2 )
    } )

    it( 'should be constructable from a JSON array hierarchy', () => {
        let ast
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
        expect( ast.arg( 0 ).numArgs() ).to.equal( 2 )
        expect( ast.arg( 1 ).isLeaf() ).to.equal( true )
        expect( ast.arg( 1 ).contents ).to.equal( '10' )
    } )

    it( 'should yield the correct head in every case', () => {
        let ast
        // Test a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.isLeaf() ).to.equal( true )
        expect( ast.head() ).to.be.undefined
        // Test a compound AST with depth 1
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.head().isLeaf() ).to.equal( true )
        expect( ast.head().contents ).to.equal( 'a' )
        // Test a compound AST with depth 2
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.head().isLeaf() ).to.equal( true )
        expect( ast.head().contents ).to.equal( '*' )
        expect( ast.arg( 0 ).head().isLeaf() ).to.equal( true )
        expect( ast.arg( 0 ).head().contents ).to.equal( '+' )
    } )

    it( 'should yield the correct arguments list in every case', () => {
        let ast
        // Test a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.args() ).to.be.undefined
        // Test a compound AST with depth 1
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.args().length ).to.equal( 2 )
        expect( ast.args()[0] ).to.be.instanceOf( AST )
        expect( ast.args()[0].isLeaf() ).to.equal( true )
        expect( ast.args()[0].isCompound() ).to.equal( false )
        expect( ast.args()[0].contents ).to.equal( 'b' )
        expect( ast.args()[1] ).to.be.instanceOf( AST )
        expect( ast.args()[1].isLeaf() ).to.equal( true )
        expect( ast.args()[1].isCompound() ).to.equal( false )
        expect( ast.args()[1].contents ).to.equal( 'c' )
        // Test a compound AST with depth 2
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.args().length ).to.equal( 2 )
        expect( ast.args()[0] ).to.be.instanceOf( AST )
        expect( ast.args()[0].isLeaf() ).to.equal( false )
        expect( ast.args()[0].isCompound() ).to.equal( true )
        expect( ast.args()[0].head() ).to.be.instanceOf( AST )
        expect( ast.args()[0].head().isLeaf() ).to.equal( true )
        expect( ast.args()[0].head().isCompound() ).to.equal( false )
        expect( ast.args()[0].head().contents ).to.equal( '+' )
        expect( ast.args()[0].args().length ).to.equal( 2 )
        expect( ast.args()[0].args()[0] ).to.be.instanceOf( AST )
        expect( ast.args()[0].args()[0].isLeaf() ).to.equal( true )
        expect( ast.args()[0].args()[0].isCompound() ).to.equal( false )
        expect( ast.args()[0].args()[0].contents ).to.equal( 'a' )
        expect( ast.args()[0].args()[1] ).to.be.instanceOf( AST )
        expect( ast.args()[0].args()[1].isLeaf() ).to.equal( true )
        expect( ast.args()[0].args()[1].isCompound() ).to.equal( false )
        expect( ast.args()[0].args()[1].contents ).to.equal( 'b' )
        expect( ast.args()[1] ).to.be.instanceOf( AST )
        expect( ast.args()[1].isLeaf() ).to.equal( true )
        expect( ast.args()[1].isCompound() ).to.equal( false )
        expect( ast.args()[1].contents ).to.equal( '10' )
    } )

    it( 'should yield the correct number of arguments in every case', () => {
        let ast
        // Test a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.numArgs() ).to.be.undefined
        // Test a compound AST with depth 1
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
        // Test a compound AST with depth 2
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.numArgs() ).to.equal( 2 )
        expect( ast.args()[0].numArgs() ).to.equal( 2 )
    } )

    it( 'should let us look up arguments by index', () => {
        let ast
        // Test a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.arg( 0 ) ).to.be.undefined
        // Test a compound AST with depth 1
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.arg( 0 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 0 ).isLeaf() ).to.equal( true )
        expect( ast.arg( 0 ).isCompound() ).to.equal( false )
        expect( ast.arg( 0 ).contents ).to.equal( 'b' )
        expect( ast.arg( 1 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 1 ).isLeaf() ).to.equal( true )
        expect( ast.arg( 1 ).isCompound() ).to.equal( false )
        expect( ast.arg( 1 ).contents ).to.equal( 'c' )
        // Test a compound AST with depth 2
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.arg( 0 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 0 ).arg( 0 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 0 ).arg( 0 ).isLeaf() ).to.equal( true )
        expect( ast.arg( 0 ).arg( 0 ).isCompound() ).to.equal( false )
        expect( ast.arg( 0 ).arg( 0 ).contents ).to.equal( 'a' )
        expect( ast.arg( 0 ).arg( 1 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 0 ).arg( 1 ).isLeaf() ).to.equal( true )
        expect( ast.arg( 0 ).arg( 1 ).isCompound() ).to.equal( false )
        expect( ast.arg( 0 ).arg( 1 ).contents ).to.equal( 'b' )
        expect( ast.arg( 1 ) ).to.be.instanceOf( AST )
        expect( ast.arg( 1 ).isLeaf() ).to.equal( true )
        expect( ast.arg( 1 ).isCompound() ).to.equal( false )
        expect( ast.arg( 1 ).contents ).to.equal( '10' )
    } )

    it( 'should be able to look up concepts in its converter', () => {
        // add some concepts to the converter
        converter.addConcept( 'test1', 'SumExpression', '(## SumExpression SumExpression)' )
        converter.addConcept( 'test3', 'SentenceExpression', '(@@ SumExpression SumExpression)' )
        converter.addConcept( 'test4', 'AtomicNumberExpression', 'Pi' )
        // make an AST whose head is one of those concepts and test
        let ast = new AST( dummy, [ 'test1', 'foo', 'bar' ] )
        expect( ast.isConcept() ).to.equal( true )
        expect( ast.concept().parentType ).to.equal( 'SumExpression' )
        expect( ast.concept().putdown ).to.equal( '(## SumExpression SumExpression)' )
        // make an AST whose head is NOT one of those concepts and test
        ast = new AST( dummy, [ 'test2', 'sugar bowl' ] )
        expect( ast.isConcept() ).to.equal( false )
        expect( ast.concept() ).to.be.undefined
        // make an AST whose head is a different one of those concepts and test
        ast = new AST( dummy, [ 'test3', '-10', '10' ] )
        expect( ast.isConcept() ).to.equal( true )
        expect( ast.concept().parentType ).to.equal( 'SentenceExpression' )
        expect( ast.concept().putdown ).to.equal( '(@@ SumExpression SumExpression)' )
        // make an AST that is just atomic (the number pi)
        ast = new AST( dummy, 'test4' )
        expect( ast.isConcept() ).to.equal( true )
        expect( ast.concept().parentType ).to.equal( 'AtomicNumberExpression' )
        expect( ast.concept().putdown ).to.equal( 'Pi' )
    } )

    it( 'should compute the correct string representation in every case', () => {
        let ast
        // Test a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'rand' )
        // Test a compound AST with depth 1
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'a(b,c)' )
        // Test a compound AST with depth 2
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.toString() ).to.equal( '*(+(a,b),10)' )
    } )

    it( 'should compute the correct JSON representation in every case', () => {
        let ast
        // Test a leaf AST
        expect( () => ast = new AST( dummy, 'rand' ) ).to.not.throw()
        expect( ast.toJSON() ).to.eql( 'rand' )
        // Test a compound AST with depth 1
        expect( () => ast = new AST( dummy, [ 'a', 'b', 'c' ] ) ).to.not.throw()
        expect( ast.toJSON() ).to.eql( [ 'a', 'b', 'c' ] )
        // Test a compound AST with depth 2
        expect( () => ast = new AST( dummy,
            [ '*', [ '+', 'a', 'b' ], '10' ] ) ).to.not.throw()
        expect( ast.toJSON() ).to.eql( [ '*', [ '+', 'a', 'b' ], '10' ] )
    } )

    it( 'should respect associativity attribute of concepts', () => {
        let conv, lang, ast
        // by default, concepts are not associative, so if we define a tiny
        // converter and language for addition of numbers, it should make
        // hierarchies of binary additions
        conv = new Converter()
        conv.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        conv.addConcept( 'add', 'SumExpression',
            '(+ SumExpression SumExpression)' )
        lang = new Language( 'lang', conv )
        lang.addNotation( 'add', 'A+B' )
        // check two hierarchies of additions
        expect( () => ast = lang.parse( '1+2+3' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'add(add(int(1),int(2)),int(3))' )
        expect( () => ast = lang.parse( '1+(2+3)' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'add(int(1),add(int(2),int(3)))' )
        // but we can mark concepts as associative, and if we do so in a tiny
        // converter and language for addition of numbers, it should flatten
        // hierarchies of binary additions
        conv = new Converter()
        conv.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        conv.addConcept( 'add', 'SumExpression',
            '(+ SumExpression SumExpression)', { associative : [ 'add' ] } )
        lang = new Language( 'lang', conv )
        lang.addNotation( 'add', 'A+B' )
        // check two hierarchies of additions
        expect( () => ast = lang.parse( '1+2+3' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'add(int(1),int(2),int(3))' )
        expect( () => ast = lang.parse( '(1+2)+3' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'add(int(1),int(2),int(3))' )
        // and it will even render them back correctly as well
        expect( ast.toLanguage( lang ) ).to.equal( '1+2+3' )
        // and that rendering should work even in weirder languages,
        // one of which we create here for testing
        conv = new Converter()
        conv.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        conv.addConcept( 'add', 'SumExpression',
            '(+ SumExpression SumExpression)', { associative : [ 'add' ] } )
        lang = new Language( 'lang', conv )
        lang.addNotation( 'add', '(SUM A B)' )
        expect( () => ast = lang.parse( '(SUM 1 (SUM 2 3))' ) ).to.not.throw()
        expect( ast.toString() ).to.equal( 'add(int(1),int(2),int(3))' )
        expect( ast.toLanguage( lang ) ).to.equal( '(SUM 1 2 3)' )
    } )

    it( 'should correctly check how operators associate when parsing', () => {
        let asts, conv, lang
        // Define a tiny converter and language for addition of numbers, and say
        // nothing about how addition associates.  This should make it possible
        // to return multiple parsings for 1+2+3.
        conv = new Converter()
        conv.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        conv.addConcept( 'add', 'SumExpression',
            '(+ SumExpression SumExpression)' )
        lang = new Language( 'lang', conv )
        lang.addNotation( 'add', 'A+B' )
        lang.parse( '1+2+3', true )
        expect( () => asts = lang.parse( '1+2+3', true ) ).to.not.throw()
        expect( asts.length ).to.equal( 2 )
        expect( asts[0].toString() ).to.equal( 'add(add(int(1),int(2)),int(3))' )
        expect( asts[1].toString() ).to.equal( 'add(int(1),add(int(2),int(3)))' )
        // And then verify that parsing without ambiguous=true returns just the
        // first one from that list.
        expect( lang.parse( '1+2+3' ).toString() )
            .to.equal( 'add(add(int(1),int(2)),int(3))' )
        // And while we're here, let's check a bigger example with nesting, so
        // that we verify that this all works recursively, too.
        conv.addConcept( 'equal', 'SentenceExpression',
            '(equal SumExpression SumExpression)' )
        lang.addNotation( 'equal', 'A=B' )
        expect( () => asts = lang.parse( '1+2+3=4+5+6', true ) ).to.not.throw()
        expect( asts.length ).to.equal( 4 )
        expect( asts.some(
            ast => ast.toString() ==
                'equal(add(add(int(1),int(2)),int(3)),add(add(int(4),int(5)),int(6)))'
        ) ).to.equal( true )
        expect( asts.some(
            ast => ast.toString() ==
                'equal(add(int(1),add(int(2),int(3))),add(add(int(4),int(5)),int(6)))'
        ) ).to.equal( true )
        expect( asts.some(
            ast => ast.toString() ==
                'equal(add(add(int(1),int(2)),int(3)),add(int(4),add(int(5),int(6))))'
        ) ).to.equal( true )
        expect( asts.some(
            ast => ast.toString() ==
                'equal(add(int(1),add(int(2),int(3))),add(int(4),add(int(5),int(6))))'
        ) ).to.equal( true )
        // Define the same converter and language, but this time, say that the
        // one operator associates left.  Then there should be one parsing only,
        // just the first one.
        conv = new Converter()
        conv.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        conv.addConcept( 'add', 'SumExpression',
            '(+ SumExpression SumExpression)', { associates : 'left' } )
        lang = new Language( 'lang', conv )
        lang.addNotation( 'add', 'A+B' )
        conv.addConcept( 'equal', 'SentenceExpression',
            '(equal SumExpression SumExpression)' )
        lang.addNotation( 'equal', 'A=B' )
        expect( () => asts = lang.parse( '1+2+3', true ) ).to.not.throw()
        expect( asts.length ).to.equal( 1 )
        expect( asts[0].toString() ).to.equal( 'add(add(int(1),int(2)),int(3))' )
        expect( lang.parse( '1+2+3' ).toString() )
            .to.equal( 'add(add(int(1),int(2)),int(3))' )
        // And the bigger example, too
        expect( () => asts = lang.parse( '1+2+3=4+5+6', true ) ).to.not.throw()
        expect( asts.length ).to.equal( 1 )
        expect( asts[0].toString() ).to.equal(
            'equal(add(add(int(1),int(2)),int(3)),add(add(int(4),int(5)),int(6)))'
        )
        // Define the same converter and language, but this time, say that the
        // one operator associates rioght.  Again, there should be one parsing
        // only, but this time it's the other one.
        conv = new Converter()
        conv.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        conv.addConcept( 'add', 'SumExpression',
            '(+ SumExpression SumExpression)', { associates : 'right' } )
        lang = new Language( 'lang', conv )
        lang.addNotation( 'add', 'A+B' )
        conv.addConcept( 'equal', 'SentenceExpression',
            '(equal SumExpression SumExpression)' )
        lang.addNotation( 'equal', 'A=B' )
        expect( () => asts = lang.parse( '1+2+3', true ) ).to.not.throw()
        expect( asts.length ).to.equal( 1 )
        expect( asts[0].toString() ).to.equal( 'add(int(1),add(int(2),int(3)))' )
        expect( lang.parse( '1+2+3' ).toString() )
            .to.equal( 'add(int(1),add(int(2),int(3)))' )
        // And the bigger example, too
        expect( () => asts = lang.parse( '1+2+3=4+5+6', true ) ).to.not.throw()
        expect( asts.length ).to.equal( 1 )
        expect( asts[0].toString() ).to.equal(
            'equal(add(int(1),add(int(2),int(3))),add(int(4),add(int(5),int(6))))'
        )
    } )

} )
