
import { expect } from 'chai'
import { converter } from '../example-converter.js'

const latex = converter.languages.get( 'latex' )

describe( 'Parsing LaTeX', () => {

    const checkLatexJson = ( latexText, json ) => {
        expect( latex.parse( latexText ).toJSON() ).to.eql( json )
        global.log?.( 'LaTeX', latexText, 'JSON', json )
    }
    const checkLatexJsonFail = ( latexText ) => {
        expect( latex.parse( latexText ) ).to.be.undefined
        global.log?.( 'LaTeX', latexText, 'JSON', null )
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
        // one-letter names work, and the least possible parsing of them (for
        // many possible parsings, using alphabetical ordering) is as function
        // variables:
        checkLatexJson(
            'x',
            [ 'funcvariable', 'x' ]
        )
        checkLatexJson(
            'E',
            [ 'funcvariable', 'E' ]
        )
        checkLatexJson(
            'q',
            [ 'funcvariable', 'q' ]
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
            '10\\%\\div2^{100}',
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
            '10\\%\\cdot2^{100}',
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

    it( 'can convert finite and empty sets to JSON', () => {
        // { }
        checkLatexJson( '\\emptyset', [ 'emptyset' ] )
        checkLatexJson( '\\{\\}', [ 'emptyset' ] )
        checkLatexJson( '\\{ \\}', [ 'emptyset' ] )
        // { 1 }
        checkLatexJson(
            '\\{ 1 \\}',
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ]
        )
        // { 1, 2 }
        checkLatexJson(
            '\\{1,2\\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ]
        )
        // { 1, 2, 3 }
        checkLatexJson(
            '\\{1, 2,   3 \\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ]
        )
        // { { }, { } }
        checkLatexJson(
            '\\{\\{\\},\\emptyset\\}',
            [ 'finiteset', [ 'eltthenseq', [ 'emptyset' ],
                [ 'oneeltseq', [ 'emptyset' ] ] ] ]
        )
        // { { { } } }
        checkLatexJson(
            '\\{\\{\\emptyset\\}\\}',
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', [ 'emptyset' ] ] ] ] ]
        )
        // { 3, x }
        checkLatexJson(
            '\\{ 3,x \\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ]
        )
        // { A cup B, A cap B }
        checkLatexJson(
            '\\{ A\\cup B, A\\cap B \\}',
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ]
        )
        // { 1, 2, emptyset, K, P }
        checkLatexJson(
            '\\{ 1, 2, \\emptyset, K, P \\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', [ 'emptyset' ],
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ]
        )
    } )

    it( 'can convert tuples and vectors to JSON', () => {
        // tuples containing at least two elements are valid
        checkLatexJson(
            '(5,6)',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        checkLatexJson(
            '(5,A\\cup B,k)',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // vectors containing at least two numbers are valid
        checkLatexJson(
            '\\langle5,6\\rangle',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ]
        )
        checkLatexJson(
            '\\langle5,-7,k\\rangle',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // tuples and vectors containing zero or one element are not valid
        checkLatexJsonFail( '()' )
        checkLatexJsonFail( '(())' )
        checkLatexJson(
            '(3)', // okay, this is valid, but not as a tuple
            [ 'number', '3' ]
        )
        checkLatexJsonFail( '\\langle\\rangle' )
        checkLatexJsonFail( '\\langle3\\rangle' )
        // tuples can contain other tuples
        checkLatexJson(
            '((1,2),6)',
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        // vectors can contain only numbers
        checkLatexJsonFail( '\\langle(1,2),6\\rangle' )
        checkLatexJsonFail( '\\langle\\langle1,2\\rangle,6\\rangle' )
        checkLatexJsonFail( '\\langle A\\cup B,6\\rangle' )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        checkLatexJson(
            'b\\in B',
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ]
        )
        checkLatexJson(
            '2\\in\\{1,2\\}',
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        checkLatexJson(
            'X\\in a\\cup b',
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ]
        )
        checkLatexJson(
            'A\\cup B\\in X\\cup Y',
            [ 'nounisin',
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
        checkLatexJson(
            '\\{1\\}\\subseteq\\{1\\}\\cup\\{2\\}',
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        checkLatexJson(
            'p\\in U\\times V',
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ]
        )
        checkLatexJson(
            'q \\in U\'\\cup V\\times W',
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ]
        )
        checkLatexJson(
            '(a,b)\\in A\\times B',
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
        checkLatexJson(
            '\\langle a,b\\rangle\\in A\\times B',
            [ 'nounisin',
                [ 'vector',
                    [ 'numthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'onenumseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
    } )

    it( 'converts "notin" notation to its placeholder concept', () => {
        checkLatexJson(
            'a\\notin A',
            [ 'nounisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ]
        )
        checkLatexJson(
            '\\emptyset\\notin\\emptyset',
            [ 'nounisnotin', [ 'emptyset' ], [ 'emptyset' ] ]
        )
        checkLatexJson(
            '3-5 \\notin K\\cap P',
            [ 'nounisnotin',
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
                [ 'nounisin',
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
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ]
        )
        checkLatexJson(
            'A\\subseteq B\\wedge B\\subseteq A',
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ]
        )
    } )

    it( 'can parse notation related to functions', () => {
        checkLatexJson(
            'f:A\\to B',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        checkLatexJson(
            'f\\colon A\\to B',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        checkLatexJson(
            '\\neg F:X\\cup Y\\rightarrow Z',
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ]
        )
        checkLatexJson(
            '\\neg F\\colon X\\cup Y\\rightarrow Z',
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ]
        )
        checkLatexJson(
            'f(x)',
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ]
        )
        checkLatexJson(
            'E(L\')',
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ]
        )
        checkLatexJson(
            '\\emptyset\\cap f(2)',
            [ 'intersection',
                [ 'emptyset' ],
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ]
        )
        checkLatexJson(
            'P(e)\\wedge Q(3+b)',
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], [ 'numbervariable', 'e' ] ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ]
        )
    } )

} )
