
import { expect } from 'chai'
import { Converter } from '../converter.js'
import { Language } from '../language.js'

describe( 'Converter instance', () => {

    it( 'should be defined', () => {
        expect( Converter ).to.be.ok
    } )

    it( 'should support the option of naming notations', () => {
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
        converter.addConcept( 'int', 'atomicnumber',
            Language.regularExpressions.integer )
        converter.addConcept( 'add', 'sum', '(+ sum sum)' )
        converter.addConcept( 'mul', 'product', '(* product product)' )
        const infix = new Language( 'infix-lang', converter )
        infix.addNotation( 'add', 'A+B' )
        infix.addNotation( 'mul', 'A*B', { name : 'asterisk multiplication' } )
        infix.addNotation( 'mul', 'A x B', { name : 'x multiplication' } )
        const prefix = new Language( 'prefix-lang', converter )
        prefix.addNotation( 'add', '+ A B' )
        prefix.addNotation( 'mul', '* A B', { name : 'asterisk multiplication' } )
        prefix.addNotation( 'mul', 'x A B', { name : 'x multiplication' } )
        
        // Be sure we can convert atomic expressions in both directions
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2' ) )
            .to.equal( '2' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '-100' ) )
            .to.equal( '-100' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '39' ) )
            .to.equal( '39' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '-41' ) )
            .to.equal( '-41' )
        // Be sure we can convert sums in both directions
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2+3' ) )
            .to.equal( '+ 2 3' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '0+-66' ) )
            .to.equal( '+ 0 -66' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+-3 5' ) )
            .to.equal( '-3 + 5' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+999 999' ) )
            .to.equal( '999 + 999' )
        // Be sure we can convert products in both directions, and it preserves
        // which type of product (which is the key thing being tested here)
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2*3' ) )
            .to.equal( '* 2 3' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '0*-66' ) )
            .to.equal( '* 0 -66' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2x3' ) )
            .to.equal( 'x 2 3' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '0x-66' ) )
            .to.equal( 'x 0 -66' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '*-3 5' ) )
            .to.equal( '-3 * 5' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '*999 999' ) )
            .to.equal( '999 * 999' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', 'x-3 5' ) )
            .to.equal( '-3 x 5' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', 'x999 999' ) )
            .to.equal( '999 x 999' )
        // Be sure we can convert compound expressions in both directions, and
        // it preserves which type of product inside larger expressions, even
        // those that mix more than one kind of product notation
        expect( converter.convert( 'infix-lang', 'prefix-lang', '10+20x40' ) )
            .to.equal( '+ 10 x 20 40' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '10*20+40' ) )
            .to.equal( '+ * 10 20 40' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+ 10 x 20 40' ) )
            .to.equal( '10 + 20 x 40' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+ * 10 20 40' ) )
            .to.equal( '10 * 20 + 40' )
    } )

    it( 'should behave differently without naming notations', () => {
        // Define the same converter as in the previous test, but with no
        // notation names, so that all multiplications should become *-type.
        const converter = new Converter()
        converter.addConcept( 'int', 'atomicnumber',
            Language.regularExpressions.integer )
        converter.addConcept( 'add', 'sum', '(+ sum sum)' )
        converter.addConcept( 'mul', 'product', '(* product product)' )
        const infix = new Language( 'infix-lang', converter )
        infix.addNotation( 'add', 'A+B' )
        infix.addNotation( 'mul', 'A*B' )
        infix.addNotation( 'mul', 'A x B' )
        const prefix = new Language( 'prefix-lang', converter )
        prefix.addNotation( 'add', '+ A B' )
        prefix.addNotation( 'mul', '* A B' )
        prefix.addNotation( 'mul', 'x A B' )
        
        // Results for atomic expressions are same as in previous test
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2' ) )
            .to.equal( '2' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '-100' ) )
            .to.equal( '-100' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '39' ) )
            .to.equal( '39' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '-41' ) )
            .to.equal( '-41' )
        // Results for sums are same as in previous test
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2+3' ) )
            .to.equal( '+ 2 3' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '0+-66' ) )
            .to.equal( '+ 0 -66' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+-3 5' ) )
            .to.equal( '-3 + 5' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+999 999' ) )
            .to.equal( '999 + 999' )
        // Results for products are now all *-type, unlike previous test
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2*3' ) )
            .to.equal( '* 2 3' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '0*-66' ) )
            .to.equal( '* 0 -66' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '2x3' ) )
            .to.equal( '* 2 3' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '0x-66' ) )
            .to.equal( '* 0 -66' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '*-3 5' ) )
            .to.equal( '-3 * 5' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '*999 999' ) )
            .to.equal( '999 * 999' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', 'x-3 5' ) )
            .to.equal( '-3 * 5' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', 'x999 999' ) )
            .to.equal( '999 * 999' )
        // Results for compound expressions now all use *-type multiplications,
        // unlike previous test
        expect( converter.convert( 'infix-lang', 'prefix-lang', '10+20x40' ) )
            .to.equal( '+ 10 * 20 40' )
        expect( converter.convert( 'infix-lang', 'prefix-lang', '10*20+40' ) )
            .to.equal( '+ * 10 20 40' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+ 10 x 20 40' ) )
            .to.equal( '10 + 20 * 40' )
        expect( converter.convert( 'prefix-lang', 'infix-lang', '+ * 10 20 40' ) )
            .to.equal( '10 * 20 + 40' )
    } )

} )
