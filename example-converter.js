
import { Converter } from './converter.js'

export const converter = new Converter()

converter.addConcept( 'numbervariable', 'atomicnumber', Converter.regularExpressions.oneLetterVariable )
converter.addConcept( 'number',         'atomicnumber', Converter.regularExpressions.number )
converter.addConcept( 'infinity',       'atomicnumber' )

converter.addConcept( 'exponentiation', 'factor',       '(^ atomicnumber atomicnumber)' )
converter.addConcept( 'percentage',     'factor',       '(% atomicnumber)' )
converter.addConcept( 'division',       'product',      '(/ product product)' )
converter.addConcept( 'multiplication', 'product',      '(* product product)' )
converter.addConcept( 'numbernegation', 'sum',          '(- sum)' )

converter.addConcept( 'logicvariable',  'atomicprop',   Converter.regularExpressions.oneLetterVariable )
converter.addConcept( 'logicaltrue',    'atomicprop',   'true' )
converter.addConcept( 'logicalfalse',   'atomicprop',   'false' )
converter.addConcept( 'contradiction',  'atomicprop',   'contradiction' )

converter.addConcept( 'logicnegation',  'conjunct',     '(not atomicprop)' )
converter.addConcept( 'conjunction',    'conjunct',     '(and conjunct conjunct)' )
converter.addConcept( 'disjunction',    'disjunct',     '(or disjunct disjunct)' )
converter.addConcept( 'implication',    'conditional',  '(implies conditional conditional)' )
converter.addConcept( 'iff',            'conditional',  '(iff conditional conditional)' )

converter.addConcept( 'universal',      'sentence',     '(forall (numbervariable , sentence))' )
converter.addConcept( 'existential',    'sentence',     '(exists (numbervariable , sentence))' )
converter.addConcept( 'existsunique',   'sentence',     '(existsunique (numbervariable , sentence))' )

converter.addLanguage( 'latex', '{', '}' )

converter.addNotation( 'latex', 'infinity',       '\\infty' )

converter.addNotation( 'latex', 'exponentiation', 'A^B' )
converter.addNotation( 'latex', 'percentage',     'A\\%' )
converter.addNotation( 'latex', 'division',       'A\\div B' )
converter.addNotation( 'latex', 'multiplication', 'A\\times B' )
converter.addNotation( 'latex', 'multiplication', 'A\\cdot B' )
converter.addNotation( 'latex', 'numbernegation', '-A' )

converter.addNotation( 'latex', 'logicaltrue',    '\\top' )
converter.addNotation( 'latex', 'logicalfalse',   '\\bot' )
converter.addNotation( 'latex', 'contradiction',  '\\rightarrow \\leftarrow' )

converter.addNotation( 'latex', 'logicnegation',  '\\neg A' )
converter.addNotation( 'latex', 'logicnegation',  '\\lnot A' )
converter.addNotation( 'latex', 'conjunction',    'A\\wedge B' )
converter.addNotation( 'latex', 'conjunction',    'A\\land B' )
converter.addNotation( 'latex', 'disjunction',    'A\\vee B' )
converter.addNotation( 'latex', 'disjunction',    'A\\lor B' )
converter.addNotation( 'latex', 'implication',    'A\\Rightarrow B' )
converter.addNotation( 'latex', 'implication',    'B\\Leftarrow A' )
converter.addNotation( 'latex', 'iff',            'A\\Leftrightarrow B' )

converter.addNotation( 'latex', 'universal',      '\\forall A, B' )
converter.addNotation( 'latex', 'existential',    '\\exists A, B' )
converter.addNotation( 'latex', 'existsunique',   '\\exists ! A, B' )

// For later:
// ----------
// infinity  : '\u221e', // ∞
// longMinus : '\u2212', // −
// divide    : '\u00f7', // ÷
// times     : '\u00d7', // ×
// cdot      : '\u00b7', // ·
