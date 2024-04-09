
import { expect } from 'chai'
import { converter } from '../example-converter.js'
import { AST } from '../ast.js'

const putdown = converter.languages.get( 'putdown' )

describe( 'Rendering JSON into putdown', () => {

    const checkJsonPutdown = ( json, putdownText ) => {
        expect(
            new AST( putdown, ...json ).toLanguage( putdown )
        ).to.equal( putdownText )
        global.log?.( 'JSON', json, 'putdown', putdownText )
    }

    it( 'can convert JSON numbers to putdown', () => {
        // non-negative integers
        checkJsonPutdown(
            [ 'number', '0' ],
            '0'
        )
        checkJsonPutdown(
            [ 'number', '453789' ],
            '453789'
        )
        checkJsonPutdown(
            [ 'number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '453789' ] ],
            '(- 453789)'
        )
        checkJsonPutdown(
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ],
            '(- 99999999999999999999999999999999999999999)'
        )
        // non-negative decimals
        checkJsonPutdown(
            [ 'number', '0.0' ],
            '0.0'
        )
        checkJsonPutdown(
            [ 'number', '29835.6875940' ],
            '29835.6875940'
        )
        checkJsonPutdown(
            [ 'number', '653280458689.' ],
            '653280458689.'
        )
        checkJsonPutdown(
            [ 'number', '.000006327589' ],
            '.000006327589'
        )
        // negative decimals are the negation of positive decimals
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '29835.6875940' ] ],
            '(- 29835.6875940)'
        )
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '653280458689.' ] ],
            '(- 653280458689.)'
        )
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '.000006327589' ] ],
            '(- .000006327589)'
        )
    } )

    it( 'can convert any size variable name from JSON to putdown', () => {
        // one-letter names work
        checkJsonPutdown(
            [ 'numbervariable', 'x' ],
            'x'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'E' ],
            'E'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'q' ],
            'q'
        )
        // multi-letter names work, too
        checkJsonPutdown(
            [ 'numbervariable', 'foo' ],
            'foo'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'bar' ],
            'bar'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'to' ],
            'to'
        )
    } )

    it( 'can convert infinity from JSON to putdown', () => {
        checkJsonPutdown(
            [ 'infinity' ],
            'infinity'
        )
    } )

    it( 'can convert exponentiation of atomics to putdown', () => {
        checkJsonPutdown(
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ],
            '(^ 1 2)'
        )
        checkJsonPutdown(
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ],
            '(^ e x)'
        )
        checkJsonPutdown(
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ],
            '(^ 1 infinity)'
        )
    } )

    it( 'can convert atomic percentages and factorials to putdown', () => {
        checkJsonPutdown(
            [ 'percentage', [ 'number', '10' ] ],
            '(% 10)'
        )
        checkJsonPutdown(
            [ 'percentage', [ 'numbervariable', 't' ] ],
            '(% t)'
        )
        checkJsonPutdown(
            [ 'factorial', [ 'number', '100' ] ],
            '(! 100)'
        )
        checkJsonPutdown(
            [ 'factorial', [ 'numbervariable', 'J' ] ],
            '(! J)'
        )
    } )

    it( 'can convert division of atomics or factors to putdown', () => {
        // division of atomics
        checkJsonPutdown(
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ],
            '(/ 1 2)'
        )
        checkJsonPutdown(
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            '(/ x y)'
        )
        checkJsonPutdown(
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ],
            '(/ 0 infinity)'
        )
        // division of factors
        checkJsonPutdown(
            [ 'division',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            '(/ (^ x 2) 3)'
        )
        checkJsonPutdown(
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '(/ 1 (^ e x))'
        )
        checkJsonPutdown(
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '(/ (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert multiplication of atomics or factors to putdown', () => {
        // multiplication of atomics
        checkJsonPutdown(
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ],
            '(* 1 2)'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            '(* x y)'
        )
        checkJsonPutdown(
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ],
            '(* 0 infinity)'
        )
        // multiplication of factors
        checkJsonPutdown(
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            '(* (^ x 2) 3)'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '(* 1 (^ e x))'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '(* (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert negations of atomics or factors to putdown', () => {
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ],
            '(* (- 1) 2)'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ],
            '(* x (- y))'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '(* (- (^ x 2)) (- 3))'
        )
        checkJsonPutdown(
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ],
            '(- (- (- (- 1000))))'
        )
    } )

    it( 'can convert additions and subtractions to putdown', () => {
        checkJsonPutdown(
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ],
            '(+ x y)'
        )
        checkJsonPutdown(
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '(- 1 (- 3))'
        )
        checkJsonPutdown(
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ]
            ],
            '(+ (^ A B) (- C D))'
        )
    } )

    it( 'can convert number expressions with groupers to putdown', () => {
        checkJsonPutdown(
            [ 'numbernegation',
                [ 'multiplication',
                    [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(- (* 1 2))'
        )
        checkJsonPutdown(
            [ 'factorial',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
            '(! (^ x 2))'
        )
        checkJsonPutdown(
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ],
                        [ 'numbernegation', [ 'number', '3' ] ] ]
            ],
            '(^ (- x) (* 2 (- 3)))'
        )
        checkJsonPutdown(
            [ 'exponentiation',
                [ 'numbernegation', [ 'number', '3' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(^ (- 3) (+ 1 2))'
        )
    } )

    it( 'can convert relations of numeric expressions to putdown', () => {
        checkJsonPutdown(
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ],
            '(> 1 2)'
        )
        checkJsonPutdown(
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ],
            '(< (- 1 2) (+ 1 2))'
        )
        checkJsonPutdown(
            [ 'logicnegation',
                [ 'equality', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(not (= 1 2))'
        )
        checkJsonPutdown(
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ],
            '(and (>= 2 1) (<= 2 3))'
        )
    } )

    it( 'creates the canonical form for inequality', () => {
        checkJsonPutdown(
            [ 'inequality', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
            '(not (= f g))'
        )
    } )

    it( 'can convert propositional logic atomics to putdown', () => {
        checkJsonPutdown(
            [ 'logicaltrue' ],
            'true'
        )
        checkJsonPutdown(
            [ 'logicalfalse' ],
            'false'
        )
        checkJsonPutdown(
            [ 'contradiction' ],
            'contradiction'
        )
        checkJsonPutdown(
            [ 'logicvariable', 'P' ],
            'P'
        )
        checkJsonPutdown(
            [ 'logicvariable', 'a' ],
            'a'
        )
        checkJsonPutdown(
            [ 'logicvariable', 'somethingLarge' ],
            'somethingLarge'
        )
    } )

    it( 'can convert propositional logic conjuncts to putdown', () => {
        checkJsonPutdown(
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ],
            '(and true false)'
        )
        checkJsonPutdown(
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ],
            '(and (not P) (not true))'
        )
        checkJsonPutdown(
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
        checkJsonPutdown(
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ],
            '(or true (not A))'
        )
        checkJsonPutdown(
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ],
            '(or (and P Q) (and Q P))'
        )
    } )

    it( 'can convert propositional logic conditionals to putdown', () => {
        checkJsonPutdown(
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            '(implies A (and Q (not P)))'
        )
        checkJsonPutdown(
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
        checkJsonPutdown(
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            '(iff A (and Q (not P)))'
        )
        checkJsonPutdown(
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
        checkJsonPutdown(
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
        checkJsonPutdown(
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ],
            '(not (iff true false))'
        )
    } )

    it( 'can convert simple predicate logic expressions to putdown', () => {
        checkJsonPutdown(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ],
            '(forall (x , P))'
        )
        checkJsonPutdown(
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ],
            '(exists (t , (not Q)))'
        )
        checkJsonPutdown(
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
        checkJsonPutdown( [ 'emptyset' ], 'emptyset' )
        // { 1 }
        checkJsonPutdown(
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
            '(finiteset (elts 1))'
        )
        // { 1, 2 }
        checkJsonPutdown(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ],
            '(finiteset (elts 1 (elts 2)))'
        )
        // { 1, 2, 3 }
        checkJsonPutdown(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ],
            '(finiteset (elts 1 (elts 2 (elts 3))))'
        )
        // { { }, { } }
        checkJsonPutdown(
            [ 'finiteset', [ 'eltthenseq', [ 'emptyset' ],
                [ 'oneeltseq', [ 'emptyset' ] ] ] ],
            '(finiteset (elts emptyset (elts emptyset)))'
        )
        // { { { } } }
        checkJsonPutdown(
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', [ 'emptyset' ] ] ] ] ],
            '(finiteset (elts (finiteset (elts emptyset))))'
        )
        // { 3, x }
        checkJsonPutdown(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ],
            '(finiteset (elts 3 (elts x)))'
        )
        // { A cup B, A cap B }
        checkJsonPutdown(
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ],
            '(finiteset (elts (setuni A B) (elts (setint A B))))'
        )
        // { 1, 2, emptyset, K, P }
        checkJsonPutdown(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', [ 'emptyset' ],
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ],
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))'
        )
    } )

    it( 'can convert tuples and vectors to putdown', () => {
        // tuples containing at least two elements are valid
        checkJsonPutdown(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '(tuple (elts 5 (elts 6)))'
        )
        checkJsonPutdown(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '(tuple (elts 5 (elts (setuni A B) (elts k))))'
        )
        // vectors containing at least two numbers are valid
        checkJsonPutdown(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ],
            '(vector (elts 5 (elts 6)))'
        )
        checkJsonPutdown(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '(vector (elts 5 (elts (- 7) (elts k))))'
        )
        // tuples can contain other tuples
        checkJsonPutdown(
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))'
        )
    } )

    it( 'can convert simple set memberships and subsets to putdown', () => {
        checkJsonPutdown(
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ],
            '(in b B)'
        )
        checkJsonPutdown(
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '(in 2 (finiteset (elts 1 (elts 2))))'
        )
        checkJsonPutdown(
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ],
            '(in X (setuni a b))'
        )
        checkJsonPutdown(
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ],
            '(in (setuni A B) (setuni X Y))'
        )
        checkJsonPutdown(
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ],
            '(subset A (setcomp B))'
        )
        checkJsonPutdown(
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ],
            '(subseteq (setint u v) (setuni u v))'
        )
        checkJsonPutdown(
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))'
        )
        checkJsonPutdown(
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ],
            '(in p (setprod U V))'
        )
        checkJsonPutdown(
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ],
            '(in q (setuni (setcomp U) (setprod V W)))'
        )
        checkJsonPutdown(
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '(in (tuple (elts a (elts b))) (setprod A B))'
        )
        checkJsonPutdown(
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
        checkJsonPutdown(
            [ 'nounisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ],
            '(not (in a A))'
        )
        checkJsonPutdown(
            [ 'logicnegation', [ 'nounisin', [ 'emptyset' ], [ 'emptyset' ] ] ],
            '(not (in emptyset emptyset))'
        )
        checkJsonPutdown(
            [ 'nounisnotin',
                [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
            ],
            '(not (in (- 3 5) (setint K P)))'
        )
    } )

    it( 'can convert to putdown sentences built from set operators', () => {
        checkJsonPutdown(
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ],
            '(or P (in b B))'
        )
        checkJsonPutdown(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ],
            '(forall (x , (in x X)))'
        )
        checkJsonPutdown(
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ],
            '(and (subseteq A B) (subseteq B A))'
        )
        checkJsonPutdown(
            [ 'equality',
                [ 'numbervariable', 'R' ], // it guesses wrong, oh well
                [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '(= R (setprod A B))'
        )
    } )

    it( 'can create putdown notation related to functions', () => {
        checkJsonPutdown(
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
            '(function f A B)'
        )
        checkJsonPutdown(
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ],
            '(not (function F (setuni X Y) Z))'
        )
        checkJsonPutdown(
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ],
            '(function (compose f g) A C)'
        )
        checkJsonPutdown(
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
            '(apply f x)'
        )
        checkJsonPutdown(
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ],
            '(apply (inverse f) (apply (inverse g) 10))'
        )
        checkJsonPutdown(
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ],
            '(apply E (setcomp L))'
        )
        checkJsonPutdown(
            [ 'intersection',
                [ 'emptyset' ],
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ],
            '(setint emptyset (apply f 2))'
        )
        checkJsonPutdown(
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ],
            '(and (apply P e) (apply Q (+ 3 b)))'
        )
        checkJsonPutdown(
            [ 'funcequality',
                [ 'funcvariable', 'F' ],
                [ 'funccomp',
                    [ 'funcvariable', 'G' ],
                    [ 'funcinverse', [ 'funcvariable', 'H' ] ] ] ],
            '(= F (compose G (inverse H)))'
        )
    } )

} )
