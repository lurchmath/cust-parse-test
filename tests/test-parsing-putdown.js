
import { expect } from 'chai'
import { converter } from '../example-converter.js'

const putdown = converter.languages.get( 'putdown' )

describe( 'Parsing putdown', () => {

    const check = ( putdownText, json ) => {
        expect( putdown.parse( putdownText ).toJSON() ).to.eql( json )
        global.log?.( 'putdown', putdownText, 'JSON', json )
    }
    const checkFail = ( putdownText ) => {
        expect( putdown.parse( putdownText ) ).to.be.undefined
        global.log?.( 'putdown', putdownText, 'JSON', null )
    }

    it( 'can convert putdown numbers to JSON', () => {
        // non-negative integers
        check( '0', [ 'number', '0' ] )
        check( '453789', [ 'number', '453789' ] )
        check(
            '99999999999999999999999999999999999999999',
            [ 'number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        check( '(- 453789)', [ 'numbernegation', [ 'number', '453789' ] ] )
        check(
            '(- 99999999999999999999999999999999999999999)',
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ]
        )
        // non-negative decimals
        check( '0.0', [ 'number', '0.0' ] )
        check( '29835.6875940', [ 'number', '29835.6875940' ] )
        check( '653280458689.', [ 'number', '653280458689.' ] )
        check( '.000006327589', [ 'number', '.000006327589' ] )
        // negative decimals are the negation of positive decimals
        check(
            '(- 29835.6875940)',
            [ 'numbernegation', [ 'number', '29835.6875940' ] ]
        )
        check(
            '(- 653280458689.)',
            [ 'numbernegation', [ 'number', '653280458689.' ] ]
        )
        check(
            '(- .000006327589)',
            [ 'numbernegation', [ 'number', '.000006327589' ] ]
        )
    } )

    it( 'can convert any size variable name to JSON', () => {
        // one-letter names work, and the least possible parsing of them (for
        // many possible parsings, using alphabetical ordering) is as function
        // variables:
        check( 'x', [ 'funcvariable', 'x' ] )
        check( 'E', [ 'funcvariable', 'E' ] )
        check( 'q', [ 'funcvariable', 'q' ] )
        // multi-letter names don't work; it just does nothing with them
        // because it can't find any concept to which they belong
        checkFail( 'foo' )
        checkFail( 'bar' )
        checkFail( 'to' )
    } )

    it( 'can convert numeric constants from putdown to JSON', () => {
        check( 'infinity', [ 'infinity' ] )
        check( 'pi', [ 'pi' ] )
        check( 'eulersnumber', [ 'eulersnumber' ] )
    } )

    it( 'can convert exponentiation of atomics to JSON', () => {
        check(
            '(^ 1 2)',
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            '(^ e x)',
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
        )
        check(
            '(^ 1 infinity)',
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ]
        )
    } )

    it( 'can convert atomic percentages and factorials to JSON', () => {
        check( '(% 10)', [ 'percentage', [ 'number', '10' ] ] )
        check( '(% t)', [ 'percentage', [ 'numbervariable', 't' ] ] )
        check( '(! 6)', [ 'factorial', [ 'number', '6' ] ] )
        check( '(! n)', [ 'factorial', [ 'numbervariable', 'n' ] ] )
    } )

    it( 'can convert division of atomics or factors to JSON', () => {
        // division of atomics
        check( '(/ 1 2)', [ 'division', [ 'number', '1' ], [ 'number', '2' ] ] )
        check(
            '(/ x y)',
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        check(
            '(/ 0 infinity)',
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // division of factors
        check(
            '(/ (^ x 2) 3)',
            [ 'division',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        check(
            '(/ 1 (^ e x))',
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        check(
            '(/ (% 10) (^ 2 100))',
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can convert multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        check(
            '(* 1 2)',
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            '(* x y)',
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        check(
            '(* 0 infinity)',
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // multiplication of factors
        check(
            '(* (^ x 2) 3)',
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        check(
            '(* 1 (^ e x))',
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        check(
            '(* (% 10) (^ 2 100))',
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can convert negations of atomics or factors to JSON', () => {
        check(
            '(* (- 1) 2)',
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ]
        )
        check(
            '(* x (- y))',
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ]
        )
        check(
            '(* (- (^ x 2)) (- 3))',
            [ 'multiplication',
                [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        check(
            '(- (- (- (- 1000))))',
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert additions and subtractions to JSON', () => {
        check(
            '(+ x y)',
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ]
        )
        check(
            '(- 1 (- 3))',
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        check(
            '(+ (^ A B) (- C pi))',
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'pi' ] ]
            ]
        )
    } )

    it( 'can convert number exprs that normally require groupers to JSON', () => {
        check(
            '(- (* 1 2))',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        check(
            '(! (^ x 2))',
            [ 'factorial',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ]
        )
        check(
            '(^ (- x) (* 2 (- 3)))',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        check(
            '(^ (- 3) (+ 1 2))',
            [ 'exponentiation',
                [ 'numbernegation', [ 'number', '3' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
    } )

    it( 'can convert relations of numeric expressions to JSON', () => {
        check(
            '(> 1 2)',
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ]
        )
        check(
            '(< (- 1 2) (+ 1 2))',
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ]
        )
        check(
            '(not (= 1 2))',
            [ 'logicnegation',
                [ 'equality', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        check(
            '(and (>= 2 1) (<= 2 3))',
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ]
        )
        check(
            '(divides 7 14)',
            [ 'divides', [ 'number', '7' ], [ 'number', '14' ] ]
        )
        check(
            '(divides (apply A k) (! n))',
            [ 'divides',
                [ 'numfuncapp', [ 'funcvariable', 'A' ], [ 'numbervariable', 'k' ] ],
                [ 'factorial', [ 'numbervariable', 'n' ] ] ]
        )
        check(
            '(~ (- 1 k) (+ 1 k))',
            [ 'genericrelation',
                [ 'subtraction', [ 'number', '1' ], [ 'numbervariable', 'k' ] ],
                [ 'addition', [ 'number', '1' ], [ 'numbervariable', 'k' ] ] ]
        )
    } )

    it( 'does not undo the canonical form for inequality', () => {
        check(
            '(not (= x y))',
            [ 'logicnegation',
                [ 'equality',
                    [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ] ]
        )
    } )

    it( 'can convert propositional logic atomics to JSON', () => {
        check( 'true', [ 'logicaltrue' ] )
        check( 'false', [ 'logicalfalse' ] )
        check( 'contradiction', [ 'contradiction' ] )
        // Not checking variables here, because their meaning is ambiguous
    } )

    it( 'can convert propositional logic conjuncts to JSON', () => {
        check(
            '(and true false)',
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ]
        )
        check(
            '(and (not P) (not true))',
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ]
        )
        check(
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
        check(
            '(or true (not A))',
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ]
        )
        check(
            '(or (and P Q) (and Q P))',
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can convert propositional logic conditionals to JSON', () => {
        check(
            '(implies A (and Q (not P)))',
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        check(
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
        check(
            '(iff A (and Q (not P)))',
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        check(
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
        check(
            '(or P (and (iff Q Q) P))',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'conjunction',
                    [ 'iff', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'Q' ] ],
                    [ 'logicvariable', 'P' ]
                ]
            ]
        )
        check(
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
        check(
            '(forall (x , P))',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ]
        )
        check(
            '(exists (t , (not Q)))',
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ]
        )
        check(
            '(existsunique (k , (implies m n)))',
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication', [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ]
        )
    } )

    it( 'can convert finite and empty sets to JSON', () => {
        // { }
        check( 'emptyset', [ 'emptyset' ] )
        // { 1 }
        check(
            '(finiteset (elts 1))',
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ]
        )
        // { 1, 2 }
        check(
            '(finiteset (elts 1 (elts 2)))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ]
        )
        // { 1, 2, 3 }
        check(
            '(finiteset (elts 1 (elts 2 (elts 3))))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ]
        )
        // { { }, { } }
        check(
            '(finiteset (elts emptyset (elts emptyset)))',
            [ 'finiteset', [ 'eltthenseq', [ 'emptyset' ],
                [ 'oneeltseq', [ 'emptyset' ] ] ] ]
        )
        // { { { } } }
        check(
            '(finiteset (elts (finiteset (elts emptyset))))',
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', [ 'emptyset' ] ] ] ] ]
        )
        // { 3, x }
        check(
            '(finiteset (elts 3 (elts x)))',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ]
        )
        // { A cup B, A cap B }
        check(
            '(finiteset (elts (setuni A B) (elts (setint A B))))',
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ]
        )
        // { 1, 2, emptyset, K, P }
        check(
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
        check(
            '(tuple (elts 5 (elts 6)))',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        check(
            '(tuple (elts 5 (elts (setuni A B) (elts k))))',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // vectors containing at least two numbers are valid
        check(
            '(vector (elts 5 (elts 6)))',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ]
        )
        check(
            '(vector (elts 5 (elts (- 7) (elts k))))',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ]
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
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        // vectors can contain only numbers
        checkFail( '(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))' )
        checkFail( '(vector (elts (vector (elts 1 (elts 2))) (elts 6)))' )
        checkFail( '(vector (elts (setuni A B) (elts 6)))' )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        check(
            '(in b B)',
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ]
        )
        check(
            '(in 2 (finiteset (elts 1 (elts 2))))',
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        check(
            '(in X (setuni a b))',
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ]
        )
        check(
            '(in (setuni A B) (setuni X Y))',
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ]
        )
        check(
            '(subset A (setcomp B))',
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ]
        )
        check(
            '(subseteq (setint u v) (setuni u v))',
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ]
        )
        check(
            '(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))',
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        check(
            '(in p (setprod U V))',
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ]
        )
        check(
            '(in q (setuni (setcomp U) (setprod V W)))',
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ]
        )
        check(
            '(in (tuple (elts a (elts b))) (setprod A B))',
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
        check(
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
        check(
            '(not (in a A))',
            [ 'logicnegation',
                [ 'nounisin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ] ]
        )
        check(
            '(not (in emptyset emptyset))',
            [ 'logicnegation', [ 'nounisin', [ 'emptyset' ], [ 'emptyset' ] ] ]
        )
        check(
            '(not (in (- 3 5) (setint K P)))',
            [ 'logicnegation',
                [ 'nounisin',
                    [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                    [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
                ]
            ]
        )
    } )

    it( 'can parse to JSON sentences built from various relations', () => {
        check(
            '(or P (in b B))',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ]
        )
        check(
            '(forall (x , (in x X)))',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ]
        )
        check(
            '(and (subseteq A B) (subseteq B A))',
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ]
        )
        check(
            '(= R (setprod A B))',
            [ 'equality',
                [ 'numbervariable', 'R' ], // it guesses wrong, oh well
                [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
        check(
            '(forall (n , (divides n (! n))))',
            [ 'universal',
                [ 'numbervariable', 'n' ],
                [ 'divides',
                    [ 'numbervariable', 'n' ],
                    [ 'factorial', [ 'numbervariable', 'n' ] ] ] ]
        )
        check(
            '(implies (~ a b) (~ b a))',
            [ 'implication',
                [ 'genericrelation',
                    [ 'numbervariable', 'a' ], [ 'numbervariable', 'b' ] ],
                [ 'genericrelation',
                    [ 'numbervariable', 'b' ], [ 'numbervariable', 'a' ] ] ]
        )
    } )

    it( 'can parse notation related to functions', () => {
        check(
            '(function f A B)',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        check(
            '(not (function F (setuni X Y) Z))',
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ]
        )
        check(
            '(function (compose f g) A C)',
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ]
        )
        check(
            '(apply f x)',
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ]
        )
        check(
            '(apply (inverse f) (apply (inverse g) 10))',
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ]
        )
        check(
            '(apply E (setcomp L))',
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ]
        )
        check(
            '(setint emptyset (apply f 2))',
            [ 'intersection',
                [ 'emptyset' ],
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ]
        )
        check(
            '(and (apply P e) (apply Q (+ 3 b)))',
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ]
        )
        check(
            '(= (apply f x) 3)',
            [ 'equality',
                [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
                [ 'number', '3' ] ]
        )
        check(
            '(= F (compose G (inverse H)))',
            [ 'funcequality',
                [ 'funcvariable', 'F' ],
                [ 'funccomp',
                    [ 'funcvariable', 'G' ],
                    [ 'funcinverse', [ 'funcvariable', 'H' ] ] ] ]
        )
    } )

    it( 'can parse trigonometric functions correctly', () => {
        check(
            '(apply sin x)',
            [ 'prefixfuncapp', [ 'sinfunc' ], [ 'numbervariable', 'x' ] ]
        )
        check(
            '(apply cos (* pi x))',
            [ 'prefixfuncapp', [ 'cosfunc' ],
                [ 'multiplication', [ 'pi' ], [ 'numbervariable', 'x' ] ] ]
        )
        check(
            '(apply tan t)',
            [ 'prefixfuncapp', [ 'tanfunc' ], [ 'numbervariable', 't' ] ]
        )
        check(
            '(/ 1 (apply cot pi))',
            [ 'division', [ 'number', '1' ],
                [ 'prefixfuncapp', [ 'cotfunc' ], [ 'pi' ] ] ]
        )
        check(
            '(= (apply sec y) (apply csc y))',
            [ 'equality',
                [ 'prefixfuncapp', [ 'secfunc' ], [ 'numbervariable', 'y' ] ],
                [ 'prefixfuncapp', [ 'cscfunc' ], [ 'numbervariable', 'y' ] ] ]
        )
    } )

} )
