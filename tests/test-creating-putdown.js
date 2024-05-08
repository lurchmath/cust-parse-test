
import { expect } from 'chai'
import { converter } from '../example-converter.js'
import { AST } from '../ast.js'

const putdown = converter.languages.get( 'putdown' )

describe( 'Rendering JSON into putdown', () => {

    const check = ( json, putdownText ) => {
        expect(
            new AST( putdown, json ).toLanguage( putdown )
        ).to.equal( putdownText )
        global.log?.( 'JSON', json, 'putdown', putdownText )
    }

    it( 'can convert JSON numbers to putdown', () => {
        // non-negative integers
        check( [ 'number', '0' ], '0' )
        check( [ 'number', '453789' ], '453789' )
        check(
            [ 'number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        check(
            [ 'numbernegation', [ 'number', '453789' ] ],
            '(- 453789)'
        )
        check(
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ],
            '(- 99999999999999999999999999999999999999999)'
        )
        // non-negative decimals
        check( [ 'number', '0.0' ], '0.0' )
        check( [ 'number', '29835.6875940' ], '29835.6875940' )
        check( [ 'number', '653280458689.' ], '653280458689.' )
        check( [ 'number', '.000006327589' ], '.000006327589' )
        // negative decimals are the negation of positive decimals
        check(
            [ 'numbernegation', [ 'number', '29835.6875940' ] ],
            '(- 29835.6875940)'
        )
        check(
            [ 'numbernegation', [ 'number', '653280458689.' ] ],
            '(- 653280458689.)'
        )
        check(
            [ 'numbernegation', [ 'number', '.000006327589' ] ],
            '(- .000006327589)'
        )
    } )

    it( 'can convert any size variable name from JSON to putdown', () => {
        // one-letter names work
        check( [ 'numbervariable', 'x' ], 'x' )
        check( [ 'numbervariable', 'E' ], 'E' )
        check( [ 'numbervariable', 'q' ], 'q' )
        // multi-letter names work, too
        check( [ 'numbervariable', 'foo' ], 'foo' )
        check( [ 'numbervariable', 'bar' ], 'bar' )
        check( [ 'numbervariable', 'to' ], 'to' )
    } )

    it( 'can convert numeric constants from JSON to putdown', () => {
        check( 'infinity', 'infinity' )
        check( 'pi', 'pi' )
        check( 'eulersnumber', 'eulersnumber' )
    } )

    it( 'can convert exponentiation of atomics to putdown', () => {
        check(
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ],
            '(^ 1 2)'
        )
        check(
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ],
            '(^ e x)'
        )
        check(
            [ 'exponentiation', [ 'number', '1' ], 'infinity' ],
            '(^ 1 infinity)'
        )
    } )

    it( 'can convert atomic percentages and factorials to putdown', () => {
        check( [ 'percentage', [ 'number', '10' ] ], '(% 10)' )
        check( [ 'percentage', [ 'numbervariable', 't' ] ], '(% t)' )
        check( [ 'factorial', [ 'number', '100' ] ], '(! 100)' )
        check( [ 'factorial', [ 'numbervariable', 'J' ] ], '(! J)' )
    } )

    it( 'can convert division of atomics or factors to putdown', () => {
        // division of atomics
        check( [ 'division', [ 'number', '1' ], [ 'number', '2' ] ], '(/ 1 2)' )
        check(
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            '(/ x y)'
        )
        check(
            [ 'division', [ 'number', '0' ], 'infinity' ],
            '(/ 0 infinity)'
        )
        // division of factors
        check(
            [ 'division',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            '(/ (^ x 2) 3)'
        )
        check(
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '(/ 1 (^ e x))'
        )
        check(
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '(/ (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert multiplication of atomics or factors to putdown', () => {
        // multiplication of atomics
        check(
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ],
            '(* 1 2)'
        )
        check(
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            '(* x y)'
        )
        check(
            [ 'multiplication', [ 'number', '0' ], 'infinity' ],
            '(* 0 infinity)'
        )
        // multiplication of factors
        check(
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            '(* (^ x 2) 3)'
        )
        check(
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '(* 1 (^ e x))'
        )
        check(
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '(* (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert negations of atomics or factors to putdown', () => {
        check(
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ],
            '(* (- 1) 2)'
        )
        check(
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ],
            '(* x (- y))'
        )
        check(
            [ 'multiplication',
                [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '(* (- (^ x 2)) (- 3))'
        )
        check(
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ],
            '(- (- (- (- 1000))))'
        )
    } )

    it( 'can convert additions and subtractions to putdown', () => {
        check(
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ],
            '(+ x y)'
        )
        check(
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '(- 1 (- 3))'
        )
        check(
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], 'pi' ]
            ],
            '(+ (^ A B) (- C pi))'
        )
    } )

    it( 'can convert number expressions with groupers to putdown', () => {
        check(
            [ 'numbernegation',
                [ 'multiplication',
                    [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(- (* 1 2))'
        )
        check(
            [ 'factorial',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
            '(! (^ x 2))'
        )
        check(
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ],
                        [ 'numbernegation', [ 'number', '3' ] ] ]
            ],
            '(^ (- x) (* 2 (- 3)))'
        )
        check(
            [ 'exponentiation',
                [ 'numbernegation', [ 'number', '3' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(^ (- 3) (+ 1 2))'
        )
    } )

    it( 'can convert relations of numeric expressions to putdown', () => {
        check(
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ],
            '(> 1 2)'
        )
        check(
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ],
            '(< (- 1 2) (+ 1 2))'
        )
        check(
            [ 'logicnegation',
                [ 'equality', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(not (= 1 2))'
        )
        check(
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ],
            '(and (>= 2 1) (<= 2 3))'
        )
        check(
            [ 'binrelapp', 'divisibility', [ 'number', '7' ], [ 'number', '14' ] ],
            '(applyrel | 7 14)'
        )
        check(
            [ 'binrelapp', 'divisibility',
                [ 'numfuncapp', [ 'funcvariable', 'A' ], [ 'numbervariable', 'k' ] ],
                [ 'factorial', [ 'numbervariable', 'n' ] ] ],
            '(applyrel | (apply A k) (! n))'
        )
        check(
            [ 'binrelapp', 'genericrelation',
                [ 'subtraction', [ 'number', '1' ], [ 'numbervariable', 'k' ] ],
                [ 'addition', [ 'number', '1' ], [ 'numbervariable', 'k' ] ] ],
            '(applyrel ~ (- 1 k) (+ 1 k))'
        )
        check(
            [ 'binrelapp', 'approximately',
                [ 'number', '0.99' ], [ 'number', '1.01' ] ],
            '(applyrel ~~ 0.99 1.01)'
        )
    } )

    it( 'creates the canonical form for inequality', () => {
        check(
            [ 'inequality', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
            '(not (= f g))'
        )
    } )

    it( 'can convert propositional logic atomics to putdown', () => {
        check( 'logicaltrue', 'true' )
        check( 'logicalfalse', 'false' )
        check( 'contradiction', 'contradiction' )
        check( [ 'logicvariable', 'P' ], 'P' )
        check( [ 'logicvariable', 'a' ], 'a' )
        check( [ 'logicvariable', 'somethingLarge' ], 'somethingLarge' )
    } )

    it( 'can convert propositional logic conjuncts to putdown', () => {
        check(
            [ 'conjunction',
                'logicaltrue',
                'logicalfalse'
            ],
            '(and true false)'
        )
        check(
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', 'logicaltrue' ]
            ],
            '(and (not P) (not true))'
        )
        check(
            [ 'conjunction',
                [ 'conjunction',
                    [ 'logicvariable', 'a' ],
                    [ 'logicvariable', 'b' ]
                ],
                [ 'logicvariable', 'c' ]
            ],
            '(and (and a b) c)'
        )
    } )

    it( 'can convert propositional logic disjuncts to putdown', () => {
        check(
            [ 'disjunction',
                'logicaltrue',
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ],
            '(or true (not A))'
        )
        check(
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ],
            '(or (and P Q) (and Q P))'
        )
    } )

    it( 'can convert propositional logic conditionals to putdown', () => {
        check(
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            '(implies A (and Q (not P)))'
        )
        check(
            [ 'implication',
                [ 'implication',
                    [ 'disjunction',
                        [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ],
                        [ 'logicvariable', 'P' ]
                    ]
                ],
                [ 'logicvariable', 'T' ]
            ],
            '(implies (implies (or P Q) (and Q P)) T)'
        )
    } )

    it( 'can convert propositional logic biconditionals to putdown', () => {
        check(
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            '(iff A (and Q (not P)))'
        )
        check(
            [ 'implication',
                [ 'iff',
                    [ 'disjunction',
                        [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ],
                        [ 'logicvariable', 'P' ]
                    ]
                ],
                [ 'logicvariable', 'T' ]
            ],
            '(implies (iff (or P Q) (and Q P)) T)'
        )
    } )

    it( 'can convert propositional expressions with groupers to putdown', () => {
        check(
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'conjunction',
                    [ 'iff',
                        [ 'logicvariable', 'Q' ],
                        [ 'logicvariable', 'Q' ]
                    ],
                    [ 'logicvariable', 'P' ]
                ]
            ],
            '(or P (and (iff Q Q) P))'
        )
        check(
            [ 'logicnegation',
                [ 'iff',
                    'logicaltrue',
                    'logicalfalse'
                ]
            ],
            '(not (iff true false))'
        )
    } )

    it( 'can convert simple predicate logic expressions to putdown', () => {
        check(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ],
            '(forall (x , P))'
        )
        check(
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ],
            '(exists (t , (not Q)))'
        )
        check(
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication',
                    [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ],
            '(existsunique (k , (implies m n)))'
        )
    } )

    it( 'can convert finite and empty sets to putdown', () => {
        // { }
        check( 'emptyset', 'emptyset' )
        // { 1 }
        check(
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
            '(finiteset (elts 1))'
        )
        // { 1, 2 }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ],
            '(finiteset (elts 1 (elts 2)))'
        )
        // { 1, 2, 3 }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ],
            '(finiteset (elts 1 (elts 2 (elts 3))))'
        )
        // { { }, { } }
        check(
            [ 'finiteset', [ 'eltthenseq', 'emptyset',
                [ 'oneeltseq', 'emptyset' ] ] ],
            '(finiteset (elts emptyset (elts emptyset)))'
        )
        // { { { } } }
        check(
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', 'emptyset' ] ] ] ],
            '(finiteset (elts (finiteset (elts emptyset))))'
        )
        // { 3, x }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ],
            '(finiteset (elts 3 (elts x)))'
        )
        // { A cup B, A cap B }
        check(
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ],
            '(finiteset (elts (setuni A B) (elts (setint A B))))'
        )
        // { 1, 2, emptyset, K, P }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', 'emptyset',
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ],
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))'
        )
    } )

    it( 'can convert tuples and vectors to putdown', () => {
        // tuples containing at least two elements are valid
        check(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '(tuple (elts 5 (elts 6)))'
        )
        check(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '(tuple (elts 5 (elts (setuni A B) (elts k))))'
        )
        // vectors containing at least two numbers are valid
        check(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ],
            '(vector (elts 5 (elts 6)))'
        )
        check(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '(vector (elts 5 (elts (- 7) (elts k))))'
        )
        // tuples can contain other tuples
        check(
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))'
        )
    } )

    it( 'can convert simple set memberships and subsets to putdown', () => {
        check(
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ],
            '(in b B)'
        )
        check(
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '(in 2 (finiteset (elts 1 (elts 2))))'
        )
        check(
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ],
            '(in X (setuni a b))'
        )
        check(
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ],
            '(in (setuni A B) (setuni X Y))'
        )
        check(
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ],
            '(subset A (setcomp B))'
        )
        check(
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ],
            '(subseteq (setint u v) (setuni u v))'
        )
        check(
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))'
        )
        check(
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ],
            '(in p (setprod U V))'
        )
        check(
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ],
            '(in q (setuni (setcomp U) (setprod V W)))'
        )
        check(
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '(in (tuple (elts a (elts b))) (setprod A B))'
        )
        check(
            [ 'nounisin',
                [ 'vector',
                    [ 'numthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'onenumseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '(in (vector (elts a (elts b))) (setprod A B))'
        )
    } )

    it( 'creates the canonical form for "notin" notation', () => {
        check(
            [ 'nounisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ],
            '(not (in a A))'
        )
        check(
            [ 'logicnegation', [ 'nounisin', 'emptyset', 'emptyset' ] ],
            '(not (in emptyset emptyset))'
        )
        check(
            [ 'nounisnotin',
                [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
            ],
            '(not (in (- 3 5) (setint K P)))'
        )
    } )

    it( 'can convert to putdown sentences built from various relations', () => {
        check(
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ],
            '(or P (in b B))'
        )
        check(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ],
            '(forall (x , (in x X)))'
        )
        check(
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ],
            '(and (subseteq A B) (subseteq B A))'
        )
        check(
            [ 'equality',
                [ 'numbervariable', 'R' ], // it guesses wrong, oh well
                [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '(= R (setprod A B))'
        )
        check(
            [ 'universal',
                [ 'numbervariable', 'n' ],
                [ 'binrelapp', 'divisibility',
                    [ 'numbervariable', 'n' ],
                    [ 'factorial', [ 'numbervariable', 'n' ] ] ] ],
            '(forall (n , (applyrel | n (! n))))'
        )
        check(
            [ 'implication',
                [ 'binrelapp', 'genericrelation',
                    [ 'numbervariable', 'a' ], [ 'numbervariable', 'b' ] ],
                [ 'binrelapp', 'genericrelation',
                    [ 'numbervariable', 'b' ], [ 'numbervariable', 'a' ] ] ],
            '(implies (applyrel ~ a b) (applyrel ~ b a))'
        )
    } )

    it( 'can create putdown notation related to functions', () => {
        check(
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
            '(function f A B)'
        )
        check(
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ],
            '(not (function F (setuni X Y) Z))'
        )
        check(
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ],
            '(function (compose f g) A C)'
        )
        check(
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
            '(apply f x)'
        )
        check(
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ],
            '(apply (inverse f) (apply (inverse g) 10))'
        )
        check(
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ],
            '(apply E (setcomp L))'
        )
        check(
            [ 'intersection',
                'emptyset',
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ],
            '(setint emptyset (apply f 2))'
        )
        check(
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ],
            '(and (apply P e) (apply Q (+ 3 b)))'
        )
        check(
            [ 'funcequality',
                [ 'funcvariable', 'F' ],
                [ 'funccomp',
                    [ 'funcvariable', 'G' ],
                    [ 'funcinverse', [ 'funcvariable', 'H' ] ] ] ],
            '(= F (compose G (inverse H)))'
        )
    } )

    it( 'can express trigonometric functions correctly', () => {
        check(
            [ 'numfuncapp', 'sinfunc', [ 'numbervariable', 'x' ] ],
            '(apply sin x)'
        )
        check(
            [ 'numfuncapp', 'cosfunc',
                [ 'multiplication', 'pi', [ 'numbervariable', 'x' ] ] ],
            '(apply cos (* pi x))'
        )
        check(
            [ 'numfuncapp', 'tanfunc', [ 'numbervariable', 't' ] ],
            '(apply tan t)'
        )
        check(
            [ 'division', [ 'number', '1' ],
                [ 'numfuncapp', 'cotfunc', 'pi' ] ],
            '(/ 1 (apply cot pi))'
        )
        check(
            [ 'equality',
                [ 'numfuncapp', 'secfunc', [ 'numbervariable', 'y' ] ],
                [ 'numfuncapp', 'cscfunc', [ 'numbervariable', 'y' ] ] ],
            '(= (apply sec y) (apply csc y))'
        )
    } )

    it( 'can express logarithms correctly', () => {
        check(
            [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ],
            '(apply log n)'
        )
        check(
            [ 'addition',
                [ 'number', '1' ],
                [ 'prefixfuncapp', 'naturallog', [ 'numbervariable', 'x' ] ] ],
            '(+ 1 (apply ln x))'
        )
        check(
            [ 'prefixfuncapp',
                [ 'logwithbase', [ 'number', '2' ] ], [ 'number', '1024' ] ],
            '(apply (logbase 2) 1024)'
        )
        check(
            [ 'division',
                [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ],
                [ 'prefixfuncapp', 'logarithm',
                    [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ] ] ],
            '(/ (apply log n) (apply log (apply log n)))'
        )
    } )

    it( 'can express equivalence classes and expressions that use them', () => {
        check(
            [ 'equivclass', [ 'number', '1' ], 'approximately' ],
            '(eqclass 1 ~~)'
        )
        check(
            [ 'equivclass',
                [ 'addition', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                'genericrelation' ],
            '(eqclass (+ x 2) ~)'
        )
        check(
            [ 'union',
                [ 'equivclass', [ 'number', '1' ], 'approximately' ],
                [ 'equivclass', [ 'number', '2' ], 'approximately' ] ],
            '(setuni (eqclass 1 ~~) (eqclass 2 ~~))'
        )
        check(
            [ 'nounisin', [ 'number', '7' ],
                [ 'equivclass', [ 'number', '7' ], 'genericrelation' ] ],
            '(in 7 (eqclass 7 ~))'
        )
        check(
            [ 'equivclass', [ 'funcvariable', 'P' ], 'genericrelation' ],
            '(eqclass P ~)'
        )
    } )

    it( 'can express equivalence and classes mod a number', () => {
        check(
            [ 'equivmodulo',
                [ 'number', '5' ], [ 'number', '11' ], [ 'number', '3' ] ],
            '(=mod 5 11 3)'
        )
        check(
            [ 'equivmodulo', [ 'numbervariable', 'k' ],
                [ 'numbervariable', 'm' ], [ 'numbervariable', 'n' ] ],
            '(=mod k m n)'
        )
        check(
            [ 'subset', 'emptyset',
                [ 'eqmodclass', [ 'numbernegation', [ 'number', '1' ] ],
                    [ 'number', '10' ] ] ],
            '(subset emptyset (modclass (- 1) 10))'
        )
    } )

} )
