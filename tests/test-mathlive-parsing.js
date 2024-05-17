
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
    const checkAll = ( latexText, ...jsons ) => {
        const all = latex.parse( latexText, true )
        expect( all.length ).to.equal( jsons.length )
        for ( let i = 0 ; i < jsons.length ; i++ )
            expect( all.some( result =>
                JSON.stringify(result) == JSON.stringify(jsons[i])
            ) ).to.equal( true )
    }

    it( 'correctly parses basic expressions', () => {
        check( '6+k',
            [ 'Addition', [ 'Number', '6' ], [ 'NumberVariable', 'k' ] ] )
        check( '1.9-T',
            [ 'Subtraction', [ 'Number', '1.9' ], [ 'NumberVariable', 'T' ] ] )
        check( '0.2\\cdot0.3',
            [ 'Multiplication', [ 'Number', '0.2' ], [ 'Number', '0.3' ] ] )
        check( '0.2\\ast0.3',
            [ 'Multiplication', [ 'Number', '0.2' ], [ 'Number', '0.3' ] ] )
        check( 'v\\div w',
            [ 'Division', [ 'NumberVariable', 'v' ], [ 'NumberVariable', 'w' ] ] )
        check( '2^{k}',
            [ 'Exponentiation', [ 'Number', '2' ], [ 'NumberVariable', 'k' ] ] )
        check( '5.0-K+e',
            [ 'Addition',
                [ 'Subtraction', [ 'Number', '5.0' ], [ 'NumberVariable', 'K' ] ],
                'EulersNumber' ] )
        check( '5.0\\times K\\div e',
            [ 'Division',
                [ 'Multiplication', [ 'Number', '5.0' ], [ 'NumberVariable', 'K' ] ],
                'EulersNumber' ] )
        check( '\\left(a^{b}\\right)^{c}',
            [ 'Exponentiation',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'a' ], [ 'NumberVariable', 'b' ] ],
                [ 'NumberVariable', 'c' ] ] )
        check( '5.0-K\\cdot e',
            [ 'Subtraction', [ 'Number', '5.0' ],
                [ 'Multiplication',
                    [ 'NumberVariable', 'K' ], 'EulersNumber' ] ] )
        check( 'u^{v}\\times w^{x}',
            [ 'Multiplication',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'u' ], [ 'NumberVariable', 'v' ] ],
                [ 'Exponentiation',
                    [ 'NumberVariable', 'w' ], [ 'NumberVariable', 'x' ] ] ] )
        check( '-A^{B}',
            [ 'NumberNegation',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ] ] )
    } )

    it( 'respects groupers while parsing', () => {
        check( '6+\\left(k+5\\right)',
            [ 'Addition',
                [ 'Number', '6' ],
                [ 'Addition', [ 'NumberVariable', 'k' ], [ 'Number', '5' ] ] ] )
        check( '\\left(5.0-K\\right)\\cdot e',
            [ 'Multiplication',
                [ 'Subtraction', [ 'Number', '5.0' ], [ 'NumberVariable', 'K' ] ],
                'EulersNumber' ] )
        check( '5.0\\times\\left(K+e\\right)',
            [ 'Multiplication',
                [ 'Number', '5.0' ],
                [ 'Addition', [ 'NumberVariable', 'K' ], 'EulersNumber' ] ] )
        check( '-\\left(K+e\\right)',
            [ 'NumberNegation',
                [ 'Addition', [ 'NumberVariable', 'K' ], 'EulersNumber' ] ] )
        check( '-\\left(A^{B}\\right)',
            [ 'NumberNegation',
                [ 'Exponentiation',
                    [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ] ] )
    } )

    it( 'correctly parses logarithms', () => {
        check(
            '\\log1000',
            [ 'PrefixFunctionApplication', 'Logarithm', [ 'Number', '1000' ] ]
        )
        check(
            '\\log e^{x}\\times y',
            [ 'PrefixFunctionApplication', 'Logarithm', [ 'Multiplication',
                [ 'Exponentiation', 'EulersNumber', [ 'NumberVariable', 'x' ] ],
                [ 'NumberVariable', 'y' ] ] ]
        )
        check(
            '\\log_{-t}\\left(k+5\\right)',
            [ 'PrefixFunctionApplication',
                [ 'LogarithmWithBase', [ 'NumberNegation', [ 'NumberVariable', 't' ] ] ],
                [ 'Addition', [ 'NumberVariable', 'k' ], [ 'Number', '5' ] ] ]
        )
    } )

    it( 'correctly parses fractions', () => {
        check(
            '\\frac 1 2',
            [ 'Division', [ 'Number', '1' ], [ 'Number', '2' ] ]
        )
        check(
            '\\frac{7-k}{1+x^2}',
            [ 'Division',
                [ 'Subtraction', [ 'Number', '7' ], [ 'NumberVariable', 'k' ] ],
                [ 'Addition',
                    [ 'Number', '1' ],
                    [ 'Exponentiation',
                        [ 'NumberVariable', 'x' ], [ 'Number', '2' ] ] ] ]
        )
    } )

    it( 'correctly parses sentences of arithmetic and algebra', () => {
        check(
            't+u\\ne t+v',
            [ 'NotEqual',
                [ 'Addition', [ 'NumberVariable', 't' ], [ 'NumberVariable', 'u' ] ],
                [ 'Addition', [ 'NumberVariable', 't' ], [ 'NumberVariable', 'v' ] ] ]
        )
        check(
            'a\\div{7+b}\\approx0.75',
            [ 'BinaryRelationHolds', 'ApproximatelyEqual',
                [ 'Division',
                    [ 'NumberVariable', 'a' ],
                    [ 'Addition', [ 'Number', '7' ], [ 'NumberVariable', 'b' ] ] ],
                [ 'Number', '0.75' ] ]
        )
        check(
            '\\frac{a}{7+b}\\approx0.75',
            [ 'BinaryRelationHolds', 'ApproximatelyEqual',
                [ 'Division',
                    [ 'NumberVariable', 'a' ],
                    [ 'Addition', [ 'Number', '7' ], [ 'NumberVariable', 'b' ] ] ],
                [ 'Number', '0.75' ] ]
        )
        check(
            't^2\\le10',
            [ 'LessThanOrEqual',
                [ 'Exponentiation', [ 'NumberVariable', 't' ], [ 'Number', '2' ] ],
                [ 'Number', '10' ] ]
        )
        check(
            '1+2+3\\ge6',
            [ 'GreaterThanOrEqual',
                [ 'Addition',
                    [ 'Addition', [ 'Number', '1' ], [ 'Number', '2' ] ],
                    [ 'Number', '3' ] ],
                [ 'Number', '6' ] ]
        )
        check(
            '\\neg A+B=C^{D}',
            [ 'LogicalNegation',
                [ 'Equals',
                    [ 'Addition',
                        [ 'NumberVariable', 'A' ], [ 'NumberVariable', 'B' ] ],
                    [ 'Exponentiation',
                        [ 'NumberVariable', 'C' ], [ 'NumberVariable', 'D' ] ] ] ]
        )
        // Equality of two variables does not uniquely determine which type of
        // variables they are, so we list all possibilities here.
        check(
            '\\lnot\\lnot x=x',
            [ 'LogicalNegation',
                [ 'LogicalNegation',
                    [ 'EqualFunctions',
                        [ 'FunctionVariable', 'x' ], [ 'FunctionVariable', 'x' ] ] ] ]
        )
        check(
            '3\\vert 9',
            [ 'BinaryRelationHolds', 'Divides', [ 'Number', '3' ], [ 'Number', '9' ] ]
        )
    } )

    it( 'correctly parses trigonometric function applications', () => {
        check(
            '\\cos x+1',
            [ 'Addition',
                [ 'PrefixFunctionApplication', 'CosineFunction', [ 'NumberVariable', 'x' ] ],
                [ 'Number', '1' ] ]
        )
        check(
            '\\cot\\left(a-9.9\\right)',
            [ 'PrefixFunctionApplication', 'CotangentFunction',
                [ 'Subtraction',
                    [ 'NumberVariable', 'a' ], [ 'Number', '9.9' ] ] ],
        )
        check(
            '\\csc^{-1}\\left(1+g\\right)',
            [ 'PrefixFunctionApplication',
                [ 'PrefixFunctionInverse', 'CosecantFunction' ],
                [ 'Addition', [ 'Number', '1' ], [ 'NumberVariable', 'g' ] ] ]
        )
    } )

    it( 'correctly parses factorials', () => {
        check(
            '\\left(W+R\\right)!',
            [ 'Factorial',
                [ 'Addition',
                    [ 'NumberVariable', 'W' ], [ 'NumberVariable', 'R' ] ] ]
        )
    } )

    it( 'correctly parses unusual implication symbols', () => {
        check(
            'P\\Rarr Q',
            [ 'Implication', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ]
        )
        check(
            'P\\rArr Q',
            [ 'Implication', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ]
        )
        check(
            'Q\\Larr P',
            [ 'Implication', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ]
        )
        check(
            'Q\\lArr P',
            [ 'Implication', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ]
        )
        check(
            'P\\lrArr Q',
            [ 'LogicalEquivalence', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ]
        )
        check(
            'P\\Lrarr Q',
            [ 'LogicalEquivalence', [ 'LogicVariable', 'P' ], [ 'LogicVariable', 'Q' ] ]
        )
    } )

    it( 'correctly parses unusual set theory notation', () => {
        check(
            '(A\\cup B)^{\\complement}',
            [ 'SetComplement',
                [ 'SetUnion', [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ] ]
        )
    } )

    it( 'correctly parses unusual function signature notation', () => {
        check(
            'f:A\\rarr B',
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ]
        )
        check(
            'f\\colon A\\rarr B',
            [ 'FunctionSignature', [ 'FunctionVariable', 'f' ],
                [ 'SetVariable', 'A' ], [ 'SetVariable', 'B' ] ]
        )
    } )

} )
