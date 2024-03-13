
import { expect } from 'chai'
import { Converter } from '../converter.js'

describe( 'Converter instance', () => {

    it( 'should be defined and have several necessary static members', () => {
        expect( Converter ).to.be.ok
        // type hierarchies is an array of arrays of strings
        expect( Converter.syntacticTypeHierarchies ).to.be.instanceOf( Array )
        expect( Converter.syntacticTypeHierarchies.every( chain =>
            chain instanceof Array ) ).to.be.true
        expect( Converter.syntacticTypeHierarchies.every( chain =>
            chain.every( entry => typeof( entry ) == 'string' ) ) ).to.be.true
        // syntacticTypes is an array of strings
        expect( Converter.syntacticTypes ).to.be.instanceOf( Array )
        expect( Converter.syntacticTypes.every( name =>
            typeof( name ) == 'string' ) ).to.be.true
        // supertypeGraph is an object
        // (Don't test whether it has members or not, because that depends on
        // the order in which tests are run; if any Converter instances were
        // created before this, it will have populated the graph.  So we don't
        // want to create test expectations that are dependent on things we
        // cannot control.)
        expect( Converter.supertypeGraph ).to.be.instanceOf( Object )
        // regularExpressions has three members, each a regexp
        expect( Converter.regularExpressions ).to.be.instanceOf( Object )
        expect(
            Converter.regularExpressions.oneLetterVariable
        ).to.be.instanceOf( RegExp )
        expect(
            Converter.regularExpressions.integer
        ).to.be.instanceOf( RegExp )
        expect(
            Converter.regularExpressions.number
        ).to.be.instanceOf( RegExp )
    } )

    it( 'should be able to compute the full supertype graph', () => {
        // Ensure the supertype graph has been computed (which should be
        // idempotent, and thus safe to run even if it has already run).
        Converter.computeSupertypeGraph()
        // Spot-check to be sure that the graph has keys it ought to have
        expect( Converter.supertypeGraph['atomicnumber'] ).to.be.ok
        expect( Converter.supertypeGraph['disjunct'] ).to.be.ok
        expect( Converter.supertypeGraph['product'] ).to.be.ok
        expect( Converter.supertypeGraph['sentence'] ).to.be.ok
        // Spot-check to be sure that the graph includes some of the supertype
        // relationships that it ought to include, and no others
        expect( Converter.supertypeGraph['atomicnumber'].length ).to.equal( 0 )
        expect( Converter.supertypeGraph['disjunct'].includes( 'conjunct' ) )
            .to.equal( true )
        expect( Converter.supertypeGraph['disjunct'].includes( 'atomicprop' ) )
            .to.equal( true )
        expect( Converter.supertypeGraph['expression'].includes( 'sum' ) )
            .to.equal( true )
        expect( Converter.supertypeGraph['sum'].includes( 'expression' ) )
            .to.equal( false )
        expect( Converter.supertypeGraph['numberexpr'].includes( 'conjunct' ) )
            .to.equal( false )
        expect( Converter.supertypeGraph['sentence'].includes( 'conjunct' ) )
            .to.equal( true )
        // Repeat the same tests using the isSupertype function
        expect( Converter.isSupertype( 'atomicnumber', 'sum' ) )
            .to.equal( false )
        expect( Converter.isSupertype( 'disjunct', 'conjunct' ) )
            .to.equal( true )
        expect( Converter.isSupertype( 'disjunct', 'atomicprop' ) )
            .to.equal( true )
        expect( Converter.isSupertype( 'expression', 'sum' ) )
            .to.equal( true )
        expect( Converter.isSupertype( 'sum', 'expression' ) )
            .to.equal( false )
        expect( Converter.isSupertype( 'numberexpr', 'conjunct' ) )
            .to.equal( false )
        expect( Converter.isSupertype( 'sentence', 'conjunct' ) )
            .to.equal( true )
        // Check to be sure isSupertype is not reflexive
        expect( Converter.isSupertype( 'sum', 'sum' ) )
            .to.equal( false )
        expect( Converter.isSupertype( 'atomicprop', 'atomicprop' ) )
            .to.equal( false )
        expect( Converter.isSupertype( 'expression', 'expression' ) )
            .to.equal( false )
        expect( Converter.isSupertype( 'conditional', 'conditional' ) )
            .to.equal( false )
        // Ensure that isSupertypeOrEqual agrees with isSupertype in all the
        // tests above that were not instances of reflexivity
        expect( Converter.isSupertypeOrEqual( 'atomicnumber', 'sum' ) )
            .to.equal( false )
        expect( Converter.isSupertypeOrEqual( 'disjunct', 'conjunct' ) )
            .to.equal( true )
        expect( Converter.isSupertypeOrEqual( 'disjunct', 'atomicprop' ) )
            .to.equal( true )
        expect( Converter.isSupertypeOrEqual( 'expression', 'sum' ) )
            .to.equal( true )
        expect( Converter.isSupertypeOrEqual( 'sum', 'expression' ) )
            .to.equal( false )
        expect( Converter.isSupertypeOrEqual( 'numberexpr', 'conjunct' ) )
            .to.equal( false )
        expect( Converter.isSupertypeOrEqual( 'sentence', 'conjunct' ) )
            .to.equal( true )
        // Check to be sure isSupertypeOrEqual is reflexive
        expect( Converter.isSupertypeOrEqual( 'sum', 'sum' ) )
            .to.equal( true )
        expect( Converter.isSupertypeOrEqual( 'atomicprop', 'atomicprop' ) )
            .to.equal( true )
        expect( Converter.isSupertypeOrEqual( 'expression', 'expression' ) )
            .to.equal( true )
        expect( Converter.isSupertypeOrEqual( 'conditional', 'conditional' ) )
            .to.equal( true )
    } )

    it( 'should be able to answer questions about syntactic types', () => {
        // Spot check to be sure it knows about several syntactic types
        expect( Converter.isSyntacticType( 'sum' ) ).to.equal( true )
        expect( Converter.isSyntacticType( 'product' ) ).to.equal( true )
        expect( Converter.isSyntacticType( 'numberexpr' ) ).to.equal( true )
        expect( Converter.isSyntacticType( 'atomicprop' ) ).to.equal( true )
        // Spot check to be sure it knows that not everything is a syntactic type
        expect( Converter.isSyntacticType( 'lego' ) ).to.equal( false )
        expect( Converter.isSyntacticType( 'pencil' ) ).to.equal( false )
        expect( Converter.isSyntacticType( 'coffee' ) ).to.equal( false )
        // Check to be sure that all atomic types are classified as such
        expect( Converter.isAtomicType( 'atomicnumber' ) ).to.equal( true )
        expect( Converter.isAtomicType( 'atomicprop' ) ).to.equal( true )
        // Spot check some non-atomic types, ensure they're not marked atomic
        expect( Converter.isAtomicType( 'sentence' ) ).to.equal( false )
        expect( Converter.isAtomicType( 'sum' ) ).to.equal( false )
        expect( Converter.isAtomicType( 'disjunct' ) ).to.equal( false )
        expect( Converter.isAtomicType( 'expression' ) ).to.equal( false )
        // Spot check some non-types, ensure they're not marked atomic
        expect( Converter.isAtomicType( 'lego' ) ).to.equal( false )
        expect( Converter.isAtomicType( 'pencil' ) ).to.equal( false )
        expect( Converter.isAtomicType( 'coffee' ) ).to.equal( false )
        // Spot check some types for their lowest subtype
        expect( Converter.lowestSubtype( 'sum' ) ).to.equal( 'atomicnumber' )
        expect( Converter.lowestSubtype( 'numberexpr' ) ).to.equal( 'atomicnumber' )
        expect( Converter.lowestSubtype( 'conjunct' ) ).to.equal( 'atomicprop' )
        expect( Converter.lowestSubtype( 'atomicprop' ) ).to.equal( 'atomicprop' )
    } )

} )
