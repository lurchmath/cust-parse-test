
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Creating JSON from putdown', () => {

    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str
    const checkPutdownJson = ( putdown, json ) => {
        expect(
            converter.convert( 'putdown', 'ast', putdown ).compact().toJSON()
        ).to.eql( json )
        // console.log( `${lpad( putdown )}  -->  ${JSON.stringify( json )}` )
    }
    const checkPutdownJsonFail = ( latex ) => {
        expect(
            converter.convert( 'putdown', 'json', latex )
        ).to.be.undefined
    }

    it( 'can convert putdown numbers to JSON', () => {
        // non-negative integers
        checkPutdownJson(
            '0',
            [ 'number', '0' ]
        )
        checkPutdownJson(
            '453789',
            [ 'number', '453789' ]
        )
        checkPutdownJson(
            '99999999999999999999999999999999999999999',
            [ 'number', '99999999999999999999999999999999999999999' ]
        )
        // negative integers are parsed as the negation of positive integers
        checkPutdownJson(
            '(- 453789)',
            [ 'numbernegation', [ 'number', '453789' ] ]
        )
        checkPutdownJson(
            '(- 99999999999999999999999999999999999999999)',
            [ 'numbernegation',
                [ 'number', '99999999999999999999999999999999999999999' ] ]
        )
        // non-negative decimals
        checkPutdownJson(
            '0.0',
            [ 'number', '0.0' ]
        )
        checkPutdownJson(
            '29835.6875940',
            [ 'number', '29835.6875940' ]
        )
        checkPutdownJson(
            '653280458689.',
            [ 'number', '653280458689.' ]
        )
        checkPutdownJson(
            '.000006327589',
            [ 'number', '.000006327589' ]
        )
        // negative decimals are the negation of positive decimals
        checkPutdownJson(
            '(- 29835.6875940)',
            [ 'numbernegation', [ 'number', '29835.6875940' ] ]
        )
        checkPutdownJson(
            '(- 653280458689.)',
            [ 'numbernegation', [ 'number', '653280458689.' ] ]
        )
        checkPutdownJson(
            '(- .000006327589)',
            [ 'numbernegation', [ 'number', '.000006327589' ] ]
        )
    } )

    it( 'can convert any size variable name to JSON', () => {
        // one-letter names work
        checkPutdownJson(
            'x',
            [ 'numbervariable', 'x' ]
        )
        checkPutdownJson(
            'E',
            [ 'numbervariable', 'E' ]
        )
        checkPutdownJson(
            'q',
            [ 'numbervariable', 'q' ]
        )
        // multi-letter names don't work; it just does nothing with them
        // because it can't find any concept to which they belong
        checkPutdownJsonFail( 'foo' )
        checkPutdownJsonFail( 'bar' )
        checkPutdownJsonFail( 'to' )
    } )

    it( 'can convert infinity from putdown to JSON', () => {
        // converter._debug = true
        checkPutdownJson(
            'infinity',
            [ 'infinity' ]
        )
    } )

    it( 'can convert exponentiation of atomics to JSON', () => {
        checkPutdownJson(
            '(^ 1 2)',
            [ 'exponentiation', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkPutdownJson(
            '(^ e x)',
            [ 'exponentiation',
                [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
        )
        checkPutdownJson(
            '(^ 1 infinity)',
            [ 'exponentiation', [ 'number', '1' ], [ 'infinity' ] ]
        )
    } )

    it( 'can convert atomic percentages to JSON', () => {
        checkPutdownJson(
            '(% 10)',
            [ 'percentage', [ 'number', '10' ] ]
        )
        checkPutdownJson(
            '(% t)',
            [ 'percentage', [ 'numbervariable', 't' ] ]
        )
    } )

    it( 'can convert division of atomics or factors to JSON', () => {
        // division of atomics
        checkPutdownJson(
            '(/ 1 2)',
            [ 'division', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkPutdownJson(
            '(/ x y)',
            [ 'division',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        checkPutdownJson(
            '(/ 0 infinity)',
            [ 'division', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // division of factors
        checkPutdownJson(
            '(/ (^ x 2) 3)',
            [ 'division',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        checkPutdownJson(
            '(/ 1 (^ e x))',
            [ 'division',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        checkPutdownJson(
            '(/ (% 10) (^ 2 100))',
            [ 'division',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can convert multiplication of atomics or factors to JSON', () => {
        // multiplication of atomics
        checkPutdownJson(
            '(* 1 2)',
            [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ]
        )
        checkPutdownJson(
            '(* x y)',
            [ 'multiplication',
                [ 'numbervariable', 'x' ], [ 'numbervariable', 'y' ] ]
        )
        checkPutdownJson(
            '(* 0 infinity)',
            [ 'multiplication', [ 'number', '0' ], [ 'infinity' ] ]
        )
        // multiplication of factors
        checkPutdownJson(
            '(* (^ x 2) 3)',
            [ 'multiplication',
                [ 'exponentiation', [ 'numbervariable', 'x' ], [ 'number', '2' ] ],
                [ 'number', '3' ]
            ]
        )
        checkPutdownJson(
            '(* 1 (^ e x))',
            [ 'multiplication',
                [ 'number', '1' ],
                [ 'exponentiation',
                    [ 'numbervariable', 'e' ], [ 'numbervariable', 'x' ] ]
            ]
        )
        checkPutdownJson(
            '(* (% 10) (^ 2 100))',
            [ 'multiplication',
                [ 'percentage', [ 'number', '10' ] ],
                [ 'exponentiation', [ 'number', '2' ], [ 'number', '100' ] ]
            ]
        )
    } )

    it( 'can convert negations of atomics or factors to JSON', () => {
        checkPutdownJson(
            '(* (- 1) 2)',
            [ 'multiplication',
                [ 'numbernegation', [ 'number', '1' ] ],
                [ 'number', '2' ]
            ]
        )
        checkPutdownJson(
            '(* x (- y))',
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ]
        )
        checkPutdownJson(
            '(* (- (^ x 2)) (- 3))',
            [ 'multiplication',
                [ 'numbernegation',
                [ 'exponentiation',
                    [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ]
        )
        checkPutdownJson(
            '(- (- (- (- 1000))))',
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ]
        )
    } )

    it( 'can convert number exprs that normally require groupers to JSON', () => {
        checkPutdownJson(
            '(- (* 1 2))',
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ]
        )
        checkPutdownJson(
            '(^ (- x) (* 2 (- 3)))',
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ]
        )
    } )

    it( 'can convert propositional logic atomics to JSON', () => {
        checkPutdownJson(
            'true',
            [ 'logicaltrue' ]
        )
        checkPutdownJson(
            'false',
            [ 'logicalfalse' ]
        )
        checkPutdownJson(
            'contradiction',
            [ 'contradiction' ]
        )
        // Not checking variables here, because their meaning is ambiguous
    } )

    it( 'can convert propositional logic conjuncts to JSON', () => {
        checkPutdownJson(
            '(and true false)',
            [ 'conjunction',
                [ 'logicaltrue' ],
                [ 'logicalfalse' ]
            ]
        )
        checkPutdownJson(
            '(and (not P) (not true))',
            [ 'conjunction',
                [ 'logicnegation', [ 'logicvariable', 'P' ] ],
                [ 'logicnegation', [ 'logicaltrue' ] ]
            ]
        )
        checkPutdownJson(
            '(and (and a b) c)',
            [ 'conjunction',
                [ 'conjunction',
                    [ 'logicvariable', 'a' ],
                    [ 'logicvariable', 'b' ]
                ],
                [ 'logicvariable', 'c' ]
            ]
        )
    } )

    it( 'can convert propositional logic disjuncts to JSON', () => {
        checkPutdownJson(
            '(or true (not A))',
            [ 'disjunction',
                [ 'logicaltrue' ],
                [ 'logicnegation', [ 'logicvariable', 'A' ] ]
            ]
        )
        checkPutdownJson(
            '(or (and P Q) (and Q P))',
            [ 'disjunction',
                [ 'conjunction', [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                [ 'conjunction', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
            ]
        )
    } )

    it( 'can convert propositional logic conditionals to JSON', () => {
        checkPutdownJson(
            '(implies A (and Q (not P)))',
            [ 'implication',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        checkPutdownJson(
            '(implies (implies (or P Q) (and Q P)) T)',
            [ 'implication',
                [ 'implication',
                    [ 'disjunction',
                        [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
                ],
                [ 'logicvariable', 'T' ]
            ]
        )
    } )

    it( 'can convert propositional logic biconditionals to JSON', () => {
        checkPutdownJson(
            '(iff A (and Q (not P)))',
            [ 'iff',
                [ 'logicvariable', 'A' ],
                [ 'conjunction',
                    [ 'logicvariable', 'Q' ],
                    [ 'logicnegation', [ 'logicvariable', 'P' ] ]
                ]
            ]
        )
        checkPutdownJson(
            '(implies (iff (or P Q) (and Q P)) T)',
            [ 'implication',
                [ 'iff',
                    [ 'disjunction',
                        [ 'logicvariable', 'P' ], [ 'logicvariable', 'Q' ] ],
                    [ 'conjunction',
                        [ 'logicvariable', 'Q' ], [ 'logicvariable', 'P' ] ]
                ],
                [ 'logicvariable', 'T' ]
            ]
        )
    } )

    it( 'can convert propositional expressions with groupers to JSON', () => {
        checkPutdownJson(
            '(or P (and (iff Q Q) P))',
            [ 'disjunction',
                [ 'logicvariable', 'P' ],
                [ 'conjunction',
                    [ 'iff', [ 'logicvariable', 'Q' ], [ 'logicvariable', 'Q' ] ],
                    [ 'logicvariable', 'P' ]
                ]
            ]
        )
        checkPutdownJson(
            '(not (iff true false))',
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ]
        )
    } )

    it( 'can convert simple predicate logic expressions to JSON', () => {
        // const rules = converter.languages.get( 'putdown' ).grammar.rules
        // Object.keys( rules ).map( name =>
        //     console.log( name, rules[name].map( rhs => rhs.slice() ) ) )
        checkPutdownJson(
            '(forall (x , P))',
            [ 'universal',
                [ 'numbervariable', 'x' ],
                [ 'logicvariable', 'P' ]
            ]
        )
        checkPutdownJson(
            '(exists (t , (not Q)))',
            [ 'existential',
                [ 'numbervariable', 't' ],
                [ 'logicnegation', [ 'logicvariable', 'Q' ] ]
            ]
        )
        checkPutdownJson(
            '(existsunique (k , (implies m n)))',
            [ 'existsunique',
                [ 'numbervariable', 'k' ],
                [ 'implication', [ 'logicvariable', 'm' ], [ 'logicvariable', 'n' ] ]
            ]
        )
    } )

} )
