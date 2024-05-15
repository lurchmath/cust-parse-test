
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
        expect( SyntacticTypes.isSupertype( 'AtomicNumberExpression', 'SumExpression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'DisjunctionExpression', 'ConjunctionExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'DisjunctionExpression', 'AtomicPropositionalExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'Expression', 'SumExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertype( 'SumExpression', 'Expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'NumberExpression', 'ConjunctionExpression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'SentenceExpression', 'ConjunctionExpression' ) )
            .to.equal( true )
        // Check to be sure isSupertype is not reflexive
        expect( SyntacticTypes.isSupertype( 'SumExpression', 'SumExpression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'AtomicPropositionalExpression', 'AtomicPropositionalExpression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'Expression', 'Expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertype( 'ConditionalExpression', 'ConditionalExpression' ) )
            .to.equal( false )
        // Ensure that isSupertypeOrEqual agrees with isSupertype in all the
        // tests above that were not instances of reflexivity
        expect( SyntacticTypes.isSupertypeOrEqual( 'AtomicNumberExpression', 'SumExpression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'DisjunctionExpression', 'ConjunctionExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'DisjunctionExpression', 'AtomicPropositionalExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'Expression', 'SumExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'SumExpression', 'Expression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'NumberExpression', 'ConjunctionExpression' ) )
            .to.equal( false )
        expect( SyntacticTypes.isSupertypeOrEqual( 'SentenceExpression', 'ConjunctionExpression' ) )
            .to.equal( true )
        // Check to be sure isSupertypeOrEqual is reflexive
        expect( SyntacticTypes.isSupertypeOrEqual( 'SumExpression', 'SumExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'AtomicPropositionalExpression', 'AtomicPropositionalExpression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'Expression', 'Expression' ) )
            .to.equal( true )
        expect( SyntacticTypes.isSupertypeOrEqual( 'ConditionalExpression', 'ConditionalExpression' ) )
            .to.equal( true )
    } )

    it( 'should be able to answer questions about syntactic types', () => {
        // Spot check to be sure it knows about several syntactic types
        expect( SyntacticTypes.types.includes( 'SumExpression' ) ).to.equal( true )
        expect( SyntacticTypes.types.includes( 'ProductExpression' ) ).to.equal( true )
        expect( SyntacticTypes.types.includes( 'NumberExpression' ) ).to.equal( true )
        expect( SyntacticTypes.types.includes( 'AtomicPropositionalExpression' ) ).to.equal( true )
        // Spot check to be sure it knows that not everything is a syntactic type
        expect( SyntacticTypes.types.includes( 'lego' ) ).to.equal( false )
        expect( SyntacticTypes.types.includes( 'pencil' ) ).to.equal( false )
        expect( SyntacticTypes.types.includes( 'coffee' ) ).to.equal( false )
        // Check to be sure that all atomic types are classified as such
        expect( SyntacticTypes.isAtomic( 'AtomicNumberExpression' ) ).to.equal( true )
        expect( SyntacticTypes.isAtomic( 'AtomicPropositionalExpression' ) ).to.equal( true )
        // Spot check some non-atomic types, ensure they're not marked atomic
        expect( SyntacticTypes.isAtomic( 'SentenceExpression' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'SumExpression' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'DisjunctionExpression' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'Expression' ) ).to.equal( false )
        // Spot check some non-types, ensure they're not marked atomic
        expect( SyntacticTypes.isAtomic( 'lego' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'pencil' ) ).to.equal( false )
        expect( SyntacticTypes.isAtomic( 'coffee' ) ).to.equal( false )
        // Spot check some types for their lowest subtype
        expect( SyntacticTypes.lowestSubtype( 'SumExpression' ) ).to.equal( 'AtomicNumberExpression' )
        expect( SyntacticTypes.lowestSubtype( 'NumberExpression' ) ).to.equal( 'AtomicNumberExpression' )
        expect( SyntacticTypes.lowestSubtype( 'ConjunctionExpression' ) ).to.equal( 'AtomicPropositionalExpression' )
        expect( SyntacticTypes.lowestSubtype( 'AtomicPropositionalExpression' ) ).to.equal( 'AtomicPropositionalExpression' )
    } )

} )
