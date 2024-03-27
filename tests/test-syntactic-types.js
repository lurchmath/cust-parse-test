
import { expect } from 'chai'
import SyntacticTypes from '../syntactic-types.js'

describe( 'Syntactic types hierarchy', () => {

    it( 'should be defined and have several necessary functions', () => {
        expect( SyntacticTypes ).to.be.ok
        // type hierarchies is an array of arrays of strings
        expect( SyntacticTypes.hierarchies ).to.be.instanceOf( Array )
        expect( SyntacticTypes.hierarchies.every( chain =>
            chain instanceof Array ) ).to.be.true
        expect( SyntacticTypes.hierarchies.every( chain =>
            chain.every( entry => typeof( entry ) == 'string' ) ) ).to.be.true
        // types is an array of strings
        expect( SyntacticTypes.types ).to.be.instanceOf( Array )
        expect( SyntacticTypes.types.every( name =>
            typeof( name ) == 'string' ) ).to.be.true
    } )

    it( 'should be able to compute the full supertype graph', () => {
        // Ensure the supertype graph has been computed by making any query
        // to it.
        SyntacticTypes.isSupertype( 'a', 'b' )
        // Spot-check to be sure that the supertype graph contains pairs that
        // it ought to contain, and not contain those it ought not to contain
        expect( SyntacticTypes.isSupertype( 'atomicnumberexpr', 'sumexpr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'disjunctexpr', 'conjunctexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'disjunctexpr', 'atomicpropexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'expr', 'sumexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'sumexpr', 'expr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'numberexpr', 'conjunctexpr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'sentenceexpr', 'conjunctexpr' ) )
            .to.equal( true )
        // Check to be sure isSupertype is not reflexive
        expect( SyntacticTypes.isSupertype( 'sumexpr', 'sumexpr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'atomicpropexpr', 'atomicpropexpr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'expr', 'expr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'condexpr', 'condexpr' ) )
            .to.equal( false )
        // Ensure that isSupertypeOrEqual agrees with isSupertype in all the
        // tests above that were not instances of reflexivity
        expect( SyntacticTypes.isSupertypeOrEqual( 'atomicnumberexpr', 'sumexpr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'disjunctexpr', 'conjunctexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'disjunctexpr', 'atomicpropexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'expr', 'sumexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'sumexpr', 'expr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'numberexpr', 'conjunctexpr' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'sentenceexpr', 'conjunctexpr' ) )
            .to.equal( true )
        // Check to be sure isSupertypeOrEqual is reflexive
        expect( SyntacticTypes.isSupertypeOrEqual( 'sumexpr', 'sumexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'atomicpropexpr', 'atomicpropexpr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'expr', 'expr' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'condexpr', 'condexpr' ) )
            .to.equal( true )
    } )

    it( 'should be able to answer questions about syntactic types', () => {
        // Spot check to be sure it knows about several syntactic types
        expect( SyntacticTypes.types.includes( 'sumexpr' ) ).to.equal( true )
        expect( SyntacticTypes.types.includes( 'prodexpr' ) ).to.equal( true )
        expect( SyntacticTypes.types.includes( 'numberexpr' ) ).to.equal( true )
        expect( SyntacticTypes.types.includes( 'atomicpropexpr' ) ).to.equal( true )
        // Spot check to be sure it knows that not everything is a syntactic type
        expect( SyntacticTypes.types.includes( 'lego' ) ).to.equal( false )
        expect( SyntacticTypes.types.includes( 'pencil' ) ).to.equal( false )
        expect( SyntacticTypes.types.includes( 'coffee' ) ).to.equal( false )
        // Check to be sure that all atomic types are classified as such
        expect( SyntacticTypes.isAtomic( 'atomicnumberexpr' ) ).to.equal( true )
        expect( SyntacticTypes.isAtomic( 'atomicpropexpr' ) ).to.equal( true )
        // Spot check some non-atomic types, ensure they're not marked atomic
        expect( SyntacticTypes.isAtomic( 'sentenceexpr' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'sumexpr' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'disjunctexpr' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'expr' ) ).to.equal( false )
        // Spot check some non-types, ensure they're not marked atomic
        expect( SyntacticTypes.isAtomic( 'lego' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'pencil' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'coffee' ) ).to.equal( false )
        // Spot check some types for their lowest subtype
        expect( SyntacticTypes.lowestSubtype( 'sumexpr' ) ).to.equal( 'atomicnumberexpr' )
        expect( SyntacticTypes.lowestSubtype( 'numberexpr' ) ).to.equal( 'atomicnumberexpr' )
        expect( SyntacticTypes.lowestSubtype( 'conjunctexpr' ) ).to.equal( 'atomicpropexpr' )
        expect( SyntacticTypes.lowestSubtype( 'atomicpropexpr' ) ).to.equal( 'atomicpropexpr' )
    } )

} )
