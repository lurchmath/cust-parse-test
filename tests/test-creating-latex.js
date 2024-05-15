
import { expect } from 'chai'
import { converter } from '../example-converter.js'
import { AST } from '../ast.js'

const latex = converter.languages.get( 'latex' )

describe( 'Rendering JSON into LaTeX', () => {

    const check = ( json, latexText ) => {
        expect(
            new AST( latex, json ).toLanguage( latex )
        ).to.eql( latexText )
        global.log?.( 'JSON', json, 'LaTeX', latexText )
    }

    it( 'can convert JSON numbers to LaTeX', () => {
        // non-negative integers
        check( [ 'Number', '0' ], '0' )
        check( [ 'Number', '453789' ], '453789' )
        check(
            [ 'Number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        check( [ 'NumberNegation', [ 'Number', '453789' ] ], '-453789' )
        check(
            [ 'NumberNegation',
                [ 'Number', '99999999999999999999999999999999999999999' ] ],
            '-99999999999999999999999999999999999999999'
        )
        // non-negative decimals
        check( [ 'Number', '0.0' ], '0.0' )
        check( [ 'Number', '29835.6875940' ], '29835.6875940' )
        check( [ 'Number', '653280458689.' ], '653280458689.' )
        check( [ 'Number', '.000006327589' ], '.000006327589' )
        // negative decimals are the negation of positive decimals
        check(
            [ 'NumberNegation', [ 'Number', '29835.6875940' ] ],
            '-29835.6875940'
        )
        check(
            [ 'NumberNegation', [ 'Number', '653280458689.' ] ],
            '-653280458689.'
        )
        check(
            [ 'NumberNegation', [ 'Number', '.000006327589' ] ],
            '-.000006327589'
        )
    } )

    it( 'can convert any size variable name from JSON to LaTeX', () => {
        // one-letter names work
        check( [ 'NumberVariable', 'x' ], 'x' )
        check( [ 'NumberVariable', 'E' ], 'E' )
        check( [ 'NumberVariable', 'q' ], 'q' )
        // multi-letter names work, too
        check( [ 'NumberVariable', 'foo' ], 'foo' )
        check( [ 'NumberVariable', 'bar' ], 'bar' )
        check( [ 'NumberVariable', 'to' ], 'to' )
    } )

    it( 'can convert numeric constants from JSON to LaTeX', () => {
        check( 'Infinity', '\\infty' )
        check( 'Pi', '\\pi' )
        check( 'EulersNumber', 'e' )
    } )

    it( 'can convert exponentiation of atomics from JSON to LaTeX', () => {
        check(
            [ 'Exponentiation', [ 'Number', '1' ], [ 'Number', '2' ] ],
            '1^2'
        )
        check(
            [ 'Exponentiation',
                [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ],
            'e^x'
        )
        check(
            [ 'Exponentiation', [ 'Number', '1' ], 'Infinity' ],
            '1^\\infty'
        )
    } )

    it( 'can convert atomic percentages and factorials from JSON to LaTeX', () => {
        check( [ 'Percentage', [ 'Number', '10' ] ], '10\\%' )
        check( [ 'Percentage', [ 'NumberVariable', 't' ] ], 't\\%' )
        check( [ 'Factorial', [ 'Number', '10' ] ], '10!' )
        check( [ 'Factorial', [ 'NumberVariable', 't' ] ], 't!' )
    } )

    it( 'can convert division of atomics or factors from JSON to LaTeX', () => {
        // division of atomics
        check(
            [ 'Division', [ 'Number', '1' ], [ 'Number', '2' ] ],
            '1\\div 2'
        )
        check(
            [ 'Division',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ],
            'x\\div y'
        )
        check(
            [ 'Division', [ 'Number', '0' ], 'Infinity' ],
            '0\\div \\infty'
        )
        // division of factors
        check(
            [ 'Division',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ],
            'x^2\\div 3'
        )
        check(
            [ 'Division',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
            ],
            '1\\div e^x'
        )
        check(
            [ 'Division',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ],
            '10\\%\\div 2^100'
        )
    } )

    it( 'can convert multiplication of atomics or factors from JSON to LaTeX', () => {
        // multiplication of atomics
        check(
            [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ],
            '1\\times 2'
        )
        check(
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ], [ 'NumberVariable', 'y' ] ],
            'x\\times y'
        )
        check(
            [ 'Multiplication', [ 'Number', '0' ], 'Infinity' ],
            '0\\times \\infty'
        )
        // multiplication of factors
        check(
            [ 'Multiplication',
                [ 'Exponentiation', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                [ 'Number', '3' ]
            ],
            'x^2\\times 3'
        )
        check(
            [ 'Multiplication',
                [ 'Number', '1' ],
                [ 'Exponentiation',
                    [ 'NumberVariable', 'e' ], [ 'NumberVariable', 'x' ] ]
            ],
            '1\\times e^x'
        )
        check(
            [ 'Multiplication',
                [ 'Percentage', [ 'Number', '10' ] ],
                [ 'Exponentiation', [ 'Number', '2' ], [ 'Number', '100' ] ]
            ],
            '10\\%\\times 2^100'
        )
    } )

    it( 'can convert negations of atomics or factors from JSON to LaTeX', () => {
        check(
            [ 'Multiplication',
                [ 'NumberNegation', [ 'Number', '1' ] ],
                [ 'Number', '2' ]
            ],
            '-1\\times 2'
        )
        check(
            [ 'Multiplication',
                [ 'NumberVariable', 'x' ],
                [ 'NumberNegation', [ 'NumberVariable', 'y' ] ]
            ],
            'x\\times -y'
        )
        check(
            [ 'Multiplication',
                [ 'NumberNegation',
                    [ 'Exponentiation',
                        [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ],
            '-x^2\\times -3'
        )
        check(
            [ 'NumberNegation', [ 'NumberNegation', [ 'NumberNegation',
                [ 'NumberNegation', [ 'Number', '1000' ] ] ] ] ],
            '----1000'
        )
    } )

    it( 'can convert additions and subtractions from JSON to LaTeX', () => {
        check(
            [ 'Addition',
                [ 'NumberVariable', 'x' ],
                [ 'NumberVariable', 'y' ]
            ],
            'x+y'
        )
        check(
            [ 'Subtraction',
                [ 'Number', '1' ],
                [ 'NumberNegation', [ 'Number', '3' ] ]
            ],
            '1--3'
        )
        check(
            [ 'Subtraction',
                [ 'Addition',
                    [ 'Exponentiation',
                        [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                    [ 'NumberVariable', 'C' ] ],
                'Pi' ],
            'A^B+C-\\pi'
        )
    } )

    it( 'can convert Number expressions with groupers from JSON to LaTeX', () => {
        check(
            [ 'NumberNegation',
                [ 'Multiplication', [ 'Number', '1' ], [ 'Number', '2' ] ] ],
            '-1\\times 2'
        )
        check(
            [ 'Factorial',
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ] ],
            '{1+2}!'
        )
        check(
            [ 'Exponentiation',
                [ 'NumberNegation',
                    [ 'NumberVariable', 'x' ] ],
                [ 'Multiplication',
                    [ 'Number', '2' ], [ 'NumberNegation', [ 'Number', '3' ] ] ]
            ],
            '{-x}^{2\\times -3}'
        )
        // Note: The following test doesn't come out the way you would expect,
        // but it's because the hierarchy of concepts in the parser encodes the
        // idea that (x+y)-z is the same as x+(y-z), which is actually true.
        check(
            [ 'Addition',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                [ 'Subtraction',
                    [ 'NumberVariable', 'C' ], [ 'NumberVariable', 'D' ] ]
            ],
            'A^B+C-D'
        )
        // Note: The following test shows that rendering LaTeX standardizes some
        // operators and groupers, notably cdot -> times and () -> {} here.
        check(
            [ 'Multiplication',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'k' ],
                    [ 'Subtraction',
                        [ 'Number', '1' ], [ 'NumberVariable', 'y' ] ] ],
                [ 'Addition',
                    [ 'Number', '2' ], [ 'NumberVariable', 'k' ] ] ],
            'k^{1-y}\\times {2+k}'
        )
    } )

    it( 'can parse relations of numeric expressions from JSON to LaTeX', () => {
        check(
            [ 'GreaterThan',
                [ 'Number', '1' ],
                [ 'Number', '2' ]
            ],
            '1>2'
        )
        check(
            [ 'LessThan',
                [ 'Subtraction', [ 'Number', '1' ], [ 'Number', '2' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ]
            ],
            '1-2<1+2'
        )
        check(
            [ 'Conjunction',
                [ 'GreaterThanOrEqual', [ 'Number', '2' ], [ 'Number', '1' ] ],
                [ 'LessThanOrEqual', [ 'Number', '2' ], [ 'Number', '3' ] ] ],
            '2\\ge 1\\wedge 2\\le 3'
        )
        check(
            [ 'BinaryRelationHolds', 'Divides', [ 'Number', '7' ], [ 'Number', '14' ] ],
            '7 | 14'
        )
        check(
            [ 'BinaryRelationHolds', 'Divides',
                [ 'NumberFunctionApplication', [ 'FunctionVariable', 'A' ], [ 'NumberVariable', 'k' ] ],
                [ 'Factorial', [ 'NumberVariable', 'n' ] ] ],
            'A(k) | n!'
        )
        check(
            [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                [ 'Subtraction', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ],
                [ 'Addition', [ 'Number', '1' ], [ 'NumberVariable', 'k' ] ] ],
            '1-k \\sim 1+k'
        )
        check(
            [ 'BinaryRelationHolds', 'ApproximatelyEqual',
                [ 'Number', '0.99' ], [ 'Number', '1.01' ] ],
            '0.99 \\approx 1.01'
        )
    } )

    it( 'can represent inequality if JSON explicitly requests it', () => {
        check(
            [ 'NotEqual', [ 'Number', '1' ], [ 'Number', '2' ] ],
            '1\\ne 2'
        )
        check(
            [ 'LogicalNegation',
                [ 'Equals', [ 'Number', '1' ], [ 'Number', '2' ] ] ],
            '\\neg 1=2'
        )
    } )

    it( 'can convert propositional logic atomics from JSON to LaTeX', () => {
        check( 'LogicalTrue', '\\top' )
        check( 'LogicalFalse', '\\bot' )
        check( 'Contradiction', '\\rightarrow \\leftarrow' )
        // Not checking variables here, because their meaning is ambiguous; we
        // will check below to ensure that they can be part of logic expressions.
    } )

    it( 'can convert propositional logic conjuncts from JSON to LaTeX', () => {
        check(
            [ 'Conjunction',
                'LogicalTrue',
                'LogicalFalse'
            ],
            '\\top\\wedge \\bot'
        )
        check(
            [ 'Conjunction',
                [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ],
                [ 'LogicalNegation', 'LogicalTrue' ]
            ],
            '\\neg P\\wedge \\neg \\top'
        )
        check(
            [ 'Conjunction',
                [ 'Conjunction',
                    [ 'LogicVariable', 'a' ],
                    [ 'LogicVariable', 'b' ]
                ],
                [ 'LogicVariable', 'c' ]
            ],
            'a\\wedge b\\wedge c'
        )
    } )

    it( 'can convert propositional logic disjuncts from JSON to LaTeX', () => {
        check(
            [ 'Disjunction',
                'LogicalTrue',
                [ 'LogicalNegation', [ 'LogicVariable', 'A' ] ]
            ],
            '\\top\\vee \\neg A'
        )
        check(
            [ 'Disjunction',
                [ 'Conjunction', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ],
                [ 'Conjunction', [ 'LogicVariable', 'Q' ], [ 'LogicVariable', 'P' ] ]
            ],
            'P\\wedge Q\\vee Q\\wedge P'
        )
    } )

    it( 'can convert propositional logic conditionals from JSON to LaTeX', () => {
        check(
            [ 'Implication',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ],
            'A\\Rightarrow Q\\wedge \\neg P'
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
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T'
        )
    } )

    it( 'can convert propositional logic biconditionals from JSON to LaTeX', () => {
        check(
            [ 'LogicalEquivalence',
                [ 'LogicVariable', 'A' ],
                [ 'Conjunction',
                    [ 'LogicVariable', 'Q' ],
                    [ 'LogicalNegation', [ 'LogicVariable', 'P' ] ]
                ]
            ],
            'A\\Leftrightarrow Q\\wedge \\neg P'
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
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T'
        )
    } )

    it( 'can convert propositional expressions with groupers from JSON to LaTeX', () => {
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
            'P\\vee {Q\\Leftrightarrow Q}\\wedge P'
        )
        check(
            [ 'LogicalNegation',
                [ 'LogicalEquivalence',
                    'LogicalTrue',
                    'LogicalFalse'
                ]
            ],
            '\\neg {\\top\\Leftrightarrow \\bot}'
        )
    } )

    it( 'can convert simple predicate logic expressions from JSON to LaTeX', () => {
        check(
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'LogicVariable', 'P' ]
            ],
            '\\forall x, P'
        )
        check(
            [ 'ExistentialQuantifier',
                [ 'NumberVariable', 't' ],
                [ 'LogicalNegation', [ 'LogicVariable', 'Q' ] ]
            ],
            '\\exists t, \\neg Q'
        )
        check(
            [ 'UniqueExistentialQuantifier',
                [ 'NumberVariable', 'k' ],
                [ 'Implication',
                    [ 'LogicVariable', 'm' ], [ 'LogicVariable', 'n' ] ]
            ],
            '\\exists ! k, m\\Rightarrow n'
        )
    } )

    it( 'can convert finite and empty sets from JSON to LaTeX', () => {
        // { }
        check( 'EmptySet', '\\emptyset' )
        // { 1 }
        check(
            [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
            '\\{1\\}'
        )
        // { 1, 2 }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'OneElementSequence', [ 'Number', '2' ] ] ] ],
            '\\{1,2\\}'
        )
        // { 1, 2, 3 }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'OneElementSequence', [ 'Number', '3' ] ] ] ] ],
            '\\{1,2,3\\}'
        )
        // { { }, { } }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', 'EmptySet',
                [ 'OneElementSequence', 'EmptySet' ] ] ],
            '\\{\\emptyset,\\emptyset\\}'
        )
        // { { { } } }
        check(
            [ 'FiniteSet', [ 'OneElementSequence',
                [ 'FiniteSet', [ 'OneElementSequence', 'EmptySet' ] ] ] ],
            '\\{\\{\\emptyset\\}\\}'
        )
        // { 3, x }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '3' ],
                [ 'OneElementSequence', [ 'NumberVariable', 'x' ] ] ] ],
            '\\{3,x\\}'
        )
        // { A cup B, A cap B }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence',
                    [ 'SetIntersection', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ] ] ],
            '\\{A\\cup B,A\\cap B\\}'
        )
        // { 1, 2, emptyset, K, P }
        check(
            [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                [ 'ElementThenSequence', [ 'Number', '2' ],
                    [ 'ElementThenSequence', 'EmptySet',
                        [ 'ElementThenSequence', [ 'NumberVariable', 'K' ],
                            [ 'OneElementSequence', [ 'NumberVariable', 'P' ] ] ] ] ] ] ],
            '\\{1,2,\\emptyset,K,P\\}'
        )
    } )

    it( 'can convert tuples and vectors from JSON to LaTeX', () => {
        // tuples containing at least two elements are valid
        check(
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ],
            '(5,6)'
        )
        check(
            [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '5' ], [ 'ElementThenSequence',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'OneElementSequence', [ 'NumberVariable', 'k' ] ] ] ] ],
            '(5,A\\cup B,k)'
        )
        // vectors containing at least two numbers are valid
        check(
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ],
                [ 'OneNumberSequence', [ 'Number', '6' ] ] ] ],
            '\\langle 5,6\\rangle'
        )
        check(
            [ 'Vector', [ 'NumberThenSequence', [ 'Number', '5' ], [ 'NumberThenSequence',
                [ 'NumberNegation', [ 'Number', '7' ] ],
                [ 'OneNumberSequence', [ 'NumberVariable', 'k' ] ] ] ] ],
            '\\langle 5,-7,k\\rangle'
        )
        // tuples can contain other tuples
        check(
            [ 'Tuple', [ 'ElementThenSequence',
                [ 'Tuple', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ],
                [ 'OneElementSequence', [ 'Number', '6' ] ] ] ],
            '((1,2),6)'
        )
    } )

    it( 'can convert simple set memberships and subsets to LaTeX', () => {
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ],
            'b\\in B'
        )
        check(
            [ 'NounIsElement', [ 'Number', '2' ],
                [ 'FiniteSet', [ 'ElementThenSequence', [ 'Number', '1' ],
                    [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ],
            '2\\in \\{1,2\\}'
        )
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'X' ],
                [ 'SetUnion', [ 'SetVariable', 'a' ], [ 'SetVariable', 'b' ] ] ],
            'X\\in a\\cup b'
        )
        check(
            [ 'NounIsElement',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ] ],
            'A\\cup B\\in X\\cup Y'
        )
        check(
            [ 'Subset',
                [ 'SetVariable', 'A' ],
                [ 'SetComplement', [ 'SetVariable', 'B' ] ] ],
            'A\\subset \\bar B'
        )
        check(
            [ 'SubsetOrEqual',
                [ 'SetIntersection', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ],
                [ 'SetUnion', [ 'SetVariable', 'u' ], [ 'SetVariable', 'v' ] ] ],
            'u\\cap v\\subseteq u\\cup v'
        )
        check(
            [ 'SubsetOrEqual',
                [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                [ 'SetUnion',
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '1' ] ] ],
                    [ 'FiniteSet', [ 'OneElementSequence', [ 'Number', '2' ] ] ] ] ],
            '\\{1\\}\\subseteq \\{1\\}\\cup \\{2\\}'
        )
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'p' ],
                [ 'SetCartesianProduct', [ 'SetVariable', 'U' ], [ 'SetVariable', 'V' ] ] ],
            'p\\in U\\times V'
        )
        check(
            [ 'NounIsElement', [ 'NumberVariable', 'q' ],
                [ 'SetUnion',
                    [ 'SetComplement', [ 'SetVariable', 'U' ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'V' ], [ 'SetVariable', 'W' ] ] ] ],
            'q\\in \\bar U\\cup V\\times W'
        )
        check(
            [ 'NounIsElement',
                [ 'Tuple',
                    [ 'ElementThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneElementSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ],
            '(a,b)\\in A\\times B'
        )
        check(
            [ 'NounIsElement',
                [ 'Vector',
                    [ 'NumberThenSequence',
                        [ 'NumberVariable', 'a' ],
                        [ 'OneNumberSequence', [ 'NumberVariable', 'b' ] ] ] ],
                    [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ],
            '\\langle a,b\\rangle\\in A\\times B'
        )
    } )

    it( 'can represent "notin" notation if JSON explicitly requests it', () => {
        check(
            [ 'LogicalNegation',
                [ 'NounIsElement', [ 'NumberVariable', 'a' ], [ 'SetVariable', 'A' ] ] ],
            '\\neg a\\in A'
        )
        check(
            [ 'LogicalNegation', [ 'NounIsElement', 'EmptySet', 'EmptySet' ] ],
            '\\neg \\emptyset\\in \\emptyset'
        )
        check(
            [ 'LogicalNegation',
                [ 'NounIsElement',
                    [ 'Subtraction', [ 'Number', '3' ], [ 'Number', '5' ] ],
                    [ 'SetIntersection', [ 'SetVariable', 'K' ], [ 'SetVariable', 'P' ] ]
                ]
            ],
            '\\neg 3-5\\in K\\cap P'
        )
        check(
            [ 'NounIsNotElement', [ 'NumberVariable', 'a' ], [ 'SetVariable', 'A' ] ],
            'a\\notin A'
        )
        check(
            [ 'NounIsNotElement', 'EmptySet', 'EmptySet' ],
            '\\emptyset\\notin \\emptyset'
        )
        check(
            [ 'NounIsNotElement',
                [ 'Subtraction', [ 'Number', '3' ], [ 'Number', '5' ] ],
                [ 'SetIntersection', [ 'SetVariable', 'K' ], [ 'SetVariable', 'P' ] ]
            ],
            '3-5\\notin K\\cap P'
        )
    } )

    it( 'can convert to LaTeX sentences built from various relations', () => {
        check(
            [ 'Disjunction',
                [ 'LogicVariable', 'P' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'b' ], [ 'SetVariable', 'B' ] ] ],
            'P\\vee b\\in B'
        )
        check(
            [ 'PropositionIsElement',
                [ 'Disjunction',
                    [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'b' ] ],
                [ 'SetVariable', 'B' ] ],
            '{P\\vee b}\\in B'
        )
        check(
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'x' ],
                [ 'NounIsElement',
                    [ 'NumberVariable', 'x' ], [ 'SetVariable', 'X' ] ] ],
            '\\forall x, x\\in X'
        )
        check(
            [ 'Conjunction',
                [ 'SubsetOrEqual', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
                [ 'SubsetOrEqual', [ 'SetVariable', 'B' ], [ 'SetVariable', 'A' ] ] ],
            'A\\subseteq B\\wedge B\\subseteq A'
        )
        check(
            [ 'Equals',
                [ 'SetVariable', 'R' ],
                [ 'SetCartesianProduct', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ],
            'R=A\\times B'
        )
        check(
            [ 'UniversalQuantifier',
                [ 'NumberVariable', 'n' ],
                [ 'BinaryRelationHolds', 'Divides',
                    [ 'NumberVariable', 'n' ],
                    [ 'Factorial', [ 'NumberVariable', 'n' ] ] ] ],
            '\\forall n, n | n!'
        )
        check(
            [ 'Implication',
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'a' ], [ 'NumberVariable', 'b' ] ],
                [ 'BinaryRelationHolds', 'GenericBinaryRelation',
                    [ 'NumberVariable', 'b' ], [ 'NumberVariable', 'a' ] ] ],
            'a \\sim b\\Rightarrow b \\sim a'
        )
    } )

    it( 'can create LaTeX notation related to functions', () => {
        check(
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ],
            'f:A\\to B'
        )
        check(
            [ 'LogicalNegation',
                [ 'FunctionSignature', [ 'FunctionVariable', 'F' ],
                    [ 'SetUnion', [ 'SetVariable', 'X' ], [ 'SetVariable', 'Y' ] ],
                    [ 'SetVariable', 'Z' ] ] ],
            '\\neg F:X\\cup Y\\to Z'
        )
        check(
            [ 'FunctionSignature',
                [ 'FunctionComposition', [ 'FunctionVariable', 'f' ], [ 'FunctionVariable', 'g' ] ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'C' ] ],
            'f\\circ g:A\\to C'
        )
        check(
            [ 'NumberFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ],
            'f(x)'
        )
        check(
            [ 'NumberFunctionApplication',
                [ 'FunctionInverse', [ 'FunctionVariable', 'f' ] ],
                [ 'NumberFunctionApplication',
                    [ 'FunctionInverse', [ 'FunctionVariable', 'g' ] ], [ 'Number', '10' ] ] ],
            'f ^ { - 1 }(g ^ { - 1 }(10))'
        )
        check(
            [ 'NumberFunctionApplication', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ],
            'E(\\bar L)'
        )
        check(
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetFunctionApplication', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ],
            '\\emptyset\\cap f(2)'
        )
        check(
            [ 'Conjunction',
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'e' ] ],
                [ 'PropositionFunctionApplication', [ 'FunctionVariable', 'Q' ],
                    [ 'Addition', [ 'Number', '3' ], [ 'NumberVariable', 'b' ] ] ] ],
            'P(e)\\wedge Q(3+b)'
        )
        check(
            [ 'EqualFunctions',
                [ 'FunctionVariable', 'F' ],
                [ 'FunctionComposition',
                    [ 'FunctionVariable', 'G' ],
                    [ 'FunctionInverse', [ 'FunctionVariable', 'H' ] ] ] ],
            'F=G\\circ H ^ { - 1 }'
        )
    } )

    it( 'can represent trigonometric functions correctly', () => {
        check(
            [ 'PrefixFunctionApplication', 'SineFunction', [ 'NumberVariable', 'x' ] ],
            '\\sin x'
        )
        check(
            [ 'PrefixFunctionApplication', 'CosineFunction',
                [ 'Multiplication', 'Pi', [ 'NumberVariable', 'x' ] ] ],
            '\\cos \\pi\\times x'
        )
        check(
            [ 'PrefixFunctionApplication', 'TangentFunction', [ 'NumberVariable', 't' ] ],
            '\\tan t'
        )
        check(
            [ 'Division', [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'CotangentFunction', 'Pi' ] ],
            '1\\div \\cot \\pi'
        )
        check(
            [ 'Equals',
                [ 'PrefixFunctionApplication', 'SecantFunction', [ 'NumberVariable', 'y' ] ],
                [ 'PrefixFunctionApplication', 'CosecantFunction', [ 'NumberVariable', 'y' ] ] ],
            '\\sec y=\\csc y'
        )
    } )

    it( 'can express logarithms correctly', () => {
        check(
            [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ],
            '\\log n'
        )
        check(
            [ 'Addition',
                [ 'Number', '1' ],
                [ 'PrefixFunctionApplication', 'NaturalLogarithm', [ 'NumberVariable', 'x' ] ] ],
            '1+\\ln x'
        )
        check(
            [ 'PrefixFunctionApplication',
                [ 'LogarithmWithBase', [ 'Number', '2' ] ], [ 'Number', '1024' ] ],
            '\\log_2 1024'
        )
        check(
            [ 'Division',
                [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ],
                [ 'PrefixFunctionApplication', 'Logarithm',
                    [ 'PrefixFunctionApplication', 'Logarithm', [ 'NumberVariable', 'n' ] ] ] ],
            '\\log n\\div \\log \\log n'
        )
    } )

    it( 'can express equivalence classes and expressions that use them', () => {
        check(
            [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ],
            '[1,\\approx]'
        )
        check(
            [ 'EquivalenceClass',
                [ 'Addition', [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ],
                'GenericBinaryRelation' ],
            '[x+2,\\sim]'
        )
        check(
            [ 'SetUnion',
                [ 'EquivalenceClass', [ 'Number', '1' ], 'ApproximatelyEqual' ],
                [ 'EquivalenceClass', [ 'Number', '2' ], 'ApproximatelyEqual' ] ],
            '[1,\\approx]\\cup [2,\\approx]'
        )
        check(
            [ 'NounIsElement', [ 'Number', '7' ],
                [ 'EquivalenceClass', [ 'Number', '7' ], 'GenericBinaryRelation' ] ],
            '7\\in [7,\\sim]'
        )
        check(
            [ 'GenericEquivalenceClass', [ 'NumberVariable', 'P' ] ],
            '[P]'
        )
    } )

    it( 'can express equivalence and classes mod a number', () => {
        check(
            [ 'EquivalentModulo',
                [ 'Number', '5' ], [ 'Number', '11' ], [ 'Number', '3' ] ],
            '5 \\equiv 11 \\mod 3'
        )
        check(
            [ 'EquivalentModulo', [ 'NumberVariable', 'k' ],
                [ 'NumberVariable', 'm' ], [ 'NumberVariable', 'n' ] ],
            'k \\equiv m \\mod n'
        )
        check(
            [ 'Subset', 'EmptySet',
                [ 'EquivalenceClassModulo', [ 'NumberNegation', [ 'Number', '1' ] ],
                    [ 'Number', '10' ] ] ],
            '\\emptyset\\subset [-1, \\equiv _ 10]'
        )
    } )

    it( 'can construct type sentences and combinations of them', () => {
        check(
            [ 'HasType', [ 'NumberVariable', 'x' ], 'SetType' ],
            'x \\text{is a set}'
        )
        check(
            [ 'HasType', [ 'NumberVariable', 'n' ], 'NumberType' ],
            'n \\text{is a number}'
        )
        check(
            [ 'HasType', [ 'NumberVariable', 'S' ], 'PartialOrderType' ],
            'S \\text{is a partial order}'
        )
        check(
            [ 'Conjunction',
                [ 'HasType', [ 'Number', '1' ], 'NumberType' ],
                [ 'HasType', [ 'Number', '10' ], 'NumberType' ] ],
            '1 \\text{is a number}\\wedge 10 \\text{is a number}'
        )
        check(
            [ 'Implication',
                [ 'HasType', [ 'NumberVariable', 'R' ], 'EquivalenceRelationType' ],
                [ 'HasType', [ 'NumberVariable', 'R' ], 'RelationType' ] ],
            'R \\text{is an equivalence relation}\\Rightarrow R \\text{is a relation}'
        )
    } )

    it( 'can create notation for expression function application', () => {
        check(
            [ 'NumberEFA', [ 'FunctionVariable', 'f' ], [ 'NumberVariable', 'x' ] ],
            '\\mathcal{f} (x)'
        )
        check(
            [ 'NumberFunctionApplication',
                [ 'FunctionVariable', 'F' ],
                [ 'NumberEFA', [ 'FunctionVariable', 'k' ], [ 'Number', '10' ] ] ],
            'F(\\mathcal{k} (10))'
        )
        check(
            [ 'NumberEFA', // this is the output type, not the input type
                [ 'FunctionVariable', 'E' ],
                [ 'SetComplement', [ 'SetVariable', 'L' ] ] ],
            '\\mathcal{E} (\\bar L)'
        )
        check(
            [ 'SetIntersection',
                'EmptySet',
                [ 'SetEFA', [ 'FunctionVariable', 'f' ], [ 'Number', '2' ] ] ],
            '\\emptyset\\cap \\mathcal{f} (2)'
        )
        check(
            [ 'Conjunction',
                [ 'PropositionEFA', [ 'FunctionVariable', 'P' ], [ 'NumberVariable', 'x' ] ],
                [ 'PropositionEFA', [ 'FunctionVariable', 'Q' ], [ 'NumberVariable', 'y' ] ] ],
            '\\mathcal{P} (x)\\wedge \\mathcal{Q} (y)'
        )
    } )

    it( 'can create notation for assumptions', () => {
        check(
            [ 'Given_Variant1', [ 'LogicVariable', 'X' ] ],
            '\\text{Assume }X'
        )
        check(
            [ 'Given_Variant2', [ 'LogicVariable', 'X' ] ],
            '\\text{assume }X'
        )
        check(
            [ 'Given_Variant3', [ 'LogicVariable', 'X' ] ],
            '\\text{Given }X'
        )
        check(
            [ 'Given_Variant4', [ 'LogicVariable', 'X' ] ],
            '\\text{given }X'
        )
        check(
            [ 'Given_Variant1',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            '\\text{Assume }k=1000'
        )
        check(
            [ 'Given_Variant2',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            '\\text{assume }k=1000'
        )
        check(
            [ 'Given_Variant3',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            '\\text{Given }k=1000'
        )
        check(
            [ 'Given_Variant4',
                [ 'Equals', [ 'NumberVariable', 'k' ], [ 'Number', '1000' ] ] ],
            '\\text{given }k=1000'
        )
        check(
            [ 'Given_Variant1', 'LogicalTrue' ],
            '\\text{Assume }\\top'
        )
        check(
            [ 'Given_Variant2', 'LogicalTrue' ],
            '\\text{assume }\\top'
        )
        check(
            [ 'Given_Variant3', 'LogicalTrue' ],
            '\\text{Given }\\top'
        )
        check(
            [ 'Given_Variant4', 'LogicalTrue' ],
            '\\text{given }\\top'
        )
    } )

    it( 'can create notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( [ 'Let_Variant1', [ 'NumberVariable', 'x' ] ], '\\text{Let }x' )
        check( [ 'Let_Variant2', [ 'NumberVariable', 'x' ] ], '\\text{let }x' )
        check( [ 'Let_Variant1', [ 'NumberVariable', 'T' ] ], '\\text{Let }T' )
        check( [ 'Let_Variant2', [ 'NumberVariable', 'T' ] ], '\\text{let }T' )
        // You can declare variables with predicates attached
        check(
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '\\text{Let }x \\text{ be such that }x>0'
        )
        check(
            [ 'LetBeSuchThat_Variant2', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '\\text{let }x \\text{ be such that }x>0'
        )
        check(
            [ 'LetBeSuchThat_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '\\text{Let }T \\text{ be such that }T=5\\vee T\\in S'
        )
        check(
            [ 'LetBeSuchThat_Variant2', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '\\text{let }T \\text{ be such that }T=5\\vee T\\in S'
        )
    } )

    it( 'can parse notation for For Some-style declarations', () => {
        // You can declare variables with predicates attached
        check(
            [ 'ForSome_Variant1', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '\\text{For some }x, x>0'
        )
        check(
            [ 'ForSome_Variant2', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            '\\text{for some }x, x>0'
        )
        check(
            [ 'ForSome_Variant3', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            'x>0 \\text{ for some } x'
        )
        check(
            [ 'ForSome_Variant4', [ 'NumberVariable', 'x' ],
                [ 'GreaterThan', [ 'NumberVariable', 'x' ], [ 'Number', '0' ] ] ],
            'x>0~\\text{for some}~x'
        )
        check(
            [ 'ForSome_Variant1', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '\\text{For some }T, T=5\\vee T\\in S'
        )
        check(
            [ 'ForSome_Variant2', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            '\\text{for some }T, T=5\\vee T\\in S'
        )
        check(
            [ 'ForSome_Variant3', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            'T=5\\vee T\\in S \\text{ for some } T'
        )
        check(
            [ 'ForSome_Variant4', [ 'NumberVariable', 'T' ],
                [ 'Disjunction',
                    [ 'Equals', [ 'NumberVariable', 'T' ], [ 'Number', '5' ] ],
                    [ 'NounIsElement', [ 'NumberVariable', 'T' ], [ 'SetVariable', 'S' ] ] ] ],
            'T=5\\vee T\\in S~\\text{for some}~T'
        )
    } )

} )
