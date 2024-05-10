
import { expect } from 'chai'
import { converter } from '../example-converter.js'
import { AST } from '../ast.js'

describe( 'Parsing MathLive-style LaTeX', () => {
    
    const latex = converter.languages.get( 'latex' )
    const check = ( latexText, json ) => {
        const ast = latex.parse( latexText )
        if ( !ast ) console.log( latex.tokenizer.tokenize( latexText ) )
        expect( ast instanceof AST ? ast.toJSON() : ast ).to.eql( json )
        global.log?.( 'LaTeX', latexText, 'JSON', json )
    }
    const checkFail = ( latexText ) => {
        expect( latex.parse( latexText ) ).to.be.undefined
        global.log?.( 'LaTeX', latexText, 'JSON', null )
    }

    it( 'correctly parses basic expressions', () => {
        check( '6+k',
            [ 'addition', [ 'number', '6' ], [ 'numbervariable', 'k' ] ] )
        check( '1.9-T',
            [ 'subtraction', [ 'number', '1.9' ], [ 'numbervariable', 'T' ] ] )
        check( '0.2\\cdot0.3',
            [ 'multiplication', [ 'number', '0.2' ], [ 'number', '0.3' ] ] )
        check( '0.2\\ast0.3',
            [ 'multiplication', [ 'number', '0.2' ], [ 'number', '0.3' ] ] )
        check( 'v\\div w',
            [ 'division', [ 'numbervariable', 'v' ], [ 'numbervariable', 'w' ] ] )
        check( '2^{k}',
            [ 'exponentiation', [ 'number', '2' ], [ 'numbervariable', 'k' ] ] )
        check( '5.0-K+e',
            [ 'addition',
                [ 'subtraction', [ 'number', '5.0' ], [ 'numbervariable', 'K' ] ],
                'eulersnumber' ] )
        check( '5.0\\times K\\div e',
            [ 'division',
                [ 'multiplication', [ 'number', '5.0' ], [ 'numbervariable', 'K' ] ],
                'eulersnumber' ] )
        check( '\\left(a^{b}\\right)^{c}',
            [ 'exponentiation',
                [ 'exponentiation',
                    [ 'numbervariable', 'a' ], [ 'numbervariable', 'b' ] ],
                [ 'numbervariable', 'c' ] ] )
        check( '5.0-K\\cdot e',
            [ 'subtraction', [ 'number', '5.0' ],
                [ 'multiplication',
                    [ 'numbervariable', 'K' ], 'eulersnumber' ] ] )
        check( 'u^{v}\\times w^{x}',
            [ 'multiplication',
                [ 'exponentiation',
                    [ 'numbervariable', 'u' ], [ 'numbervariable', 'v' ] ],
                [ 'exponentiation',
                    [ 'numbervariable', 'w' ], [ 'numbervariable', 'x' ] ] ] )
        check( '-A^{B}',
            [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ] ] )
    } )

    it( 'respects groupers while parsing', () => {
        check( '6+\\left(k+5\\right)',
            [ 'addition',
                [ 'number', '6' ],
                [ 'addition', [ 'numbervariable', 'k' ], [ 'number', '5' ] ] ] )
        check( '\\left(5.0-K\\right)\\cdot e',
            [ 'multiplication',
                [ 'subtraction', [ 'number', '5.0' ], [ 'numbervariable', 'K' ] ],
                'eulersnumber' ] )
        check( '5.0\\times\\left(K+e\\right)',
            [ 'multiplication',
                [ 'number', '5.0' ],
                [ 'addition', [ 'numbervariable', 'K' ], 'eulersnumber' ] ] )
        check( '-\\left(K+e\\right)',
            [ 'numbernegation',
                [ 'addition', [ 'numbervariable', 'K' ], 'eulersnumber' ] ] )
        check( '-\\left(A^{B}\\right)',
            [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ] ] )
    } )

    it( 'correctly parses logarithms', () => {
        check(
            '\\log1000',
            [ 'prefixfuncapp', 'logarithm', [ 'number', '1000' ] ]
        )
        check(
            '\\log e^{x}\\times y',
            [ 'prefixfuncapp', 'logarithm', [ 'multiplication',
                [ 'exponentiation', 'eulersnumber', [ 'numbervariable', 'x' ] ],
                [ 'numbervariable', 'y' ] ] ]
        )
        check(
            '\\log_{-t}\\left(k+5\\right)',
            [ 'prefixfuncapp',
                [ 'logwithbase', [ 'numbernegation', [ 'numbervariable', 't' ] ] ],
                [ 'addition', [ 'numbervariable', 'k' ], [ 'number', '5' ] ] ]
        )
    } )

    it( 'correctly parses fractions', () => {
        check(
            '\\frac 1 2',
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        check(
            '\\frac{7-k}{1+x^2}',
            [ 'division',
                [ 'subtraction', [ 'number', '7' ], [ 'numbervariable', 'k' ] ],
                [ 'addition',
                    [ 'number', '1' ],
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ] ]
        )
    } )

    it( 'correctly parses sentences of arithmetic and algebra', () => {
        check(
            't+u\\ne t+v',
            [ 'inequality',
                [ 'addition', [ 'numbervariable', 't' ], [ 'numbervariable', 'u' ] ],
                [ 'addition', [ 'numbervariable', 't' ], [ 'numbervariable', 'v' ] ] ]
        )
        check(
            'a\\div{7+b}\\approx0.75',
            [ 'binrelapp', 'approximately',
                [ 'division',
                    [ 'numbervariable', 'a' ],
                    [ 'addition', [ 'number', '7' ], [ 'numbervariable', 'b' ] ] ],
                [ 'number', '0.75' ] ]
        )
        check(
            '\\frac{a}{7+b}\\approx0.75',
            [ 'binrelapp', 'approximately',
                [ 'division',
                    [ 'numbervariable', 'a' ],
                    [ 'addition', [ 'number', '7' ], [ 'numbervariable', 'b' ] ] ],
                [ 'number', '0.75' ] ]
        )
        check(
            't^2\\le10',
            [ 'lessthanoreq',
                [ 'exponentiation', [ 'numbervariable', 't' ], [ 'number', '2' ] ],
                [ 'number', '10' ] ]
        )
        check(
            '1+2+3\\ge6',
            [ 'greaterthanoreq',
                [ 'addition',
                    [ 'addition', [ 'number', '1' ], [ 'number', '2' ] ],
                    [ 'number', '3' ] ],
                [ 'number', '6' ] ]
        )
        check(
            '\\neg A+B=C^{D}',
            [ 'logicnegation',
                [ 'equality',
                    [ 'addition',
                        [ 'numbervariable', 'A' ], [ 'numbervariable', 'B' ] ],
                    [ 'exponentiation',
                        [ 'numbervariable', 'C' ], [ 'numbervariable', 'D' ] ] ] ]
        )
        check(
            '\\lnot\\lnot x=x',
            [ 'logicnegation',
                [ 'logicnegation',
                    [ 'equality',
                        [ 'numbervariable', 'x' ], [ 'numbervariable', 'x' ] ] ] ]
        )
        check(
            '3\\vert 9',
            [ 'binrelapp', 'divisibility', [ 'number', '3' ], [ 'number', '9' ] ]
        )
    } )

    it( 'correctly parses trigonometric function applications', () => {
        check(
            '\\cos x+1',
            [ 'addition',
                [ 'prefixfuncapp', 'cosfunc', [ 'numbervariable', 'x' ] ],
                [ 'number', '1' ] ]
        )
        check(
            '\\cot\\left(a-9.9\\right)',
            [ 'prefixfuncapp', 'cotfunc',
                [ 'subtraction',
                    [ 'numbervariable', 'a' ], [ 'number', '9.9' ] ] ],
        )
        check(
            '\\csc^{-1}\\left(1+g\\right)',
            [ 'prefixfuncapp',
                [ 'prefixfuncinv', 'cscfunc' ],
                [ 'addition', [ 'number', '1' ], [ 'numbervariable', 'g' ] ] ]
        )
    } )

    it( 'correctly parses factorials', () => {
        check(
            '\\left(W+R\\right)!',
            [ 'factorial',
                [ 'addition',
                    [ 'numbervariable', 'W' ], [ 'numbervariable', 'R' ] ] ]
        )
    } )

    it( 'correctly parses unusual implication symbols', () => {
        check(
            'P\\Rarr Q',
            [ 'implication', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ]
        )
        check(
            'P\\rArr Q',
            [ 'implication', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ]
        )
        check(
            'Q\\Larr P',
            [ 'implication', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ]
        )
        check(
            'Q\\lArr P',
            [ 'implication', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ]
        )
        check(
            'P\\lrArr Q',
            [ 'iff', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ]
        )
        check(
            'P\\Lrarr Q',
            [ 'iff', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ]
        )
    } )

    it( 'correctly parses unusual set theory notation', () => {
        check(
            '(A\\cup B)^{\\complement}',
            [ 'complement',
                [ 'union', [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ] ]
        )
    } )

    it( 'correctly parses unusual function signature notation', () => {
        check(
            'f:A\\rarr B',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
        check(
            'f\\colon A\\rarr B',
            [ 'funcsignature', [ 'funcvariable', 'f' ],
                [ 'setvariable', 'A' ], [ 'setvariable', 'B' ] ]
        )
    } )

} )
