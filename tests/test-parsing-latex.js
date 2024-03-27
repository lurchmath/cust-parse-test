
import { expect } from 'chai'
import { converter } from '../example-converter.js'

const latex = converter.languages.get( 'latex' )

describe( 'Parsing latex', () => {

    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str
    const checkLatexJson = ( latexText, json ) => {
        expect( latex.parse( latexText ).toJSON() ).to.eql( json )
        // console.log( `${lpad( latexText )}  -->  ${JSON.stringify( json )}` )
    }
    const checkLatexJsonFail = ( latexText ) => {
        expect( latex.parse( latexText ) ).to.be.undefined
    }

    it( 'can parse many kinds of numbers to JSON', () => {
        // non-negative integers
        checkLatexJson(
            '0',
            [ 'number', '0' ]
        )
        checkLatexJson(
            '453789',
            [ 'number', '453789' ]
        )
        checkLatexJson(
            '99999999999999999999999999999999999999999',
            [ 'number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        checkLatexJson(
            '-453789',
            [ 'numbernegation', [ 'number', '453789' ] ]
        )
        checkLatexJson(
            '-99999999999999999999999999999999999999999',
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ]
        )
        // non-negative decimals
        checkLatexJson(
            '0.0',
            [ 'number', '0.0' ]
        )
        checkLatexJson(
            '29835.6875940',
            [ 'number', '29835.6875940' ]
        )
        checkLatexJson(
            '653280458689.',
            [ 'number', '653280458689.' ]
        )
        checkLatexJson(
            '.000006327589',
            [ 'number', '.000006327589' ]
        )
        // negative decimals are the negation of positive decimals
        checkLatexJson(
            '-29835.6875940',
            [ 'numbernegation', [ 'number', '29835.6875940' ] ]
        )
        checkLatexJson(
            '-653280458689.',
            [ 'numbernegation', [ 'number', '653280458689.' ] ]
        )
        checkLatexJson(
            '-.000006327589',
            [ 'numbernegation', [ 'number', '.000006327589' ] ]
        )
    } )

    it( 'can parse one-letter variable names to JSON', () => {
        // one-letter names work
        checkLatexJson(
            'x',
            [ 'numbervariable', 'x' ]
        )
        checkLatexJson(
            'E',
            [ 'numbervariable', 'E' ]
        )
        checkLatexJson(
            'q',
            [ 'numbervariable', 'q' ]
        )
        // multi-letter names do not work
        checkLatexJsonFail( 'foo' )
        checkLatexJsonFail( 'bar' )
        checkLatexJsonFail( 'to' )
    } )

    it( 'can parse LaTeX infinity to JSON', () => {
        checkLatexJson(
            '\\infty',
            [ 'infinity' ]
        )
    } )

    it( 'can parse exponentiation of atomics to JSON', () => {
        checkLatexJson(
            '1^2',
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkLatexJson(
            'e^x',
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
        )
        checkLatexJson(
            '1^\\infty',
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ]
        )
    } )

    it( 'can parse atomic percentages and factorials to JSON', () => {
        checkLatexJson(
            '10\\%',
            [ 'percentage', [ 'number', '10' ] ]
        )
        checkLatexJson(
            't\\%',
            [ 'percentage', [ 'numbervariable', 't' ] ]
        )
        checkLatexJson(
            '77!',
            [ 'factorial', [ 'number', '77' ] ]
        )
        checkLatexJson(
            'y!',
            [ 'factorial', [ 'numbervariable', 'y' ] ]
        )
    } )

    it( 'can parse division of atomics or factors to JSON', () => {
        // division of atomics
        checkLatexJson(
            '1\\div2',
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkLatexJson(
            'x\\div y',
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        checkLatexJson(
            '0\\div\\infty',
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // division of factors
        checkLatexJson(
            'x^2\\div3',
            [ 'division',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        checkLatexJson(
            '1\\div e^x',
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        checkLatexJson(
            '10\\%\\div2^100',
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can parse multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        checkLatexJson(
            '1\\times2',
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkLatexJson(
            'x\\cdot y',
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        checkLatexJson(
            '0\\times\\infty',
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // multiplication of factors
        checkLatexJson(
            'x^2\\cdot3',
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        checkLatexJson(
            '1\\times e^x',
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        checkLatexJson(
            '10\\%\\cdot2^100',
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can parse negations of atomics or factors to JSON', () => {
        checkLatexJson(
            '-1\\times2',
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ] ]
        )
        checkLatexJson(
            'x\\cdot{-y}',
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ]
        )
        checkLatexJson(
            '{-x^2}\\cdot{-3}',
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        checkLatexJson(
            '(-x^2)\\cdot(-3)',
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        checkLatexJson(
            '----1000',
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert additions and subtractions to JSON', () => {
        checkLatexJson(
            'x+y',
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ]
        )
        checkLatexJson(
            '1--3',
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        // Following could also be a subtraction of a sum and a variable, which
        // is also OK, but the one shown below is alphabetically earlier:
        checkLatexJson(
            'A^B+C-D',
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ] ]
        )
    } )

    it( 'can parse number expressions with groupers to JSON', () => {
        checkLatexJson(
            '-{1\\times2}',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        checkLatexJson(
            '-(1\\times2)',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        checkLatexJson(
            '(N-1)!',
            [ 'factorial',
                [ 'subtraction',
                    [ 'numbervariable', 'N' ], [ 'number', '1' ] ] ]
        )
        checkLatexJson(
            '{-x}^{2\\cdot{-3}}',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        checkLatexJson(
            '(-x)^(2\\cdot(-3))',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        checkLatexJson(
            '(-x)^{2\\cdot(-3)}',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        checkLatexJson(
            'A^B+(C-D)',
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ]
            ]
        )
        checkLatexJson(
            'k^{1-y}\\cdot(2+k)',
            [ 'multiplication',
                [ 'exponentiation',
                    [ 'numbervariable', 'k' ],
                    [ 'subtraction',
                        [ 'number', '1' ], [ 'numbervariable', 'y' ] ] ],
                [ 'addition',
                    [ 'number', '2' ], [ 'numbervariable', 'k' ] ] ]
        )
    } )

    it( 'can parse propositional logic atomics to JSON', () => {
        checkLatexJson(
            '\\top',
            [ 'logicaltrue' ]
        )
        checkLatexJson(
            '\\bot',
            [ 'logicalfalse' ]
        )
        checkLatexJson(
            '\\rightarrow\\leftarrow',
            [ 'contradiction' ]
        )
        // Not checking variables here, because their meaning is ambiguous; we
        // will check below to ensure that they can be part of logic expressions.
    } )

    it( 'can parse propositional logic conjuncts to JSON', () => {
        checkLatexJson(
            '\\top\\wedge\\bot',
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ]
        )
        checkLatexJson(
            '\\neg P\\wedge\\neg\\top',
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ]
        )
        // Following could also be left-associated, which is also a valid
        // parsing, but the one shown below is alphabetically earlier:
        checkLatexJson(
            'a\\wedge b\\wedge c',
            [ 'conjunction',
                [ 'logicvariable', 'a' ],
                [ 'conjunction',
                    [ 'logicvariable', 'b' ],
                    [ 'logicvariable', 'c' ]
                ]
            ]
        )
    } )

    it( 'can parse propositional logic disjuncts to JSON', () => {
        checkLatexJson(
            '\\top\\vee \\neg A',
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ]
        )
        checkLatexJson(
            'P\\wedge Q\\vee Q\\wedge P',
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can parse propositional logic conditionals to JSON', () => {
        checkLatexJson(
            'A\\Rightarrow Q\\wedge\\neg P',
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        // Implication should right-associate:
        checkLatexJson(
            'P\\vee Q\\Rightarrow Q\\wedge P\\Rightarrow T',
            [ 'implication',
                [ 'disjunction',
                    [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'implication',
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ],
                    [ 'logicvariable', 'T' ]
                ]
            ]
        )
    } )

    it( 'can parse propositional logic biconditionals to JSON', () => {
        checkLatexJson(
            'A\\Leftrightarrow Q\\wedge\\neg P',
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        // Implication should right-associate, including double implications:
        checkLatexJson(
            'P\\vee Q\\Leftrightarrow Q\\wedge P\\Rightarrow T',
            [ 'iff',
                [ 'disjunction',
                    [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'implication',
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ],
                        [ 'logicvariable', 'P' ]
                    ],
                    [ 'logicvariable', 'T' ]
                ]
            ]
        )
    } )

    it( 'can parse propositional expressions with groupers to JSON', () => {
        checkLatexJson(
            'P\\lor {Q\\Leftrightarrow Q}\\land P',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'conjunction',
                    [ 'iff',
                        [ 'logicvariable', 'Q' ],
                        [ 'logicvariable', 'Q' ]
                    ],
                    [ 'logicvariable', 'P' ]
                ]
            ]
        )
        checkLatexJson(
            '\\lnot{\\top\\Leftrightarrow\\bot}',
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ]
        )
        checkLatexJson(
            '\\lnot(\\top\\Leftrightarrow\\bot)',
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ]
        )
    } )

    it( 'can parse simple predicate logic expressions to JSON', () => {
        checkLatexJson(
            '\\forall x, P',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ]
        )
        checkLatexJson(
            '\\exists t,\\neg Q',
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ]
        )
        checkLatexJson(
            '\\exists! k,m\\Rightarrow n',
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication',
                    [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ]
        )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        checkLatexJson(
            'b\\in B',
            [ 'numberisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ]
        )
        checkLatexJson(
            'X\\in a\\cup b',
            [ 'numberisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ]
        )
        checkLatexJson(
            'A\\cup B\\in X\\cup Y',
            [ 'setisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ]
        )
        checkLatexJson(
            'A\\subset\\bar B',
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ]
        )
        checkLatexJson(
            'A\\subset B\'',
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ]
        )
        checkLatexJson(
            'u\\cap v\\subseteq u\\cup v',
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ]
        )
    } )

    it( 'converts "notin" notation to its placeholder concept', () => {
        checkLatexJson(
            'a\\notin A',
            [ 'numberisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ]
        )
        checkLatexJson(
            '3-5 \\notin K\\cap P',
            [ 'numberisnotin',
                [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can parse to JSON sentences built from set operators', () => {
        checkLatexJson(
            'P\\vee b\\in B',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'numberisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ]
        )
        checkLatexJson(
            '{P \\vee b} \\in B',
            [ 'propisin',
                [ 'disjunction',
                    [ 'logicvariable', 'P' ], [ 'logicvariable', 'b' ] ],
                [ 'setvariable', 'B' ] ]
        )
        checkLatexJson(
            '\\forall x, x\\in X',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'numberisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ]
        )
        checkLatexJson(
            'A\\subseteq B\\wedge B\\subseteq A',
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ]
        )
    } )

} )
