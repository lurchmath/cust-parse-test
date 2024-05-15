
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
        check( [ 'Number', '0' ], '0' )
        check( [ 'Number', '453789' ], '453789' )
        check(
            [ 'Number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        check(
            [ 'NumberNegation', [ 'Number', '453789' ] ],
            '(- 453789)'
        )
        check(
            [ 'NumberNegation',
                [ 'Number', '99999999999999999999999999999999999999999' ] ],
            '(- 99999999999999999999999999999999999999999)'
        )
        // non-negative decimals
        check( [ 'Number', '0.0' ], '0.0' )
        check( [ 'Number', '29835.6875940' ], '29835.6875940' )
        check( [ 'Number', '653280458689.' ], '653280458689.' )
        check( [ 'Number', '.000006327589' ], '.000006327589' )
        // negative decimals are the negation of positive decimals
        check(
            [ 'NumberNegation', [ 'Number', '29835.6875940' ] ],
            '(- 29835.6875940)'
        )
        check(
            [ 'NumberNegation', [ 'Number', '653280458689.' ] ],
            '(- 653280458689.)'
        )
        check(
            [ 'NumberNegation', [ 'Number', '.000006327589' ] ],
            '(- .000006327589)'
        )
    } )

    it( 'can convert any size variable name from JSON to putdown', () => {
        // one-letter names work
        check( [ 'NumberVariable', 'x' ], 'x' )
        check( [ 'NumberVariable', 'E' ], 'E' )
        check( [ 'NumberVariable', 'q' ], 'q' )
        // multi-letter names work, too
        check( [ 'NumberVariable', 'foo' ], 'foo' )
        check( [ 'NumberVariable', 'bar' ], 'bar' )
        check( [ 'NumberVariable', 'to' ], 'to' )
    } )

    it( 'can convert numeric constants from JSON to putdown', () => {
        check( 'Infinity', 'infinity' )
        check( 'Pi', 'pi' )
        check( 'EulersNumber', 'eulersnumber' )
    } )

    it( 'can convert exponentiation of atomics to putdown', () => {
        check(
            [ 'Exponentiation', [ 'Number', '1' ], [ 'Number', '2' ] ],
            '(^ 1 2)'
        )
        check(
            [ 'Exponentiation',
                [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ],
            '(^ e x)'
        )
        check(
            [ 'Exponentiation', [ 'Number', '1' ], 'Infinity' ],
            '(^ 1 infinity)'
        )
    } )

    it( 'can convert atomic percentages and factorials to putdown', () => {
        check( [ 'Percentage', [ 'Number', '10' ] ], '(% 10)' )
        check( [ 'Percentage', [ 'NumberVariable', 't' ] ], '(% t)' )
        check( [ 'Factorial', [ 'Number', '100' ] ], '(! 100)' )
        check( [ 'Factorial', [ 'NumberVariable', 'J' ] ], '(! J)' )
    } )

    it( 'can convert division of atomics or factors to putdown', () => {
        // division of atomics
        check( [ 'Division', [ 'Number', '1' ], [ 'Number', '2' ] ], '(/ 1 2)' )
        check(
            [ 'Division',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ],
            '(/ x y)'
        )
        check(
            [ 'Division', [ 'Number', '0' ], 'Infinity' ],
            '(/ 0 infinity)'
        )
        // division of factors
        check(
            [ 'Division',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ],
            '(/ (^ x 2) 3)'
        )
        check(
            [ 'Division',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
            ],
            '(/ 1 (^ e x))'
        )
        check(
            [ 'Division',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ],
            '(/ (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert multiplication of atomics or factors to putdown', () => {
        // multiplication of atomics
        check(
            [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ],
            '(* 1 2)'
        )
        check(
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ],
            '(* x y)'
        )
        check(
            [ 'Multiplication', [ 'Number', '0' ], 'Infinity' ],
            '(* 0 infinity)'
        )
        // multiplication of factors
        check(
            [ 'Multiplication',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ],
            '(* (^ x 2) 3)'
        )
        check(
            [ 'Multiplication',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
            ],
            '(* 1 (^ e x))'
        )
        check(
            [ 'Multiplication',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ],
            '(* (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert negations of atomics or factors to putdown', () => {
        check(
            [ 'Multiplication',
                [ 'NumberNegation', [ 'Number', '1' ] ],
                [ 'Number', '2' ]
            ],
            '(* (- 1) 2)'
        )
        check(
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ],
                [ 'NumberNegation', [ 'NumberVariable', 'y' ] ]
            ],
            '(* x (- y))'
        )
        check(
            [ 'Multiplication',
                [ 'NumberNegation',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ],
            '(* (- (^ x 2)) (- 3))'
        )
        check(
            [ 'NumberNegation', [ 'NumberNegation', [ 'NumberNegation',
                [ 'NumberNegation', [ 'Number', '1000' ] ] ] ] ],
            '(- (- (- (- 1000))))'
        )
    } )

    it( 'can convert additions and subtractions to putdown', () => {
        check(
            [ 'Addition',
                [ 'NumberVariable', 'x' ],
                [ 'NumberVariable', 'y' ]
            ],
            '(+ x y)'
        )
        check(
            [ 'Subtraction',
                [ 'Number', '1' ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ],
            '(- 1 (- 3))'
        )
        check(
            [ 'Addition',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                [ 'Subtraction',
                    [ 'NumberVariable', 'C' ], 'Pi' ]
            ],
            '(+ (^ A B) (- C pi))'
        )
    } )

    it( 'can convert number expressions with groupers to putdown', () => {
        check(
            [ 'NumberNegation',
                [ 'Multiplication',
                    [ 'Number', '1' ], [ 'Number', '2' ] ] ],
            '(- (* 1 2))'
        )
        check(
            [ 'Factorial',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ],
            '(! (^ x 2))'
        )
        check(
            [ 'Exponentiation',
                [ 'NumberNegation',
                    [ 'NumberVariable', 'x' ] ],
                [ 'Multiplication',
                    [ 'Number', '2' ],
                        [ 'NumberNegation', [ 'Number', '3' ] ] ]
            ],
            '(^ (- x) (* 2 (- 3)))'
        )
        check(
            [ 'Exponentiation',
                [ 'NumberNegation', [ 'Number', '3' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ] ],
            '(^ (- 3) (+ 1 2))'
        )
    } )

    it( 'can convert relations of numeric expressions to putdown', () => {
        check(
            [ 'GreaterThan',
                [ 'Number', '1' ],
                [ 'Number', '2' ]
            ],
            '(> 1 2)'
        )
        check(
            [ 'LessThan',
                [ 'Subtraction', [ 'Number', '1' ], [ 'Number', '2' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ]
            ],
            '(< (- 1 2) (+ 1 2))'
        )
        check(
            [ 'LogicalNegation',
                [ 'Equals', [ 'Number', '1' ], [ 'Number', '2' ] ] ],
            '(not (= 1 2))'
        )
        check(
            [ 'Conjunction',
                [ 'GreaterThanOrEqual', [ 'Number', '2' ], [ 'Number', '1' ] ],
                [ 'LessThanOrEqual', [ 'Number', '2' ], [ 'Number', '3' ] ] ],
            '(and (>= 2 1) (<= 2 3))'
        )
        check(
            [ 'BinaryRelationHolds', 'Divides', [ 'Number', '7' ], [ 'Number', '14' ] ],
            '(relationholds | 7 14)'
        )
        check(
            [ 'BinaryRelationHolds', 'Divides',
                [ 'NumberFunctionApplication', [ 'FunctionVariable', 'A' ], [ 'NumberVariable', 'k' ] ],
                [ 'Factorial', [ 'NumberVariable', 'n' ] ] ],
            '(relationholds | (apply A k) (! n))'
        )
        check(
            [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                [ 'Subtraction', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ] ],
            '(relationholds ~ (- 1 k) (+ 1 k))'
        )
        check(
            [ 'BinaryRelationHolds', 'ApproximatelyEqual',
                [ 'Number', '0.99' ], [ 'Number', '1.01' ] ],
            '(relationholds ~~ 0.99 1.01)'
        )
    } )

    it( 'creates the canonical form for inequality', () => {
        check(
            [ 'NotEqual', [ 'FunctionVariable', 'f' ], [ 'FunctionVariable', 'g' ] ],
            '(not (= f g))'
        )
    } )

    it( 'can convert propositional logic atomics to putdown', () => {
        check( 'LogicalTrue', 'true' )
        check( 'LogicalFalse', 'false' )
        check( 'Contradiction', 'contradiction' )
        check( [ 'LogicVariable', 'P' ], 'P' )
        check( [ 'LogicVariable', 'a' ], 'a' )
        check( [ 'LogicVariable', 'somethingLarge' ], 'somethingLarge' )
    } )

    it( 'can convert propositional logic conjuncts to putdown', () => {
        check(
            [ 'Conjunction',
                'LogicalTrue',
                'LogicalFalse'
            ],
            '(and true false)'
        )
        check(
            [ 'Conjunction',
                [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ],
                [ 'LogicalNegation', 'LogicalTrue' ]
            ],
            '(and (not P) (not true))'
        )
        check(
            [ 'Conjunction',
                [ 'Conjunction',
                    [ 'LogicVariable', 'a' ],
                    [ 'LogicVariable', 'b' ]
                ],
                [ 'LogicVariable', 'c' ]
            ],
            '(and (and a b) c)'
        )
    } )

    it( 'can convert propositional logic disjuncts to putdown', () => {
        check(
            [ 'Disjunction',
                'LogicalTrue',
                [ 'LogicalNegation', [ 'LogicVariable', 'A' ] ]
            ],
            '(or true (not A))'
        )
        check(
            [ 'Disjunction',
                [ 'Conjunction', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                [ 'Conjunction', [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ]
            ],
            '(or (and P Q) (and Q P))'
        )
    } )

    it( 'can convert propositional logic conditionals to putdown', () => {
        check(
            [ 'Implication',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ],
            '(implies A (and Q (not P)))'
        )
        check(
            [ 'Implication',
                [ 'Implication',
                    [ 'Disjunction',
                        [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                    [ 'Conjunction',
                        [ 'LogicVariable', 'Q' ],
                        [ 'LogicVariable', 'P' ]
                    ]
                ],
                [ 'LogicVariable', 'T' ]
            ],
            '(implies (implies (or P Q) (and Q P)) T)'
        )
    } )

    it( 'can convert propositional logic biconditionals to putdown', () => {
        check(
            [ 'LogicalEquivalence',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ],
            '(iff A (and Q (not P)))'
        )
        check(
            [ 'Implication',
                [ 'LogicalEquivalence',
                    [ 'Disjunction',
                        [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                    [ 'Conjunction',
                        [ 'LogicVariable', 'Q' ],
                        [ 'LogicVariable', 'P' ]
                    ]
                ],
                [ 'LogicVariable', 'T' ]
            ],
            '(implies (iff (or P Q) (and Q P)) T)'
        )
    } )

    it( 'can convert propositional expressions with groupers to putdown', () => {
        check(
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'Conjunction',
                    [ 'LogicalEquivalence',
                        [ 'LogicVariable', 'Q' ],
                        [ 'LogicVariable', 'Q' ]
                    ],
                    [ 'LogicVariable', 'P' ]
                ]
            ],
            '(or P (and (iff Q Q) P))'
        )
        check(
            [ 'LogicalNegation',
                [ 'LogicalEquivalence',
                    'LogicalTrue',
                    'LogicalFalse'
                ]
            ],
            '(not (iff true false))'
        )
    } )

    it( 'can convert simple predicate logic expressions to putdown', () => {
        check(
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'LogicVariable', 'P' ]
            ],
            '(forall (x , P))'
        )
        check(
            [ 'ExistentialQuantifier',
                [ 'NumberVariable', 't' ],
                [ 'LogicalNegation', [ 'LogicVariable', 'Q' ] ]
            ],
            '(exists (t , (not Q)))'
        )
        check(
            [ 'UniqueExistentialQuantifier',
                [ 'NumberVariable', 'k' ],
                [ 'Implication',
                    [ 'LogicVariable', 'm' ], [ 'LogicVariable', 'n' ] ]
            ],
            '(exists! (k , (implies m n)))'
        )
    } )

    it( 'can convert finite and empty sets to putdown', () => {
        // { }
        check( 'EmptySet', 'emptyset' )
        // { 1 }
        check(
            [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
            '(finiteset (elts 1))'
        )
        // { 1, 2 }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'OneElementSequence', [ 'Number', '2' ] ] ] ],
            '(finiteset (elts 1 (elts 2)))'
        )
        // { 1, 2, 3 }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'OneElementSequence', [ 'Number', '3' ] ] ] ] ],
            '(finiteset (elts 1 (elts 2 (elts 3))))'
        )
        // { { }, { } }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', 'EmptySet',
                [ 'OneElementSequence', 'EmptySet' ] ] ],
            '(finiteset (elts emptyset (elts emptyset)))'
        )
        // { { { } } }
        check(
            [ 'FiniteSet', [ 'OneElementSequence',
                [ 'FiniteSet', [ 'OneElementSequence', 'EmptySet' ] ] ] ],
            '(finiteset (elts (finiteset (elts emptyset))))'
        )
        // { 3, x }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '3' ],
                [ 'OneElementSequence', [ 'NumberVariable', 'x' ] ] ] ],
            '(finiteset (elts 3 (elts x)))'
        )
        // { A cup B, A cap B }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence',
                    [ 'SetIntersection', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ] ] ],
            '(finiteset (elts (union A B) (elts (intersection A B))))'
        )
        // { 1, 2, emptyset, K, P }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'ElementThenSequence', 'EmptySet',
                        [ 'ElementThenSequence', [ 'NumberVariable', 'K' ],
                            [ 'OneElementSequence', [ 'NumberVariable', 'P' ] ] ] ] ] ] ],
            '(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))'
        )
    } )

    it( 'can convert tuples and vectors to putdown', () => {
        // tuples containing at least two elements are valid
        check(
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ],
            '(tuple (elts 5 (elts 6)))'
        )
        check(
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ], [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence', [ 'NumberVariable', 'k' ] ] ] ] ],
            '(tuple (elts 5 (elts (union A B) (elts k))))'
        )
        // vectors containing at least two numbers are valid
        check(
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ],
                [ 'OneNumberSequence', [ 'Number', '6' ] ] ] ],
            '(vector (elts 5 (elts 6)))'
        )
        check(
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ], [ 'NumberThenSequence',
                [ 'NumberNegation', [ 'Number', '7' ] ],
                [ 'OneNumberSequence', [ 'NumberVariable', 'k' ] ] ] ] ],
            '(vector (elts 5 (elts (- 7) (elts k))))'
        )
        // tuples can contain other tuples
        check(
            [ 'Tuple', [ 'ElementThenSequence',
                [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ],
            '(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))'
        )
    } )

    it( 'can convert simple set memberships and subsets to putdown', () => {
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ],
            '(in b B)'
        )
        check(
            [ 'NounIsElement', [ 'Number', '2' ],
                [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ],
            '(in 2 (finiteset (elts 1 (elts 2))))'
        )
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'X' ],
                [ 'SetUnion', [ 'SetVariable', 'a' ], [ 'SetVariable', 'b' ] ] ],
            '(in X (union a b))'
        )
        check(
            [ 'NounIsElement',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ] ],
            '(in (union A B) (union X Y))'
        )
        check(
            [ 'Subset',
                [ 'SetVariable', 'A' ],
                [ 'SetComplement', [ 'SetVariable', 'B' ] ] ],
            '(subset A (complement B))'
        )
        check(
            [ 'SubsetOrEqual',
                [ 'SetIntersection', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ],
                [ 'SetUnion', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ] ],
            '(subseteq (intersection u v) (union u v))'
        )
        check(
            [ 'SubsetOrEqual',
                [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                [ 'SetUnion',
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ],
            '(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))'
        )
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'p' ],
                [ 'SetCartesianProduct', [ 'SetVariable', 'U' ], [ 'SetVariable', 'V' ] ] ],
            '(in p (cartesianproduct U V))'
        )
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'q' ],
                [ 'SetUnion',
                    [ 'SetComplement', [ 'SetVariable', 'U' ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'V' ], [ 'SetVariable', 'W' ] ] ] ],
            '(in q (union (complement U) (cartesianproduct V W)))'
        )
        check(
            [ 'NounIsElement',
                [ 'Tuple',
                    [ 'ElementThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneElementSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ],
            '(in (tuple (elts a (elts b))) (cartesianproduct A B))'
        )
        check(
            [ 'NounIsElement',
                [ 'Vector',
                    [ 'NumberThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneNumberSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ],
            '(in (vector (elts a (elts b))) (cartesianproduct A B))'
        )
    } )

    it( 'creates the canonical form for "notin" notation', () => {
        check(
            [ 'NounIsNotElement', [ 'NumberVariable', 'a' ], [ 'SetVariable', 'A' ] ],
            '(not (in a A))'
        )
        check(
            [ 'LogicalNegation', [ 'NounIsElement', 'EmptySet', 'EmptySet' ] ],
            '(not (in emptyset emptyset))'
        )
        check(
            [ 'NounIsNotElement',
                [ 'Subtraction', [ 'Number', '3' ], [ 'Number', '5' ] ],
                [ 'SetIntersection', [ 'SetVariable', 'K' ], [ 'SetVariable', 'P' ] ]
            ],
            '(not (in (- 3 5) (intersection K P)))'
        )
    } )

    it( 'can convert to putdown sentences built from various relations', () => {
        check(
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ] ],
            '(or P (in b B))'
        )
        check(
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'x' ], [ 'SetVariable', 'X' ] ] ],
            '(forall (x , (in x X)))'
        )
        check(
            [ 'Conjunction',
                [ 'SubsetOrEqual', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SubsetOrEqual', [ 'SetVariable', 'B' ], [ 'SetVariable', 'A' ] ] ],
            '(and (subseteq A B) (subseteq B A))'
        )
        check(
            [ 'Equals',
                [ 'NumberVariable', 'R' ], // it guesses wrong, oh well
                [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ],
            '(= R (cartesianproduct A B))'
        )
        check(
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'n' ],
                [ 'BinaryRelationHolds', 'Divides',
                    [ 'NumberVariable', 'n' ],
                    [ 'Factorial', [ 'NumberVariable', 'n' ] ] ] ],
            '(forall (n , (relationholds | n (! n))))'
        )
        check(
            [ 'Implication',
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'a' ], [ 'NumberVariable', 'b' ] ],
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'b' ], [ 'NumberVariable', 'a' ] ] ],
            '(implies (relationholds ~ a b) (relationholds ~ b a))'
        )
    } )

    it( 'can create putdown notation related to functions', () => {
        check(
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
            '(function f A B)'
        )
        check(
            [ 'LogicalNegation',
                [ 'FunctionSignature', [ 'FunctionVariable', 'F' ],
                    [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ],
                    [ 'SetVariable', 'Z' ] ] ],
            '(not (function F (union X Y) Z))'
        )
        check(
            [ 'FunctionSignature',
                [ 'FunctionComposition', [ 'FunctionVariable', 'f' ], [ 'FunctionVariable', 'g' ] ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'C' ] ],
            '(function (compose f g) A C)'
        )
        check(
            [ 'NumberFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ],
            '(apply f x)'
        )
        check(
            [ 'NumberFunctionApplication',
                [ 'FunctionInverse', [ 'FunctionVariable', 'f' ] ],
                [ 'NumberFunctionApplication',
                    [ 'FunctionInverse', [ 'FunctionVariable', 'g' ] ], [ 'Number', '10' ] ] ],
            '(apply (inverse f) (apply (inverse g) 10))'
        )
        check(
            [ 'NumberFunctionApplication', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ],
            '(apply E (complement L))'
        )
        check(
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ],
            '(intersection emptyset (apply f 2))'
        )
        check(
            [ 'Conjunction',
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'e' ] ],
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'Q' ],
                    [ 'Addition', [ 'Number', '3' ], [ 'NumberVariable', 'b' ] ] ] ],
            '(and (apply P e) (apply Q (+ 3 b)))'
        )
        check(
            [ 'EqualFunctions',
                [ 'FunctionVariable', 'F' ],
                [ 'FunctionComposition',
                    [ 'FunctionVariable', 'G' ],
                    [ 'FunctionInverse', [ 'FunctionVariable', 'H' ] ] ] ],
            '(= F (compose G (inverse H)))'
        )
    } )

    it( 'can express trigonometric functions correctly', () => {
        check(
            [ 'NumberFunctionApplication', 'SineFunction', [ 'NumberVariable', 'x' ] ],
            '(apply sin x)'
        )
        check(
            [ 'NumberFunctionApplication', 'CosineFunction',
                [ 'Multiplication', 'Pi', [ 'NumberVariable', 'x' ] ] ],
            '(apply cos (* pi x))'
        )
        check(
            [ 'NumberFunctionApplication', 'TangentFunction', [ 'NumberVariable', 't' ] ],
            '(apply tan t)'
        )
        check(
            [ 'Division', [ 'Number', '1' ],
                [ 'NumberFunctionApplication', 'CotangentFunction', 'Pi' ] ],
            '(/ 1 (apply cot pi))'
        )
        check(
            [ 'Equals',
                [ 'NumberFunctionApplication', 'SecantFunction', [ 'NumberVariable', 'y' ] ],
                [ 'NumberFunctionApplication', 'CosecantFunction', [ 'NumberVariable', 'y' ] ] ],
            '(= (apply sec y) (apply csc y))'
        )
    } )

    it( 'can express logarithms correctly', () => {
        check(
            [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ],
            '(apply log n)'
        )
        check(
            [ 'Addition',
                [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'NaturalLogarithm', [ 'NumberVariable', 'x' ] ] ],
            '(+ 1 (apply ln x))'
        )
        check(
            [ 'PrefixFunctionApplication',
                [ 'LogarithmWithBase', [ 'Number', '2' ] ], [ 'Number', '1024' ] ],
            '(apply (logbase 2) 1024)'
        )
        check(
            [ 'Division',
                [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ],
                [ 'PrefixFunctionApplication', 'Logarithm',
                    [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ] ] ],
            '(/ (apply log n) (apply log (apply log n)))'
        )
    } )

    it( 'can express equivalence classes and expressions that use them', () => {
        check(
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ],
            '(equivclass 1 ~~)'
        )
        check(
            [ 'EquivalenceClass',
                [ 'Addition', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                'GenericBinaryRelation' ],
            '(equivclass (+ x 2) ~)'
        )
        check(
            [ 'SetUnion',
                [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ],
                [ 'EquivalenceClass', [ 'Number', '2' ], 'ApproximatelyEqual' ] ],
            '(union (equivclass 1 ~~) (equivclass 2 ~~))'
        )
        check(
            [ 'NounIsElement', [ 'Number', '7' ],
                [ 'EquivalenceClass', [ 'Number', '7' ], 'GenericBinaryRelation' ] ],
            '(in 7 (equivclass 7 ~))'
        )
        check(
            [ 'EquivalenceClass', [ 'FunctionVariable', 'P' ], 'GenericBinaryRelation' ],
            '(equivclass P ~)'
        )
    } )

    it( 'can express equivalence and classes mod a number', () => {
        check(
            [ 'EquivalentModulo',
                [ 'Number', '5' ], [ 'Number', '11' ], [ 'Number', '3' ] ],
            '(=mod 5 11 3)'
        )
        check(
            [ 'EquivalentModulo', [ 'NumberVariable', 'k' ],
                [ 'NumberVariable', 'm' ], [ 'NumberVariable', 'n' ] ],
            '(=mod k m n)'
        )
        check(
            [ 'Subset', 'EmptySet',
                [ 'EquivalenceClassModulo', [ 'NumberNegation', [ 'Number', '1' ] ],
                    [ 'Number', '10' ] ] ],
            '(subset emptyset (modclass (- 1) 10))'
        )
    } )

    it( 'can construct type sentences and combinations of them', () => {
        check(
            [ 'HasType', [ 'NumberVariable', 'x' ], 'SetType' ],
            '(hastype x settype)'
        )
        check(
            [ 'HasType', [ 'NumberVariable', 'n' ], 'NumberType' ],
            '(hastype n numbertype)'
        )
        check(
            [ 'HasType', [ 'NumberVariable', 'S' ], 'PartialOrderType' ],
            '(hastype S partialordertype)'
        )
        check(
            [ 'Conjunction',
                [ 'HasType', [ 'Number', '1' ], 'NumberType' ],
                [ 'HasType', [ 'Number', '10' ], 'NumberType' ] ],
            '(and (hastype 1 numbertype) (hastype 10 numbertype))'
        )
        check(
            [ 'Implication',
                [ 'HasType', [ 'NumberVariable', 'R' ], 'EquivalenceRelationType' ],
                [ 'HasType', [ 'NumberVariable', 'R' ], 'RelationType' ] ],
            '(implies (hastype R equivalencerelationtype) (hastype R relationtype))'
        )
    } )

    it( 'can create notation for expression function application', () => {
        check(
            [ 'NumberEFA', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ],
            '(efa f x)'
        )
        check(
            [ 'NumberFunctionApplication',
                [ 'FunctionVariable', 'F' ],
                [ 'NumberEFA', [ 'FunctionVariable', 'k' ], [ 'Number', '10' ] ] ],
            '(apply F (efa k 10))'
        )
        check(
            [ 'NumberEFA', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ],
            '(efa E (complement L))'
        )
        check(
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetEFA', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ],
            '(intersection emptyset (efa f 2))'
        )
        check(
            [ 'Conjunction',
                [ 'PropositionEFA', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'x' ] ],
                [ 'PropositionEFA', [ 'FunctionVariable', 'Q' ], [ 'NumberVariable', 'y' ] ] ],
            '(and (efa P x) (efa Q y))'
        )
    } )

    it( 'can create notation for assumptions', () => {
        check( [ 'Given_Variant1', [ 'LogicVariable', 'X' ] ], ':X' )
        check( [ 'Given_Variant2', [ 'LogicVariable', 'X' ] ], ':X' )
        check( [ 'Given_Variant3', [ 'LogicVariable', 'X' ] ], ':X' )
        check( [ 'Given_Variant4', [ 'LogicVariable', 'X' ] ], ':X' )
        check(
            [ 'Given_Variant1',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            ':(= k 1000)'
        )
        check(
            [ 'Given_Variant2',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            ':(= k 1000)'
        )
        check(
            [ 'Given_Variant3',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            ':(= k 1000)'
        )
        check(
            [ 'Given_Variant4',
            [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            ':(= k 1000)'
        )
        check( [ 'Given_Variant1', 'LogicalTrue' ], ':true' )
        check( [ 'Given_Variant2', 'LogicalTrue' ], ':true' )
        check( [ 'Given_Variant3', 'LogicalTrue' ], ':true' )
        check( [ 'Given_Variant4', 'LogicalTrue' ], ':true' )
    } )

    it( 'can create notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( [ 'Let_Variant1', [ 'NumberVariable', 'x' ] ], ':[x]' )
        check( [ 'Let_Variant1', [ 'NumberVariable', 'T' ] ], ':[T]' )
        // You can declare variables with predicates attached
        check(
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            ':[x , (> x 0)]'
        )
        check(
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            ':[T , (or (= T 5) (in T S))]'
        )
    } )

    it( 'can create notation for For Some-style declarations', () => {
        check(
            [ 'ForSome_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '[x , (> x 0)]'
        )
        check(
            [ 'ForSome_Variant2', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '[x , (> x 0)]'
        )
        check(
            [ 'ForSome_Variant3', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '[x , (> x 0)]'
        )
        check(
            [ 'ForSome_Variant4', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '[x , (> x 0)]'
        )
        check(
            [ 'ForSome_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '[T , (or (= T 5) (in T S))]'
        )
        check(
            [ 'ForSome_Variant2', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '[T , (or (= T 5) (in T S))]'
        )
        check(
            [ 'ForSome_Variant3', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '[T , (or (= T 5) (in T S))]'
        )
        check(
            [ 'ForSome_Variant4', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '[T , (or (= T 5) (in T S))]'
        )
    } )

} )
