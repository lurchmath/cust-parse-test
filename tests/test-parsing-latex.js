
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
        check( '0', [ 'number', '0' ] )
        check( '453789', [ 'number', '453789' ] )
        check(
            '99999999999999999999999999999999999999999',
            [ 'number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        check( '-453789', [ 'numbernegation', [ 'number', '453789' ] ] )
        check(
            '-99999999999999999999999999999999999999999',
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
            '-29835.6875940',
            [ 'numbernegation', [ 'number', '29835.6875940' ] ]
        )
        check(
            '-653280458689.',
            [ 'numbernegation', [ 'number', '653280458689.' ] ]
        )
        check(
            '-.000006327589',
            [ 'numbernegation', [ 'number', '.000006327589' ] ]
        )
    } )

    it( 'can parse one-letter variable names to JSON', () => {
        // one-letter names work, and the least possible parsing of them (for
        // many possible parsings, using alphabetical ordering) is as function
        // variables:
        check( 'x', [ 'funcvariable', 'x' ] )
        check( 'E', [ 'funcvariable', 'E' ] )
        check( 'q', [ 'funcvariable', 'q' ] )
        // multi-letter names do not work
        checkFail( 'foo' )
        checkFail( 'bar' )
        checkFail( 'to' )
    } )

    it( 'can parse LaTeX numeric constants to JSON', () => {
        check( '\\infty', 'infinity' )
        check( '\\pi', 'pi' )
        // The following happens because, even though the parser detects the
        // parsing of e as Euler's number is valid, it's not the first in the
        // alphabetical ordering of the possible parsed results:
        check( 'e', [ 'funcvariable', 'e' ] )
    } )

    it( 'can parse exponentiation of atomics to JSON', () => {
        check(
            '1^2',
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            'e^x',
            [ 'exponentiation', 'eulersnumber', [ 'numbervariable', 'x' ] ]
        )
        check(
            '1^\\infty',
            [ 'exponentiation', [ 'number', '1' ], 'infinity' ]
        )
    } )

    it( 'can parse atomic percentages and factorials to JSON', () => {
        check( '10\\%', [ 'percentage', [ 'number', '10' ] ] )
        check( 't\\%', [ 'percentage', [ 'numbervariable', 't' ] ] )
        check( '77!', [ 'factorial', [ 'number', '77' ] ] )
        check( 'y!', [ 'factorial', [ 'numbervariable', 'y' ] ] )
    } )

    it( 'can parse division of atomics or factors to JSON', () => {
        // division of atomics
        check(
            '1\\div2',
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            'x\\div y',
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        check(
            '0\\div\\infty',
            [ 'division', [ 'number', '0' ], 'infinity' ]
        )
        // division of factors
        check(
            'x^2\\div3',
            [ 'division',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        check(
            '1\\div e^x',
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    'eulersnumber', [ 'numbervariable', 'x' ] ]
            ]
        )
        check(
            '10\\%\\div2^{100}',
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can parse multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        check(
            '1\\times2',
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            'x\\cdot y',
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        check(
            '0\\times\\infty',
            [ 'multiplication', [ 'number', '0' ], 'infinity' ]
        )
        // multiplication of factors
        check(
            'x^2\\cdot3',
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        check(
            '1\\times e^x',
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    'eulersnumber', [ 'numbervariable', 'x' ] ]
            ]
        )
        check(
            '10\\%\\cdot2^{100}',
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can parse negations of atomics or factors to JSON', () => {
        check(
            '-1\\times2',
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ] ]
        )
        check(
            'x\\cdot{-y}',
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ]
        )
        check(
            '{-x^2}\\cdot{-3}',
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        check(
            '(-x^2)\\cdot(-3)',
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        check(
            '----1000',
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert additions and subtractions to JSON', () => {
        check(
            'x+y',
            [ 'addition',
                [ 'numbervariable', 'x' ],
                [ 'numbervariable', 'y' ]
            ]
        )
        check(
            '1--3',
            [ 'subtraction',
                [ 'number', '1' ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        // Following could also be a subtraction of a sum and a variable, which
        // is also OK, but the one shown below is alphabetically earlier:
        check(
            'A^B+C-\\pi',
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], 'pi' ] ]
        )
    } )

    it( 'can parse number expressions with groupers to JSON', () => {
        check(
            '-{1\\times2}',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        check(
            '-(1\\times2)',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        check(
            '(N-1)!',
            [ 'factorial',
                [ 'subtraction',
                    [ 'numbervariable', 'N' ], [ 'number', '1' ] ] ]
        )
        check(
            '{-x}^{2\\cdot{-3}}',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        check(
            '(-x)^(2\\cdot(-3))',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        check(
            '(-x)^{2\\cdot(-3)}',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
        check(
            'A^B+(C-D)',
            [ 'addition',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                [ 'subtraction',
                    [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ]
            ]
        )
        check(
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

    it( 'can parse relations of numeric expressions to JSON', () => {
        check(
            '1>2',
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ]
        )
        check(
            '1\\gt2',
            [ 'greaterthan',
                [ 'number', '1' ],
                [ 'number', '2' ]
            ]
        )
        check(
            '1-2<1+2',
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ]
        )
        check(
            '1-2\\lt1+2',
            [ 'lessthan',
                [ 'subtraction', [ 'number', '1' ], [ 'number', '2' ] ],
                [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ]
            ]
        )
        check(
            '\\neg 1=2',
            [ 'logicnegation',
                [ 'equality', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        check(
            '2\\ge1\\wedge2\\le3',
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ]
        )
        check(
            '2\\geq1\\wedge2\\leq3',
            [ 'conjunction',
                [ 'greaterthanoreq', [ 'number', '2' ], [ 'number', '1' ] ],
                [ 'lessthanoreq', [ 'number', '2' ], [ 'number', '3' ] ] ]
        )
        check(
            '7|14',
            [ 'binrelapp', 'divisibility', [ 'number', '7' ], [ 'number', '14' ] ]
        )
        check(
            'A(k) | n!',
            [ 'binrelapp', 'divisibility',
                [ 'numfuncapp', [ 'funcvariable', 'A' ], [ 'numbervariable', 'k' ] ],
                [ 'factorial', [ 'numbervariable', 'n' ] ] ]
        )
        check(
            '1-k \\sim 1+k',
            [ 'binrelapp', 'genericrelation',
                [ 'subtraction', [ 'number', '1' ], [ 'numbervariable', 'k' ] ],
                [ 'addition', [ 'number', '1' ], [ 'numbervariable', 'k' ] ] ]
        )
        check(
            '0.99\\approx1.01',
            [ 'binrelapp', 'approximately',
                [ 'number', '0.99' ], [ 'number', '1.01' ] ]
        )
    } )

    it( 'converts inequality to its placeholder concept', () => {
        check(
            '1\\ne2',
            [ 'inequality', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            '1\\neq2',
            [ 'inequality', [ 'number', '1' ], [ 'number', '2' ] ]
        )
    } )

    it( 'can parse propositional logic atomics to JSON', () => {
        check( '\\top', 'logicaltrue' )
        check( '\\bot', 'logicalfalse' )
        check( '\\rightarrow\\leftarrow', 'contradiction' )
        // Not checking variables here, because their meaning is ambiguous; we
        // will check below to ensure that they can be part of logic expressions.
    } )

    it( 'can parse propositional logic conjuncts to JSON', () => {
        check(
            '\\top\\wedge\\bot',
            [ 'conjunction',
                'logicaltrue',
                'logicalfalse'
            ]
        )
        check(
            '\\neg P\\wedge\\neg\\top',
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', 'logicaltrue' ]
            ]
        )
        // Following could also be left-associated, which is also a valid
        // parsing, but the one shown below is alphabetically earlier:
        check(
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
        check(
            '\\top\\vee \\neg A',
            [ 'disjunction',
                'logicaltrue',
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ]
        )
        check(
            'P\\wedge Q\\vee Q\\wedge P',
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can parse propositional logic conditionals to JSON', () => {
        check(
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
        check(
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
        check(
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
        check(
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
        check(
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
        check(
            '\\lnot{\\top\\Leftrightarrow\\bot}',
            [ 'logicnegation',
                [ 'iff',
                    'logicaltrue',
                    'logicalfalse'
                ]
            ]
        )
        check(
            '\\lnot(\\top\\Leftrightarrow\\bot)',
            [ 'logicnegation',
                [ 'iff',
                    'logicaltrue',
                    'logicalfalse'
                ]
            ]
        )
    } )

    it( 'can parse simple predicate logic expressions to JSON', () => {
        check(
            '\\forall x, P',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ]
        )
        check(
            '\\exists t,\\neg Q',
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ]
        )
        check(
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
        check( '\\emptyset', 'emptyset' )
        check( '\\{\\}', 'emptyset' )
        check( '\\{ \\}', 'emptyset' )
        // { 1 }
        check(
            '\\{ 1 \\}',
            [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ]
        )
        // { 1, 2 }
        check(
            '\\{1,2\\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'oneeltseq', [ 'number', '2' ] ] ] ]
        )
        // { 1, 2, 3 }
        check(
            '\\{1, 2,   3 \\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'oneeltseq', [ 'number', '3' ] ] ] ] ]
        )
        // { { }, { } }
        check(
            '\\{\\{\\},\\emptyset\\}',
            [ 'finiteset', [ 'eltthenseq', 'emptyset',
                [ 'oneeltseq', 'emptyset' ] ] ]
        )
        // { { { } } }
        check(
            '\\{\\{\\emptyset\\}\\}',
            [ 'finiteset', [ 'oneeltseq',
                [ 'finiteset', [ 'oneeltseq', 'emptyset' ] ] ] ]
        )
        // { 3, x }
        check(
            '\\{ 3,x \\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '3' ],
                [ 'oneeltseq', [ 'numbervariable', 'x' ] ] ] ]
        )
        // { A cup B, A cap B }
        check(
            '\\{ A\\cup B, A\\cap B \\}',
            [ 'finiteset', [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq',
                    [ 'intersection', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ] ] ]
        )
        // { 1, 2, emptyset, K, P }
        check(
            '\\{ 1, 2, \\emptyset, K, P \\}',
            [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                [ 'eltthenseq', [ 'number', '2' ],
                    [ 'eltthenseq', 'emptyset',
                        [ 'eltthenseq', [ 'numbervariable', 'K' ],
                            [ 'oneeltseq', [ 'numbervariable', 'P' ] ] ] ] ] ] ]
        )
    } )

    it( 'can convert tuples and vectors to JSON', () => {
        // tuples containing at least two elements are valid
        check(
            '(5,6)',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        check(
            '(5,A\\cup B,k)',
            [ 'tuple', [ 'eltthenseq', [ 'number', '5' ], [ 'eltthenseq',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'oneeltseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // vectors containing at least two numbers are valid
        check(
            '\\langle5,6\\rangle',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ],
                [ 'onenumseq', [ 'number', '6' ] ] ] ]
        )
        check(
            '\\langle5,-7,k\\rangle',
            [ 'vector', [ 'numthenseq', [ 'number', '5' ], [ 'numthenseq',
                [ 'numbernegation', [ 'number', '7' ] ],
                [ 'onenumseq', [ 'numbervariable', 'k' ] ] ] ] ]
        )
        // tuples and vectors containing zero or one element are not valid
        checkFail( '()' )
        checkFail( '(())' )
        check(
            '(3)', // okay, this is valid, but not as a tuple
            [ 'number', '3' ]
        )
        checkFail( '\\langle\\rangle' )
        checkFail( '\\langle3\\rangle' )
        // tuples can contain other tuples
        check(
            '((1,2),6)',
            [ 'tuple', [ 'eltthenseq',
                [ 'tuple', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ],
                [ 'oneeltseq', [ 'number', '6' ] ] ] ]
        )
        // vectors can contain only numbers
        checkFail( '\\langle(1,2),6\\rangle' )
        checkFail( '\\langle\\langle1,2\\rangle,6\\rangle' )
        checkFail( '\\langle A\\cup B,6\\rangle' )
    } )

    it( 'can convert simple set memberships and subsets to JSON', () => {
        // As before, when a variable could be any type, the alphabetically
        // least type is numbervariable
        check(
            'b\\in B',
            [ 'nounisin', [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ]
        )
        check(
            '2\\in\\{1,2\\}',
            [ 'nounisin', [ 'number', '2' ],
                [ 'finiteset', [ 'eltthenseq', [ 'number', '1' ],
                    [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        check(
            'X\\in a\\cup b',
            [ 'nounisin', [ 'numbervariable', 'X' ],
                [ 'union', [ 'setvariable', 'a' ], [ 'setvariable', 'b' ] ] ]
        )
        check(
            'A\\cup B\\in X\\cup Y',
            [ 'nounisin',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ] ]
        )
        check(
            'A\\subset\\bar B',
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ]
        )
        check(
            'A\\subset B\'',
            [ 'subset',
                [ 'setvariable', 'A' ],
                [ 'complement', [ 'setvariable', 'B' ] ] ]
        )
        check(
            'u\\cap v\\subseteq u\\cup v',
            [ 'subseteq',
                [ 'intersection', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ],
                [ 'union', [ 'setvariable', 'u' ], [ 'setvariable', 'v' ] ] ]
        )
        check(
            '\\{1\\}\\subseteq\\{1\\}\\cup\\{2\\}',
            [ 'subseteq',
                [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                [ 'union',
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '1' ] ] ],
                    [ 'finiteset', [ 'oneeltseq', [ 'number', '2' ] ] ] ] ]
        )
        check(
            'p\\in U\\times V',
            [ 'nounisin', [ 'numbervariable', 'p' ],
                [ 'setproduct', [ 'setvariable', 'U' ], [ 'setvariable', 'V' ] ] ]
        )
        check(
            'q \\in U\'\\cup V\\times W',
            [ 'nounisin', [ 'numbervariable', 'q' ],
                [ 'union',
                    [ 'complement', [ 'setvariable', 'U' ] ],
                    [ 'setproduct', [ 'setvariable', 'V' ], [ 'setvariable', 'W' ] ] ] ]
        )
        check(
            '(a,b)\\in A\\times B',
            [ 'nounisin',
                [ 'tuple',
                    [ 'eltthenseq',
                        [ 'numbervariable', 'a' ],
                        [ 'oneeltseq', [ 'numbervariable', 'b' ] ] ] ],
                    [ 'setproduct', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
        check(
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
        check(
            'a\\notin A',
            [ 'nounisnotin', [ 'numbervariable', 'a' ], [ 'setvariable', 'A' ] ]
        )
        check(
            '\\emptyset\\notin\\emptyset',
            [ 'nounisnotin', 'emptyset', 'emptyset' ]
        )
        check(
            '3-5 \\notin K\\cap P',
            [ 'nounisnotin',
                [ 'subtraction', [ 'number', '3' ], [ 'number', '5' ] ],
                [ 'intersection', [ 'setvariable', 'K' ], [ 'setvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can parse to JSON sentences built from various relations', () => {
        check(
            'P\\vee b\\in B',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'nounisin',
                    [ 'numbervariable', 'b' ], [ 'setvariable', 'B' ] ] ]
        )
        check(
            '{P \\vee b} \\in B',
            [ 'propisin',
                [ 'disjunction',
                    [ 'logicvariable', 'P' ], [ 'logicvariable', 'b' ] ],
                [ 'setvariable', 'B' ] ]
        )
        check(
            '\\forall x, x\\in X',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'nounisin',
                    [ 'numbervariable', 'x' ], [ 'setvariable', 'X' ] ] ]
        )
        check(
            'A\\subseteq B\\wedge B\\subseteq A',
            [ 'conjunction',
                [ 'subseteq', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ],
                [ 'subseteq', [ 'setvariable', 'B' ], [ 'setvariable', 'A' ] ] ]
        )
        check(
            'R = A\\cup B',
            [ 'equality',
                [ 'numbervariable', 'R' ], // it guesses wrong, oh well
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
        check(
            '\\forall n, n|n!',
            [ 'universal',
                [ 'numbervariable', 'n' ],
                [ 'binrelapp', 'divisibility',
                    [ 'numbervariable', 'n' ],
                    [ 'factorial', [ 'numbervariable', 'n' ] ] ] ]
        )
        check(
            'a\\sim b\\Rightarrow b\\sim a',
            [ 'implication',
                [ 'binrelapp', 'genericrelation',
                    [ 'numbervariable', 'a' ], [ 'numbervariable', 'b' ] ],
                [ 'binrelapp', 'genericrelation',
                    [ 'numbervariable', 'b' ], [ 'numbervariable', 'a' ] ] ]
        )
    } )

    it( 'can parse notation related to functions', () => {
        check(
            'f:A\\to B',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        check(
            'f\\colon A\\to B',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        check(
            '\\neg F:X\\cup Y\\rightarrow Z',
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ]
        )
        check(
            '\\neg F\\colon X\\cup Y\\rightarrow Z',
            [ 'logicnegation',
                [ 'funcsignature', [ 'funcvariable', 'F' ],
                    [ 'union', [ 'setvariable', 'X' ], [ 'setvariable', 'Y' ] ],
                    [ 'setvariable', 'Z' ] ] ]
        )
        check(
            'f\\circ g:A\\to C',
            [ 'funcsignature',
                [ 'funccomp', [ 'funcvariable', 'f' ], [ 'funcvariable', 'g' ] ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'C' ] ]
        )
        check(
            'f(x)',
            [ 'numfuncapp', [ 'funcvariable', 'f' ], [ 'numbervariable', 'x' ] ]
        )
        check(
            'f^{-1}(g^{-1}(10))',
            [ 'numfuncapp',
                [ 'funcinverse', [ 'funcvariable', 'f' ] ],
                [ 'numfuncapp',
                    [ 'funcinverse', [ 'funcvariable', 'g' ] ], [ 'number', '10' ] ] ]
        )
        check(
            'E(L\')',
            [ 'numfuncapp', // this is the output type, not the input type
                [ 'funcvariable', 'E' ],
                [ 'complement', [ 'setvariable', 'L' ] ] ]
        )
        check(
            '\\emptyset\\cap f(2)',
            [ 'intersection',
                'emptyset',
                [ 'setfuncapp', [ 'funcvariable', 'f' ], [ 'number', '2' ] ] ]
        )
        check(
            'P(e)\\wedge Q(3+b)',
            [ 'conjunction',
                [ 'propfuncapp', [ 'funcvariable', 'P' ], 'eulersnumber' ],
                [ 'propfuncapp', [ 'funcvariable', 'Q' ],
                    [ 'addition', [ 'number', '3' ], [ 'numbervariable', 'b' ] ] ] ]
        )
        check(
            'F=G\\circ H^{-1}',
            [ 'funcequality',
                [ 'funcvariable', 'F' ],
                [ 'funccomp',
                    [ 'funcvariable', 'G' ],
                    [ 'funcinverse', [ 'funcvariable', 'H' ] ] ] ]
        )
    } )

    it( 'can parse trigonometric functions correctly', () => {
        check(
            '\\sin x',
            [ 'prefixfuncapp', 'sinfunc', [ 'numbervariable', 'x' ] ]
        )
        check(
            '\\cos\\pi\\cdot x',
            [ 'prefixfuncapp', 'cosfunc',
                [ 'multiplication', 'pi', [ 'numbervariable', 'x' ] ] ]
        )
        check(
            '\\tan t',
            [ 'prefixfuncapp', 'tanfunc', [ 'numbervariable', 't' ] ]
        )
        check(
            '1\\div\\cot\\pi',
            [ 'division', [ 'number', '1' ],
                [ 'prefixfuncapp', 'cotfunc', 'pi' ] ]
        )
        check(
            '\\sec y=\\csc y',
            [ 'equality',
                [ 'prefixfuncapp', 'secfunc', [ 'numbervariable', 'y' ] ],
                [ 'prefixfuncapp', 'cscfunc', [ 'numbervariable', 'y' ] ] ]
        )
    } )

    it( 'can parse logarithms correctly', () => {
        check(
            '\\log n',
            [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ]
        )
        check(
            '1+\\ln{x}',
            [ 'addition',
                [ 'number', '1' ],
                [ 'prefixfuncapp', 'naturallog', [ 'numbervariable', 'x' ] ] ]
        )
        check(
            '\\log_2 1024',
            [ 'prefixfuncapp',
                [ 'logwithbase', [ 'number', '2' ] ], [ 'number', '1024' ] ]
        )
        check(
            '\\log_{2}{1024}',
            [ 'prefixfuncapp',
                [ 'logwithbase', [ 'number', '2' ] ], [ 'number', '1024' ] ]
        )
        check(
            '\\log n \\div \\log\\log n',
            [ 'division',
                [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ],
                [ 'prefixfuncapp', 'logarithm',
                    [ 'prefixfuncapp', 'logarithm', [ 'numbervariable', 'n' ] ] ] ]
        )
    } )

    it( 'can parse equivalence classes and treat them as sets', () => {
        check(
            '[1,\\approx]',
            [ 'equivclass', [ 'number', '1' ], 'approximately' ]
        )
        check(
            '[x+2,\\sim]',
            [ 'equivclass',
                [ 'addition', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                'genericrelation' ]
        )
        check(
            '[1,\\approx]\\cup[2,\\approx]',
            [ 'union',
                [ 'equivclass', [ 'number', '1' ], 'approximately' ],
                [ 'equivclass', [ 'number', '2' ], 'approximately' ] ]
        )
        check(
            '7\\in[7,\\sim]',
            [ 'nounisin', [ 'number', '7' ],
                [ 'equivclass', [ 'number', '7' ], 'genericrelation' ] ]
        )
        check(
            '[P]',
            [ 'bareequivclass', [ 'numbervariable', 'P' ] ]
        )
    } )

    it( 'can parse equivalence and classes mod a number', () => {
        check(
            '5\\equiv11\\mod3',
            [ 'equivmodulo',
                [ 'number', '5' ], [ 'number', '11' ], [ 'number', '3' ] ]
        )
        check(
            '5\\equiv_3 11',
            [ 'equivmodulo',
                [ 'number', '5' ], [ 'number', '11' ], [ 'number', '3' ] ]
        )
        check(
            'k \\equiv m \\mod n',
            [ 'equivmodulo', [ 'numbervariable', 'k' ],
                [ 'numbervariable', 'm' ], [ 'numbervariable', 'n' ] ]
        )
        check(
            'k \\equiv_n m',
            [ 'equivmodulo', [ 'numbervariable', 'k' ],
                [ 'numbervariable', 'm' ], [ 'numbervariable', 'n' ] ]
        )
        check(
            'k \\equiv_{n} m',
            [ 'equivmodulo', [ 'numbervariable', 'k' ],
                [ 'numbervariable', 'm' ], [ 'numbervariable', 'n' ] ]
        )
        check(
            '\\emptyset \\subset [-1,\\equiv_10]',
            [ 'subset', 'emptyset',
                [ 'eqmodclass', [ 'numbernegation', [ 'number', '1' ] ],
                    [ 'number', '10' ] ] ]
        )
    } )

    it( 'can parse type sentences and combinations of them', () => {
        check( 'x \\text{is a set}',
            [ 'hastype', [ 'numbervariable', 'x' ], 'settype' ] )
        check( 'n \\text{is }\\text{a number}',
            [ 'hastype', [ 'numbervariable', 'n' ], 'numbertype' ] )
        check( 'S\\text{is}~\\text{a partial order}',
            [ 'hastype', [ 'numbervariable', 'S' ], 'partialordtype' ] )
        check( '1\\text{is a number}\\wedge 10\\text{is a number}',
            [ 'conjunction',
                [ 'hastype', [ 'number', '1' ], 'numbertype' ],
                [ 'hastype', [ 'number', '10' ], 'numbertype' ] ] )
        check( 'R\\text{is an equivalence relation}\\Rightarrow R\\text{is a relation}',
            [ 'implication',
                [ 'hastype', [ 'numbervariable', 'R' ], 'equivreltype' ],
                [ 'hastype', [ 'numbervariable', 'R' ], 'reltype' ] ] )
    } )

} )
