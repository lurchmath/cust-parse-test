
import { Converter } from './converter.js'
import { Language } from './language.js'

export const converter = new Converter()

converter.addConcept( 'numbervariable', 'atomicnumber', Language.regularExpressions.oneLetterVariable )
converter.addConcept( 'number',         'atomicnumber', Language.regularExpressions.nonnegativeNumber )
converter.addConcept( 'infinity',       'atomicnumber' )

converter.addConcept( 'exponentiation', 'factor',       '(^ atomicnumber atomicnumber)' )
converter.addConcept( 'percentage',     'factor',       '(% atomicnumber)' )
converter.addConcept( 'division',       'product',      '(/ product product)' )
converter.addConcept( 'multiplication', 'product',      '(* product product)' )
converter.addConcept( 'numbernegation', 'product',      '(- product)' )

converter.addConcept( 'addition',       'sum',          '(+ sum sum)' )
converter.addConcept( 'subtraction',    'sum',          '(- sum sum)' )

converter.addConcept( 'logicvariable',  'atomicprop',   Language.regularExpressions.oneLetterVariable )
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

const latex = new Language( 'latex', converter, [ '{', '}', '(', ')' ] )

latex.addNotation( 'infinity',       '\\infty' )

latex.addNotation( 'exponentiation', 'A^B' )
latex.addNotation( 'percentage',     'A\\%' )
latex.addNotation( 'division',       'A\\div B' )
latex.addNotation( 'multiplication', 'A\\times B' )
latex.addNotation( 'multiplication', 'A\\cdot B' )
latex.addNotation( 'numbernegation', '-A' )

latex.addNotation( 'addition',       'A+B' )
latex.addNotation( 'subtraction',    'A-B' )

latex.addNotation( 'logicaltrue',    '\\top' )
latex.addNotation( 'logicalfalse',   '\\bot' )
latex.addNotation( 'contradiction',  '\\rightarrow \\leftarrow' )

latex.addNotation( 'logicnegation',  '\\neg A' )
latex.addNotation( 'logicnegation',  '\\lnot A' )
latex.addNotation( 'conjunction',    'A\\wedge B' )
latex.addNotation( 'conjunction',    'A\\land B' )
latex.addNotation( 'disjunction',    'A\\vee B' )
latex.addNotation( 'disjunction',    'A\\lor B' )
latex.addNotation( 'implication',    'A\\Rightarrow B' )
latex.addNotation( 'implication',    'B\\Leftarrow A' )
latex.addNotation( 'iff',            'A\\Leftrightarrow B' )

latex.addNotation( 'universal',      '\\forall A, B' )
latex.addNotation( 'existential',    '\\exists A, B' )
latex.addNotation( 'existsunique',   '\\exists ! A, B' )
