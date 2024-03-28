
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Converting putdown to LaTeX', () => {
    
    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str

    const putdown = converter.languages.get( 'putdown' )
    const latex = converter.languages.get( 'latex' )
    const checkPutdownLatex = ( putdownText, latexText ) => {
        expect( putdown.convertTo( putdownText, latex ) ).to.equal( latexText )
        // console.log( `${lpad( putdown )}  -->  ${latex}` )
    }
    const checkPutdownLatexFail = ( putdownText ) => {
        expect( putdown.convertTo( putdownText, latex ) ).to.be.undefined
    }

    it( 'correctly converts many kinds of numbers but not malformed ones', () => {
        checkPutdownLatex( '0', '0' )
        checkPutdownLatex( '328975289', '328975289' )
        checkPutdownLatex( '(- 9097285323)', '- 9097285323' )
        checkPutdownLatex( '0.0', '0.0' )
        checkPutdownLatex( '32897.5289', '32897.5289' )
        checkPutdownLatex( '(- 1.9097285323)', '- 1.9097285323' )
        checkPutdownLatexFail( '0.0.0' )
        checkPutdownLatexFail( '0k0' )
    } )

    it( 'correctly converts one-letter variable names but not larger ones', () => {
        checkPutdownLatex( 'x', 'x' )
        checkPutdownLatex( 'U', 'U' )
        checkPutdownLatex( 'Q', 'Q' )
        checkPutdownLatex( 'm', 'm' )
        checkPutdownLatexFail( 'foo', 'foo' )
        checkPutdownLatexFail( 'Hi', 'Hi' )
    } )

    it( 'correctly converts the infinity symbol', () => {
        checkPutdownLatex( 'infinity', '\\infty' )
    } )

    it( 'correctly converts exponentiation of atomics', () => {
        checkPutdownLatex( '(^ 1 2)', '1 ^ 2' )
        checkPutdownLatex( '(^ e x)', 'e ^ x' )
        checkPutdownLatex( '(^ 1 infinity)', '1 ^ \\infty' )
    } )

    it( 'correctly converts atomic percentages and factorials', () => {
        checkPutdownLatex( '(% 10)', '10 \\%' )
        checkPutdownLatex( '(% t)', 't \\%' )
        checkPutdownLatex( '(! 10)', '10 !' )
        checkPutdownLatex( '(! t)', 't !' )
    } )

    it( 'correctly converts division of atomics or factors', () => {
        // division of atomics
        checkPutdownLatex( '(/ 1 2)', '1 \\div 2' )
        checkPutdownLatex( '(/ x y)', 'x \\div y' )
        checkPutdownLatex( '(/ 0 infinity)', '0 \\div \\infty' )
        // division of factors
        checkPutdownLatex( '(/ (^ x 2) 3)', 'x ^ 2 \\div 3' )
        checkPutdownLatex( '(/ 1 (^ e x))', '1 \\div e ^ x' )
        checkPutdownLatex( '(/ (% 10) (^ 2 100))', '10 \\% \\div 2 ^ 100' )
    } )

    it( 'correctly converts multiplication of atomics or factors', () => {
        // multiplication of atomics
        checkPutdownLatex( '(* 1 2)', '1 \\times 2' )
        checkPutdownLatex( '(* x y)', 'x \\times y' )
        checkPutdownLatex( '(* 0 infinity)', '0 \\times \\infty' )
        // multiplication of factors
        checkPutdownLatex( '(* (^ x 2) 3)', 'x ^ 2 \\times 3' )
        checkPutdownLatex( '(* 1 (^ e x))', '1 \\times e ^ x' )
        checkPutdownLatex( '(* (% 10) (^ 2 100))', '10 \\% \\times 2 ^ 100' )
    } )

    it( 'correctly converts negations of atomics or factors', () => {
        checkPutdownLatex( '(* (- 1) 2)', '- 1 \\times 2' )
        checkPutdownLatex( '(* x (- y))', 'x \\times - y' )
        checkPutdownLatex( '(* (- (^ x 2)) (- 3))', '- x ^ 2 \\times - 3' )
        checkPutdownLatex( '(- (- (- (- 1000))))', '- - - - 1000' )
    } )

    it( 'correctly converts additions and subtractions', () => {
        checkPutdownLatex( '(+ x y)', 'x + y' )
        checkPutdownLatex( '(- 1 (- 3))', '1 - - 3' )
        checkPutdownLatex( '(+ (^ A B) (- C D))', 'A ^ B + C - D' )
    } )
    
    it( 'correctly converts number expressions with groupers', () => {
        checkPutdownLatex( '(- (* 1 2))', '- 1 \\times 2' )
        checkPutdownLatex( '(! (^ x 2))', '{x ^ 2} !' )
        checkPutdownLatex( '(^ (- x) (* 2 (- 3)))', '{- x} ^ {2 \\times - 3}' )
        checkPutdownLatex( '(^ (- 3) (+ 1 2))', '{- 3} ^ {1 + 2}' )
    } )

    it( 'correctly converts propositional logic atomics', () => {
        checkPutdownLatex( 'true', '\\top' )
        checkPutdownLatex( 'false', '\\bot' )
        checkPutdownLatex( 'contradiction', '\\rightarrow \\leftarrow' )
        // no need to check variables; they were tested earlier
    } )

    it( 'correctly converts propositional logic conjuncts', () => {
        checkPutdownLatex( '(and true false)', '\\top \\wedge \\bot' )
        checkPutdownLatex(
            '(and (not P) (not true))',
            '\\neg P \\wedge \\neg \\top'
        )
        checkPutdownLatex( '(and (and a b) c)', 'a \\wedge b \\wedge c' )
    } )

    it( 'correctly converts propositional logic disjuncts', () => {
        checkPutdownLatex( '(or true (not A))', '\\top \\vee \\neg A' )
        checkPutdownLatex(
            '(or (and P Q) (and Q P))',
            'P \\wedge Q \\vee Q \\wedge P'
        )
    } )

    it( 'correctly converts propositional logic conditionals', () => {
        checkPutdownLatex(
            '(implies A (and Q (not P)))',
            'A \\Rightarrow Q \\wedge \\neg P'
        )
        checkPutdownLatex(
            '(implies (implies (or P Q) (and Q P)) T)',
            'P \\vee Q \\Rightarrow Q \\wedge P \\Rightarrow T'
        )
    } )

    it( 'correctly converts propositional logic biconditionals', () => {
        checkPutdownLatex(
            '(iff A (and Q (not P)))',
            'A \\Leftrightarrow Q \\wedge \\neg P'
        )
        checkPutdownLatex(
            '(implies (iff (or P Q) (and Q P)) T)',
            'P \\vee Q \\Leftrightarrow Q \\wedge P \\Rightarrow T'
        )
    } )

    it( 'correctly converts propositional expressions with groupers', () => {
        checkPutdownLatex(
            '(or P (and (iff Q Q) P))',
            'P \\vee {Q \\Leftrightarrow Q} \\wedge P'
        )
        checkPutdownLatex(
            '(not (iff true false))',
            '\\neg {\\top \\Leftrightarrow \\bot}'
        )
    } )

    it( 'correctly converts simple predicate logic expressions', () => {
        checkPutdownLatex( '(forall (x , P))', '\\forall x , P' )
        checkPutdownLatex( '(exists (t , (not Q)))', '\\exists t , \\neg Q' )
        checkPutdownLatex(
            '(existsunique (k , (implies m n)))',
            '\\exists ! k , m \\Rightarrow n'
        )
    } )

    it( 'can convert finite and empty sets', () => {
        checkPutdownLatex( 'emptyset', '\\emptyset' )
        checkPutdownLatex( '(finiteset (elts 1))', '\\{ 1 \\}' )
        checkPutdownLatex( '(finiteset (elts 1 (elts 2)))', '\\{ 1 , 2 \\}' )
        checkPutdownLatex(
            '(finiteset (elts 1 (elts 2 (elts 3))))',
            '\\{ 1 , 2 , 3 \\}'
        )
        checkPutdownLatex(
            '(finiteset (elts emptyset (elts emptyset)))',
            '\\{ \\emptyset , \\emptyset \\}'
        )
        checkPutdownLatex(
            '(finiteset (elts (finiteset (elts emptyset))))',
            '\\{ \\{ \\emptyset \\} \\}'
        )
        checkPutdownLatex( '(finiteset (elts 3 (elts x)))', '\\{ 3 , x \\}' )
        checkPutdownLatex(
            '(finiteset (elts (setuni A B) (elts (setint A B))))',
            '\\{ A \\cup B , A \\cap B \\}'
        )
        checkPutdownLatex(
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))',
            '\\{ 1 , 2 , \\emptyset , K , P \\}'
        )
    } )

    it( 'can convert simple set memberships and subsets', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        checkPutdownLatex( '(in b B)', 'b \\in B' )
        checkPutdownLatex(
            '(in 2 (finiteset (elts 1 (elts 2))))',
            '2 \\in \\{ 1 , 2 \\}'
        )
        checkPutdownLatex( '(in X (setuni a b))', 'X \\in a \\cup b' )
        checkPutdownLatex(
            '(in (setuni A B) (setuni X Y))',
            'A \\cup B \\in X \\cup Y'
        )
        checkPutdownLatex( '(subset A (setcomp B))', 'A \\subset \\bar B' )
        checkPutdownLatex(
            '(subseteq (setint u v) (setuni u v))',
            'u \\cap v \\subseteq u \\cup v'
        )
        checkPutdownLatex(
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))',
            '\\{ 1 \\} \\subseteq \\{ 1 \\} \\cup \\{ 2 \\}'
        )
    } )

    it( 'does not undo the canonical form for "notin" notation', () => {
        checkPutdownLatex( '(not (in a A))', '\\neg a \\in A' )
        checkPutdownLatex(
            '(not (in emptyset emptyset))',
            '\\neg \\emptyset \\in \\emptyset'
        )
        checkPutdownLatex(
            '(not (in (- 3 5) (setint K P)))',
            '\\neg 3 - 5 \\in K \\cap P'
        )
    } )

    it( 'can convert sentences built from set operators', () => {
        checkPutdownLatex( '(or P (in b B))', 'P \\vee b \\in B' )
        checkPutdownLatex( '(in (or P b) B)', '{P \\vee b} \\in B' )
        checkPutdownLatex( '(forall (x , (in x X)))', '\\forall x , x \\in X' )
        checkPutdownLatex(
            '(and (subseteq A B) (subseteq B A))',
            'A \\subseteq B \\wedge B \\subseteq A'
        )
    } )

} )
