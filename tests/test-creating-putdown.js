
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Creating putdown from JSON', () => {

    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str
    const simplifyPutdown = putdown =>
        putdown.replace( /\(\s+/g, '(' ).replace( /\s+\)/g, ')' ).replaceAll( '  ', ' ' )
    const checkJsonPutdown = ( json, putdown ) => {
        expect(
            simplifyPutdown( converter.convert( 'json', 'putdown', json ) )
        ).to.equal( putdown )
        // console.log( `${lpad( putdown )}  <--  ${JSON.stringify( json )}` )
    }

    it( 'can convert JSON numbers to putdown', () => {
        // non-negative integers
        checkJsonPutdown(
            [ 'number', '0' ],
            '0'
        )
        checkJsonPutdown(
            [ 'number', '453789' ],
            '453789'
        )
        checkJsonPutdown(
            [ 'number', '99999999999999999999999999999999999999999' ],
            '99999999999999999999999999999999999999999'
        )
        // negative integers are parsed as the negation of positive integers
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '453789' ] ],
            '(- 453789)'
        )
        checkJsonPutdown(
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ],
            '(- 99999999999999999999999999999999999999999)'
        )
        // non-negative decimals
        checkJsonPutdown(
            [ 'number', '0.0' ],
            '0.0'
        )
        checkJsonPutdown(
            [ 'number', '29835.6875940' ],
            '29835.6875940'
        )
        checkJsonPutdown(
            [ 'number', '653280458689.' ],
            '653280458689.'
        )
        checkJsonPutdown(
            [ 'number', '.000006327589' ],
            '.000006327589'
        )
        // negative decimals are the negation of positive decimals
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '29835.6875940' ] ],
            '(- 29835.6875940)'
        )
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '653280458689.' ] ],
            '(- 653280458689.)'
        )
        checkJsonPutdown(
            [ 'numbernegation', [ 'number', '.000006327589' ] ],
            '(- .000006327589)'
        )
    } )

    it( 'can convert any size variable name to JSON', () => {
        // one-letter names work
        checkJsonPutdown(
            [ 'numbervariable', 'x' ],
            'x'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'E' ],
            'E'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'q' ],
            'q'
        )
        // multi-letter names work, too
        checkJsonPutdown(
            [ 'numbervariable', 'foo' ],
            'foo'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'bar' ],
            'bar'
        )
        checkJsonPutdown(
            [ 'numbervariable', 'to' ],
            'to'
        )
    } )

    it( 'can convert LaTeX infinity from JSON to putdown', () => {
        checkJsonPutdown(
            [ 'infinity' ],
            'infinity'
        )
    } )

    it( 'can convert exponentiation of atomics to putdown', () => {
        checkJsonPutdown(
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ],
            '(^ 1 2)'
        )
        checkJsonPutdown(
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ],
            '(^ e x)'
        )
        checkJsonPutdown(
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ],
            '(^ 1 infinity)'
        )
    } )

    it( 'can convert atomic percentages to putdown', () => {
        checkJsonPutdown(
            [ 'percentage', [ 'number', '10' ] ],
            '(% 10)'
        )
        checkJsonPutdown(
            [ 'percentage', [ 'numbervariable', 't' ] ],
            '(% t)'
        )
    } )

    it( 'can convert division of atomics or factors to putdown', () => {
        // division of atomics
        checkJsonPutdown(
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ],
            '(/ 1 2)'
        )
        checkJsonPutdown(
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            '(/ x y)'
        )
        checkJsonPutdown(
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ],
            '(/ 0 infinity)'
        )
        // division of factors
        checkJsonPutdown(
            [ 'division',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            '(/ (^ x 2) 3)'
        )
        checkJsonPutdown(
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '(/ 1 (^ e x))'
        )
        checkJsonPutdown(
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '(/ (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert multiplication of atomics or factors to putdown', () => {
        // multiplication of atomics
        checkJsonPutdown(
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ],
            '(* 1 2)'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ],
            '(* x y)'
        )
        checkJsonPutdown(
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ],
            '(* 0 infinity)'
        )
        // multiplication of factors
        checkJsonPutdown(
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ],
            '(* (^ x 2) 3)'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ],
            '(* 1 (^ e x))'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ],
            '(* (% 10) (^ 2 100))'
        )
    } )

    it( 'can convert negations of atomics or factors to putdown', () => {
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ],
            '(* (- 1) 2)'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ],
            '(* x (- y))'
        )
        checkJsonPutdown(
            [ 'multiplication',
                [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '(* (- (^ x 2)) (- 3))'
        )
        checkJsonPutdown(
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ],
            '(- (- (- (- 1000))))'
        )
    } )

    it( 'can convert number expressions with groupers to putdown', () => {
        checkJsonPutdown(
            [ 'numbernegation',
                [ 'multiplication',
                    [ 'number', '1' ], [ 'number', '2' ] ] ],
            '(- (* 1 2))'
        )
        checkJsonPutdown(
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ],
                        [ 'numbernegation', [ 'number', '3' ] ] ]
            ],
            '(^ (- x) (* 2 (- 3)))'
        )
    } )

    it( 'can convert propositional logic atomics to putdown', () => {
        checkJsonPutdown(
            [ 'logicaltrue' ],
            'true'
        )
        checkJsonPutdown(
            [ 'logicalfalse' ],
            'false'
        )
        checkJsonPutdown(
            [ 'contradiction' ],
            'contradiction'
        )
        checkJsonPutdown(
            [ 'logicvariable', 'P' ],
            'P'
        )
        checkJsonPutdown(
            [ 'logicvariable', 'a' ],
            'a'
        )
        checkJsonPutdown(
            [ 'logicvariable', 'somethingLarge' ],
            'somethingLarge'
        )
    } )

    it( 'can convert propositional logic conjuncts to putdown', () => {
        checkJsonPutdown(
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ],
            '(and true false)'
        )
        checkJsonPutdown(
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ],
            '(and (not P) (not true))'
        )
        checkJsonPutdown(
            [ 'conjunction',
                [ 'conjunction',
                    [ 'logicvariable', 'a' ],
                    [ 'logicvariable', 'b' ]
                ],
                [ 'logicvariable', 'c' ]
            ],
            '(and (and a b) c)'
        )
    } )

    it( 'can convert propositional logic disjuncts to putdown', () => {
        checkJsonPutdown(
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ],
            '(or true (not A))'
        )
        checkJsonPutdown(
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ],
            '(or (and P Q) (and Q P))'
        )
    } )

    it( 'can convert propositional logic conditionals to putdown', () => {
        checkJsonPutdown(
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            '(implies A (and Q (not P)))'
        )
        checkJsonPutdown(
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
            '(implies (implies (or P Q) (and Q P)) T)'
        )
    } )

    it( 'can convert propositional logic biconditionals to putdown', () => {
        checkJsonPutdown(
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ],
            '(iff A (and Q (not P)))'
        )
        checkJsonPutdown(
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
            '(implies (iff (or P Q) (and Q P)) T)'
        )
    } )

    it( 'can convert propositional expressions with groupers to putdown', () => {
        checkJsonPutdown(
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
            '(or P (and (iff Q Q) P))'
        )
        checkJsonPutdown(
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ],
            '(not (iff true false))'
        )
    } )

    it( 'can convert simple predicate logic expressions to putdown', () => {
        checkJsonPutdown(
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ],
            '(forall (x , P))'
        )
        checkJsonPutdown(
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ],
            '(exists (t , (not Q)))'
        )
        checkJsonPutdown(
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication',
                    [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ],
            '(existsunique (k , (implies m n)))'
        )
    } )

} )
