
import { expect } from 'chai'
import { converter } from '../example-converter.js'
import { AST } from '../ast.js'

const latex = converter.languages.get( 'latex' )

describe( 'Parsing LaTeX', () => {

    const check = ( latexText, json ) => {
        const ast = latex.parse( latexText )
        expect( ast instanceof AST ? ast.toJSON() : ast ).to.eql( json )
        global.log?.( 'LaTeX', latexText, 'JSON', json )
    }
    const checkFail = ( latexText ) => {
        expect( latex.parse( latexText ) ).to.be.undefined
        global.log?.( 'LaTeX', latexText, 'JSON', null )
    }

    it( 'can parse many kinds of numbers to JSON', () => {
        // non-negative integers
        check( '0', [ 'Number', '0' ] )
        check( '453789', [ 'Number', '453789' ] )
        check(
            '99999999999999999999999999999999999999999',
            [ 'Number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        check( '-453789', [ 'NumberNegation', [ 'Number', '453789' ] ] )
        check(
            '-99999999999999999999999999999999999999999',
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
            '-29835.6875940',
            [ 'NumberNegation', [ 'Number', '29835.6875940' ] ]
        )
        check(
            '-653280458689.',
            [ 'NumberNegation', [ 'Number', '653280458689.' ] ]
        )
        check(
            '-.000006327589',
            [ 'NumberNegation', [ 'Number', '.000006327589' ] ]
        )
    } )

    it( 'can parse one-letter variable names to JSON', () => {
        // one-letter names work, and the least possible parsing of them (for
        // many possible parsings, using alphabetical ordering) is as function
        // variables:
        check( 'x', [ 'FunctionVariable', 'x' ] )
        check( 'E', [ 'FunctionVariable', 'E' ] )
        check( 'q', [ 'FunctionVariable', 'q' ] )
        // multi-letter names do not work
        checkFail( 'foo' )
        checkFail( 'bar' )
        checkFail( 'to' )
    } )

    it( 'can parse LaTeX numeric constants to JSON', () => {
        check( '\\infty', 'Infinity' )
        check( '\\pi', 'Pi' )
        // The following happens because, even though the parser detects the
        // parsing of e as Euler's number is valid, it's not the first in the
        // alphabetical ordering of the possible parsed results:
        check( 'e', [ 'FunctionVariable', 'e' ] )
    } )

    it( 'can parse exponentiation of atomics to JSON', () => {
        check(
            '1^2',
            [ 'Exponentiation', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            'e^x',
            [ 'Exponentiation', 'EulersNumber', [ 'NumberVariable', 'x' ] ]
        )
        check(
            '1^\\infty',
            [ 'Exponentiation', [ 'Number', '1' ], 'Infinity' ]
        )
    } )

    it( 'can parse atomic percentages and factorials to JSON', () => {
        check( '10\\%', [ 'Percentage', [ 'Number', '10' ] ] )
        check( 't\\%', [ 'Percentage', [ 'NumberVariable', 't' ] ] )
        check( '77!', [ 'Factorial', [ 'Number', '77' ] ] )
        check( 'y!', [ 'Factorial', [ 'NumberVariable', 'y' ] ] )
    } )

    it( 'can parse division of atomics or factors to JSON', () => {
        // division of atomics
        check(
            '1\\div2',
            [ 'Division', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            'x\\div y',
            [ 'Division',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ]
        )
        check(
            '0\\div\\infty',
            [ 'Division', [ 'Number', '0' ], 'Infinity' ]
        )
        // division of factors
        check(
            'x^2\\div3',
            [ 'Division',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ]
        )
        check(
            '1\\div e^x',
            [ 'Division',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    'EulersNumber', [ 'NumberVariable', 'x' ] ]
            ]
        )
        check(
            '10\\%\\div2^{100}',
            [ 'Division',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ]
        )
    } )

    it( 'can parse multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        check(
            '1\\times2',
            [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            'x\\cdot y',
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ]
        )
        check(
            '0\\times\\infty',
            [ 'Multiplication', [ 'Number', '0' ], 'Infinity' ]
        )
        // multiplication of factors
        check(
            'x^2\\cdot3',
            [ 'Multiplication',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ]
        )
        check(
            '1\\times e^x',
            [ 'Multiplication',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    'EulersNumber', [ 'NumberVariable', 'x' ] ]
            ]
        )
        check(
            '10\\%\\cdot2^{100}',
            [ 'Multiplication',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ]
        )
    } )

    it( 'can parse negations of atomics or factors to JSON', () => {
        check(
            '-1\\times2',
            [ 'Multiplication',
                [ 'NumberNegation', [ 'Number', '1' ] ],
                [ 'Number', '2' ] ]
        )
        check(
            'x\\cdot{-y}',
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ],
                [ 'NumberNegation', [ 'NumberVariable', 'y' ] ]
            ]
        )
        check(
            '{-x^2}\\cdot{-3}',
            [ 'Multiplication',
                [ 'NumberNegation',
                    [ 'Exponentiation',
                        [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ]
        )
        check(
            '(-x^2)\\cdot(-3)',
            [ 'Multiplication',
                [ 'NumberNegation',
                    [ 'Exponentiation',
                        [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ]
        )
        check(
            '----1000',
            [ 'NumberNegation', [ 'NumberNegation', [ 'NumberNegation',
                [ 'NumberNegation', [ 'Number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert additions and subtractions to JSON', () => {
        check(
            'x+y',
            [ 'Addition',
                [ 'NumberVariable', 'x' ],
                [ 'NumberVariable', 'y' ]
            ]
        )
        check(
            '1--3',
            [ 'Subtraction',
                [ 'Number', '1' ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ]
        )
        // Following could also be a Subtraction of a sum and a variable, which
        // is also OK, but the one shown below is alphabetically earlier:
        check(
            'A^B+C-\\pi',
            [ 'Addition',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                [ 'Subtraction',
                    [ 'NumberVariable', 'C' ], 'Pi' ] ]
        )
    } )

    it( 'can parse number expressions with groupers to JSON', () => {
        check(
            '-{1\\times2}',
            [ 'NumberNegation',
                [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ] ]
        )
        check(
            '-(1\\times2)',
            [ 'NumberNegation',
                [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ] ]
        )
        check(
            '(N-1)!',
            [ 'Factorial',
                [ 'Subtraction',
                    [ 'NumberVariable', 'N' ], [ 'Number', '1' ] ] ]
        )
        check(
            '\\left(N-1\\right)!',
            [ 'Factorial',
                [ 'Subtraction',
                    [ 'NumberVariable', 'N' ], [ 'Number', '1' ] ] ]
        )
        checkFail( '\\left(N-1)!' )
        checkFail( '(N-1\\right)!' )
        check(
            '{-x}^{2\\cdot{-3}}',
            [ 'Exponentiation',
                [ 'NumberNegation',
                    [ 'NumberVariable', 'x' ] ],
                [ 'Multiplication',
                    [ 'Number', '2' ], [ 'NumberNegation', [ 'Number', '3' ] ] ]
            ]
        )
        check(
            '(-x)^(2\\cdot(-3))',
            [ 'Exponentiation',
                [ 'NumberNegation',
                    [ 'NumberVariable', 'x' ] ],
                [ 'Multiplication',
                    [ 'Number', '2' ], [ 'NumberNegation', [ 'Number', '3' ] ] ]
            ]
        )
        check(
            '(-x)^{2\\cdot(-3)}',
            [ 'Exponentiation',
                [ 'NumberNegation',
                    [ 'NumberVariable', 'x' ] ],
                [ 'Multiplication',
                    [ 'Number', '2' ], [ 'NumberNegation', [ 'Number', '3' ] ] ]
            ]
        )
        check(
            'A^B+(C-D)',
            [ 'Addition',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                [ 'Subtraction',
                    [ 'NumberVariable', 'C' ], [ 'NumberVariable', 'D' ] ]
            ]
        )
        check(
            'A^B+\\left(C-D\\right)',
            [ 'Addition',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                [ 'Subtraction',
                    [ 'NumberVariable', 'C' ], [ 'NumberVariable', 'D' ] ]
            ]
        )
        check(
            'k^{1-y}\\cdot(2+k)',
            [ 'Multiplication',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'k' ],
                    [ 'Subtraction',
                        [ 'Number', '1' ], [ 'NumberVariable', 'y' ] ] ],
                [ 'Addition',
                    [ 'Number', '2' ], [ 'NumberVariable', 'k' ] ] ]
        )
    } )

    it( 'can parse relations of numeric expressions to JSON', () => {
        check(
            '1>2',
            [ 'GreaterThan',
                [ 'Number', '1' ],
                [ 'Number', '2' ]
            ]
        )
        check(
            '1\\gt2',
            [ 'GreaterThan',
                [ 'Number', '1' ],
                [ 'Number', '2' ]
            ]
        )
        check(
            '1-2<1+2',
            [ 'LessThan',
                [ 'Subtraction', [ 'Number', '1' ], [ 'Number', '2' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ]
            ]
        )
        check(
            '1-2\\lt1+2',
            [ 'LessThan',
                [ 'Subtraction', [ 'Number', '1' ], [ 'Number', '2' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ]
            ]
        )
        check(
            '\\neg 1=2',
            [ 'LogicalNegation',
                [ 'Equals', [ 'Number', '1' ], [ 'Number', '2' ] ] ]
        )
        check(
            '2\\ge1\\wedge2\\le3',
            [ 'Conjunction',
                [ 'GreaterThanOrEqual', [ 'Number', '2' ], [ 'Number', '1' ] ],
                [ 'LessThanOrEqual', [ 'Number', '2' ], [ 'Number', '3' ] ] ]
        )
        check(
            '2\\geq1\\wedge2\\leq3',
            [ 'Conjunction',
                [ 'GreaterThanOrEqual', [ 'Number', '2' ], [ 'Number', '1' ] ],
                [ 'LessThanOrEqual', [ 'Number', '2' ], [ 'Number', '3' ] ] ]
        )
        check(
            '7|14',
            [ 'BinaryRelationHolds', 'Divides', [ 'Number', '7' ], [ 'Number', '14' ] ]
        )
        check(
            '7\\vert14',
            [ 'BinaryRelationHolds', 'Divides', [ 'Number', '7' ], [ 'Number', '14' ] ]
        )
        check(
            'A(k) | n!',
            [ 'BinaryRelationHolds', 'Divides',
                [ 'NumberFunctionApplication', [ 'FunctionVariable', 'A' ], [ 'NumberVariable', 'k' ] ],
                [ 'Factorial', [ 'NumberVariable', 'n' ] ] ]
        )
        check(
            'A(k) \\vert n!',
            [ 'BinaryRelationHolds', 'Divides',
                [ 'NumberFunctionApplication', [ 'FunctionVariable', 'A' ], [ 'NumberVariable', 'k' ] ],
                [ 'Factorial', [ 'NumberVariable', 'n' ] ] ]
        )
        check(
            '1-k \\sim 1+k',
            [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                [ 'Subtraction', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ] ]
        )
        check(
            '0.99\\approx1.01',
            [ 'BinaryRelationHolds', 'ApproximatelyEqual',
                [ 'Number', '0.99' ], [ 'Number', '1.01' ] ]
        )
    } )

    it( 'converts inequality to its placeholder concept', () => {
        check(
            '1\\ne2',
            [ 'NotEqual', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            '1\\neq2',
            [ 'NotEqual', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
    } )

    it( 'can parse propositional logic atomics to JSON', () => {
        check( '\\top', 'LogicalTrue' )
        check( '\\bot', 'LogicalFalse' )
        check( '\\rightarrow\\leftarrow', 'Contradiction' )
        // Not checking variables here, because their meaning is ambiguous; we
        // will check below to ensure that they can be part of logic expressions.
    } )

    it( 'can parse propositional logic conjuncts to JSON', () => {
        check(
            '\\top\\wedge\\bot',
            [ 'Conjunction',
                'LogicalTrue',
                'LogicalFalse'
            ]
        )
        check(
            '\\neg P\\wedge\\neg\\top',
            [ 'Conjunction',
                [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ],
                [ 'LogicalNegation', 'LogicalTrue' ]
            ]
        )
        // Following could also be left-associated, which is also a valid
        // parsing, but the one shown below is alphabetically earlier:
        check(
            'a\\wedge b\\wedge c',
            [ 'Conjunction',
                [ 'LogicVariable', 'a' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'b' ],
                    [ 'LogicVariable', 'c' ]
                ]
            ]
        )
    } )

    it( 'can parse propositional logic disjuncts to JSON', () => {
        check(
            '\\top\\vee \\neg A',
            [ 'Disjunction',
                'LogicalTrue',
                [ 'LogicalNegation', [ 'LogicVariable', 'A' ] ]
            ]
        )
        check(
            'P\\wedge Q\\vee Q\\wedge P',
            [ 'Disjunction',
                [ 'Conjunction', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                [ 'Conjunction', [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ]
            ]
        )
    } )

    it( 'can parse propositional logic conditionals to JSON', () => {
        check(
            'A\\Rightarrow Q\\wedge\\neg P',
            [ 'Implication',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ]
        )
        // Implication should right-associate:
        check(
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T',
            [ 'Implication',
                [ 'Disjunction',
                    [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                [ 'Implication',
                    [ 'Conjunction',
                        [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ],
                    [ 'LogicVariable', 'T' ]
                ]
            ]
        )
    } )

    it( 'can parse propositional logic biconditionals to JSON', () => {
        check(
            'A\\Leftrightarrow Q\\wedge\\neg P',
            [ 'LogicalEquivalence',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ]
        )
        // This is how iff and implies associate right now, due to alphabetical
        // ordering, but we will be tweaking this in a future update.
        check(
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T',
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
            ]
        )
    } )

    it( 'can parse propositional expressions with groupers to JSON', () => {
        check(
            'P\\lor {Q\\Leftrightarrow Q}\\land P',
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'Conjunction',
                    [ 'LogicalEquivalence',
                        [ 'LogicVariable', 'Q' ],
                        [ 'LogicVariable', 'Q' ]
                    ],
                    [ 'LogicVariable', 'P' ]
                ]
            ]
        )
        check(
            '\\lnot{\\top\\Leftrightarrow\\bot}',
            [ 'LogicalNegation',
                [ 'LogicalEquivalence',
                    'LogicalTrue',
                    'LogicalFalse'
                ]
            ]
        )
        check(
            '\\lnot\\left(\\top\\Leftrightarrow\\bot\\right)',
            [ 'LogicalNegation',
                [ 'LogicalEquivalence',
                    'LogicalTrue',
                    'LogicalFalse'
                ]
            ]
        )
        check(
            '\\lnot(\\top\\Leftrightarrow\\bot)',
            [ 'LogicalNegation',
                [ 'LogicalEquivalence',
                    'LogicalTrue',
                    'LogicalFalse'
                ]
            ]
        )
    } )

    it( 'can parse simple predicate logic expressions to JSON', () => {
        check(
            '\\forall x, P',
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'LogicVariable', 'P' ]
            ]
        )
        check(
            '\\exists t,\\neg Q',
            [ 'ExistentialQuantifier',
                [ 'NumberVariable', 't' ],
                [ 'LogicalNegation', [ 'LogicVariable', 'Q' ] ]
            ]
        )
        check(
            '\\exists! k,m\\Rightarrow n',
            [ 'UniqueExistentialQuantifier',
                [ 'NumberVariable', 'k' ],
                [ 'Implication',
                    [ 'LogicVariable', 'm' ], [ 'LogicVariable', 'n' ] ]
            ]
        )
    } )

    it( 'can convert finite and empty sets to JSON', () => {
        // { }
        check( '\\emptyset', 'EmptySet' )
        check( '\\{\\}', 'EmptySet' )
        check( '\\{ \\}', 'EmptySet' )
        // { 1 }
        check(
            '\\{ 1 \\}',
            [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ]
        )
        check(
            '\\left\\{ 1 \\right\\}',
            [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ]
        )
        // { 1, 2 }
        check(
            '\\{1,2\\}',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'OneElementSequence', [ 'Number', '2' ] ] ] ]
        )
        // { 1, 2, 3 }
        check(
            '\\{1, 2,   3 \\}',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'OneElementSequence', [ 'Number', '3' ] ] ] ] ]
        )
        // { { }, { } }
        check(
            '\\{\\{\\},\\emptyset\\}',
            [ 'FiniteSet', [ 'ElementThenSequence', 'EmptySet',
                [ 'OneElementSequence', 'EmptySet' ] ] ]
        )
        // { { { } } }
        check(
            '\\{\\{\\emptyset\\}\\}',
            [ 'FiniteSet', [ 'OneElementSequence',
                [ 'FiniteSet', [ 'OneElementSequence', 'EmptySet' ] ] ] ]
        )
        // { 3, x }
        check(
            '\\{ 3,x \\}',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '3' ],
                [ 'OneElementSequence', [ 'NumberVariable', 'x' ] ] ] ]
        )
        check(
            '\\left\\{ 3,x \\right\\}',
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '3' ],
                [ 'OneElementSequence', [ 'NumberVariable', 'x' ] ] ] ]
        )
        // { A cup B, A cap B }
        check(
            '\\{ A\\cup B, A\\cap B \\}',
            [ 'FiniteSet', [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence',
                    [ 'SetIntersection', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ] ] ]
        )
        // { 1, 2, emptyset, K, P }
        check(
            '\\{ 1, 2, \\emptyset, K, P \\}',
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
            '(5,6)',
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ]
        )
        check(
            '(5,A\\cup B,k)',
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ], [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence', [ 'NumberVariable', 'k' ] ] ] ] ]
        )
        // vectors containing at least two numbers are valid
        check(
            '\\langle5,6\\rangle',
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ],
                [ 'OneNumberSequence', [ 'Number', '6' ] ] ] ]
        )
        check(
            '\\langle5,-7,k\\rangle',
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ], [ 'NumberThenSequence',
                [ 'NumberNegation', [ 'Number', '7' ] ],
                [ 'OneNumberSequence', [ 'NumberVariable', 'k' ] ] ] ] ]
        )
        // tuples and vectors containing zero or one element are not valid
        checkFail( '()' )
        checkFail( '(())' )
        check(
            '(3)', // okay, this is valid, but not as a tuple
            [ 'Number', '3' ]
        )
        checkFail( '\\langle\\rangle' )
        checkFail( '\\langle3\\rangle' )
        // tuples can contain other tuples
        check(
            '((1,2),6)',
            [ 'Tuple', [ 'ElementThenSequence',
                [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ]
        )
        // vectors can contain only numbers
        checkFail( '\\langle(1,2),6\\rangle' )
        checkFail( '\\langle\\langle1,2\\rangle,6\\rangle' )
        checkFail( '\\langle A\\cup B,6\\rangle' )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is NumberVariable
        check(
            'b\\in B',
            [ 'NounIsElement', [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ]
        )
        check(
            '2\\in\\{1,2\\}',
            [ 'NounIsElement', [ 'Number', '2' ],
                [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ]
        )
        check(
            'X\\in a\\cup b',
            [ 'NounIsElement', [ 'NumberVariable', 'X' ],
                [ 'SetUnion', [ 'SetVariable', 'a' ], [ 'SetVariable', 'b' ] ] ]
        )
        check(
            'A\\cup B\\in X\\cup Y',
            [ 'NounIsElement',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ] ]
        )
        check(
            'A\\subset\\bar B',
            [ 'Subset',
                [ 'SetVariable', 'A' ],
                [ 'SetComplement', [ 'SetVariable', 'B' ] ] ]
        )
        check(
            'A\\subset B\'',
            [ 'Subset',
                [ 'SetVariable', 'A' ],
                [ 'SetComplement', [ 'SetVariable', 'B' ] ] ]
        )
        check(
            'u\\cap v\\subseteq u\\cup v',
            [ 'SubsetOrEqual',
                [ 'SetIntersection', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ],
                [ 'SetUnion', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ] ]
        )
        check(
            '\\{1\\}\\subseteq\\{1\\}\\cup\\{2\\}',
            [ 'SubsetOrEqual',
                [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                [ 'SetUnion',
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ]
        )
        check(
            'p\\in U\\times V',
            [ 'NounIsElement', [ 'NumberVariable', 'p' ],
                [ 'SetCartesianProduct', [ 'SetVariable', 'U' ], [ 'SetVariable', 'V' ] ] ]
        )
        check(
            'q \\in U\'\\cup V\\times W',
            [ 'NounIsElement', [ 'NumberVariable', 'q' ],
                [ 'SetUnion',
                    [ 'SetComplement', [ 'SetVariable', 'U' ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'V' ], [ 'SetVariable', 'W' ] ] ] ]
        )
        check(
            '(a,b)\\in A\\times B',
            [ 'NounIsElement',
                [ 'Tuple',
                    [ 'ElementThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneElementSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '\\langle a,b\\rangle\\in A\\times B',
            [ 'NounIsElement',
                [ 'Vector',
                    [ 'NumberThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneNumberSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
    } )

    it( 'converts "notin" notation to its placeholder concept', () => {
        check(
            'a\\notin A',
            [ 'NounIsNotElement', [ 'NumberVariable', 'a' ], [ 'SetVariable', 'A' ] ]
        )
        check(
            '\\emptyset\\notin\\emptyset',
            [ 'NounIsNotElement', 'EmptySet', 'EmptySet' ]
        )
        check(
            '3-5 \\notin K\\cap P',
            [ 'NounIsNotElement',
                [ 'Subtraction', [ 'Number', '3' ], [ 'Number', '5' ] ],
                [ 'SetIntersection', [ 'SetVariable', 'K' ], [ 'SetVariable', 'P' ] ]
            ]
        )
    } )

    it( 'can parse to JSON sentences built from various relations', () => {
        check(
            'P\\vee b\\in B',
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '{P \\vee b} \\in B',
            [ 'PropositionIsElement',
                [ 'Disjunction',
                    [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'b' ] ],
                [ 'SetVariable', 'B' ] ]
        )
        check(
            '\\forall x, x\\in X',
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'x' ], [ 'SetVariable', 'X' ] ] ]
        )
        check(
            'A\\subseteq B\\wedge B\\subseteq A',
            [ 'Conjunction',
                [ 'SubsetOrEqual', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SubsetOrEqual', [ 'SetVariable', 'B' ], [ 'SetVariable', 'A' ] ] ]
        )
        check(
            'R = A\\cup B',
            [ 'Equals',
                [ 'NumberVariable', 'R' ], // it guesses wrong, oh well
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
        check(
            '\\forall n, n|n!',
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'n' ],
                [ 'BinaryRelationHolds', 'Divides',
                    [ 'NumberVariable', 'n' ],
                    [ 'Factorial', [ 'NumberVariable', 'n' ] ] ] ]
        )
        check(
            'a\\sim b\\Rightarrow b\\sim a',
            [ 'Implication',
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'a' ], [ 'NumberVariable', 'b' ] ],
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'b' ], [ 'NumberVariable', 'a' ] ] ]
        )
    } )

    it( 'can parse notation related to functions', () => {
        check(
            'f:A\\to B',
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ]
        )
        check(
            'f\\colon A\\to B',
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ]
        )
        check(
            '\\neg F:X\\cup Y\\rightarrow Z',
            [ 'LogicalNegation',
                [ 'FunctionSignature', [ 'FunctionVariable', 'F' ],
                    [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ],
                    [ 'SetVariable', 'Z' ] ] ]
        )
        check(
            '\\neg F\\colon X\\cup Y\\rightarrow Z',
            [ 'LogicalNegation',
                [ 'FunctionSignature', [ 'FunctionVariable', 'F' ],
                    [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ],
                    [ 'SetVariable', 'Z' ] ] ]
        )
        check(
            'f\\circ g:A\\to C',
            [ 'FunctionSignature',
                [ 'FunctionComposition', [ 'FunctionVariable', 'f' ], [ 'FunctionVariable', 'g' ] ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'C' ] ]
        )
        check(
            'f(x)',
            [ 'NumberFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ]
        )
        check(
            'f^{-1}(g^{-1}(10))',
            [ 'NumberFunctionApplication',
                [ 'FunctionInverse', [ 'FunctionVariable', 'f' ] ],
                [ 'NumberFunctionApplication',
                    [ 'FunctionInverse', [ 'FunctionVariable', 'g' ] ], [ 'Number', '10' ] ] ]
        )
        check(
            'E(L\')',
            [ 'NumberFunctionApplication', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ]
        )
        check(
            '\\emptyset\\cap f(2)',
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ]
        )
        check(
            'P(e)\\wedge Q(3+b)',
            [ 'Conjunction',
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'P' ], 'EulersNumber' ],
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'Q' ],
                    [ 'Addition', [ 'Number', '3' ], [ 'NumberVariable', 'b' ] ] ] ]
        )
        check(
            'F=G\\circ H^{-1}',
            [ 'EqualFunctions',
                [ 'FunctionVariable', 'F' ],
                [ 'FunctionComposition',
                    [ 'FunctionVariable', 'G' ],
                    [ 'FunctionInverse', [ 'FunctionVariable', 'H' ] ] ] ]
        )
    } )

    it( 'can parse trigonometric functions correctly', () => {
        check(
            '\\sin x',
            [ 'PrefixFunctionApplication', 'SineFunction', [ 'NumberVariable', 'x' ] ]
        )
        check(
            '\\cos\\pi\\cdot x',
            [ 'PrefixFunctionApplication', 'CosineFunction',
                [ 'Multiplication', 'Pi', [ 'NumberVariable', 'x' ] ] ]
        )
        check(
            '\\tan t',
            [ 'PrefixFunctionApplication', 'TangentFunction', [ 'NumberVariable', 't' ] ]
        )
        check(
            '1\\div\\cot\\pi',
            [ 'Division', [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'CotangentFunction', 'Pi' ] ]
        )
        check(
            '\\sec y=\\csc y',
            [ 'Equals',
                [ 'PrefixFunctionApplication', 'SecantFunction', [ 'NumberVariable', 'y' ] ],
                [ 'PrefixFunctionApplication', 'CosecantFunction', [ 'NumberVariable', 'y' ] ] ]
        )
    } )

    it( 'can parse logarithms correctly', () => {
        check(
            '\\log n',
            [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ]
        )
        check(
            '1+\\ln{x}',
            [ 'Addition',
                [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'NaturalLogarithm', [ 'NumberVariable', 'x' ] ] ]
        )
        check(
            '\\log_2 1024',
            [ 'PrefixFunctionApplication',
                [ 'LogarithmWithBase', [ 'Number', '2' ] ], [ 'Number', '1024' ] ]
        )
        check(
            '\\log_{2}{1024}',
            [ 'PrefixFunctionApplication',
                [ 'LogarithmWithBase', [ 'Number', '2' ] ], [ 'Number', '1024' ] ]
        )
        check(
            '\\log n \\div \\log\\log n',
            [ 'Division',
                [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ],
                [ 'PrefixFunctionApplication', 'Logarithm',
                    [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ] ] ]
        )
    } )

    it( 'can parse equivalence classes and treat them as sets', () => {
        check(
            '[1,\\approx]',
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ]
        )
        check(
            '\\left[1,\\approx\\right]',
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ]
        )
        check(
            '\\lbrack1,\\approx\\rbrack',
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ]
        )
        check(
            '\\left\\lbrack1,\\approx\\right\\rbrack',
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ]
        )
        checkFail( '\\left[1,\\approx]' )
        checkFail( '[1,\\approx\\right]' )
        check(
            '[x+2,\\sim]',
            [ 'EquivalenceClass',
                [ 'Addition', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                'GenericBinaryRelation' ]
        )
        check(
            '[1,\\approx]\\cup[2,\\approx]',
            [ 'SetUnion',
                [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ],
                [ 'EquivalenceClass', [ 'Number', '2' ], 'ApproximatelyEqual' ] ]
        )
        check(
            '7\\in[7,\\sim]',
            [ 'NounIsElement', [ 'Number', '7' ],
                [ 'EquivalenceClass', [ 'Number', '7' ], 'GenericBinaryRelation' ] ]
        )
        check(
            '[P]',
            [ 'GenericEquivalenceClass', [ 'NumberVariable', 'P' ] ]
        )
        check(
            '\\left[P\\right]',
            [ 'GenericEquivalenceClass', [ 'NumberVariable', 'P' ] ]
        )
    } )

    it( 'can parse equivalence and classes mod a number', () => {
        check(
            '5\\equiv11\\mod3',
            [ 'EquivalentModulo',
                [ 'Number', '5' ], [ 'Number', '11' ], [ 'Number', '3' ] ]
        )
        check(
            '5\\equiv_3 11',
            [ 'EquivalentModulo',
                [ 'Number', '5' ], [ 'Number', '11' ], [ 'Number', '3' ] ]
        )
        check(
            'k \\equiv m \\mod n',
            [ 'EquivalentModulo', [ 'NumberVariable', 'k' ],
                [ 'NumberVariable', 'm' ], [ 'NumberVariable', 'n' ] ]
        )
        check(
            'k \\equiv_n m',
            [ 'EquivalentModulo', [ 'NumberVariable', 'k' ],
                [ 'NumberVariable', 'm' ], [ 'NumberVariable', 'n' ] ]
        )
        check(
            'k \\equiv_{n} m',
            [ 'EquivalentModulo', [ 'NumberVariable', 'k' ],
                [ 'NumberVariable', 'm' ], [ 'NumberVariable', 'n' ] ]
        )
        check(
            '\\emptyset \\subset [-1,\\equiv_10]',
            [ 'Subset', 'EmptySet',
                [ 'EquivalenceClassModulo', [ 'NumberNegation', [ 'Number', '1' ] ],
                    [ 'Number', '10' ] ] ]
        )
        check(
            '\\emptyset \\subset \\left[-1,\\equiv_10\\right]',
            [ 'Subset', 'EmptySet',
                [ 'EquivalenceClassModulo', [ 'NumberNegation', [ 'Number', '1' ] ],
                    [ 'Number', '10' ] ] ]
        )
    } )

    it( 'can parse type sentences and combinations of them', () => {
        check( 'x \\text{is a set}',
            [ 'HasType', [ 'NumberVariable', 'x' ], 'SetType' ] )
        check( 'n \\text{is }\\text{a number}',
            [ 'HasType', [ 'NumberVariable', 'n' ], 'NumberType' ] )
        check( 'S\\text{is}~\\text{a partial order}',
            [ 'HasType', [ 'NumberVariable', 'S' ], 'PartialOrderType' ] )
        check( '1\\text{is a number}\\wedge 10\\text{is a number}',
            [ 'Conjunction',
                [ 'HasType', [ 'Number', '1' ], 'NumberType' ],
                [ 'HasType', [ 'Number', '10' ], 'NumberType' ] ] )
        check( 'R\\text{is an equivalence relation}\\Rightarrow R\\text{is a relation}',
            [ 'Implication',
                [ 'HasType', [ 'NumberVariable', 'R' ], 'EquivalenceRelationType' ],
                [ 'HasType', [ 'NumberVariable', 'R' ], 'RelationType' ] ] )
    } )

    it( 'can parse notation for expression function application', () => {
        check(
            '\\mathcal{f}(x)',
            [ 'NumberEFA', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ]
        )
        check(
            'F(\\mathcal{k}(10))',
            [ 'NumberFunctionApplication',
                [ 'FunctionVariable', 'F' ],
                [ 'NumberEFA', [ 'FunctionVariable', 'k' ], [ 'Number', '10' ] ] ]
        )
        check(
            '\\mathcal{E}(L\')',
            [ 'NumberEFA', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ]
        )
        check(
            '\\emptyset\\cap\\mathcal{f}(2)',
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetEFA', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ]
        )
        check(
            '\\mathcal{P}(x)\\wedge\\mathcal{Q}(y)',
            [ 'Conjunction',
                [ 'PropositionEFA', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'x' ] ],
                [ 'PropositionEFA', [ 'FunctionVariable', 'Q' ], [ 'NumberVariable', 'y' ] ] ]
        )
    } )

    it( 'can parse notation for assumptions', () => {
        // You can assume a sentence
        check( '\\text{Assume }X', [ 'Given_Variant1', [ 'LogicVariable', 'X' ] ] )
        check( '\\text{assume }X', [ 'Given_Variant2', [ 'LogicVariable', 'X' ] ] )
        check( '\\text{Given }X', [ 'Given_Variant3', [ 'LogicVariable', 'X' ] ] )
        check( '\\text{given }X', [ 'Given_Variant4', [ 'LogicVariable', 'X' ] ] )
        check(
            '\\text{Assume }k=1000',
            [ 'Given_Variant1',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ]
        )
        check(
            '\\text{assume }k=1000',
            [ 'Given_Variant2',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ]
        )
        check(
            '\\text{Given }k=1000',
            [ 'Given_Variant3',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ]
        )
        check(
            '\\text{given }k=1000',
            [ 'Given_Variant4',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ]
        )
        check( '\\text{Assume }\\top', [ 'Given_Variant1', 'LogicalTrue' ] )
        check( '\\text{assume }\\top', [ 'Given_Variant2', 'LogicalTrue' ] )
        check( '\\text{Given }\\top', [ 'Given_Variant3', 'LogicalTrue' ] )
        check( '\\text{given }\\top', [ 'Given_Variant4', 'LogicalTrue' ] )
        // You cannot assume something that's not a sentence
        checkFail( '\\text{Assume }50' )
        checkFail( '\\text{assume }(5,6)' )
        checkFail( '\\text{Given }f\\circ g' )
        checkFail( '\\text{given }\\emptyset' )
        checkFail( '\\text{Assume }\\infty' )
    } )

    it( 'can parse notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( '\\text{Let }x', [ 'Let_Variant1', [ 'NumberVariable', 'x' ] ] )
        check( '\\text{let }x', [ 'Let_Variant2', [ 'NumberVariable', 'x' ] ] )
        check( '\\text{Let }T', [ 'Let_Variant1', [ 'NumberVariable', 'T' ] ] )
        check( '\\text{let }T', [ 'Let_Variant2', [ 'NumberVariable', 'T' ] ] )
        // You can declare variables with predicates attached
        check(
            '\\text{Let }x \\text{ be such that }x>0',
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            '\\text{let }x \\text{ be such that }x>0',
            [ 'LetBeSuchThat_Variant2', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            '\\text{Let }T \\text{ be such that }T=5\\vee T\\in S',
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
        )
        check(
            '\\text{let }T \\text{ be such that }T=5\\vee T\\in S',
            [ 'LetBeSuchThat_Variant2', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
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

    it( 'can parse notation for For Some-style declarations', () => {
        // You can declare variables with predicates attached
        check(
            '\\text{For some }x, x>0',
            [ 'ForSome_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            '\\text{for some }x, x>0',
            [ 'ForSome_Variant2', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            'x>0 \\text{ for some } x',
            [ 'ForSome_Variant3', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            'x>0~\\text{for some}~x',
            [ 'ForSome_Variant4', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ]
        )
        check(
            '\\text{For some }T, T=5\\vee T\\in S',
            [ 'ForSome_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
        )
        check(
            '\\text{for some }T, T=5\\vee T\\in S',
            [ 'ForSome_Variant2', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
        )
        check(
            'T=5\\vee T\\in S \\text{ for some } T',
            [ 'ForSome_Variant3', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
        )
        check(
            'T=5\\vee T\\in S~\\text{for some}~T',
            [ 'ForSome_Variant4', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ]
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
