
import { expect } from 'chai'
import { converter } from '../example-converter.js'
import { AST } from '../ast.js'

const latex = converter.languages.get( 'latex' )

describe( 'Rendering JSON into LaTeX', () => {

    const checkJsonLatex = ( json, latexText ) => {
        expect(
            new AST( latex, ...json ).toLanguage( latex )
        ).to.eql( latexText )
        global.log?.( 'JSON', json, 'LaTeX', latexText )
    }

    it( 'can convert JSON numbers to LaTeX', () => {
        // non-negative integers
        checkJsonLatex(
            [ 'number', '0' ],
            '0'
        )
        checkJsonLatex(
            [ 'number', '453789' ],
            '453789'
        )
        checkJsonLatex(
            [ 'number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        checkJsonLatex(
            [ 'numbernegation', [ 'number', '453789' ] ],
            '- 453789'
        )
        checkJsonLatex(
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ],
            '- 99999999999999999999999999999999999999999'
        )
        // non-negative decimals
        checkJsonLatex(
            [ 'number', '0.0' ],
            '0.0'
        )
        checkJsonLatex(
            [ 'number', '29835.6875940' ],
            '29835.6875940'
        )
        checkJsonLatex(
            [ 'number', '653280458689.' ],
            '653280458689.'
        )
        checkJsonLatex(
            [ 'number', '.000006327589' ],
            '.000006327589'
        )
        // negative decimals are the negation of positive decimals
        checkJsonLatex(
            [ 'numbernegation', [ 'number', '29835.6875940' ] ],
            '- 29835.6875940'
        )
        checkJsonLatex(
            [ 'numbernegation', [ 'number', '653280458689.' ] ],
            '- 653280458689.'
        )
        checkJsonLatex(
            [ 'numbernegation', [ 'number', '.000006327589' ] ],
            '- .000006327589'
        )
    } )

    it( 'can convert any size variable name from JSON to LaTeX', () => {
        // one-letter names work
        checkJsonLatex(
            [ 'numbervariable', 'x' ],
            'x'
        )
        checkJsonLatex(
            [ 'numbervariable', 'E' ],
            'E'
        )
        checkJsonLatex(
            [ 'numbervariable', 'q' ],
            'q'
        )
        // multi-letter names work, too
        checkJsonLatex(
            [ 'numbervariable', 'foo' ],
            'foo'
        )
        checkJsonLatex(
            [ 'numbervariable', 'bar' ],
            'bar'
        )
        checkJsonLatex(
            [ 'numbervariable', 'to' ],
            'to'
        )
    } )

    it( 'can convert infinity from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'infinity' ],
            '\\infty'
        )
    } )

    it( 'can convert exponentiation of atomics from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ],
            '1 ^ 2'
        )
        checkJsonLatex(
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ],
            'e ^ x'
        )
        checkJsonLatex(
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ],
            '1 ^ \\infty'
        )
    } )

    it( 'can convert atomic percentages and factorials from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'percentage', [ 'number', '10' ] ],
            '10 \\%'
        )
        checkJsonLatex(
            [ 'percentage', [ 'numbervariable', 't' ] ],
            't \\%'
        )
        checkJsonLatex(
            [ 'factorial', [ 'number', '10' ] ],
            '10 !'
        )
        checkJsonLatex(
            [ 'factorial', [ 'numbervariable', 't' ] ],
            't !'
        )
    } )

    it( 'can convert division of atomics or factors from JSON to LaTeX', () => {
        // division of atomics
        checkJsonLatex(
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ],
            '1 \\div 2'
        )
        checkJsonLatex(
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            'x \\div y'
        )
        checkJsonLatex(
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ],
            '0 \\div \\infty'
        )
        // division of factors
        checkJsonLatex(
            [ 'division',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            'x ^ 2 \\div 3'
        )
        checkJsonLatex(
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '1 \\div e ^ x'
        )
        checkJsonLatex(
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '10 \\% \\div 2 ^ 100'
        )
    } )

    it( 'can convert multiplication of atomics or factors from JSON to LaTeX', () => {
        // multiplication of atomics
        checkJsonLatex(
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ],
            '1 \\times 2'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            'x \\times y'
        )
        checkJsonLatex(
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ],
            '0 \\times \\infty'
        )
        // multiplication of factors
        checkJsonLatex(
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            'x ^ 2 \\times 3'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '1 \\times e ^ x'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '10 \\% \\times 2 ^ 100'
        )
    } )

    it( 'can convert negations of atomics or factors from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ],
            '- 1 \\times 2'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ],
            'x \\times - y'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '- x ^ 2 \\times - 3'
        )
        checkJsonLatex(
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ],
            '- - - - 1000'
        )
    } )

    it( 'can convert additions and subtractions from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ],
            'x + y'
        )
        checkJsonLatex(
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '1 - - 3'
        )
        checkJsonLatex(
            [ 'subtraction',
                [ 'addition',
                    [ 'exponentiation',
                        [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                    [ 'numbervariable', 'C' ] ],
                [ 'numbervariable', 'D' ] ],
            'A ^ B + C - D'
        )
    } )

    it( 'can convert number expressions with groupers from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '- 1 \\times 2'
        )
        checkJsonLatex(
            [ 'factorial',
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '{1 + 2} !'
        )
        checkJsonLatex(
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ],
            '{- x} ^ {2 \\times - 3}'
        )
        // Note: The following test doesn't come out the way you would expect,
        // but it's because the hierarchy of concepts in the parser encodes the
        // idea that (x+y)-z is the same as x+(y-z), which is actually true.
        checkJsonLatex(
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ]
            ],
            'A ^ B + C - D'
        )
        // Note: The following test shows that rendering LaTeX standardizes some
        // operators and groupers, notably cdot -> times and () -> {} here.
        checkJsonLatex(
            [ 'multiplication',
                [ 'exponentiation',
                    [ 'numbervariable', 'k' ],
                    [ 'subtraction',
                        [ 'number', '1' ], [ 'numbervariable', 'y' ] ] ],
                [ 'addition',
                    [ 'number', '2' ], [ 'numbervariable', 'k' ] ] ],
            'k ^ {1 - y} \\times {2 + k}'
        )
    } )

    it( 'can convert propositional logic atomics from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'logicaltrue' ],
            '\\top'
        )
        checkJsonLatex(
            [ 'logicalfalse' ],
            '\\bot'
        )
        checkJsonLatex(
            [ 'contradiction' ],
            '\\rightarrow \\leftarrow'
        )
        // Not checking variables here, because their meaning is ambiguous; we
        // will check below to ensure that they can be part of logic expressions.
    } )

    it( 'can convert propositional logic conjuncts from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ],
            '\\top \\wedge \\bot'
        )
        checkJsonLatex(
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ],
            '\\neg P \\wedge \\neg \\top'
        )
        checkJsonLatex(
            [ 'conjunction',
                [ 'conjunction',
                    [ 'logicvariable', 'a' ],
                    [ 'logicvariable', 'b' ]
                ],
                [ 'logicvariable', 'c' ]
            ],
            'a \\wedge b \\wedge c'
        )
    } )

    it( 'can convert propositional logic disjuncts from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ],
            '\\top \\vee \\neg A'
        )
        checkJsonLatex(
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ],
            'P \\wedge Q \\vee Q \\wedge P'
        )
    } )

    it( 'can convert propositional logic conditionals from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            'A \\Rightarrow Q \\wedge \\neg P'
        )
        checkJsonLatex(
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
            'P \\vee Q \\Rightarrow Q \\wedge P \\Rightarrow T'
        )
    } )

    it( 'can convert propositional logic biconditionals from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            'A \\Leftrightarrow Q \\wedge \\neg P'
        )
        checkJsonLatex(
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
            'P \\vee Q \\Leftrightarrow Q \\wedge P \\Rightarrow T'
        )
    } )

    it( 'can convert propositional expressions with groupers from JSON to LaTeX', () => {
        checkJsonLatex(
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
            'P \\vee {Q \\Leftrightarrow Q} \\wedge P'
        )
        checkJsonLatex(
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ],
            '\\neg {\\top \\Leftrightarrow \\bot}'
        )
    } )

    it( 'can convert simple predicate logic expressions from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ],
            '\\forall x , P'
        )
        checkJsonLatex(
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ],
            '\\exists t , \\neg Q'
        )
        checkJsonLatex(
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication',
                    [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ],
            '\\exists ! k , m \\Rightarrow n'
        )
    } )

    it( 'can convert finite and empty sets from JSON to LaTeX', () => {
        // { }
        checkJsonLatex( [ 'emptyset' ], '\\emptyset' )
        // { 1 }
        checkJsonLatex(
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
            '\\{ 1 \\}'
        )
        // { 1, 2 }
        checkJsonLatex(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ],
            '\\{ 1 , 2 \\}'
        )
        // { 1, 2, 3 }
        checkJsonLatex(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ],
            '\\{ 1 , 2 , 3 \\}'
        )
        // { { }, { } }
        checkJsonLatex(
            [ 'finiteset', [ 'eltthenseq', [ 'emptyset' ],
                [ 'oneeltseq', [ 'emptyset' ] ] ] ],
            '\\{ \\emptyset , \\emptyset \\}'
        )
        // { { { } } }
        checkJsonLatex(
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', [ 'emptyset' ] ] ] ] ],
            '\\{ \\{ \\emptyset \\} \\}'
        )
        // { 3, x }
        checkJsonLatex(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ],
            '\\{ 3 , x \\}'
        )
        // { A cup B, A cap B }
        checkJsonLatex(
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ],
            '\\{ A \\cup B , A \\cap B \\}'
        )
        // { 1, 2, emptyset, K, P }
        checkJsonLatex(
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', [ 'emptyset' ],
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ],
            '\\{ 1 , 2 , \\emptyset , K , P \\}'
        )
    } )

    it( 'can convert tuples and vectors from JSON to LaTeX', () => {
        // tuples containing at least two elements are valid
        checkJsonLatex(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '( 5 , 6 )'
        )
        checkJsonLatex(
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '( 5 , A \\cup B , k )'
        )
        // vectors containing at least two numbers are valid
        checkJsonLatex(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ],
            '\\langle 5 , 6 \\rangle'
        )
        checkJsonLatex(
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ],
            '\\langle 5 , - 7 , k \\rangle'
        )
        // tuples can contain other tuples
        checkJsonLatex(
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ],
            '( ( 1 , 2 ) , 6 )'
        )
    } )

    it( 'can convert simple set memberships and subsets to LaTeX', () => {
        checkJsonLatex(
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ],
            'b \\in B'
        )
        checkJsonLatex(
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '2 \\in \\{ 1 , 2 \\}'
        )
        checkJsonLatex(
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ],
            'X \\in a \\cup b'
        )
        checkJsonLatex(
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ],
            'A \\cup B \\in X \\cup Y'
        )
        checkJsonLatex(
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ],
            'A \\subset \\bar B'
        )
        checkJsonLatex(
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ],
            'u \\cap v \\subseteq u \\cup v'
        )
        checkJsonLatex(
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ],
            '\\{ 1 \\} \\subseteq \\{ 1 \\} \\cup \\{ 2 \\}'
        )
        checkJsonLatex(
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ],
            'p \\in U \\times V'
        )
        checkJsonLatex(
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ],
            'q \\in \\bar U \\cup V \\times W'
        )
        checkJsonLatex(
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '( a , b ) \\in A \\times B'
        )
        checkJsonLatex(
            [ 'nounisin',
                [ 'vector',
                    [ 'numthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'onenumseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ],
            '\\langle a , b \\rangle \\in A \\times B'
        )
    } )

    it( 'can represent "notin" notation if JSON explicitly requests it', () => {
        checkJsonLatex(
            [ 'logicnegation',
                [ 'nounisin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ] ],
            '\\neg a \\in A'
        )
        checkJsonLatex(
            [ 'logicnegation', [ 'nounisin', [ 'emptyset' ], [ 'emptyset' ] ] ],
            '\\neg \\emptyset \\in \\emptyset'
        )
        checkJsonLatex(
            [ 'logicnegation',
                [ 'nounisin',
                    [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                    [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
                ]
            ],
            '\\neg 3 - 5 \\in K \\cap P'
        )
        checkJsonLatex(
            [ 'nounisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ],
            'a \\notin A'
        )
        checkJsonLatex(
            [ 'nounisnotin', [ 'emptyset' ], [ 'emptyset' ] ],
            '\\emptyset \\notin \\emptyset'
        )
        checkJsonLatex(
            [ 'nounisnotin',
                [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
            ],
            '3 - 5 \\notin K \\cap P'
        )
    } )

    it( 'can convert to LaTeX sentences built from set operators', () => {
        checkJsonLatex(
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ],
            'P \\vee b \\in B'
        )
        checkJsonLatex(
            [ 'propisin',
                [ 'disjunction',
                    [ 'logicvariable', 'P' ], [ 'logicvariable', 'b' ] ],
                [ 'setvariable', 'B' ] ],
            '{P \\vee b} \\in B'
        )
        checkJsonLatex(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ],
            '\\forall x , x \\in X'
        )
        checkJsonLatex(
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ],
            'A \\subseteq B \\wedge B \\subseteq A'
        )
    } )

    it( 'can create LaTeX notation related to functions', () => {
        checkJsonLatex(
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
            'f : A \\to B'
        )
        checkJsonLatex(
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ],
            '\\neg F : X \\cup Y \\to Z'
        )
        checkJsonLatex(
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ],
            'f \\circ g : A \\to C'
        )
        checkJsonLatex(
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ],
            'f ( x )'
        )
        checkJsonLatex(
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ],
            'f ^ { - 1 } ( g ^ { - 1 } ( 10 ) )'
        )
        checkJsonLatex(
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ],
            'E ( \\bar L )'
        )
        checkJsonLatex(
            [ 'intersection',
                [ 'emptyset' ],
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ],
            '\\emptyset \\cap f ( 2 )'
        )
        checkJsonLatex(
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ],
            'P ( e ) \\wedge Q ( 3 + b )'
        )
    } )

} )
