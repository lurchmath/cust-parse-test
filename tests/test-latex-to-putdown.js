
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Converting LaTeX to putdown', () => {
    
    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str
    
    const latex = converter.languages.get( 'latex' )
    const putdown = converter.languages.get( 'putdown' )
    const checkLatexPutdown = ( latexText, putdownText ) => {
        expect( latex.convertTo( latexText, putdown ) ).to.equal( putdownText )
        // console.log( `${lpad( latexText )}  -->  ${putdown}` )
    }
    const checkLatexPutdownFail = ( latexText ) => {
        expect( latex.convertTo( latexText, putdown ) ).to.be.undefined
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
        checkLatexPutdown( '10!', '(! 10)' )
        checkLatexPutdown( 't!', '(! t)' )
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
        checkLatexPutdown( 'x\\cdot(-y)', '(* x (- y))' )
        checkLatexPutdown( '{-x^2}\\cdot{-3}', '(* (- (^ x 2)) (- 3))' )
        checkLatexPutdown( '(-x^2)\\cdot(-3)', '(* (- (^ x 2)) (- 3))' )
        checkLatexPutdown( '----1000', '(- (- (- (- 1000))))' )
    } )

    it( 'correctly converts additions and subtractions', () => {
        checkLatexPutdown( 'x + y', '(+ x y)' )
        checkLatexPutdown( '1 - - 3', '(- 1 (- 3))' )
        // Following could also be (- (+ (^ A B) C) D), both of which are OK,
        // but the one shown below is alphabetically earlier:
        checkLatexPutdown( 'A ^ B + C - D', '(+ (^ A B) (- C D))' )
    } )
    
    it( 'correctly converts number expressions with groupers', () => {
        checkLatexPutdown( '-{1\\times2}', '(- (* 1 2))' )
        checkLatexPutdown( '-(1\\times2)', '(- (* 1 2))' )
        checkLatexPutdown( '{x^2}!', '(! (^ x 2))' )
        checkLatexPutdown( '3!\\cdot4!', '(* (! 3) (! 4))' )
        checkLatexPutdown( '{-x}^{2\\cdot{-3}}', '(^ (- x) (* 2 (- 3)))' )
        checkLatexPutdown( '(-x)^(2\\cdot(-3))', '(^ (- x) (* 2 (- 3)))' )
        checkLatexPutdown( '(-x)^{2\\cdot(-3)}', '(^ (- x) (* 2 (- 3)))' )
        checkLatexPutdown( '{-3}^{1+2}', '(^ (- 3) (+ 1 2))' )
        checkLatexPutdown( 'k^{1-y}\\cdot(2+k)', '(* (^ k (- 1 y)) (+ 2 k))' )
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
        // Following could also be (and (and a b) c), both of which are OK,
        // but the one shown below is alphabetically earlier:
        checkLatexPutdown( 'a\\wedge b\\wedge c', '(and a (and b c))' )
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
        // Implication should right-associate:
        checkLatexPutdown(
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T',
            '(implies (or P Q) (implies (and Q P) T))'
        )
    } )

    it( 'correctly converts propositional logic biconditionals', () => {
        checkLatexPutdown(
            'A\\Leftrightarrow Q\\wedge\\neg P',
            '(iff A (and Q (not P)))'
        )
        // Implication should right-associate, including double implications:
        checkLatexPutdown(
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T',
            '(iff (or P Q) (implies (and Q P) T))'
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
        checkLatexPutdown(
            '\\lnot(\\top\\Leftrightarrow\\bot)',
            '(not (iff true false))'
        )
    } )

    it( 'correctly converts simple predicate logic expressions', () => {
        checkLatexPutdown( '\\forall x, P', '(forall (x , P))' )
        checkLatexPutdown( '\\exists t,\\neg Q', '(exists (t , (not Q)))' )
        checkLatexPutdown(
            '\\exists! k,m\\Rightarrow n',
            '(existsunique (k , (implies m n)))'
        )
    } )

    it( 'can convert finite and empty sets', () => {
        checkLatexPutdown( '\\emptyset', 'emptyset' )
        checkLatexPutdown( '\\{ 1 \\}', '(finiteset (elts 1))' )
        checkLatexPutdown( '\\{ 1 , 2 \\}', '(finiteset (elts 1 (elts 2)))' )
        checkLatexPutdown(
            '\\{ 1 , 2 , 3 \\}',
            '(finiteset (elts 1 (elts 2 (elts 3))))'
        )
        checkLatexPutdown(
            '\\{ \\emptyset , \\emptyset \\}',
            '(finiteset (elts emptyset (elts emptyset)))'
        )
        checkLatexPutdown(
            '\\{ \\{ \\emptyset \\} \\}',
            '(finiteset (elts (finiteset (elts emptyset))))'
        )
        checkLatexPutdown( '\\{ 3 , x \\}', '(finiteset (elts 3 (elts x)))' )
        checkLatexPutdown(
            '\\{ A \\cup B , A \\cap B \\}',
            '(finiteset (elts (setuni A B) (elts (setint A B))))'
        )
        checkLatexPutdown(
            '\\{ 1 , 2 , \\emptyset , K , P \\}',
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))'
        )
    } )

    it( 'can convert simple set memberships and subsets', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        checkLatexPutdown( 'b \\in B', '(in b B)' )
        checkLatexPutdown(
            '2 \\in \\{ 1 , 2 \\}',
            '(in 2 (finiteset (elts 1 (elts 2))))'
        )
        checkLatexPutdown( 'X \\in a \\cup b', '(in X (setuni a b))' )
        checkLatexPutdown(
            'A \\cup B \\in X \\cup Y',
            '(in (setuni A B) (setuni X Y))'
        )
        checkLatexPutdown( 'A \\subset \\bar B', '(subset A (setcomp B))' )
        checkLatexPutdown(
            'u \\cap v \\subseteq u \\cup v',
            '(subseteq (setint u v) (setuni u v))'
        )
        checkLatexPutdown(
            '\\{1\\}\\subseteq\\{1\\}\\cup\\{2\\}',
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))'
        )
    } )

    it( 'expands "notin" notation into canonical form', () => {
        checkLatexPutdown( 'a\\notin A', '(not (in a A))' )
        checkLatexPutdown(
            '\\emptyset \\notin \\emptyset',
            '(not (in emptyset emptyset))'
        )
        checkLatexPutdown(
            '3-5\\notin K\\cap P',
            '(not (in (- 3 5) (setint K P)))'
        )
    } )

    it( 'can convert sentences built from set operators', () => {
        checkLatexPutdown( 'P \\vee b \\in B', '(or P (in b B))' )
        checkLatexPutdown( '{P \\vee b} \\in B', '(in (or P b) B)' )
        checkLatexPutdown( '\\forall x , x \\in X', '(forall (x , (in x X)))' )
        checkLatexPutdown(
            'A \\subseteq B \\wedge B \\subseteq A',
            '(and (subseteq A B) (subseteq B A))'
        )
    } )

} )
