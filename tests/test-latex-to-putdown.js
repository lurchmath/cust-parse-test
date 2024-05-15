
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Converting LaTeX to putdown', () => {
    
    const latex = converter.languages.get( 'latex' )
    const putdown = converter.languages.get( 'putdown' )
    const check = ( latexText, putdownText ) => {
        expect( latex.convertTo( latexText, putdown ) ).to.equal( putdownText )
        global.log?.( 'LaTeX', latexText, 'putdown', putdownText )
    }
    const checkFail = ( latexText ) => {
        expect( latex.convertTo( latexText, putdown ) ).to.be.undefined
        global.log?.( 'LaTeX', latexText, 'putdown', null )
    }

    it( 'correctly converts many kinds of numbers but not malformed ones', () => {
        check( '0', '0' )
        check( '328975289', '328975289' )
        check( '-9097285323', '(- 9097285323)' )
        check( '0.0', '0.0' )
        check( '32897.5289', '32897.5289' )
        check( '-1.9097285323', '(- 1.9097285323)' )
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
        check( '\\infty', 'infinity' )
        check( '\\pi', 'pi' )
        // The following happens because, even though the parser detects the
        // parsing of e as Euler's number is valid, it's not the first in the
        // alphabetical ordering of the possible parsed results:
        check( 'e', 'e' )
    } )

    it( 'correctly converts exponentiation of atomics', () => {
        check( '1^2', '(^ 1 2)' )
        check( 'e^x', '(^ eulersnumber x)' )
        check( '1^\\infty', '(^ 1 infinity)' )
    } )

    it( 'correctly converts atomic percentages', () => {
        check( '10\\%', '(% 10)' )
        check( 't\\%', '(% t)' )
        check( '10!', '(! 10)' )
        check( 't!', '(! t)' )
    } )

    it( 'correctly converts division of atomics or factors', () => {
        // division of atomics
        check( '1\\div2', '(/ 1 2)' )
        check( 'x\\div y', '(/ x y)' )
        check( '0\\div\\infty', '(/ 0 infinity)' )
        // division of factors
        check( 'x^2\\div3', '(/ (^ x 2) 3)' )
        check( '1\\div e^x', '(/ 1 (^ eulersnumber x))' )
        check( '10\\%\\div2^{100}', '(/ (% 10) (^ 2 100))' )
    } )

    it( 'correctly converts multiplication of atomics or factors', () => {
        // multiplication of atomics
        check( '1\\times2', '(* 1 2)' )
        check( 'x\\cdot y', '(* x y)' )
        check( '0\\times\\infty', '(* 0 infinity)' )
        // multiplication of factors
        check( 'x^2\\cdot3', '(* (^ x 2) 3)' )
        check( '1\\times e^x', '(* 1 (^ eulersnumber x))' )
        check( '10\\%\\cdot2^{100}', '(* (% 10) (^ 2 100))' )
    } )

    it( 'correctly converts negations of atomics or factors', () => {
        check( '-1\\times2', '(* (- 1) 2)' )
        check( 'x\\cdot{-y}', '(* x (- y))' )
        check( 'x\\cdot(-y)', '(* x (- y))' )
        check( '{-x^2}\\cdot{-3}', '(* (- (^ x 2)) (- 3))' )
        check( '(-x^2)\\cdot(-3)', '(* (- (^ x 2)) (- 3))' )
        check( '----1000', '(- (- (- (- 1000))))' )
    } )

    it( 'correctly converts additions and subtractions', () => {
        check( 'x + y', '(+ x y)' )
        check( '1 - - 3', '(- 1 (- 3))' )
        // Following could also be (- (+ (^ A B) C) pi), both of which are OK,
        // but the one shown below is alphabetically earlier:
        check( 'A ^ B + C - \\pi', '(+ (^ A B) (- C pi))' )
    } )
    
    it( 'correctly converts number expressions with groupers', () => {
        check( '-{1\\times2}', '(- (* 1 2))' )
        check( '-(1\\times2)', '(- (* 1 2))' )
        check( '{x^2}!', '(! (^ x 2))' )
        check( '(N-1)!', '(! (- N 1))' )
        check( '\\left(N-1\\right)!', '(! (- N 1))' )
        checkFail( '\\left(N-1)!' )
        checkFail( '(N-1\\right)!' )
        check( '3!\\cdot4!', '(* (! 3) (! 4))' )
        check( '{-x}^{2\\cdot{-3}}', '(^ (- x) (* 2 (- 3)))' )
        check( '(-x)^(2\\cdot(-3))', '(^ (- x) (* 2 (- 3)))' )
        check( '(-x)^{2\\cdot(-3)}', '(^ (- x) (* 2 (- 3)))' )
        check( '{-3}^{1+2}', '(^ (- 3) (+ 1 2))' )
        check( 'k^{1-y}\\cdot(2+k)', '(* (^ k (- 1 y)) (+ 2 k))' )
        check( '0.99\\approx1.01', '(relationholds ~~ 0.99 1.01)' )
    } )

    it( 'can convert relations of numeric expressions', () => {
        check( '1 > 2', '(> 1 2)' )
        check( '1 \\gt 2', '(> 1 2)' )
        check( '1 - 2 < 1 + 2', '(< (- 1 2) (+ 1 2))' )
        check( '1 - 2 \\lt 1 + 2', '(< (- 1 2) (+ 1 2))' )
        check( '\\neg 1 = 2', '(not (= 1 2))' )
        check( '2 \\ge 1 \\wedge 2 \\le 3', '(and (>= 2 1) (<= 2 3))' )
        check( '2\\geq1\\wedge2\\leq3', '(and (>= 2 1) (<= 2 3))' )
        check( '7 | 14', '(relationholds | 7 14)' )
        check( '7 \\vert 14', '(relationholds | 7 14)' )
        check( 'A ( k ) | n !', '(relationholds | (apply A k) (! n))' )
        check( 'A ( k )\\vert n !', '(relationholds | (apply A k) (! n))' )
        check( '1 - k \\sim 1 + k', '(relationholds ~ (- 1 k) (+ 1 k))' )
    } )

    it( 'creates the canonical form for inequality', () => {
        check( 'x \\ne y', '(not (= x y))' )
        check( 'x \\neq y', '(not (= x y))' )
        check( '\\neg x = y', '(not (= x y))' )
    } )
    
    it( 'correctly converts propositional logic atomics', () => {
        check( '\\top', 'true' )
        check( '\\bot', 'false' )
        check( '\\rightarrow\\leftarrow', 'contradiction' )
        // no need to check variables; they were tested earlier
    } )

    it( 'correctly converts propositional logic conjuncts', () => {
        check( '\\top\\wedge\\bot', '(and true false)' )
        check( '\\neg P\\wedge\\neg\\top', '(and (not P) (not true))' )
        // Following could also be (and (and a b) c), both of which are OK,
        // but the one shown below is alphabetically earlier:
        check( 'a\\wedge b\\wedge c', '(and a (and b c))' )
    } )

    it( 'correctly converts propositional logic disjuncts', () => {
        check( '\\top\\vee \\neg A', '(or true (not A))' )
        check( 'P\\wedge Q\\vee Q\\wedge P', '(or (and P Q) (and Q P))' )
    } )

    it( 'correctly converts propositional logic conditionals', () => {
        check( 'A\\Rightarrow Q\\wedge\\neg P', '(implies A (and Q (not P)))' )
        // Implication should right-associate:
        check(
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T',
            '(implies (or P Q) (implies (and Q P) T))'
        )
    } )

    it( 'correctly converts propositional logic biconditionals', () => {
        check( 'A\\Leftrightarrow Q\\wedge\\neg P', '(iff A (and Q (not P)))' )
        // This is how iff and implies associate right now, due to alphabetical
        // ordering, but we will be tweaking this in a future update.
        check(
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T',
            '(implies (iff (or P Q) (and Q P)) T)'
        )
    } )

    it( 'correctly converts propositional expressions with groupers', () => {
        check(
            'P\\lor {Q\\Leftrightarrow Q}\\land P',
            '(or P (and (iff Q Q) P))'
        )
        check( '\\lnot{\\top\\Leftrightarrow\\bot}', '(not (iff true false))' )
        check(
            '\\lnot\\left(\\top\\Leftrightarrow\\bot\\right)',
            '(not (iff true false))'
        )
        check( '\\lnot(\\top\\Leftrightarrow\\bot)', '(not (iff true false))' )
    } )

    it( 'correctly converts simple predicate logic expressions', () => {
        check( '\\forall x, P', '(forall (x , P))' )
        check( '\\exists t,\\neg Q', '(exists (t , (not Q)))' )
        check(
            '\\exists! k,m\\Rightarrow n',
            '(exists! (k , (implies m n)))'
        )
    } )

    it( 'can convert finite and empty sets', () => {
        check( '\\emptyset', 'emptyset' )
        check( '\\{ 1 \\}', '(finiteset (elts 1))' )
        check( '\\left\\{ 1 \\right\\}', '(finiteset (elts 1))' )
        check( '\\{ 1 , 2 \\}', '(finiteset (elts 1 (elts 2)))' )
        check( '\\{ 1 , 2 , 3 \\}', '(finiteset (elts 1 (elts 2 (elts 3))))' )
        check(
            '\\{ \\emptyset , \\emptyset \\}',
            '(finiteset (elts emptyset (elts emptyset)))'
        )
        check(
            '\\{ \\{ \\emptyset \\} \\}',
            '(finiteset (elts (finiteset (elts emptyset))))'
        )
        check( '\\{ 3 , x \\}', '(finiteset (elts 3 (elts x)))' )
        check( '\\left\\{ 3 , x \\right\\}', '(finiteset (elts 3 (elts x)))' )
        check(
            '\\{ A \\cup B , A \\cap B \\}',
            '(finiteset (elts (union A B) (elts (intersection A B))))'
        )
        check(
            '\\{ 1 , 2 , \\emptyset , K , P \\}',
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))'
        )
    } )

    it( 'correctly converts tuples and vectors', () => {
        // tuples containing at least two elements are valid
        check( '( 5 , 6 )', '(tuple (elts 5 (elts 6)))' )
        check(
            '( 5 , A \\cup B , k )',
            '(tuple (elts 5 (elts (union A B) (elts k))))'
        )
        // vectors containing at least two numbers are valid
        check( '\\langle 5 , 6 \\rangle', '(vector (elts 5 (elts 6)))' )
        check(
            '\\langle 5 , - 7 , k \\rangle',
            '(vector (elts 5 (elts (- 7) (elts k))))'
        )
        // tuples and vectors containing zero or one element are not valid
        checkFail( '()' )
        checkFail( '(())' )
        check( '(3)', '3' ) // okay, this is valid, but not as a tuple
        checkFail( '\\langle\\rangle' )
        checkFail( '\\langle3\\rangle' )
        // tuples can contain other tuples
        check(
            '( ( 1 , 2 ) , 6 )',
            '(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))'
        )
        // vectors can contain only numbers
        checkFail( '\\langle(1,2),6\\rangle' )
        checkFail( '\\langle\\langle1,2\\rangle,6\\rangle' )
        checkFail( '\\langle A\\cup B,6\\rangle' )
    } )

    it( 'can convert simple set memberships and subsets', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is NumberVariable
        check( 'b \\in B', '(in b B)' )
        check( '2 \\in \\{ 1 , 2 \\}', '(in 2 (finiteset (elts 1 (elts 2))))' )
        check( 'X \\in a \\cup b', '(in X (union a b))' )
        check( 'A \\cup B \\in X \\cup Y', '(in (union A B) (union X Y))' )
        check( 'A \\subset \\bar B', '(subset A (complement B))' )
        check(
            'u \\cap v \\subseteq u \\cup v',
            '(subseteq (intersection u v) (union u v))'
        )
        check(
            '\\{1\\}\\subseteq\\{1\\}\\cup\\{2\\}',
            '(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))'
        )
        check( 'p \\in U \\times V', '(in p (cartesianproduct U V))' )
        check(
            'q \\in \\bar U \\cup V \\times W',
            '(in q (union (complement U) (cartesianproduct V W)))'
        )
        check(
            '( a , b ) \\in A \\times B',
            '(in (tuple (elts a (elts b))) (cartesianproduct A B))'
        )
        check(
            '\\langle a , b \\rangle \\in A \\times B',
            '(in (vector (elts a (elts b))) (cartesianproduct A B))'
        )
    } )

    it( 'expands "notin" notation into canonical form', () => {
        check( 'a\\notin A', '(not (in a A))' )
        check( '\\emptyset \\notin \\emptyset', '(not (in emptyset emptyset))' )
        check( '3-5\\notin K\\cap P', '(not (in (- 3 5) (intersection K P)))' )
    } )

    it( 'can convert sentences built from set operators', () => {
        check( 'P \\vee b \\in B', '(or P (in b B))' )
        check( '{P \\vee b} \\in B', '(in (or P b) B)' )
        check( '\\forall x , x \\in X', '(forall (x , (in x X)))' )
        check(
            'A \\subseteq B \\wedge B \\subseteq A',
            '(and (subseteq A B) (subseteq B A))'
        )
        // humorously enough, the following is not treated as sets!  that's ok!
        check( 'R = A \\times B', '(= R (* A B))' )
        // so let's try one that has to be sets...
        check( 'R = A \\cup B', '(= R (union A B))' )
        check( '\\forall n , n | n !', '(forall (n , (relationholds | n (! n))))' )
        check(
            'a \\sim b \\Rightarrow b \\sim a',
            '(implies (relationholds ~ a b) (relationholds ~ b a))'
        )
    } )

    it( 'can convert notation related to functions', () => {
        check( 'f:A\\to B', '(function f A B)' )
        check( 'f\\colon A\\to B', '(function f A B)' )
        check( '\\neg F:X\\cup Y\\to Z', '(not (function F (union X Y) Z))' )
        check(
            '\\neg F\\colon X\\cup Y\\to Z',
            '(not (function F (union X Y) Z))'
        )
        check( 'f \\circ g : A \\to C', '(function (compose f g) A C)' )
        check( 'f(x)', '(apply f x)' )
        check(
            'f ^ {-1} ( g ^ {-1} ( 10 ) )',
            '(apply (inverse f) (apply (inverse g) 10))'
        )
        check( 'E(\\bar L)', '(apply E (complement L))' )
        check( '\\emptyset\\cap f(2)', '(intersection emptyset (apply f 2))' )
        check(
            'P(e)\\wedge Q(3+b)',
            '(and (apply P eulersnumber) (apply Q (+ 3 b)))'
        )
        check( 'F=G\\circ H^{-1}', '(= F (compose G (inverse H)))' )
    } )

    it( 'can convert expressions with trigonometric functions', () => {
        check( '\\sin x', '(apply sin x)' )
        check( '\\cos \\pi \\times x', '(apply cos (* pi x))' )
        check( '\\tan t', '(apply tan t)' )
        check( '1 \\div \\cot \\pi', '(/ 1 (apply cot pi))' )
        check( '\\sec y = \\csc y', '(= (apply sec y) (apply csc y))' )
    } )

    it( 'can convert expressions with logarithms', () => {
        check( '\\log n', '(apply log n)' )
        check( '1 + \\ln x', '(+ 1 (apply ln x))' )
        check( '\\log_ 2 1024', '(apply (logbase 2) 1024)' )
        check(
            '\\log n \\div \\log \\log n',
            '(/ (apply log n) (apply log (apply log n)))'
        )
    } )

    it( 'can convert equivalence classes and expressions that use them', () => {
        check( '[ 1 , \\approx ]', '(equivclass 1 ~~)' )
        check( '\\left[ 1 , \\approx \\right]', '(equivclass 1 ~~)' )
        checkFail( '\\left[ 1 , \\approx ]' )
        checkFail( '[ 1 , \\approx \\right]' )
        check( '[ x + 2 , \\sim ]', '(equivclass (+ x 2) ~)' )
        check(
            '[ 1 , \\approx ] \\cup [ 2 , \\approx ]',
            '(union (equivclass 1 ~~) (equivclass 2 ~~))'
        )
        check( '7 \\in [ 7 , \\sim ]', '(in 7 (equivclass 7 ~))' )
        check( '[P]', '(equivclass P ~)' )
        check( '\\left[P\\right]', '(equivclass P ~)' )
    } )

    it( 'can convert equivalence and classes mod a number', () => {
        check( '5 \\equiv 11 \\mod 3', '(=mod 5 11 3)' )
        check( 'k \\equiv m \\mod n', '(=mod k m n)' )
        check(
            '\\emptyset \\subset [ - 1 , \\equiv _ 10 ]',
            '(subset emptyset (modclass (- 1) 10))'
        )
        check(
            '\\emptyset \\subset \\left[ - 1 , \\equiv _ 10 \\right]',
            '(subset emptyset (modclass (- 1) 10))'
        )
    } )

    it( 'can convert type sentences and combinations of them', () => {
        check( 'x \\text{is a set}', '(hastype x settype)' )
        check( 'n \\text{is }\\text{a number}', '(hastype n numbertype)' )
        check( 'S\\text{is}~\\text{a partial order}',
            '(hastype S partialordertype)' )
        check(
            '1\\text{is a number}\\wedge 10\\text{is a number}',
            '(and (hastype 1 numbertype) (hastype 10 numbertype))'
        )
        check(
            'R\\text{is an equivalence relation}\\Rightarrow R\\text{is a relation}',
            '(implies (hastype R equivalencerelationtype) (hastype R relationtype))'
        )
    } )

    it( 'can convert notation for expression function application', () => {
        check( '\\mathcal{f} (x)', '(efa f x)' )
        check( 'F(\\mathcal{k} (10))', '(apply F (efa k 10))' )
        check( '\\mathcal{E} (\\bar L)', '(efa E (complement L))' )
        check(
            '\\emptyset\\cap \\mathcal{f} (2)',
            '(intersection emptyset (efa f 2))'
        )
        check(
            '\\mathcal{P} (x)\\wedge \\mathcal{Q} (y)',
            '(and (efa P x) (efa Q y))'
        )
    } )

    it( 'can convert notation for assumptions', () => {
        // You can assume a sentence
        check( '\\text{Assume }X', ':X' )
        check( '\\text{Assume }k=1000', ':(= k 1000)' )
        check( '\\text{Assume }\\top', ':true' )
        // You cannot assume something that's not a sentence
        checkFail( '\\text{Assume }50' )
        checkFail( '\\text{assume }(5,6)' )
        checkFail( '\\text{Given }f\\circ g' )
        checkFail( '\\text{given }\\emptyset' )
        checkFail( '\\text{Assume }\\infty' )
    } )

    it( 'can convert notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( '\\text{Let }x', ':[x]' )
        check( '\\text{let }x', ':[x]' )
        check( '\\text{Let }T', ':[T]' )
        check( '\\text{let }T', ':[T]' )
        // You can declare variables with predicates attached
        check( '\\text{Let }x \\text{ be such that }x>0', ':[x , (> x 0)]' )
        check( '\\text{let }x \\text{ be such that }x>0', ':[x , (> x 0)]' )
        check(
            '\\text{Let }T \\text{ be such that }T=5\\vee T\\in S',
            ':[T , (or (= T 5) (in T S))]'
        )
        check(
            '\\text{let }T \\text{ be such that }T=5\\vee T\\in S',
            ':[T , (or (= T 5) (in T S))]'
        )
        // You cannot declare something that's not a variable
        checkFail( '\\text{Let }x>5' )
        checkFail( '\\text{Let }1=1' )
        checkFail( '\\text{Let }\\emptyset' )
        // You cannot declare a variable with a non-predicate attached
        checkFail( '\\text{Let }x \\text{ be such that }1' )
        checkFail( '\\text{Let }x \\text{ be such that }1\\vee 2' )
        checkFail( '\\text{Let }x \\text{ be such that }\\text{Let }y' )
        checkFail( '\\text{Let }x \\text{ be such that }\\text{Assume }B' )
    } )

    it( 'can convert notation for For Some-style declarations', () => {
        // You can declare variables with predicates attached
        check( '\\text{For some }x, x>0', '[x , (> x 0)]' )
        check(
            '\\text{For some }T, T=5\\vee T\\in S',
            '[T , (or (= T 5) (in T S))]'
        )
        // You can't declare variables by themselves
        checkFail( '\\text{For some }x' )
        checkFail( '\\text{for some }x' )
        checkFail( '\\text{For some }T' )
        checkFail( '\\text{for some }T' )
        // You cannot declare something that's not a variable
        checkFail( '\\text{For some }x>5, x>55' )
        checkFail( '\\text{For some }1=1, P' )
        checkFail( '\\text{For some }\\emptyset, 1+1=2' )
        checkFail( 'x>55 \\text{ for some } x>5' )
        checkFail( 'P \\text{ for some } 1=1' )
        checkFail( '\\emptyset \\text{ for some } 1+1=2' )
        // You cannot declare a variable with a non-predicate attached
        checkFail( '\\text{For some }x, 1' )
        checkFail( '\\text{For some }x, 1\\vee 2' )
        checkFail( '\\text{For some }x, \\text{Let }y' )
        checkFail( '\\text{For some }x, \\text{Assume }B' )
        checkFail( '1~\\text{for some}~x' )
        checkFail( '1\\vee 2~\\text{for some}~x' )
        checkFail( '\\text{Let }y~\\text{for some}~x' )
        checkFail( '\\text{Assume }B~\\text{for some}~x' )
    } )

} )
