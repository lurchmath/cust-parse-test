
import { expect } from 'chai'
import { Template } from '../template.js'

describe( 'Template class', () => {

    it( 'should be defined and should define a default variables list', () => {
        expect( Template ).to.be.ok
        expect( Template.defaultVariableNames ).to.be.a( 'string' )
    } )

    it( 'should construct the right parts from given texts', () => {
        let template = new Template( 'A+B' )
        expect( template.parts ).to.deep.equal( [ 'A', '+', 'B' ] )
        template = new Template( 'A+B+C' )
        expect( template.parts ).to.deep.equal( [ 'A', '+', 'B', '+', 'C' ] )
        template = new Template( '\\sin^{-1}(A)' )
        expect( template.parts ).to.deep.equal( [ '\\sin^{-1}(', 'A', ')' ] )
        template = new Template( '\\sin^{-1}(x)', 'x' )
        expect( template.parts ).to.deep.equal( [ '\\sin^{-1}(', 'x', ')' ] )
        template = new Template( '(y2-y1)/(x2-x1)', ['x1','x2','y1','y2'] )
        expect( template.parts ).to.deep.equal(
            [ '(', 'y2', '-', 'y1', ')/(', 'x2', '-', 'x1', ')' ] )
    } )

    it( 'should represent themselves correctly as strings', () => {
        let template = new Template( "A+B" )
        expect( template.toString() ).to.equal( '["A","+","B"]' )
        template = new Template( "A+B+C" )
        expect( template.toString() ).to.equal( '["A","+","B","+","C"]' )
        template = new Template( "\\sin^{-1}(A)" )
        expect( template.toString() ).to.equal( '["\\\\sin^{-1}(","A",")"]' )
        template = new Template( "\\sin^{-1}(x)","x" )
        expect( template.toString() ).to.equal( '["\\\\sin^{-1}(","x",")"]' )
        template = new Template( "(y2-y1)/(x2-x1)", ["x1","x2","y1","y2"] )
        expect( template.toString() ).to.equal(
            '["(","y2","-","y1",")/(","x2","-","x1",")"]' )
    } )

    it( 'should compute arities correctly', () => {
        let template = new Template( 'A+B' )
        expect( template.arity() ).to.equal( 2 )
        template = new Template( 'A+B+C' )
        expect( template.arity() ).to.equal( 3 )
        template = new Template( '\\sin^{-1}(A)' )
        expect( template.arity() ).to.equal( 1 )
        template = new Template( '\\sin^{-1}(x)', 'x' )
        expect( template.arity() ).to.equal( 1 )
        template = new Template( '(y2-y1)/(x2-x1)', ['x1','x2','y1','y2'] )
        expect( template.arity() ).to.equal( 4 )
    } )

    it( 'should fill in templates correctly', () => {
        let template = new Template( 'A+B' )
        expect( template.fillIn( [ '1', '2' ] ) ).to.equal( '1+2' )
        template = new Template( 'A+B+C' )
        expect( template.fillIn( [ '(3-k)', '\\sin(x)', '35/t' ] ) )
            .to.equal( '(3-k)+\\sin(x)+35/t' )
        template = new Template( '\\sin^{-1}(A)' )
        expect( template.fillIn( [ 'A' ] ) ).to.equal( '\\sin^{-1}(A)' )
        expect( template.fillIn( [ 'B' ] ) ).to.equal( '\\sin^{-1}(B)' )
        expect( template.fillIn( [ '\\sin(x)' ] ) )
            .to.equal( '\\sin^{-1}(\\sin(x))' )
        template = new Template( '\\sin^{-1}(x)', 'x' )
        expect( template.fillIn( [ 'A' ] ) ).to.equal( '\\sin^{-1}(A)' )
        expect( template.fillIn( [ 'B' ] ) ).to.equal( '\\sin^{-1}(B)' )
        expect( template.fillIn( [ '\\sin(x)' ] ) )
            .to.equal( '\\sin^{-1}(\\sin(x))' )
        template = new Template( '(y2-y1)/(x2-x1)', ['x1','x2','y1','y2'] )
        expect( template.fillIn( [ 'you', 'me', 'him', 'her' ] ) ).to.equal(
            '(her-him)/(me-you)' )
    } )

    it( 'should throw errors for requests to fill in with wrong arity', () => {
        let template = new Template( 'A+B' )
        expect( () => template.fillIn( [] ) ).to.throw( / arity 2 / )
        expect( () => template.fillIn( [ '1' ] ) ).to.throw( / arity 2 / )
        expect( () => template.fillIn( [ '1', '2', '3' ] ) ).to.throw( / arity 2 / )
        template = new Template( 'A+B+C' )
        expect( () => template.fillIn( [] ) ).to.throw( / arity 3 / )
        expect( () => template.fillIn( [ '1' ] ) ).to.throw( / arity 3 / )
        expect( () => template.fillIn( [ '1', '2' ] ) ).to.throw( / arity 3 / )
        template = new Template( '\\sin^{-1}(A)' )
        expect( () => template.fillIn( [] ) ).to.throw( / arity 1 / )
        expect( () => template.fillIn( [ '1', '2' ] ) ).to.throw( / arity 1 / )
        template = new Template( '\\sin^{-1}(x)', 'x' )
        expect( () => template.fillIn( [] ) ).to.throw( / arity 1 / )
        expect( () => template.fillIn( [ '1', '2' ] ) ).to.throw( / arity 1 / )
        template = new Template( '(y2-y1)/(x2-x1)', ['x1','x2','y1','y2'] )
        expect( () => template.fillIn( [] ) ).to.throw( / arity 4 / )
        expect( () => template.fillIn( [ '1' ] ) ).to.throw( / arity 4 / )
        expect( () => template.fillIn( [ '1', '2' ] ) ).to.throw( / arity 4 / )
        expect( () => template.fillIn( [ '1', '2', '3' ] ) ).to.throw( / arity 4 / )
    } )

} )
