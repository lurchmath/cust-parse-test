
import { expect } from 'chai'
import { Converter } from '../converter.js'
import { Language } from '../language.js'

describe( 'Converter class', () => {

    it( 'should be defined', () => {
        expect( Converter ).to.be.ok
    } )

    it( 'should support write-only notation for derived concepts', () => {
        // Technically, we've tested most of the converter class in the other
        // test files, such as "test-creating-latex.js" etc.  But those use the
        // example-converter.js, which does not name any of its notations (as of
        // this writing).  Here we test to be sure that we can define and use
        // named notations.  We use a tiny converter to test it.

        // Define a converter that can handle sums and products of integers in
        // infix or prefix notation, depending on which of two languages you
        // choose to use:
        //  - infix-lang:  2 + 3, 2 * 3, 2 x 3
        //  - prefix-lang: + 2 3, * 2 3, x 2 3
        const converter = new Converter()
        converter.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        converter.addConcept( 'add', 'SumExpression', '(+ SumExpression SumExpression)' )
        converter.addConcept( 'mul', 'ProductExpression', '(* ProductExpression ProductExpression)' )
        converter.addConcept( 'xmul', 'ProductExpression', '(* ProductExpression ProductExpression)', false )
        const infix = new Language( 'infix-lang', converter )
        infix.addNotation( 'add', 'A+B' )
        infix.addNotation( 'mul', 'A*B' )
        infix.addNotation( 'xmul', 'A x B' )
        const prefix = new Language( 'prefix-lang', converter )
        prefix.addNotation( 'add', '+ A B' )
        prefix.addNotation( 'mul', '* A B' )
        prefix.addNotation( 'xmul', 'x A B' )
        
        // Be sure we can convert atomic expressions in both directions
        expect( infix.convertTo( '2', prefix ) ).to.equal( '2' )
        expect( infix.convertTo( '-100', prefix ) ).to.equal( '-100' )
        expect( prefix.convertTo( '39', infix ) ).to.equal( '39' )
        expect( prefix.convertTo( '-41', infix ) ).to.equal( '-41' )
        // Be sure we can convert sums in both directions
        expect( infix.convertTo( '2+3', prefix ) ).to.equal( '+ 2 3' )
        expect( infix.convertTo( '0+-66', prefix ) ).to.equal( '+ 0 -66' )
        expect( prefix.convertTo( '+-3 5', infix ) ).to.equal( '-3+5' )
        expect( prefix.convertTo( '+999 999', infix ) ).to.equal( '999+999' )
        // Be sure we can convert products in both directions, and it preserves
        // which type of product (which is the key thing being tested here)
        expect( infix.convertTo( '2*3', prefix ) ).to.equal( '* 2 3' )
        expect( infix.convertTo( '0*-66', prefix ) ).to.equal( '* 0 -66' )
        expect( infix.convertTo( '2x3', prefix ) ).to.equal( 'x 2 3' )
        expect( infix.convertTo( '0x-66', prefix ) ).to.equal( 'x 0 -66' )
        expect( prefix.convertTo( '*-3 5', infix ) ).to.equal( '-3*5' )
        expect( prefix.convertTo( '*999 999', infix ) ).to.equal( '999*999' )
        expect( prefix.convertTo( 'x-3 5', infix ) ).to.equal( '-3 x 5' )
        expect( prefix.convertTo( 'x999 999', infix ) ).to.equal( '999 x 999' )
        // Be sure we can convert compound expressions in both directions, and
        // it preserves which type of product inside larger expressions, even
        // those that mix more than one kind of product notation
        expect( infix.convertTo( '10+20x40', prefix ) ).to.equal( '+ 10 x 20 40' )
        expect( infix.convertTo( '10*20+40', prefix ) ).to.equal( '+ * 10 20 40' )
        expect( prefix.convertTo( '+ 10 x 20 40', infix ) ).to.equal( '10+20 x 40' )
        expect( prefix.convertTo( '+ * 10 20 40', infix ) ).to.equal( '10*20+40' )
    } )

    it( 'should behave differently without derived concepts', () => {
        // Define the same converter as in the previous test, but with no
        // notation names, so that all multiplications should become *-type.
        const converter = new Converter()
        converter.addConcept( 'int', 'AtomicNumberExpression',
            Language.regularExpressions.integer )
        converter.addConcept( 'add', 'SumExpression', '(+ SumExpression SumExpression)' )
        converter.addConcept( 'mul', 'ProductExpression', '(* ProductExpression ProductExpression)' )
        const infix = new Language( 'infix-lang', converter )
        infix.addNotation( 'add', 'A+B' )
        infix.addNotation( 'mul', 'A*B' )
        infix.addNotation( 'mul', 'A x B' )
        const prefix = new Language( 'prefix-lang', converter )
        prefix.addNotation( 'add', '+ A B' )
        prefix.addNotation( 'mul', '* A B' )
        prefix.addNotation( 'mul', 'x A B' )
        
        // Results for atomic expressions are same as in previous test
        expect( infix.convertTo( '2', prefix ) ).to.equal( '2' )
        expect( infix.convertTo( '-100', prefix ) ).to.equal( '-100' )
        expect( prefix.convertTo( '39', infix ) ).to.equal( '39' )
        expect( prefix.convertTo( '-41', infix ) ).to.equal( '-41' )
        // Results for sums are same as in previous test
        expect( infix.convertTo( '2+3', prefix ) ).to.equal( '+ 2 3' )
        expect( infix.convertTo( '0+-66', prefix ) ).to.equal( '+ 0 -66' )
        expect( prefix.convertTo( '+-3 5', infix ) ).to.equal( '-3+5' )
        expect( prefix.convertTo( '+999 999', infix ) ).to.equal( '999+999' )
        // Results for products are now all *-type, unlike previous test
        expect( infix.convertTo( '2*3', prefix ) ).to.equal( '* 2 3' )
        expect( infix.convertTo( '0*-66', prefix ) ).to.equal( '* 0 -66' )
        expect( infix.convertTo( '2x3', prefix ) ).to.equal( '* 2 3' )
        expect( infix.convertTo( '0x-66', prefix ) ).to.equal( '* 0 -66' )
        expect( prefix.convertTo( '*-3 5', infix ) ).to.equal( '-3*5' )
        expect( prefix.convertTo( '*999 999', infix ) ).to.equal( '999*999' )
        expect( prefix.convertTo( 'x-3 5', infix ) ).to.equal( '-3*5' )
        expect( prefix.convertTo( 'x999 999', infix ) ).to.equal( '999*999' )
        // Results for compound expressions now all use *-type multiplications,
        // unlike previous test
        expect( infix.convertTo( '10+20x40', prefix ) ).to.equal( '+ 10 * 20 40' )
        expect( infix.convertTo( '10*20+40', prefix ) ).to.equal( '+ * 10 20 40' )
        expect( prefix.convertTo( '+ 10 x 20 40', infix ) ).to.equal( '10+20*40' )
        expect( prefix.convertTo( '+ * 10 20 40', infix ) ).to.equal( '10*20+40' )
    } )

    it( 'should be able to import built-in concepts', () => {
        // First, a brand new converter contains no concepts other than those
        // necessitated by groupers.
        const converter = new Converter()
        const originalConcepts = Array.from( converter.concepts.keys() )
        expect( originalConcepts.every( key =>
            key.startsWith( 'GroupedAtomic' ) ) ).to.equal( true )
        // Next, if we add to it a few new concepts with no dependencies, then
        // the new ones should be present, and nothing else should be.
        const toAdd = [ 'Pi', 'Factorial' ]
        converter.addBuiltIns( toAdd )
        const newConcepts = Array.from( converter.concepts.keys() )
        expect( newConcepts.length ).to.equal(
            originalConcepts.length + toAdd.length )
        expect( newConcepts.every( key =>
            originalConcepts.includes( key ) || toAdd.includes( key )
        ) ).to.equal( true )
        // Next, if we add to it a concept with dependencies, then those
        // dependencies come in as well.
        const toAddWithDeps = [ 'UniversalQuantifier', 'ExistentialQuantifier' ]
        const depsThatShouldComeIn = [ 'NumberVariable' ]
        expect( toAddWithDeps.some( concept =>
            newConcepts.includes( concept ) ) ).to.equal( false )
        expect( depsThatShouldComeIn.some( concept =>
            newConcepts.includes( concept ) ) ).to.equal( false )
        converter.addBuiltIns( toAddWithDeps )
        const newConcepts2 = Array.from( converter.concepts.keys() )
        expect( newConcepts2.length ).to.equal( originalConcepts.length +
            toAdd.length + toAddWithDeps.length + depsThatShouldComeIn.length )
        expect( newConcepts2.every( key =>
            originalConcepts.includes( key ) || toAdd.includes( key ) ||
            toAddWithDeps.includes( key ) || depsThatShouldComeIn.includes( key )
        ) ).to.equal( true )
        // If we add some of those things again, there should be no change.
        converter.addBuiltIns( toAdd )
        converter.addBuiltIns( toAddWithDeps )
        expect( newConcepts2 ).to.deep.equal(
            Array.from( converter.concepts.keys() ) )
        // If we add all the concepts, there should be a LOT more.
        converter.addBuiltIns()
        expect( Array.from( converter.concepts.keys() ).length )
            .to.be.greaterThan( newConcepts2.length * 2 )
    } )

} )
