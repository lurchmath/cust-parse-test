
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
    const checkAll = ( putdownText, ...jsons ) => {
        const all = putdown.parse( putdownText, true )
        expect( all.length ).to.equal( jsons.length )
        for ( let i = 0 ; i < jsons.length ; i++ )
            expect( all.some( result =>
                JSON.stringify(result) == JSON.stringify(jsons[i])
            ) ).to.equal( true )
    }

    it( 'can convert putdown numbers to JSON', () => {
        // non-negative integers
        check( '0', [ 'Number', '0' ] )
        check( '453789', [ 'Number', '453789' ] )
        check(
            '99999999999999999999999999999999999999999',
            [ 'Number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        check( '(- 453789)', [ 'NumberNegation', [ 'Number', '453789' ] ] )
        check(
            '(- 99999999999999999999999999999999999999999)',
            [ 'NumberNegation',
                [ 'Number', '99999999999999999999999999999999999999999' ] ]
        )
        // non-negative decimals
        check( '0.0', [ 'Number', '0.0' ] )
        check( '29835.6875940', [ 'Number', '29835.6875940' ] )
        check( '653280458689.', [ 'Number', '653280458689.' ] )
        check( '.000006327589', [ 'Number', '.000006327589' ] )
        // negative decimals are the negation of positive decimals
        check(
            '(- 29835.6875940)',
            [ 'NumberNegation', [ 'Number', '29835.6875940' ] ]
        )
        check(
            '(- 653280458689.)',
            [ 'NumberNegation', [ 'Number', '653280458689.' ] ]
        )
        check(
            '(- .000006327589)',
            [ 'NumberNegation', [ 'Number', '.000006327589' ] ]
        )
    } )

    it( 'can convert any size variable name to JSON', () => {
        // one-letter names work, and could be any type of variable:
        checkAll(
            'x',
            [ 'NumberVariable', 'x' ],
            [ 'FunctionVariable', 'x' ],
            [ 'SetVariable', 'x' ],
            [ 'LogicVariable', 'x' ]
        )
        checkAll(
            'E',
            [ 'NumberVariable', 'E' ],
            [ 'FunctionVariable', 'E' ],
            [ 'SetVariable', 'E' ],
            [ 'LogicVariable', 'E' ]
        )
        checkAll(
            'q',
            [ 'NumberVariable', 'q' ],
            [ 'FunctionVariable', 'q' ],
            [ 'SetVariable', 'q' ],
            [ 'LogicVariable', 'q' ]
        )
        // multi-letter names don't work; it just does nothing with them
        // because it can't find any concept to which they belong
        checkFail( 'foo' )
        checkFail( 'bar' )
        checkFail( 'to' )
    } )

    it( 'can convert numeric constants from putdown to JSON', () => {
        check( 'infinity', 'Infinity' )
        check( 'pi', 'Pi' )
        check( 'eulersnumber', 'EulersNumber' )
    } )

    it( 'can convert exponentiation of atomics to JSON', () => {
        check(
            '(^ 1 2)',
            [ 'Exponentiation', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            '(^ e x)',
            [ 'Exponentiation',
                [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
        )
        check(
            '(^ 1 infinity)',
            [ 'Exponentiation', [ 'Number', '1' ], 'Infinity' ]
        )
    } )

    it( 'can convert atomic percentages and factorials to JSON', () => {
        check( '(% 10)', [ 'Percentage', [ 'Number', '10' ] ] )
        check( '(% t)', [ 'Percentage', [ 'NumberVariable', 't' ] ] )
        check( '(! 6)', [ 'Factorial', [ 'Number', '6' ] ] )
        check( '(! n)', [ 'Factorial', [ 'NumberVariable', 'n' ] ] )
    } )

    it( 'can convert division of atomics or factors to JSON', () => {
        // division of atomics
        check( '(/ 1 2)', [ 'Division', [ 'Number', '1' ], [ 'Number', '2' ] ] )
        check(
            '(/ x y)',
            [ 'Division',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ]
        )
        check(
            '(/ 0 infinity)',
            [ 'Division', [ 'Number', '0' ], 'Infinity' ]
        )
        // division of factors
        check(
            '(/ (^ x 2) 3)',
            [ 'Division',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ]
        )
        check(
            '(/ 1 (^ e x))',
            [ 'Division',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
            ]
        )
        check(
            '(/ (% 10) (^ 2 100))',
            [ 'Division',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ]
        )
    } )

    it( 'can convert multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        check(
            '(* 1 2)',
            [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            '(* x y)',
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ]
        )
        check(
            '(* 0 infinity)',
            [ 'Multiplication', [ 'Number', '0' ], 'Infinity' ]
        )
        // multiplication of factors
        check(
            '(* (^ x 2) 3)',
            [ 'Multiplication',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ]
        )
        check(
            '(* 1 (^ e x))',
            [ 'Multiplication',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
            ]
        )
        check(
            '(* (% 10) (^ 2 100))',
            [ 'Multiplication',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ]
        )
    } )

    it( 'can convert negations of atomics or factors to JSON', () => {
        check(
            '(* (- 1) 2)',
            [ 'Multiplication',
                [ 'NumberNegation', [ 'Number', '1' ] ],
                [ 'Number', '2' ]
            ]
        )
        check(
            '(* x (- y))',
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ],
                [ 'NumberNegation', [ 'NumberVariable', 'y' ] ]
            ]
        )
        check(
            '(* (- (^ x 2)) (- 3))',
            [ 'Multiplication',
                [ 'NumberNegation',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ]
        )
        check(
            '(- (- (- (- 1000))))',
            [ 'NumberNegation', [ 'NumberNegation', [ 'NumberNegation',
                [ 'NumberNegation', [ 'Number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert additions and subtractions to JSON', () => {
        check(
            '(+ x y)',
            [ 'Addition',
                [ 'NumberVariable', 'x' ],
                [ 'NumberVariable', 'y' ]
            ]
        )
        check(
            '(- 1 (- 3))',
            [ 'Subtraction',
                [ 'Number', '1' ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ]
        )
        check(
            '(+ (^ A B) (- C pi))',
            [ 'Addition',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                [ 'Subtraction',
                    [ 'NumberVariable', 'C' ], 'Pi' ]
            ]
        )
    } )

    it( 'can convert Number exprs that normally require groupers to JSON', () => {
        check(
            '(- (* 1 2))',
            [ 'NumberNegation',
                [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(! (^ x 2))',
            [ 'Factorial',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(^ (- x) (* 2 (- 3)))',
            [ 'Exponentiation',
                [ 'NumberNegation',
                    [ 'NumberVariable', 'x' ] ],
                [ 'Multiplication',
                    [ 'Number', '2' ], [ 'NumberNegation', [ 'Number', '3' ] ] ]
            ]
        )
        check(
            '(^ (- 3) (+ 1 2))',
            [ 'Exponentiation',
                [ 'NumberNegation', [ 'Number', '3' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ] ]
        )
    } )

    it( 'can convert relations of numeric expressions to JSON', () => {
        check(
            '(> 1 2)',
            [ 'GreaterThan',
                [ 'Number', '1' ],
                [ 'Number', '2' ]
            ]
        )
        check(
            '(< (- 1 2) (+ 1 2))',
            [ 'LessThan',
                [ 'Subtraction', [ 'Number', '1' ], [ 'Number', '2' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ]
            ]
        )
        check(
            '(not (= 1 2))',
            [ 'LogicalNegation',
                [ 'Equals', [ 'Number', '1' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(and (>= 2 1) (<= 2 3))',
            [ 'Conjunction',
                [ 'GreaterThanOrEqual', [ 'Number', '2' ], [ 'Number', '1' ] ],
                [ 'LessThanOrEqual', [ 'Number', '2' ], [ 'Number', '3' ] ] ]
        )
        check(
            '(relationholds | 7 14)',
            [ 'BinaryRelationHolds', 'Divides', [ 'Number', '7' ], [ 'Number', '14' ] ]
        )
        check(
            '(relationholds | (apply A k) (! n))',
            [ 'BinaryRelationHolds', 'Divides',
                [ 'NumberFunctionApplication', [ 'FunctionVariable', 'A' ], [ 'NumberVariable', 'k' ] ],
                [ 'Factorial', [ 'NumberVariable', 'n' ] ] ]
        )
        check(
            '(relationholds ~ (- 1 k) (+ 1 k))',
            [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                [ 'Subtraction', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ] ]
        )
        check(
            '(relationholds ~~ 0.99 1.01)',
            [ 'BinaryRelationHolds', 'ApproximatelyEqual',
                [ 'Number', '0.99' ], [ 'Number', '1.01' ] ]
        )
    } )

    it( 'does not undo the canonical form for inequality', () => {
        // Check all possibilities for this ambiguous expression
        checkAll(
            '(not (= x y))',
            [ 'LogicalNegation',
                [ 'EqualFunctions',
                    [ 'FunctionVariable', 'x' ], [ 'FunctionVariable', 'y' ] ] ],
            [ 'LogicalNegation',
                [ 'Equals',
                    [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ] ],
            [ 'LogicalNegation',
                [ 'Equals',
                    [ 'NumberVariable', 'x' ], [ 'SetVariable', 'y' ] ] ],
            [ 'LogicalNegation',
                [ 'Equals',
                    [ 'SetVariable', 'x' ], [ 'NumberVariable', 'y' ] ] ],
            [ 'LogicalNegation',
                [ 'Equals',
                    [ 'SetVariable', 'x' ], [ 'SetVariable', 'y' ] ] ]
        )
    } )

    it( 'can convert propositional logic atomics to JSON', () => {
        check( 'true', 'LogicalTrue' )
        check( 'false', 'LogicalFalse' )
        check( 'contradiction', 'Contradiction' )
        // Not checking variables here, because their meaning is ambiguous
    } )

    it( 'can convert propositional logic conjuncts to JSON', () => {
        check(
            '(and true false)',
            [ 'Conjunction',
                'LogicalTrue',
                'LogicalFalse'
            ]
        )
        check(
            '(and (not P) (not true))',
            [ 'Conjunction',
                [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ],
                [ 'LogicalNegation', 'LogicalTrue' ]
            ]
        )
        check(
            '(and (and a b) c)',
            [ 'Conjunction',
                [ 'Conjunction',
                    [ 'LogicVariable', 'a' ],
                    [ 'LogicVariable', 'b' ]
                ],
                [ 'LogicVariable', 'c' ]
            ]
        )
    } )

    it( 'can convert propositional logic disjuncts to JSON', () => {
        check(
            '(or true (not A))',
            [ 'Disjunction',
                'LogicalTrue',
                [ 'LogicalNegation', [ 'LogicVariable', 'A' ] ]
            ]
        )
        check(
            '(or (and P Q) (and Q P))',
            [ 'Disjunction',
                [ 'Conjunction', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                [ 'Conjunction', [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ]
            ]
        )
    } )

    it( 'can convert propositional logic conditionals to JSON', () => {
        check(
            '(implies A (and Q (not P)))',
            [ 'Implication',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ]
        )
        check(
            '(implies (implies (or P Q) (and Q P)) T)',
            [ 'Implication',
                [ 'Implication',
                    [ 'Disjunction',
                        [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                    [ 'Conjunction',
                        [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ]
                ],
                [ 'LogicVariable', 'T' ]
            ]
        )
    } )

    it( 'can convert propositional logic biconditionals to JSON', () => {
        check(
            '(iff A (and Q (not P)))',
            [ 'LogicalEquivalence',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ]
        )
        check(
            '(implies (iff (or P Q) (and Q P)) T)',
            [ 'Implication',
                [ 'LogicalEquivalence',
                    [ 'Disjunction',
                        [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                    [ 'Conjunction',
                        [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ]
                ],
                [ 'LogicVariable', 'T' ]
            ]
        )
    } )

    it( 'can convert propositional expressions with groupers to JSON', () => {
        check(
            '(or P (and (iff Q Q) P))',
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'Conjunction',
                    [ 'LogicalEquivalence', [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'Q' ] ],
                    [ 'LogicVariable', 'P' ]
                ]
            ]
        )
        check(
            '(not (iff true false))',
            [ 'LogicalNegation',
                [ 'LogicalEquivalence',
                    'LogicalTrue',
                    'LogicalFalse'
                ]
            ]
        )
    } )

    it( 'can convert simple predicate logic expressions to JSON', () => {
        check(
            '(forall (x , P))',
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'LogicVariable', 'P' ]
            ]
        )
        check(
            '(exists (t , (not Q)))',
            [ 'ExistentialQuantifier',
                [ 'NumberVariable', 't' ],
                [ 'LogicalNegation', [ 'LogicVariable', 'Q' ] ]
            ]
        )
        check(
            '(exists! (k , (implies m n)))',
            [ 'UniqueExistentialQuantifier',
                [ 'NumberVariable', 'k' ],
                [ 'Implication', [ 'LogicVariable', 'm' ], [ 'LogicVariable', 'n' ] ]
            ]
        )
    } )

    it( 'can convert finite and empty sets to JSON', () => {
        // { }
        check( 'emptyset', 'EmptySet' )
        // { 1 }
        check(
            '(finiteset (elts 1))',
            [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ]
        )
        // { 1, 2 }
        check(
            '(finiteset (elts 1 (elts 2)))',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'OneElementSequence', [ 'Number', '2' ] ] ] ]
        )
        // { 1, 2, 3 }
        check(
            '(finiteset (elts 1 (elts 2 (elts 3))))',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'OneElementSequence', [ 'Number', '3' ] ] ] ] ]
        )
        // { { }, { } }
        check(
            '(finiteset (elts emptyset (elts emptyset)))',
            [ 'FiniteSet', [ 'ElementThenSequence', 'EmptySet',
                [ 'OneElementSequence', 'EmptySet' ] ] ]
        )
        // { { { } } }
        check(
            '(finiteset (elts (finiteset (elts emptyset))))',
            [ 'FiniteSet', [ 'OneElementSequence',
                [ 'FiniteSet', [ 'OneElementSequence', 'EmptySet' ] ] ] ]
        )
        // { 3, x }
        check(
            '(finiteset (elts 3 (elts x)))',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '3' ],
                [ 'OneElementSequence', [ 'NumberVariable', 'x' ] ] ] ]
        )
        // { A cup B, A cap B }
        check(
            '(finiteset (elts (union A B) (elts (intersection A B))))',
            [ 'FiniteSet', [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence',
                    [ 'SetIntersection', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ] ] ]
        )
        // { 1, 2, emptyset, K, P }
        check(
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'ElementThenSequence', 'EmptySet',
                        [ 'ElementThenSequence', [ 'NumberVariable', 'K' ],
                            [ 'OneElementSequence', [ 'NumberVariable', 'P' ] ] ] ] ] ] ]
        )
    } )

    it( 'can convert tuples and vectors to JSON', () => {
        // tuples containing at least two elements are valid
        check(
            '(tuple (elts 5 (elts 6)))',
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ]
        )
        check(
            '(tuple (elts 5 (elts (union A B) (elts k))))',
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ], [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence', [ 'NumberVariable', 'k' ] ] ] ] ]
        )
        // vectors containing at least two numbers are valid
        check(
            '(vector (elts 5 (elts 6)))',
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ],
                [ 'OneNumberSequence', [ 'Number', '6' ] ] ] ]
        )
        check(
            '(vector (elts 5 (elts (- 7) (elts k))))',
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ], [ 'NumberThenSequence',
                [ 'NumberNegation', [ 'Number', '7' ] ],
                [ 'OneNumberSequence', [ 'NumberVariable', 'k' ] ] ] ] ]
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
            [ 'Tuple', [ 'ElementThenSequence',
                [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ]
        )
        // vectors can contain only numbers
        checkFail( '(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))' )
        checkFail( '(vector (elts (vector (elts 1 (elts 2))) (elts 6)))' )
        checkFail( '(vector (elts (union A B) (elts 6)))' )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is NumberVariable
        check(
            '(in b B)',
            [ 'NounIsElement', [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ]
        )
        check(
            '(in 2 (finiteset (elts 1 (elts 2))))',
            [ 'NounIsElement', [ 'Number', '2' ],
                [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ]
        )
        check(
            '(in X (union a b))',
            [ 'NounIsElement', [ 'NumberVariable', 'X' ],
                [ 'SetUnion', [ 'SetVariable', 'a' ], [ 'SetVariable', 'b' ] ] ]
        )
        check(
            '(in (union A B) (union X Y))',
            [ 'NounIsElement',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ] ]
        )
        check(
            '(subset A (complement B))',
            [ 'Subset',
                [ 'SetVariable', 'A' ],
                [ 'SetComplement', [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '(subseteq (intersection u v) (union u v))',
            [ 'SubsetOrEqual',
                [ 'SetIntersection', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ],
                [ 'SetUnion', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ] ]
        )
        check(
            '(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))',
            [ 'SubsetOrEqual',
                [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                [ 'SetUnion',
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ]
        )
        check(
            '(in p (cartesianproduct U V))',
            [ 'NounIsElement', [ 'NumberVariable', 'p' ],
                [ 'SetCartesianProduct', [ 'SetVariable', 'U' ], [ 'SetVariable', 'V' ] ] ]
        )
        check(
            '(in q (union (complement U) (cartesianproduct V W)))',
            [ 'NounIsElement', [ 'NumberVariable', 'q' ],
                [ 'SetUnion',
                    [ 'SetComplement', [ 'SetVariable', 'U' ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'V' ], [ 'SetVariable', 'W' ] ] ] ]
        )
        check(
            '(in (tuple (elts a (elts b))) (cartesianproduct A B))',
            [ 'NounIsElement',
                [ 'Tuple',
                    [ 'ElementThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneElementSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '(in (vector (elts a (elts b))) (cartesianproduct A B))',
            [ 'NounIsElement',
                [ 'Vector',
                    [ 'NumberThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneNumberSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
    } )

    it( 'does not undo the canonical form for "notin" notation', () => {
        check(
            '(not (in a A))',
            [ 'LogicalNegation',
                [ 'NounIsElement', [ 'NumberVariable', 'a' ], [ 'SetVariable', 'A' ] ] ]
        )
        check(
            '(not (in emptyset emptyset))',
            [ 'LogicalNegation', [ 'NounIsElement', 'EmptySet', 'EmptySet' ] ]
        )
        check(
            '(not (in (- 3 5) (intersection K P)))',
            [ 'LogicalNegation',
                [ 'NounIsElement',
                    [ 'Subtraction', [ 'Number', '3' ], [ 'Number', '5' ] ],
                    [ 'SetIntersection', [ 'SetVariable', 'K' ], [ 'SetVariable', 'P' ] ]
                ]
            ]
        )
    } )

    it( 'can parse to JSON sentences built from various relations', () => {
        check(
            '(or P (in b B))',
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '(forall (x , (in x X)))',
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'x' ], [ 'SetVariable', 'X' ] ] ]
        )
        check(
            '(and (subseteq A B) (subseteq B A))',
            [ 'Conjunction',
                [ 'SubsetOrEqual', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SubsetOrEqual', [ 'SetVariable', 'B' ], [ 'SetVariable', 'A' ] ] ]
        )
        check(
            '(= R (cartesianproduct A B))',
            [ 'Equals',
                [ 'NumberVariable', 'R' ], // it guesses wrong, oh well
                [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '(forall (n , (relationholds | n (! n))))',
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'n' ],
                [ 'BinaryRelationHolds', 'Divides',
                    [ 'NumberVariable', 'n' ],
                    [ 'Factorial', [ 'NumberVariable', 'n' ] ] ] ]
        )
        check(
            '(implies (relationholds ~ a b) (relationholds ~ b a))',
            [ 'Implication',
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'a' ], [ 'NumberVariable', 'b' ] ],
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'b' ], [ 'NumberVariable', 'a' ] ] ]
        )
    } )

    it( 'can parse notation related to functions', () => {
        check(
            '(function f A B)',
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ]
        )
        check(
            '(not (function F (union X Y) Z))',
            [ 'LogicalNegation',
                [ 'FunctionSignature', [ 'FunctionVariable', 'F' ],
                    [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ],
                    [ 'SetVariable', 'Z' ] ] ]
        )
        check(
            '(function (compose f g) A C)',
            [ 'FunctionSignature',
                [ 'FunctionComposition', [ 'FunctionVariable', 'f' ], [ 'FunctionVariable', 'g' ] ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'C' ] ]
        )
        check(
            '(apply f x)',
            [ 'NumberFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ]
        )
        check(
            '(apply (inverse f) (apply (inverse g) 10))',
            [ 'NumberFunctionApplication',
                [ 'FunctionInverse', [ 'FunctionVariable', 'f' ] ],
                [ 'NumberFunctionApplication',
                    [ 'FunctionInverse', [ 'FunctionVariable', 'g' ] ], [ 'Number', '10' ] ] ]
        )
        check(
            '(apply E (complement L))',
            [ 'NumberFunctionApplication', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ]
        )
        check(
            '(intersection emptyset (apply f 2))',
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(and (apply P e) (apply Q (+ 3 b)))',
            [ 'Conjunction',
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'e' ] ],
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'Q' ],
                    [ 'Addition', [ 'Number', '3' ], [ 'NumberVariable', 'b' ] ] ] ]
        )
        check(
            '(= (apply f x) 3)',
            [ 'Equals',
                [ 'NumberFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ],
                [ 'Number', '3' ] ]
        )
        check(
            '(= F (compose G (inverse H)))',
            [ 'EqualFunctions',
                [ 'FunctionVariable', 'F' ],
                [ 'FunctionComposition',
                    [ 'FunctionVariable', 'G' ],
                    [ 'FunctionInverse', [ 'FunctionVariable', 'H' ] ] ] ]
        )
    } )

    it( 'can parse trigonometric functions correctly', () => {
        check(
            '(apply sin x)',
            [ 'PrefixFunctionApplication', 'SineFunction', [ 'NumberVariable', 'x' ] ]
        )
        check(
            '(apply cos (* pi x))',
            [ 'PrefixFunctionApplication', 'CosineFunction',
                [ 'Multiplication', 'Pi', [ 'NumberVariable', 'x' ] ] ]
        )
        check(
            '(apply tan t)',
            [ 'PrefixFunctionApplication', 'TangentFunction', [ 'NumberVariable', 't' ] ]
        )
        check(
            '(/ 1 (apply cot pi))',
            [ 'Division', [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'CotangentFunction', 'Pi' ] ]
        )
        check(
            '(= (apply sec y) (apply csc y))',
            [ 'Equals',
                [ 'PrefixFunctionApplication', 'SecantFunction', [ 'NumberVariable', 'y' ] ],
                [ 'PrefixFunctionApplication', 'CosecantFunction', [ 'NumberVariable', 'y' ] ] ]
        )
    } )

    it( 'can parse logarithms correctly', () => {
        check(
            '(apply log n)',
            [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ]
        )
        check(
            '(+ 1 (apply ln x))',
            [ 'Addition',
                [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'NaturalLogarithm', [ 'NumberVariable', 'x' ] ] ]
        )
        check(
            '(apply (logbase 2) 1024)',
            [ 'PrefixFunctionApplication',
                [ 'LogarithmWithBase', [ 'Number', '2' ] ], [ 'Number', '1024' ] ]
        )
        check(
            '(/ (apply log n) (apply log (apply log n)))',
            [ 'Division',
                [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ],
                [ 'PrefixFunctionApplication', 'Logarithm',
                    [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ] ] ]
        )
    } )

    it( 'can parse equivalence classes and treat them as sets', () => {
        check(
            '(equivclass 1 ~~)',
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ]
        )
        // Check both possibilities for this ambiguous expression:
        checkAll(
            '(equivclass (+ x 2) ~)',
            [ 'EquivalenceClass',
                [ 'Addition', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                'GenericBinaryRelation' ],
            [ 'GenericEquivalenceClass',
                [ 'Addition', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(union (equivclass 1 ~~) (equivclass 2 ~~))',
            [ 'SetUnion',
                [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ],
                [ 'EquivalenceClass', [ 'Number', '2' ], 'ApproximatelyEqual' ] ]
        )
        // Check both possibilities for this ambiguous expression:
        checkAll(
            '(in 7 (equivclass 7 ~))',
            [ 'NounIsElement', [ 'Number', '7' ],
                [ 'EquivalenceClass', [ 'Number', '7' ], 'GenericBinaryRelation' ] ],
            [ 'NounIsElement', [ 'Number', '7' ],
                [ 'GenericEquivalenceClass', [ 'Number', '7' ] ] ]
        )
    } )

    it( 'can parse equivalence and classes mod a Number', () => {
        check(
            '(=mod 5 11 3)',
            [ 'EquivalentModulo',
                [ 'Number', '5' ], [ 'Number', '11' ], [ 'Number', '3' ] ]
        )
        check(
            '(=mod k m n)',
            [ 'EquivalentModulo', [ 'NumberVariable', 'k' ],
                [ 'NumberVariable', 'm' ], [ 'NumberVariable', 'n' ] ]
        )
        check(
            '(subset emptyset (modclass (- 1) 10))',
            [ 'Subset', 'EmptySet',
                [ 'EquivalenceClassModulo', [ 'NumberNegation', [ 'Number', '1' ] ],
                    [ 'Number', '10' ] ] ]
        )
    } )

    it( 'can parse type sentences and combinations of them', () => {
        check( '(hastype x settype)',
            [ 'HasType', [ 'NumberVariable', 'x' ], 'SetType' ] )
        check( '(hastype n numbertype)',
            [ 'HasType', [ 'NumberVariable', 'n' ], 'NumberType' ] )
        check( '(hastype S partialordertype)',
            [ 'HasType', [ 'NumberVariable', 'S' ], 'PartialOrderType' ] )
        check( '(and (hastype 1 numbertype) (hastype 10 numbertype))',
            [ 'Conjunction',
                [ 'HasType', [ 'Number', '1' ], 'NumberType' ],
                [ 'HasType', [ 'Number', '10' ], 'NumberType' ] ] )
        check( '(implies (hastype R equivalencerelationtype) (hastype R relationtype))',
            [ 'Implication',
                [ 'HasType', [ 'NumberVariable', 'R' ], 'EquivalenceRelationType' ],
                [ 'HasType', [ 'NumberVariable', 'R' ], 'RelationType' ] ] )
    } )

    it( 'can parse notation for expression function application', () => {
        check(
            '(efa f x)',
            [ 'NumberEFA', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ]
        )
        check(
            '(apply F (efa k 10))',
            [ 'NumberFunctionApplication',
                [ 'FunctionVariable', 'F' ],
                [ 'NumberEFA', [ 'FunctionVariable', 'k' ], [ 'Number', '10' ] ] ]
        )
        check(
            '(efa E (complement L))',
            [ 'NumberEFA', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ]
        )
        check(
            '(intersection emptyset (efa f 2))',
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetEFA', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(and (efa P x) (efa Q y))',
            [ 'Conjunction',
                [ 'PropositionEFA', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'x' ] ],
                [ 'PropositionEFA', [ 'FunctionVariable', 'Q' ], [ 'NumberVariable', 'y' ] ] ]
        )
    } )

    it( 'can parse notation for assumptions', () => {
        // You can assume a sentence
        check( ':X', [ 'Given_Variant1', [ 'LogicVariable', 'X' ] ] )
        check(
            ':(= k 1000)',
            [ 'Given_Variant1',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ]
        )
        check( ':true', [ 'Given_Variant1', 'LogicalTrue' ] )
        // You cannot assume something that's not a sentence
        checkFail( ':50' )
        checkFail( ':(tuple (elts 5 (elts 6)))' )
        checkFail( ':(compose f g)' )
        checkFail( ':emptyset' )
        checkFail( ':infinity' )
    } )

    it( 'can parse notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( ':[x]', [ 'Let_Variant1', [ 'NumberVariable', 'x' ] ] )
        check( ':[T]', [ 'Let_Variant1', [ 'NumberVariable', 'T' ] ] )
        // You can declare variables with predicates attached
        check(
            ':[x , (> x 0)]',
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            ':[T , (or (= T 5) (in T S))]',
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
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

    it( 'can parse notation for For Some-style declarations', () => {
        // You can declare variables with predicates attached
        check(
            '[x , (> x 0)]',
            [ 'ForSome_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            '[T , (or (= T 5) (in T S))]',
            [ 'ForSome_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
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
