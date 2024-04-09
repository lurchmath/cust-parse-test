
import { expect } from 'chai'
import { converter } from '../example-converter.js'

const putdown = converter.languages.get( 'putdown' )

describe( 'Parsing putdown', () => {

    const checkPutdownJson = ( putdownText, json ) => {
        expect( putdown.parse( putdownText ).toJSON() ).to.eql( json )
        global.log?.( 'putdown', putdownText, 'JSON', json )
    }
    const checkPutdownJsonFail = ( putdownText ) => {
        expect( putdown.parse( putdownText ) ).to.be.undefined
        global.log?.( 'putdown', putdownText, 'JSON', null )
    }

    it( 'can convert putdown numbers to JSON', () => {
        // non-negative integers
        checkPutdownJson(
            '0',
            [ 'number', '0' ]
        )
        checkPutdownJson(
            '453789',
            [ 'number', '453789' ]
        )
        checkPutdownJson(
            '99999999999999999999999999999999999999999',
            [ 'number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        checkPutdownJson(
            '(- 453789)',
            [ 'numbernegation', [ 'number', '453789' ] ]
        )
        checkPutdownJson(
            '(- 99999999999999999999999999999999999999999)',
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ]
        )
        // non-negative decimals
        checkPutdownJson(
            '0.0',
            [ 'number', '0.0' ]
        )
        checkPutdownJson(
            '29835.6875940',
            [ 'number', '29835.6875940' ]
        )
        checkPutdownJson(
            '653280458689.',
            [ 'number', '653280458689.' ]
        )
        checkPutdownJson(
            '.000006327589',
            [ 'number', '.000006327589' ]
        )
        // negative decimals are the negation of positive decimals
        checkPutdownJson(
            '(- 29835.6875940)',
            [ 'numbernegation', [ 'number', '29835.6875940' ] ]
        )
        checkPutdownJson(
            '(- 653280458689.)',
            [ 'numbernegation', [ 'number', '653280458689.' ] ]
        )
        checkPutdownJson(
            '(- .000006327589)',
            [ 'numbernegation', [ 'number', '.000006327589' ] ]
        )
    } )

    it( 'can convert any size variable name to JSON', () => {
        // one-letter names work, and the least possible parsing of them (for
        // many possible parsings, using alphabetical ordering) is as function
        // variables:
        checkPutdownJson(
            'x',
            [ 'funcvariable', 'x' ]
        )
        checkPutdownJson(
            'E',
            [ 'funcvariable', 'E' ]
        )
        checkPutdownJson(
            'q',
            [ 'funcvariable', 'q' ]
        )
        // multi-letter names don't work; it just does nothing with them
        // because it can't find any concept to which they belong
        checkPutdownJsonFail( 'foo' )
        checkPutdownJsonFail( 'bar' )
        checkPutdownJsonFail( 'to' )
    } )

    it( 'can convert infinity from putdown to JSON', () => {
        checkPutdownJson(
            'infinity',
            [ 'infinity' ]
        )
    } )

    it( 'can convert exponentiation of atomics to JSON', () => {
        checkPutdownJson(
            '(^ 1 2)',
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkPutdownJson(
            '(^ e x)',
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
        )
        checkPutdownJson(
            '(^ 1 infinity)',
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ]
        )
    } )

    it( 'can convert atomic percentages and factorials to JSON', () => {
        checkPutdownJson(
            '(% 10)',
            [ 'percentage', [ 'number', '10' ] ]
        )
        checkPutdownJson(
            '(% t)',
            [ 'percentage', [ 'numbervariable', 't' ] ]
        )
        checkPutdownJson(
            '(! 6)',
            [ 'factorial', [ 'number', '6' ] ]
        )
        checkPutdownJson(
            '(! n)',
            [ 'factorial', [ 'numbervariable', 'n' ] ]
        )
    } )

    it( 'can convert division of atomics or factors to JSON', () => {
        // division of atomics
        checkPutdownJson(
            '(/ 1 2)',
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkPutdownJson(
            '(/ x y)',
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        checkPutdownJson(
            '(/ 0 infinity)',
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // division of factors
        checkPutdownJson(
            '(/ (^ x 2) 3)',
            [ 'division',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        checkPutdownJson(
            '(/ 1 (^ e x))',
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        checkPutdownJson(
            '(/ (% 10) (^ 2 100))',
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can convert multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        checkPutdownJson(
            '(* 1 2)',
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkPutdownJson(
            '(* x y)',
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        checkPutdownJson(
            '(* 0 infinity)',
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // multiplication of factors
        checkPutdownJson(
            '(* (^ x 2) 3)',
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        checkPutdownJson(
            '(* 1 (^ e x))',
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        checkPutdownJson(
            '(* (% 10) (^ 2 100))',
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can convert negations of atomics or factors to JSON', () => {
        checkPutdownJson(
            '(* (- 1) 2)',
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ]
        )
        checkPutdownJson(
            '(* x (- y))',
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ]
        )
        checkPutdownJson(
            '(* (- (^ x 2)) (- 3))',
            [ 'multiplication',
                [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        checkPutdownJson(
            '(- (- (- (- 1000))))',
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert additions and subtractions to JSON', () => {
        checkPutdownJson(
            '(+ x y)',
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ]
        )
        checkPutdownJson(
            '(- 1 (- 3))',
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        checkPutdownJson(
            '(+ (^ A B) (- C D))',
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ]
            ]
        )
    } )

    it( 'can convert number exprs that normally require groupers to JSON', () => {
        checkPutdownJson(
            '(- (* 1 2))',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        checkPutdownJson(
            '(! (^ x 2))',
            [ 'factorial',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ]
        )
        checkPutdownJson(
            '(^ (- x) (* 2 (- 3)))',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        checkPutdownJson(
            '(^ (- 3) (+ 1 2))',
            [ 'exponentiation',
                [ 'numbernegation', [ 'number', '3' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
    } )

    it( 'can convert relations of numeric expressions to JSON', () => {
        checkPutdownJson(
            '(> 1 2)',
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ]
        )
        checkPutdownJson(
            '(< (- 1 2) (+ 1 2))',
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ]
        )
        checkPutdownJson(
            '(not (= 1 2))',
            [ 'logicnegation',
                [ 'equality', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        checkPutdownJson(
            '(and (>= 2 1) (<= 2 3))',
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ]
        )
    } )

    it( 'does not undo the canonical form for inequality', () => {
        checkPutdownJson(
            '(not (= x y))',
            [ 'logicnegation',
                [ 'equality',
                    [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ] ]
        )
    } )

    it( 'can convert propositional logic atomics to JSON', () => {
        checkPutdownJson(
            'true',
            [ 'logicaltrue' ]
        )
        checkPutdownJson(
            'false',
            [ 'logicalfalse' ]
        )
        checkPutdownJson(
            'contradiction',
            [ 'contradiction' ]
        )
        // Not checking variables here, because their meaning is ambiguous
    } )

    it( 'can convert propositional logic conjuncts to JSON', () => {
        checkPutdownJson(
            '(and true false)',
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ]
        )
        checkPutdownJson(
            '(and (not P) (not true))',
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ]
        )
        checkPutdownJson(
            '(and (and a b) c)',
            [ 'conjunction',
                [ 'conjunction',
                    [ 'logicvariable', 'a' ],
                    [ 'logicvariable', 'b' ]
                ],
                [ 'logicvariable', 'c' ]
            ]
        )
    } )

    it( 'can convert propositional logic disjuncts to JSON', () => {
        checkPutdownJson(
            '(or true (not A))',
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ]
        )
        checkPutdownJson(
            '(or (and P Q) (and Q P))',
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can convert propositional logic conditionals to JSON', () => {
        checkPutdownJson(
            '(implies A (and Q (not P)))',
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        checkPutdownJson(
            '(implies (implies (or P Q) (and Q P)) T)',
            [ 'implication',
                [ 'implication',
                    [ 'disjunction',
                        [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
                ],
                [ 'logicvariable', 'T' ]
            ]
        )
    } )

    it( 'can convert propositional logic biconditionals to JSON', () => {
        checkPutdownJson(
            '(iff A (and Q (not P)))',
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        checkPutdownJson(
            '(implies (iff (or P Q) (and Q P)) T)',
            [ 'implication',
                [ 'iff',
                    [ 'disjunction',
                        [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
                ],
                [ 'logicvariable', 'T' ]
            ]
        )
    } )

    it( 'can convert propositional expressions with groupers to JSON', () => {
        checkPutdownJson(
            '(or P (and (iff Q Q) P))',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'conjunction',
                    [ 'iff', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'Q' ] ],
                    [ 'logicvariable', 'P' ]
                ]
            ]
        )
        checkPutdownJson(
            '(not (iff true false))',
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ]
        )
    } )

    it( 'can convert simple predicate logic expressions to JSON', () => {
        // const rules = converter.languages.get( 'putdown' ).grammar.rules
        // Object.keys( rules ).map( name =>
        //     console.log( name, rules[name].map( rhs => rhs.slice() ) ) )
        checkPutdownJson(
            '(forall (x , P))',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ]
        )
        checkPutdownJson(
            '(exists (t , (not Q)))',
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ]
        )
        checkPutdownJson(
            '(existsunique (k , (implies m n)))',
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication', [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ]
        )
    } )

    it( 'can convert finite and empty sets to JSON', () => {
        // { }
        checkPutdownJson( 'emptyset', [ 'emptyset' ] )
        // { 1 }
        checkPutdownJson(
            '(finiteset (elts 1))',
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ]
        )
        // { 1, 2 }
        checkPutdownJson(
            '(finiteset (elts 1 (elts 2)))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ]
        )
        // { 1, 2, 3 }
        checkPutdownJson(
            '(finiteset (elts 1 (elts 2 (elts 3))))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ]
        )
        // { { }, { } }
        checkPutdownJson(
            '(finiteset (elts emptyset (elts emptyset)))',
            [ 'finiteset', [ 'eltthenseq', [ 'emptyset' ],
                [ 'oneeltseq', [ 'emptyset' ] ] ] ]
        )
        // { { { } } }
        checkPutdownJson(
            '(finiteset (elts (finiteset (elts emptyset))))',
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', [ 'emptyset' ] ] ] ] ]
        )
        // { 3, x }
        checkPutdownJson(
            '(finiteset (elts 3 (elts x)))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ]
        )
        // { A cup B, A cap B }
        checkPutdownJson(
            '(finiteset (elts (setuni A B) (elts (setint A B))))',
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ]
        )
        // { 1, 2, emptyset, K, P }
        checkPutdownJson(
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', [ 'emptyset' ],
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ]
        )
    } )

    it( 'can convert tuples and vectors to JSON', () => {
        // tuples containing at least two elements are valid
        checkPutdownJson(
            '(tuple (elts 5 (elts 6)))',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        checkPutdownJson(
            '(tuple (elts 5 (elts (setuni A B) (elts k))))',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // vectors containing at least two numbers are valid
        checkPutdownJson(
            '(vector (elts 5 (elts 6)))',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ]
        )
        checkPutdownJson(
            '(vector (elts 5 (elts (- 7) (elts k))))',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // tuples and vectors containing zero or one element are not valid
        checkPutdownJsonFail( '(tuple)' )
        checkPutdownJsonFail( '(tuple (elts))' )
        checkPutdownJsonFail( '(tuple (elts 3))' )
        checkPutdownJsonFail( '(vector)' )
        checkPutdownJsonFail( '(vector (elts))' )
        checkPutdownJsonFail( '(vector (elts 3))' )
        // tuples can contain other tuples
        checkPutdownJson(
            '(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))',
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        // vectors can contain only numbers
        checkPutdownJsonFail( '(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))' )
        checkPutdownJsonFail( '(vector (elts (vector (elts 1 (elts 2))) (elts 6)))' )
        checkPutdownJsonFail( '(vector (elts (setuni A B) (elts 6)))' )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        checkPutdownJson(
            '(in b B)',
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ]
        )
        checkPutdownJson(
            '(in 2 (finiteset (elts 1 (elts 2))))',
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        checkPutdownJson(
            '(in X (setuni a b))',
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ]
        )
        checkPutdownJson(
            '(in (setuni A B) (setuni X Y))',
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ]
        )
        checkPutdownJson(
            '(subset A (setcomp B))',
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ]
        )
        checkPutdownJson(
            '(subseteq (setint u v) (setuni u v))',
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ]
        )
        checkPutdownJson(
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))',
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        checkPutdownJson(
            '(in p (setprod U V))',
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ]
        )
        checkPutdownJson(
            '(in q (setuni (setcomp U) (setprod V W)))',
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ]
        )
        checkPutdownJson(
            '(in (tuple (elts a (elts b))) (setprod A B))',
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
        checkPutdownJson(
            '(in (vector (elts a (elts b))) (setprod A B))',
            [ 'nounisin',
                [ 'vector',
                    [ 'numthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'onenumseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
    } )

    it( 'does not undo the canonical form for "notin" notation', () => {
        checkPutdownJson(
            '(not (in a A))',
            [ 'logicnegation',
                [ 'nounisin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ] ]
        )
        checkPutdownJson(
            '(not (in emptyset emptyset))',
            [ 'logicnegation', [ 'nounisin', [ 'emptyset' ], [ 'emptyset' ] ] ]
        )
        checkPutdownJson(
            '(not (in (- 3 5) (setint K P)))',
            [ 'logicnegation',
                [ 'nounisin',
                    [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                    [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
                ]
            ]
        )
    } )

    it( 'can parse to JSON sentences built from set operators', () => {
        checkPutdownJson(
            '(or P (in b B))',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ]
        )
        checkPutdownJson(
            '(forall (x , (in x X)))',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ]
        )
        checkPutdownJson(
            '(and (subseteq A B) (subseteq B A))',
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ]
        )
        checkPutdownJson(
            '(= R (setprod A B))',
            [ 'equality',
                [ 'numbervariable', 'R' ], // it guesses wrong, oh well
                [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
    } )

    it( 'can parse notation related to functions', () => {
        checkPutdownJson(
            '(function f A B)',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        checkPutdownJson(
            '(not (function F (setuni X Y) Z))',
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ]
        )
        checkPutdownJson(
            '(function (compose f g) A C)',
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ]
        )
        checkPutdownJson(
            '(apply f x)',
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ]
        )
        checkPutdownJson(
            '(apply (inverse f) (apply (inverse g) 10))',
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ]
        )
        checkPutdownJson(
            '(apply E (setcomp L))',
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ]
        )
        checkPutdownJson(
            '(setint emptyset (apply f 2))',
            [ 'intersection',
                [ 'emptyset' ],
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ]
        )
        checkPutdownJson(
            '(and (apply P e) (apply Q (+ 3 b)))',
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ]
        )
        checkPutdownJson(
            '(= (apply f x) 3)',
            [ 'equality',
                [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
                [ 'number', '3' ] ]
        )
        checkPutdownJson(
            '(= F (compose G (inverse H)))',
            [ 'funcequality',
                [ 'funcvariable', 'F' ],
                [ 'funccomp',
                    [ 'funcvariable', 'G' ],
                    [ 'funcinverse', [ 'funcvariable', 'H' ] ] ] ]
        )
    } )

} )
