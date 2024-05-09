
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Converting putdown to LaTeX', () => {
    
    const putdown = converter.languages.get( 'putdown' )
    const latex = converter.languages.get( 'latex' )
    const check = ( putdownText, latexText ) => {
        expect( putdown.convertTo( putdownText, latex ) ).to.equal( latexText )
        global.log?.( 'putdown', putdownText, 'LaTeX', latexText )
    }
    const checkFail = ( putdownText ) => {
        expect( putdown.convertTo( putdownText, latex ) ).to.be.undefined
        global.log?.( 'putdown', putdownText, 'LaTeX', null )
    }

    it( 'correctly converts many kinds of numbers but not malformed ones', () => {
        check( '0', '0' )
        check( '328975289', '328975289' )
        check( '(- 9097285323)', '-9097285323' )
        check( '0.0', '0.0' )
        check( '32897.5289', '32897.5289' )
        check( '(- 1.9097285323)', '-1.9097285323' )
        checkFail( '0.0.0' )
        checkFail( '0k0' )
    } )

    it( 'correctly converts one-letter variable names but not larger ones', () => {
        check( 'x', 'x' )
        check( 'U', 'U' )
        check( 'Q', 'Q' )
        check( 'm', 'm' )
        checkFail( 'foo' )
        checkFail( 'Hi' )
    } )

    it( 'correctly converts numeric constants', () => {
        check( 'infinity', '\\infty' )
        check( 'pi', '\\pi' )
        check( 'eulersnumber', 'e' )
    } )

    it( 'correctly converts exponentiation of atomics', () => {
        check( '(^ 1 2)', '1^2' )
        check( '(^ e x)', 'e^x' )
        check( '(^ 1 infinity)', '1^\\infty' )
    } )

    it( 'correctly converts atomic percentages and factorials', () => {
        check( '(% 10)', '10\\%' )
        check( '(% t)', 't\\%' )
        check( '(! 10)', '10!' )
        check( '(! t)', 't!' )
    } )

    it( 'correctly converts division of atomics or factors', () => {
        // division of atomics
        check( '(/ 1 2)', '1\\div 2' )
        check( '(/ x y)', 'x\\div y' )
        check( '(/ 0 infinity)', '0\\div \\infty' )
        // division of factors
        check( '(/ (^ x 2) 3)', 'x^2\\div 3' )
        check( '(/ 1 (^ e x))', '1\\div e^x' )
        check( '(/ (% 10) (^ 2 100))', '10\\%\\div 2^100' )
    } )

    it( 'correctly converts multiplication of atomics or factors', () => {
        // multiplication of atomics
        check( '(* 1 2)', '1\\times 2' )
        check( '(* x y)', 'x\\times y' )
        check( '(* 0 infinity)', '0\\times \\infty' )
        // multiplication of factors
        check( '(* (^ x 2) 3)', 'x^2\\times 3' )
        check( '(* 1 (^ e x))', '1\\times e^x' )
        check( '(* (% 10) (^ 2 100))', '10\\%\\times 2^100' )
    } )

    it( 'correctly converts negations of atomics or factors', () => {
        check( '(* (- 1) 2)', '-1\\times 2' )
        check( '(* x (- y))', 'x\\times -y' )
        check( '(* (- (^ x 2)) (- 3))', '-x^2\\times -3' )
        check( '(- (- (- (- 1000))))', '----1000' )
    } )

    it( 'correctly converts additions and subtractions', () => {
        check( '(+ x y)', 'x+y' )
        check( '(- 1 (- 3))', '1--3' )
        check( '(+ (^ A B) (- C pi))', 'A^B+C-\\pi' )
    } )
    
    it( 'correctly converts number expressions with groupers', () => {
        check( '(- (* 1 2))', '-1\\times 2' )
        check( '(! (^ x 2))', '{x^2}!' )
        check( '(^ (- x) (* 2 (- 3)))', '{-x}^{2\\times -3}' )
        check( '(^ (- 3) (+ 1 2))', '{-3}^{1+2}' )
    } )

    it( 'can convert relations of numeric expressions', () => {
        check( '(> 1 2)', '1>2' )
        check( '(< (- 1 2) (+ 1 2))', '1-2<1+2' )
        check( '(not (= 1 2))', '\\neg 1=2' )
        check( '(and (>= 2 1) (<= 2 3))', '2\\ge 1\\wedge 2\\le 3' )
        check( '(applyrel | 7 14)', '7 | 14' )
        check( '(applyrel | (apply A k) (! n))', 'A(k) | n!' )
        check( '(applyrel ~ (- 1 k) (+ 1 k))', '1-k \\sim 1+k' )
        check( '(applyrel ~~ 0.99 1.01)', '0.99 \\approx 1.01' )
    } )

    it( 'does not undo the canonical form for inequality', () => {
        check( '(not (= x y))', '\\neg x=y' )
    } )

    it( 'correctly converts propositional logic atomics', () => {
        check( 'true', '\\top' )
        check( 'false', '\\bot' )
        check( 'contradiction', '\\rightarrow \\leftarrow' )
        // no need to check variables; they were tested earlier
    } )

    it( 'correctly converts propositional logic conjuncts', () => {
        check( '(and true false)', '\\top\\wedge \\bot' )
        check( '(and (not P) (not true))', '\\neg P\\wedge \\neg \\top' )
        check( '(and (and a b) c)', 'a\\wedge b\\wedge c' )
    } )

    it( 'correctly converts propositional logic disjuncts', () => {
        check( '(or true (not A))', '\\top\\vee \\neg A' )
        check( '(or (and P Q) (and Q P))', 'P\\wedge Q\\vee Q\\wedge P' )
    } )

    it( 'correctly converts propositional logic conditionals', () => {
        check(
            '(implies A (and Q (not P)))',
            'A\\Rightarrow Q\\wedge \\neg P'
        )
        check(
            '(implies (implies (or P Q) (and Q P)) T)',
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T'
        )
    } )

    it( 'correctly converts propositional logic biconditionals', () => {
        check(
            '(iff A (and Q (not P)))',
            'A\\Leftrightarrow Q\\wedge \\neg P'
        )
        check(
            '(implies (iff (or P Q) (and Q P)) T)',
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T'
        )
    } )

    it( 'correctly converts propositional expressions with groupers', () => {
        check(
            '(or P (and (iff Q Q) P))',
            'P\\vee {Q\\Leftrightarrow Q}\\wedge P'
        )
        check(
            '(not (iff true false))',
            '\\neg {\\top\\Leftrightarrow \\bot}'
        )
    } )

    it( 'correctly converts simple predicate logic expressions', () => {
        check( '(forall (x , P))', '\\forall x, P' )
        check( '(exists (t , (not Q)))', '\\exists t, \\neg Q' )
        check(
            '(existsunique (k , (implies m n)))',
            '\\exists ! k, m\\Rightarrow n'
        )
    } )

    it( 'can convert finite and empty sets', () => {
        check( 'emptyset', '\\emptyset' )
        check( '(finiteset (elts 1))', '\\{1\\}' )
        check( '(finiteset (elts 1 (elts 2)))', '\\{1,2\\}' )
        check(
            '(finiteset (elts 1 (elts 2 (elts 3))))',
            '\\{1,2,3\\}'
        )
        check(
            '(finiteset (elts emptyset (elts emptyset)))',
            '\\{\\emptyset,\\emptyset\\}'
        )
        check(
            '(finiteset (elts (finiteset (elts emptyset))))',
            '\\{\\{\\emptyset\\}\\}'
        )
        check( '(finiteset (elts 3 (elts x)))', '\\{3,x\\}' )
        check(
            '(finiteset (elts (setuni A B) (elts (setint A B))))',
            '\\{A\\cup B,A\\cap B\\}'
        )
        check(
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))',
            '\\{1,2,\\emptyset,K,P\\}'
        )
    } )

    it( 'correctly converts tuples and vectors', () => {
        // tuples containing at least two elements are valid
        check( '(tuple (elts 5 (elts 6)))', '(5,6)' )
        check(
            '(tuple (elts 5 (elts (setuni A B) (elts k))))',
            '(5,A\\cup B,k)'
        )
        // vectors containing at least two numbers are valid
        check( '(vector (elts 5 (elts 6)))', '\\langle 5,6\\rangle' )
        check(
            '(vector (elts 5 (elts (- 7) (elts k))))',
            '\\langle 5,-7,k\\rangle'
        )
        // tuples and vectors containing zero or one element are not valid
        checkFail( '(tuple)' )
        checkFail( '(tuple (elts))' )
        checkFail( '(tuple (elts 3))' )
        checkFail( '(vector)' )
        checkFail( '(vector (elts))' )
        checkFail( '(vector (elts 3))' )
        // tuples can contain other tuples
        check(
            '(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))',
            '((1,2),6)'
        )
        // vectors can contain only numbers
        checkFail( '(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))' )
        checkFail( '(vector (elts (vector (elts 1 (elts 2))) (elts 6)))' )
        checkFail( '(vector (elts (setuni A B) (elts 6)))' )
    } )

    it( 'can convert simple set memberships and subsets', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        check( '(in b B)', 'b\\in B' )
        check( '(in 2 (finiteset (elts 1 (elts 2))))', '2\\in \\{1,2\\}' )
        check( '(in X (setuni a b))', 'X\\in a\\cup b' )
        check( '(in (setuni A B) (setuni X Y))', 'A\\cup B\\in X\\cup Y' )
        check( '(subset A (setcomp B))', 'A\\subset \\bar B' )
        check(
            '(subseteq (setint u v) (setuni u v))',
            'u\\cap v\\subseteq u\\cup v'
        )
        check(
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))',
            '\\{1\\}\\subseteq \\{1\\}\\cup \\{2\\}'
        )
        check( '(in p (setprod U V))', 'p\\in U\\times V' )
        check(
            '(in q (setuni (setcomp U) (setprod V W)))',
            'q\\in \\bar U\\cup V\\times W'
        )
        check(
            '(in (tuple (elts a (elts b))) (setprod A B))',
            '(a,b)\\in A\\times B'
        )
        check(
            '(in (vector (elts a (elts b))) (setprod A B))',
            '\\langle a,b\\rangle\\in A\\times B'
        )
    } )

    it( 'does not undo the canonical form for "notin" notation', () => {
        check( '(not (in a A))', '\\neg a\\in A' )
        check(
            '(not (in emptyset emptyset))',
            '\\neg \\emptyset\\in \\emptyset'
        )
        check( '(not (in (- 3 5) (setint K P)))', '\\neg 3-5\\in K\\cap P' )
    } )

    it( 'can convert sentences built from set operators', () => {
        check( '(or P (in b B))', 'P\\vee b\\in B' )
        check( '(in (or P b) B)', '{P\\vee b}\\in B' )
        check( '(forall (x , (in x X)))', '\\forall x, x\\in X' )
        check(
            '(and (subseteq A B) (subseteq B A))',
            'A\\subseteq B\\wedge B\\subseteq A'
        )
        check( '(= R (setprod A B))', 'R=A\\times B' )
        check( '(forall (n , (applyrel | n (! n))))', '\\forall n, n | n!' )
        check(
            '(implies (applyrel ~ a b) (applyrel ~ b a))',
            'a \\sim b\\Rightarrow b \\sim a'
        )
    } )

    it( 'can convert notation related to functions', () => {
        check( '(function f A B)', 'f:A\\to B' )
        check(
            '(not (function F (setuni X Y) Z))',
            '\\neg F:X\\cup Y\\to Z'
        )
        check( '(function (compose f g) A C)', 'f\\circ g:A\\to C' )
        check( '(apply f x)', 'f(x)' )
        check(
            '(apply (inverse f) (apply (inverse g) 10))',
            'f ^ { - 1 }(g ^ { - 1 }(10))'
        )
        check( '(apply E (setcomp L))', 'E(\\bar L)' )
        check( '(setint emptyset (apply f 2))', '\\emptyset\\cap f(2)' )
        check(
            '(and (apply P e) (apply Q (+ 3 b)))',
            'P(e)\\wedge Q(3+b)'
        )
        check( '(= F (compose G (inverse H)))', 'F=G\\circ H ^ { - 1 }' )
    } )

    it( 'can convert expressions with trigonometric functions', () => {
        check( '(apply sin x)', '\\sin x' )
        check( '(apply cos (* pi x))', '\\cos \\pi\\times x' )
        check( '(apply tan t)', '\\tan t' )
        check( '(/ 1 (apply cot pi))', '1\\div \\cot \\pi' )
        check( '(= (apply sec y) (apply csc y))', '\\sec y=\\csc y' )
    } )

    it( 'can convert expressions with logarithms', () => {
        check( '(apply log n)', '\\log n' )
        check( '(+ 1 (apply ln x))', '1+\\ln x' )
        check( '(apply (logbase 2) 1024)', '\\log_2 1024' )
        check(
            '(/ (apply log n) (apply log (apply log n)))',
            '\\log n\\div \\log \\log n'
        )
    } )

    it( 'can convert equivalence classes and expressions that use them', () => {
        check( '(eqclass 1 ~~)', '[1,\\approx]' )
        check( '(eqclass (+ x 2) ~)', '[x+2]' )
        check(
            '(setuni (eqclass 1 ~~) (eqclass 2 ~~))',
            '[1,\\approx]\\cup [2,\\approx]'
        )
        check( '(in 7 (eqclass 7 ~))', '7\\in [7]' )
    } )

    it( 'can convert equivalence and classes mod a number', () => {
        check( '(=mod 5 11 3)', '5 \\equiv 11 \\mod 3' )
        check( '(=mod k m n)', 'k \\equiv m \\mod n' )
        check(
            '(subset emptyset (modclass (- 1) 10))',
            '\\emptyset\\subset [-1, \\equiv _ 10]'
        )
    } )

    it( 'can convert type sentences and combinations of them', () => {
        // In every case here, the LaTeX produced has an extra space in it.
        // This will be slightly ugly, and is a bug we need to figure out how
        // to fix, long term.
        check( '(hastype x settype)', 'x \\text{is a set}' )
        check( '(hastype n numbertype)', 'n \\text{is a number}' )
        check( '(hastype S partialordertype)', 'S \\text{is a partial order}' )
        check(
            '(and (hastype 1 numbertype) (hastype 10 numbertype))',
            '1 \\text{is a number}\\wedge 10 \\text{is a number}'
        )
        check(
            '(implies (hastype R equivalencerelationtype) (hastype R relationtype))',
            'R \\text{is an equivalence relation}\\Rightarrow R \\text{is a relation}'
        )
    } )

    it( 'can convert notation for expression function application', () => {
        check( '(efa f x)', '\\mathcal{f} (x)' )
        check( '(apply F (efa k 10))', 'F(\\mathcal{k} (10))' )
        check( '(efa E (setcomp L))', '\\mathcal{E} (\\bar L)' )
        check(
            '(setint emptyset (efa f 2))',
            '\\emptyset\\cap \\mathcal{f} (2)'
        )
        check(
            '(and (efa P x) (efa Q y))',
            '\\mathcal{P} (x)\\wedge \\mathcal{Q} (y)'
        )
    } )

    it( 'can convert notation for assumptions', () => {
        // You can assume a sentence
        check( ':X', '\\text{Assume }X' )
        check( ':(= k 1000)', '\\text{Assume }k=1000' )
        check( ':true', '\\text{Assume }\\top' )
        // You cannot assume something that's not a sentence
        checkFail( ':50' )
        checkFail( ':(tuple (elts 5 (elts 6)))' )
        checkFail( ':(compose f g)' )
        checkFail( ':emptyset' )
        checkFail( ':infinity' )
    } )

    it( 'can convert notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( ':[x]', '\\text{Let }x' )
        check( ':[T]', '\\text{Let }T' )
        // You can declare variables with predicates attached
        check( ':[x , (> x 0)]', '\\text{Let }x \\text{ be such that }x>0' )
        check(
            ':[T , (or (= T 5) (in T S))]',
            '\\text{Let }T \\text{ be such that }T=5\\vee T\\in S'
        )
        // You cannot declare something that's not a variable
        checkFail( ':[(> x 5)]' )
        checkFail( ':[(= 1 1)]' )
        checkFail( ':[emptyset]' )
        // You cannot declare a variable with a non-predicate attached
        checkFail( ':[x , 1]' )
        checkFail( ':[x , (or 1 2)]' )
        checkFail( ':[x , [y]]' )
        checkFail( ':[x , :B]' )
    } )

    it( 'can convert notation for For Some-style declarations', () => {
        // You can declare variables with predicates attached
        check( '[x , (> x 0)]', '\\text{For some }x, x>0' )
        check(
            '[T , (or (= T 5) (in T S))]',
            '\\text{For some }T, T=5\\vee T\\in S'
        )
        // You can't declare variables by themselves
        checkFail( '[x]' )
        checkFail( '[T]' )
        // You cannot declare something that's not a variable
        checkFail( '[(> x 5)]' )
        checkFail( '[(= 1 1)]' )
        checkFail( '[emptyset]' )
        // You cannot declare a variable with a non-predicate attached
        checkFail( '[x , 1]' )
        checkFail( '[x , (or 1 2)]' )
        checkFail( '[x , [y]]' )
        checkFail( '[x , :B]' )
    } )

} )
