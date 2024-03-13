
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
        // supertypeGraph is an object
        // (Don't test whether it has members or not, because it won't be
        // populated until the first call it isSupertype().)
        expect( SyntacticTypes.supertypeGraph ).to.be.instanceOf( Object )
    } )

    it( 'should be able to compute the full supertype graph', () => {
        // Ensure the supertype graph has been computed by making any query
        // to it.
        SyntacticTypes.isSupertype( 'a', 'b' )
        // Spot-check to be sure that the graph has keys it ought to have
        expect( SyntacticTypes.supertypeGraph['atomicnumber'] ).to.be.ok
        expect( SyntacticTypes.supertypeGraph['disjunct'] ).to.be.ok
        expect( SyntacticTypes.supertypeGraph['product'] ).to.be.ok
        expect( SyntacticTypes.supertypeGraph['sentence'] ).to.be.ok
        // Spot-check to be sure that the graph includes some of the supertype
        // relationships that it ought to include, and no others
        expect( SyntacticTypes.supertypeGraph['atomicnumber'].length ).to.equal( 0 )
        expect( SyntacticTypes.supertypeGraph['disjunct'].includes( 'conjunct' ) )
            .to.equal( true )
        expect( SyntacticTypes.supertypeGraph['disjunct'].includes( 'atomicprop' ) )
            .to.equal( true )
        expect( SyntacticTypes.supertypeGraph['expression'].includes( 'sum' ) )
            .to.equal( true )
        expect( SyntacticTypes.supertypeGraph['sum'].includes( 'expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.supertypeGraph['numberexpr'].includes( 'conjunct' ) )
            .to.equal( false )
        expect( SyntacticTypes.supertypeGraph['sentence'].includes( 'conjunct' ) )
            .to.equal( true )
        // Repeat the same tests using the isSupertype function
        expect( SyntacticTypes.isSupertype( 'atomicnumber', 'sum' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'disjunct', 'conjunct' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'disjunct', 'atomicprop' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'expression', 'sum' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'sum', 'expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'numberexpr', 'conjunct' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'sentence', 'conjunct' ) )
            .to.equal( true )
        // Check to be sure isSupertype is not reflexive
        expect( SyntacticTypes.isSupertype( 'sum', 'sum' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'atomicprop', 'atomicprop' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'expression', 'expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'conditional', 'conditional' ) )
            .to.equal( false )
        // Ensure that isSupertypeOrEqual agrees with isSupertype in all the
        // tests above that were not instances of reflexivity
        expect( SyntacticTypes.isSupertypeOrEqual( 'atomicnumber', 'sum' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'disjunct', 'conjunct' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'disjunct', 'atomicprop' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'expression', 'sum' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'sum', 'expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'numberexpr', 'conjunct' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'sentence', 'conjunct' ) )
            .to.equal( true )
        // Check to be sure isSupertypeOrEqual is reflexive
        expect( SyntacticTypes.isSupertypeOrEqual( 'sum', 'sum' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'atomicprop', 'atomicprop' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'expression', 'expression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'conditional', 'conditional' ) )
            .to.equal( true )
    } )

    it( 'should be able to answer questions about syntactic types', () => {
        // Spot check to be sure it knows about several syntactic types
        expect( SyntacticTypes.includes( 'sum' ) ).to.equal( true )
        expect( SyntacticTypes.includes( 'product' ) ).to.equal( true )
        expect( SyntacticTypes.includes( 'numberexpr' ) ).to.equal( true )
        expect( SyntacticTypes.includes( 'atomicprop' ) ).to.equal( true )
        // Spot check to be sure it knows that not everything is a syntactic type
        expect( SyntacticTypes.includes( 'lego' ) ).to.equal( false )
        expect( SyntacticTypes.includes( 'pencil' ) ).to.equal( false )
        expect( SyntacticTypes.includes( 'coffee' ) ).to.equal( false )
        // Check to be sure that all atomic types are classified as such
        expect( SyntacticTypes.isAtomic( 'atomicnumber' ) ).to.equal( true )
        expect( SyntacticTypes.isAtomic( 'atomicprop' ) ).to.equal( true )
        // Spot check some non-atomic types, ensure they're not marked atomic
        expect( SyntacticTypes.isAtomic( 'sentence' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'sum' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'disjunct' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'expression' ) ).to.equal( false )
        // Spot check some non-types, ensure they're not marked atomic
        expect( SyntacticTypes.isAtomic( 'lego' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'pencil' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'coffee' ) ).to.equal( false )
        // Spot check some types for their lowest subtype
        expect( SyntacticTypes.lowestSubtype( 'sum' ) ).to.equal( 'atomicnumber' )
        expect( SyntacticTypes.lowestSubtype( 'numberexpr' ) ).to.equal( 'atomicnumber' )
        expect( SyntacticTypes.lowestSubtype( 'conjunct' ) ).to.equal( 'atomicprop' )
        expect( SyntacticTypes.lowestSubtype( 'atomicprop' ) ).to.equal( 'atomicprop' )
    } )

} )
