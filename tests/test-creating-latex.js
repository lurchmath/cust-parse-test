
import { expect } from 'chai'
import { converter } from '../example-converter.js'

describe( 'Creating latex from JSON', () => {

    const whitespace = '                                            '
    const lpad = str => whitespace.substr( 0, whitespace.length - str.length ) + str
    const checkJsonLatex = ( json, latex ) => {
        expect(
            converter.convert( 'json', 'latex', json )
        ).to.eql( latex )
        // console.log( `${lpad( latex )}  -->  ${JSON.stringify( json )}` )
    }
    const checkJsonLatexFail = ( json ) => {
        expect(
            converter.convert( 'json', 'latex', json )
        ).to.be.undefined
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

    it( 'can convert atomic percentages from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'percentage', [ 'number', '10' ] ],
            '10 \\%'
        )
        checkJsonLatex(
            [ 'percentage', [ 'numbervariable', 't' ] ],
            't \\%'
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
            '{ - 1 } \\times 2'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'numbervariable', 'x' ],
                [ 'numbernegation', [ 'numbervariable', 'y' ] ]
            ],
            'x \\times { - y }'
        )
        checkJsonLatex(
            [ 'multiplication',
                [ 'numbernegation',
                    [ 'exponentiation',
                        [ 'numbervariable', 'x' ], [ 'number', '2' ] ] ],
                [ 'numbernegation', [ 'number', '3' ] ]
            ],
            '{ - x ^ 2 } \\times { - 3 }'
        )
        checkJsonLatex(
            [ 'numbernegation', [ 'numbernegation', [ 'numbernegation',
                [ 'numbernegation', [ 'number', '1000' ] ] ] ] ],
            '- - - - 1000'
        )
    } )

    it( 'can convert number expressions with groupers from JSON to LaTeX', () => {
        checkJsonLatex(
            [ 'numbernegation',
                [ 'multiplication', [ 'number', '1' ], [ 'number', '2' ] ] ],
            '- 1 \\times 2'
        )
        checkJsonLatex(
            [ 'exponentiation',
                [ 'numbernegation',
                    [ 'numbervariable', 'x' ] ],
                [ 'multiplication',
                    [ 'number', '2' ], [ 'numbernegation', [ 'number', '3' ] ] ]
            ],
            '{ - x } ^ { 2 \\times { - 3 } }'
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
            'P \\vee { Q \\Leftrightarrow Q } \\wedge P'
        )
        checkJsonLatex(
            [ 'logicnegation',
                [ 'iff',
                    [ 'logicaltrue' ],
                    [ 'logicalfalse' ]
                ]
            ],
            '\\neg { \\top \\Leftrightarrow \\bot }'
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

} )
