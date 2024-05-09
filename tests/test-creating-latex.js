
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
        check( [ 'number', '0' ], '0' )
        check( [ 'number', '453789' ], '453789' )
        check(
            [ 'number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        check( [ 'numbernegation', [ 'number', '453789' ] ], '-453789' )
        check(
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ],
            '-99999999999999999999999999999999999999999'
        )
        // non-negative decimals
        check( [ 'number', '0.0' ], '0.0' )
        check( [ 'number', '29835.6875940' ], '29835.6875940' )
        check( [ 'number', '653280458689.' ], '653280458689.' )
        check( [ 'number', '.000006327589' ], '.000006327589' )
        // negative decimals are the negation of positive decimals
        check(
            [ 'numbernegation', [ 'number', '29835.6875940' ] ],
            '-29835.6875940'
        )
        check(
            [ 'numbernegation', [ 'number', '653280458689.' ] ],
            '-653280458689.'
        )
        check(
            [ 'numbernegation', [ 'number', '.000006327589' ] ],
            '-.000006327589'
        )
    } )

    it( 'can convert any size variable name from JSON to LaTeX', () => {
        // one-letter names work
        check( [ 'numbervariable', 'x' ], 'x' )
        check( [ 'numbervariable', 'E' ], 'E' )
        check( [ 'numbervariable', 'q' ], 'q' )
        // multi-letter names work, too
        check( [ 'numbervariable', 'foo' ], 'foo' )
        check( [ 'numbervariable', 'bar' ], 'bar' )
        check( [ 'numbervariable', 'to' ], 'to' )
    } )

    it( 'can convert numeric constants from JSON to LaTeX', () => {
        check( 'infinity', '\\infty' )
        check( 'pi', '\\pi' )
        check( 'eulersnumber', 'e' )
    } )

    it( 'can convert exponentiation of atomics from JSON to LaTeX', () => {
        check(
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ],
            '1^2'
        )
        check(
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ],
            'e^x'
        )
        check(
            [ 'exponentiation', [ 'number', '1' ], 'infinity' ],
            '1^\\infty'
        )
    } )

    it( 'can convert atomic percentages and factorials from JSON to LaTeX', () => {
        check( [ 'percentage', [ 'number', '10' ] ], '10\\%' )
        check( [ 'percentage', [ 'numbervariable', 't' ] ], 't\\%' )
        check( [ 'factorial', [ 'number', '10' ] ], '10!' )
        check( [ 'factorial', [ 'numbervariable', 't' ] ], 't!' )
    } )

    it( 'can convert division of atomics or factors from JSON to LaTeX', () => {
        // division of atomics
        check(
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ],
            '1\\div 2'
        )
        check(
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            'x\\div y'
        )
        check(
            [ 'division', [ 'number', '0' ], 'infinity' ],
            '0\\div \\infty'
        )
        // division of factors
        check(
            [ 'division',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            'x^2\\div 3'
        )
        check(
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '1\\div e^x'
        )
        check(
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '10\\%\\div 2^100'
        )
    } )

    it( 'can convert multiplication of atomics or factors from JSON to LaTeX', () => {
        // multiplication of atomics
        check(
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ],
            '1\\times 2'
        )
        check(
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            'x\\times y'
        )
        check(
            [ 'multiplication', [ 'number', '0' ], 'infinity' ],
            '0\\times \\infty'
        )
        // multiplication of factors
        check(
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            'x^2\\times 3'
        )
        check(
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '1\\times e^x'
        )
        check(
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '10\\%\\times 2^100'
        )
    } )

    it( 'can convert negations of atomics or factors from JSON to LaTeX', () => {
        check(
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ],
            '-1\\times 2'
        )
        check(
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ],
            'x\\times -y'
        )
        check(
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '-x^2\\times -3'
        )
        check(
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ],
            '----1000'
        )
    } )

    it( 'can convert additions and subtractions from JSON to LaTeX', () => {
        check(
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ],
            'x+y'
        )
        check(
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '1--3'
        )
        check(
            [ 'subtraction',
                [ 'addition',
                    [ 'exponentiation',
                        [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                    [ 'numbervariable', 'C' ] ],
                'pi' ],
            'A^B+C-\\pi'
        )
    } )

    it( 'can convert number expressions with groupers from JSON to LaTeX', () => {
        check(
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '-1\\times 2'
        )
        check(
            [ 'factorial',
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '{1+2}!'
        )
        check(
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ],
            '{-x}^{2\\times -3}'
        )
        // Note: The following test doesn't come out the way you would expect,
        // but it's because the hierarchy of concepts in the parser encodes the
        // idea that (x+y)-z is the same as x+(y-z), which is actually true.
        check(
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ]
            ],
            'A^B+C-D'
        )
        // Note: The following test shows that rendering LaTeX standardizes some
        // operators and groupers, notably cdot -> times and () -> {} here.
        check(
            [ 'multiplication',
                [ 'exponentiation',
                    [ 'numbervariable', 'k' ],
                    [ 'subtraction',
                        [ 'number', '1' ], [ 'numbervariable', 'y' ] ] ],
                [ 'addition',
                    [ 'number', '2' ], [ 'numbervariable', 'k' ] ] ],
            'k^{1-y}\\times {2+k}'
        )
    } )

    it( 'can parse relations of numeric expressions from JSON to LaTeX', () => {
        check(
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ],
            '1>2'
        )
        check(
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ],
            '1-2<1+2'
        )
        check(
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ],
            '2\\ge 1\\wedge 2\\le 3'
        )
        check(
            [ 'binrelapp', 'divisibility', [ 'number', '7' ], [ 'number', '14' ] ],
            '7 | 14'
        )
        check(
            [ 'binrelapp', 'divisibility',
                [ 'numfuncapp', [ 'funcvariable', 'A' ], [ 'numbervariable', 'k' ] ],
                [ 'factorial', [ 'numbervariable', 'n' ] ] ],
            'A(k) | n!'
        )
        check(
            [ 'binrelapp', 'genericrelation',
                [ 'subtraction', [ 'number', '1' ], [ 'numbervariable', 'k' ] ],
                [ 'addition', [ 'number', '1' ], [ 'numbervariable', 'k' ] ] ],
            '1-k \\sim 1+k'
        )
        check(
            [ 'binrelapp', 'approximately',
                [ 'number', '0.99' ], [ 'number', '1.01' ] ],
            '0.99 \\approx 1.01'
        )
    } )

    it( 'can represent inequality if JSON explicitly requests it', () => {
        check(
            [ 'inequality', [ 'number', '1' ], [ 'number', '2' ] ],
            '1\\ne 2'
        )
        check(
            [ 'logicnegation',
                [ 'equality', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '\\neg 1=2'
        )
    } )

    it( 'can convert propositional logic atomics from JSON to LaTeX', () => {
        check( 'logicaltrue', '\\top' )
        check( 'logicalfalse', '\\bot' )
        check( 'contradiction', '\\rightarrow \\leftarrow' )
        // Not checking variables here, because their meaning is ambiguous; we
        // will check below to ensure that they can be part of logic expressions.
    } )

    it( 'can convert propositional logic conjuncts from JSON to LaTeX', () => {
        check(
            [ 'conjunction',
                'logicaltrue',
                'logicalfalse'
            ],
            '\\top\\wedge \\bot'
        )
        check(
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', 'logicaltrue' ]
            ],
            '\\neg P\\wedge \\neg \\top'
        )
        check(
            [ 'conjunction',
                [ 'conjunction',
                    [ 'logicvariable', 'a' ],
                    [ 'logicvariable', 'b' ]
                ],
                [ 'logicvariable', 'c' ]
            ],
            'a\\wedge b\\wedge c'
        )
    } )

    it( 'can convert propositional logic disjuncts from JSON to LaTeX', () => {
        check(
            [ 'disjunction',
                'logicaltrue',
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ],
            '\\top\\vee \\neg A'
        )
        check(
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ],
            'P\\wedge Q\\vee Q\\wedge P'
        )
    } )

    it( 'can convert propositional logic conditionals from JSON to LaTeX', () => {
        check(
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            'A\\Rightarrow Q\\wedge \\neg P'
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
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T'
        )
    } )

    it( 'can convert propositional logic biconditionals from JSON to LaTeX', () => {
        check(
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            'A\\Leftrightarrow Q\\wedge \\neg P'
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
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T'
        )
    } )

    it( 'can convert propositional expressions with groupers from JSON to LaTeX', () => {
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
            'P\\vee {Q\\Leftrightarrow Q}\\wedge P'
        )
        check(
            [ 'logicnegation',
                [ 'iff',
                    'logicaltrue',
                    'logicalfalse'
                ]
            ],
            '\\neg {\\top\\Leftrightarrow \\bot}'
        )
    } )

    it( 'can convert simple predicate logic expressions from JSON to LaTeX', () => {
        check(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ],
            '\\forall x, P'
        )
        check(
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ],
            '\\exists t, \\neg Q'
        )
        check(
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication',
                    [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ],
            '\\exists ! k, m\\Rightarrow n'
        )
    } )

    it( 'can convert finite and empty sets from JSON to LaTeX', () => {
        // { }
        check( 'emptyset', '\\emptyset' )
        // { 1 }
        check(
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
            '\\{1\\}'
        )
        // { 1, 2 }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ],
            '\\{1,2\\}'
        )
        // { 1, 2, 3 }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ],
            '\\{1,2,3\\}'
        )
        // { { }, { } }
        check(
            [ 'finiteset', [ 'eltthenseq', 'emptyset',
                [ 'oneeltseq', 'emptyset' ] ] ],
            '\\{\\emptyset,\\emptyset\\}'
        )
        // { { { } } }
        check(
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', 'emptyset' ] ] ] ],
            '\\{\\{\\emptyset\\}\\}'
        )
        // { 3, x }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ],
            '\\{3,x\\}'
        )
        // { A cup B, A cap B }
        check(
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ],
            '\\{A\\cup B,A\\cap B\\}'
        )
        // { 1, 2, emptyset, K, P }
        check(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', 'emptyset',
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ],
            '\\{1,2,\\emptyset,K,P\\}'
        )
    } )

    it( 'can convert tuples and vectors from JSON to LaTeX', () => {
        // tuples containing at least two elements are valid
        check(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '(5,6)'
        )
        check(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '(5,A\\cup B,k)'
        )
        // vectors containing at least two numbers are valid
        check(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ],
            '\\langle 5,6\\rangle'
        )
        check(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '\\langle 5,-7,k\\rangle'
        )
        // tuples can contain other tuples
        check(
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '((1,2),6)'
        )
    } )

    it( 'can convert simple set memberships and subsets to LaTeX', () => {
        check(
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ],
            'b\\in B'
        )
        check(
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '2\\in \\{1,2\\}'
        )
        check(
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ],
            'X\\in a\\cup b'
        )
        check(
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ],
            'A\\cup B\\in X\\cup Y'
        )
        check(
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ],
            'A\\subset \\bar B'
        )
        check(
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ],
            'u\\cap v\\subseteq u\\cup v'
        )
        check(
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '\\{1\\}\\subseteq \\{1\\}\\cup \\{2\\}'
        )
        check(
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ],
            'p\\in U\\times V'
        )
        check(
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ],
            'q\\in \\bar U\\cup V\\times W'
        )
        check(
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '(a,b)\\in A\\times B'
        )
        check(
            [ 'nounisin',
                [ 'vector',
                    [ 'numthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'onenumseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '\\langle a,b\\rangle\\in A\\times B'
        )
    } )

    it( 'can represent "notin" notation if JSON explicitly requests it', () => {
        check(
            [ 'logicnegation',
                [ 'nounisin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ] ],
            '\\neg a\\in A'
        )
        check(
            [ 'logicnegation', [ 'nounisin', 'emptyset', 'emptyset' ] ],
            '\\neg \\emptyset\\in \\emptyset'
        )
        check(
            [ 'logicnegation',
                [ 'nounisin',
                    [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                    [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
                ]
            ],
            '\\neg 3-5\\in K\\cap P'
        )
        check(
            [ 'nounisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ],
            'a\\notin A'
        )
        check(
            [ 'nounisnotin', 'emptyset', 'emptyset' ],
            '\\emptyset\\notin \\emptyset'
        )
        check(
            [ 'nounisnotin',
                [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
            ],
            '3-5\\notin K\\cap P'
        )
    } )

    it( 'can convert to LaTeX sentences built from various relations', () => {
        check(
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ],
            'P\\vee b\\in B'
        )
        check(
            [ 'propisin',
                [ 'disjunction',
                    [ 'logicvariable', 'P' ], [ 'logicvariable', 'b' ] ],
                [ 'setvariable', 'B' ] ],
            '{P\\vee b}\\in B'
        )
        check(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ],
            '\\forall x, x\\in X'
        )
        check(
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ],
            'A\\subseteq B\\wedge B\\subseteq A'
        )
        check(
            [ 'equality',
                [ 'setvariable', 'R' ],
                [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            'R=A\\times B'
        )
        check(
            [ 'universal',
                [ 'numbervariable', 'n' ],
                [ 'binrelapp', 'divisibility',
                    [ 'numbervariable', 'n' ],
                    [ 'factorial', [ 'numbervariable', 'n' ] ] ] ],
            '\\forall n, n | n!'
        )
        check(
            [ 'implication',
                [ 'binrelapp', 'genericrelation',
                    [ 'numbervariable', 'a' ], [ 'numbervariable', 'b' ] ],
                [ 'binrelapp', 'genericrelation',
                    [ 'numbervariable', 'b' ], [ 'numbervariable', 'a' ] ] ],
            'a \\sim b\\Rightarrow b \\sim a'
        )
    } )

    it( 'can create LaTeX notation related to functions', () => {
        check(
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
            'f:A\\to B'
        )
        check(
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ],
            '\\neg F:X\\cup Y\\to Z'
        )
        check(
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ],
            'f\\circ g:A\\to C'
        )
        check(
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
            'f(x)'
        )
        check(
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ],
            'f ^ { - 1 }(g ^ { - 1 }(10))'
        )
        check(
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ],
            'E(\\bar L)'
        )
        check(
            [ 'intersection',
                'emptyset',
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ],
            '\\emptyset\\cap f(2)'
        )
        check(
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ],
            'P(e)\\wedge Q(3+b)'
        )
        check(
            [ 'funcequality',
                [ 'funcvariable', 'F' ],
                [ 'funccomp',
                    [ 'funcvariable', 'G' ],
                    [ 'funcinverse', [ 'funcvariable', 'H' ] ] ] ],
            'F=G\\circ H ^ { - 1 }'
        )
    } )

    it( 'can represent trigonometric functions correctly', () => {
        check(
            [ 'prefixfuncapp', 'sinfunc', [ 'numbervariable', 'x' ] ],
            '\\sin x'
        )
        check(
            [ 'prefixfuncapp', 'cosfunc',
                [ 'multiplication', 'pi', [ 'numbervariable', 'x' ] ] ],
            '\\cos \\pi\\times x'
        )
        check(
            [ 'prefixfuncapp', 'tanfunc', [ 'numbervariable', 't' ] ],
            '\\tan t'
        )
        check(
            [ 'division', [ 'number', '1' ],
                [ 'prefixfuncapp', 'cotfunc', 'pi' ] ],
            '1\\div \\cot \\pi'
        )
        check(
            [ 'equality',
                [ 'prefixfuncapp', 'secfunc', [ 'numbervariable', 'y' ] ],
                [ 'prefixfuncapp', 'cscfunc', [ 'numbervariable', 'y' ] ] ],
            '\\sec y=\\csc y'
        )
    } )

    it( 'can express logarithms correctly', () => {
        check(
            [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ],
            '\\log n'
        )
        check(
            [ 'addition',
                [ 'number', '1' ],
                [ 'prefixfuncapp', 'naturallog', [ 'numbervariable', 'x' ] ] ],
            '1+\\ln x'
        )
        check(
            [ 'prefixfuncapp',
                [ 'logwithbase', [ 'number', '2' ] ], [ 'number', '1024' ] ],
            '\\log_2 1024'
        )
        check(
            [ 'division',
                [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ],
                [ 'prefixfuncapp', 'logarithm',
                    [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ] ] ],
            '\\log n\\div \\log \\log n'
        )
    } )

    it( 'can express equivalence classes and expressions that use them', () => {
        check(
            [ 'equivclass', [ 'number', '1' ], 'approximately' ],
            '[1,\\approx]'
        )
        check(
            [ 'equivclass',
                [ 'addition', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                'genericrelation' ],
            '[x+2,\\sim]'
        )
        check(
            [ 'union',
                [ 'equivclass', [ 'number', '1' ], 'approximately' ],
                [ 'equivclass', [ 'number', '2' ], 'approximately' ] ],
            '[1,\\approx]\\cup [2,\\approx]'
        )
        check(
            [ 'nounisin', [ 'number', '7' ],
                [ 'equivclass', [ 'number', '7' ], 'genericrelation' ] ],
            '7\\in [7,\\sim]'
        )
        check(
            [ 'bareequivclass', [ 'numbervariable', 'P' ] ],
            '[P]'
        )
    } )

    it( 'can express equivalence and classes mod a number', () => {
        check(
            [ 'equivmodulo',
                [ 'number', '5' ], [ 'number', '11' ], [ 'number', '3' ] ],
            '5 \\equiv 11 \\mod 3'
        )
        check(
            [ 'equivmodulo', [ 'numbervariable', 'k' ],
                [ 'numbervariable', 'm' ], [ 'numbervariable', 'n' ] ],
            'k \\equiv m \\mod n'
        )
        check(
            [ 'subset', 'emptyset',
                [ 'eqmodclass', [ 'numbernegation', [ 'number', '1' ] ],
                    [ 'number', '10' ] ] ],
            '\\emptyset\\subset [-1, \\equiv _ 10]'
        )
    } )

    it( 'can construct type sentences and combinations of them', () => {
        check(
            [ 'hastype', [ 'numbervariable', 'x' ], 'settype' ],
            'x \\text{is a set}'
        )
        check(
            [ 'hastype', [ 'numbervariable', 'n' ], 'numbertype' ],
            'n \\text{is a number}'
        )
        check(
            [ 'hastype', [ 'numbervariable', 'S' ], 'partialordtype' ],
            'S \\text{is a partial order}'
        )
        check(
            [ 'conjunction',
                [ 'hastype', [ 'number', '1' ], 'numbertype' ],
                [ 'hastype', [ 'number', '10' ], 'numbertype' ] ],
            '1 \\text{is a number}\\wedge 10 \\text{is a number}'
        )
        check(
            [ 'implication',
                [ 'hastype', [ 'numbervariable', 'R' ], 'equivreltype' ],
                [ 'hastype', [ 'numbervariable', 'R' ], 'reltype' ] ],
            'R \\text{is an equivalence relation}\\Rightarrow R \\text{is a relation}'
        )
    } )

    it( 'can create notation for expression function application', () => {
        check(
            [ 'numefa', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
            '\\mathcal{f} (x)'
        )
        check(
            [ 'numfuncapp',
                [ 'funcvariable', 'F' ],
                [ 'numefa', [ 'funcvariable', 'k' ], [ 'number', '10' ] ] ],
            'F(\\mathcal{k} (10))'
        )
        check(
            [ 'numefa', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ],
            '\\mathcal{E} (\\bar L)'
        )
        check(
            [ 'intersection',
                'emptyset',
                [ 'setefa', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ],
            '\\emptyset\\cap \\mathcal{f} (2)'
        )
        check(
            [ 'conjunction',
                [ 'propefa', [ 'funcvariable', 'P' ], [ 'numbervariable', 'x' ] ],
                [ 'propefa', [ 'funcvariable', 'Q' ], [ 'numbervariable', 'y' ] ] ],
            '\\mathcal{P} (x)\\wedge \\mathcal{Q} (y)'
        )
    } )

    it( 'can create notation for assumptions', () => {
        check(
            [ 'givenvariant1', [ 'logicvariable', 'X' ] ],
            '\\text{Assume }X'
        )
        check(
            [ 'givenvariant2', [ 'logicvariable', 'X' ] ],
            '\\text{assume }X'
        )
        check(
            [ 'givenvariant3', [ 'logicvariable', 'X' ] ],
            '\\text{Given }X'
        )
        check(
            [ 'givenvariant4', [ 'logicvariable', 'X' ] ],
            '\\text{given }X'
        )
        check(
            [ 'givenvariant1',
                [ 'equality', [ 'numbervariable', 'k' ], [ 'number', '1000' ] ] ],
            '\\text{Assume }k=1000'
        )
        check(
            [ 'givenvariant2',
                [ 'equality', [ 'numbervariable', 'k' ], [ 'number', '1000' ] ] ],
            '\\text{assume }k=1000'
        )
        check(
            [ 'givenvariant3',
                [ 'equality', [ 'numbervariable', 'k' ], [ 'number', '1000' ] ] ],
            '\\text{Given }k=1000'
        )
        check(
            [ 'givenvariant4',
                [ 'equality', [ 'numbervariable', 'k' ], [ 'number', '1000' ] ] ],
            '\\text{given }k=1000'
        )
        check(
            [ 'givenvariant1', 'logicaltrue' ],
            '\\text{Assume }\\top'
        )
        check(
            [ 'givenvariant2', 'logicaltrue' ],
            '\\text{assume }\\top'
        )
        check(
            [ 'givenvariant3', 'logicaltrue' ],
            '\\text{Given }\\top'
        )
        check(
            [ 'givenvariant4', 'logicaltrue' ],
            '\\text{given }\\top'
        )
    } )

    it( 'can create notation for Let-style declarations', () => {
        // You can declare variables by themselves
        check( [ 'letvariant1', [ 'numbervariable', 'x' ] ], '\\text{Let }x' )
        check( [ 'letvariant2', [ 'numbervariable', 'x' ] ], '\\text{let }x' )
        check( [ 'letvariant1', [ 'numbervariable', 'T' ] ], '\\text{Let }T' )
        check( [ 'letvariant2', [ 'numbervariable', 'T' ] ], '\\text{let }T' )
        // You can declare variables with predicates attached
        check(
            [ 'letbevariant1', [ 'numbervariable', 'x' ],
                [ 'greaterthan', [ 'numbervariable', 'x' ], [ 'number', '0' ] ] ],
            '\\text{Let }x \\text{ be such that }x>0'
        )
        check(
            [ 'letbevariant2', [ 'numbervariable', 'x' ],
                [ 'greaterthan', [ 'numbervariable', 'x' ], [ 'number', '0' ] ] ],
            '\\text{let }x \\text{ be such that }x>0'
        )
        check(
            [ 'letbevariant1', [ 'numbervariable', 'T' ],
                [ 'disjunction',
                    [ 'equality', [ 'numbervariable', 'T' ], [ 'number', '5' ] ],
                    [ 'nounisin', [ 'numbervariable', 'T' ], [ 'setvariable', 'S' ] ] ] ],
            '\\text{Let }T \\text{ be such that }T=5\\vee T\\in S'
        )
        check(
            [ 'letbevariant2', [ 'numbervariable', 'T' ],
                [ 'disjunction',
                    [ 'equality', [ 'numbervariable', 'T' ], [ 'number', '5' ] ],
                    [ 'nounisin', [ 'numbervariable', 'T' ], [ 'setvariable', 'S' ] ] ] ],
            '\\text{let }T \\text{ be such that }T=5\\vee T\\in S'
        )
    } )

    it( 'can parse notation for For Some-style declarations', () => {
        // You can declare variables with predicates attached
        check(
            [ 'forsomevariant1', [ 'numbervariable', 'x' ],
                [ 'greaterthan', [ 'numbervariable', 'x' ], [ 'number', '0' ] ] ],
            '\\text{For some }x, x>0'
        )
        check(
            [ 'forsomevariant2', [ 'numbervariable', 'x' ],
                [ 'greaterthan', [ 'numbervariable', 'x' ], [ 'number', '0' ] ] ],
            '\\text{for some }x, x>0'
        )
        check(
            [ 'forsomevariant3', [ 'numbervariable', 'x' ],
                [ 'greaterthan', [ 'numbervariable', 'x' ], [ 'number', '0' ] ] ],
            'x>0 \\text{ for some } x'
        )
        check(
            [ 'forsomevariant4', [ 'numbervariable', 'x' ],
                [ 'greaterthan', [ 'numbervariable', 'x' ], [ 'number', '0' ] ] ],
            'x>0~\\text{for some}~x'
        )
        check(
            [ 'forsomevariant1', [ 'numbervariable', 'T' ],
                [ 'disjunction',
                    [ 'equality', [ 'numbervariable', 'T' ], [ 'number', '5' ] ],
                    [ 'nounisin', [ 'numbervariable', 'T' ], [ 'setvariable', 'S' ] ] ] ],
            '\\text{For some }T, T=5\\vee T\\in S'
        )
        check(
            [ 'forsomevariant2', [ 'numbervariable', 'T' ],
                [ 'disjunction',
                    [ 'equality', [ 'numbervariable', 'T' ], [ 'number', '5' ] ],
                    [ 'nounisin', [ 'numbervariable', 'T' ], [ 'setvariable', 'S' ] ] ] ],
            '\\text{for some }T, T=5\\vee T\\in S'
        )
        check(
            [ 'forsomevariant3', [ 'numbervariable', 'T' ],
                [ 'disjunction',
                    [ 'equality', [ 'numbervariable', 'T' ], [ 'number', '5' ] ],
                    [ 'nounisin', [ 'numbervariable', 'T' ], [ 'setvariable', 'S' ] ] ] ],
            'T=5\\vee T\\in S \\text{ for some } T'
        )
        check(
            [ 'forsomevariant4', [ 'numbervariable', 'T' ],
                [ 'disjunction',
                    [ 'equality', [ 'numbervariable', 'T' ], [ 'number', '5' ] ],
                    [ 'nounisin', [ 'numbervariable', 'T' ], [ 'setvariable', 'S' ] ] ] ],
            'T=5\\vee T\\in S~\\text{for some}~T'
        )
    } )

} )
