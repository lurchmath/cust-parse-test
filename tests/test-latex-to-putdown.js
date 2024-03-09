
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Converting LaTeX to putdown', () => {

    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str
    const checkLatexPutdown = ( latex, putdown ) => {
        expect(
            converter.convert( 'latex', 'putdown', latex )
        ).to.equal( putdown )
        // console.log( `${lpad( latex )}  -->  ${putdown}` )
    }
    const checkLatexPutdownFail = ( latex ) => {
        expect(
            converter.convert( 'latex', 'putdown', latex )
        ).to.be.undefined
    }

    it( 'correctly converts many kinds of numbers but not malformed ones', () => {
        checkLatexPutdown( '0', '0' )
        checkLatexPutdown( '328975289', '328975289' )
        checkLatexPutdown( '-9097285323', '(- 9097285323)' )
        checkLatexPutdown( '0.0', '0.0' )
        checkLatexPutdown( '32897.5289', '32897.5289' )
        checkLatexPutdown( '-1.9097285323', '(- 1.9097285323)' )
        checkLatexPutdownFail( '0.0.0' )
        checkLatexPutdownFail( '0k0' )
    } )

    it( 'correctly converts one-letter variable names but not larger ones', () => {
        checkLatexPutdown( 'x', 'x' )
        checkLatexPutdown( 'U', 'U' )
        checkLatexPutdown( 'Q', 'Q' )
        checkLatexPutdown( 'm', 'm' )
        checkLatexPutdownFail( 'foo', 'foo' )
        checkLatexPutdownFail( 'Hi', 'Hi' )
    } )

    it( 'correctly converts the infinity symbol', () => {
        checkLatexPutdown( '\\infty', 'infinity' )
    } )

    it( 'correctly converts exponentiation of atomics', () => {
        checkLatexPutdown( '1^2', '(^ 1 2)' )
        checkLatexPutdown( 'e^x', '(^ e x)' )
        checkLatexPutdown( '1^\\infty', '(^ 1 infinity)' )
    } )

    it( 'correctly converts atomic percentages', () => {
        checkLatexPutdown( '10\\%', '(% 10)' )
        checkLatexPutdown( 't\\%', '(% t)' )
    } )

    it( 'correctly converts division of atomics or factors', () => {
        // division of atomics
        checkLatexPutdown( '1\\div2', '(/ 1 2)' )
        checkLatexPutdown( 'x\\div y', '(/ x y)' )
        checkLatexPutdown( '0\\div\\infty', '(/ 0 infinity)' )
        // division of factors
        checkLatexPutdown( 'x^2\\div3', '(/ (^ x 2) 3)' )
        checkLatexPutdown( '1\\div e^x', '(/ 1 (^ e x))' )
        checkLatexPutdown( '10\\%\\div2^100', '(/ (% 10) (^ 2 100))' )
    } )

    it( 'correctly converts multiplication of atomics or factors', () => {
        // multiplication of atomics
        checkLatexPutdown( '1\\times2', '(* 1 2)' )
        checkLatexPutdown( 'x\\cdot y', '(* x y)' )
        checkLatexPutdown( '0\\times\\infty', '(* 0 infinity)' )
        // multiplication of factors
        checkLatexPutdown( 'x^2\\cdot3', '(* (^ x 2) 3)' )
        checkLatexPutdown( '1\\times e^x', '(* 1 (^ e x))' )
        checkLatexPutdown( '10\\%\\cdot2^100', '(* (% 10) (^ 2 100))' )
    } )

    it( 'correctly converts negations of atomics or factors', () => {
        checkLatexPutdown( '-1\\times2', '(* (- 1) 2)' )
        checkLatexPutdown( 'x\\cdot{-y}', '(* x (- y))' )
        checkLatexPutdown( '{-x^2}\\cdot{-3}', '(* (- (^ x 2)) (- 3))' )
        checkLatexPutdown( '----1000', '(- (- (- (- 1000))))' )
    } )

    it( 'correctly converts number expressions with groupers', () => {
        checkLatexPutdown( '-{1\\times2}', '(- (* 1 2))' )
        checkLatexPutdown( '{-x}^{2\\cdot{-3}}', '(^ (- x) (* 2 (- 3)))' )
    } )

    it( 'correctly converts propositional logic atomics', () => {
        checkLatexPutdown( '\\top', 'true' )
        checkLatexPutdown( '\\bot', 'false' )
        checkLatexPutdown( '\\rightarrow\\leftarrow', 'contradiction' )
        // no need to check variables; they were tested earlier
    } )

    it( 'correctly converts propositional logic conjuncts', () => {
        checkLatexPutdown( '\\top\\wedge\\bot', '(and true false)' )
        checkLatexPutdown( '\\neg P\\wedge\\neg\\top', '(and (not P) (not true))' )
        checkLatexPutdown( 'a\\wedge b\\wedge c', '(and (and a b) c)' )
    } )

    it( 'correctly converts propositional logic disjuncts', () => {
        checkLatexPutdown( '\\top\\vee \\neg A', '(or true (not A))' )
        checkLatexPutdown( 'P\\wedge Q\\vee Q\\wedge P', '(or (and P Q) (and Q P))' )
    } )

    it( 'correctly converts propositional logic conditionals', () => {
        checkLatexPutdown(
            'A\\Rightarrow Q\\wedge\\neg P',
            '(implies A (and Q (not P)))'
        )
        checkLatexPutdown(
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T',
            '(implies (implies (or P Q) (and Q P)) T)'
        )
    } )

    it( 'correctly converts propositional logic biconditionals', () => {
        checkLatexPutdown(
            'A\\Leftrightarrow Q\\wedge\\neg P',
            '(iff A (and Q (not P)))'
        )
        checkLatexPutdown(
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T',
            '(implies (iff (or P Q) (and Q P)) T)'
        )
    } )

    it( 'correctly converts propositional expressions with groupers', () => {
        checkLatexPutdown(
            'P\\lor {Q\\Leftrightarrow Q}\\land P',
            '(or P (and (iff Q Q) P))'
        )
        checkLatexPutdown(
            '\\lnot{\\top\\Leftrightarrow\\bot}',
            '(not (iff true false))'
        )
    } )

    it( 'correctly converts simple predicate logic expressions', () => {
        checkLatexPutdown(
            '\\forall x, P',
            '(forall (x , P))'
        )
        checkLatexPutdown(
            '\\exists t,\\neg Q',
            '(exists (t , (not Q)))'
        )
        checkLatexPutdown(
            '\\exists! k,m\\Rightarrow n',
            '(existsunique (k , (implies m n)))'
        )
    } )

} )
