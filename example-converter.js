
import { Converter } from './converter.js'
import { Language } from './language.js'

export const converter = new Converter()

converter.addConcept( 'numbervariable', 'atomicnumberexpr', Language.regularExpressions.oneLetterVariable )
converter.addConcept( 'number',         'atomicnumberexpr', Language.regularExpressions.nonnegativeNumber )
converter.addConcept( 'infinity',       'atomicnumberexpr' )

converter.addConcept( 'exponentiation', 'factorexpr',       '(^ atomicnumberexpr atomicnumberexpr)' )
converter.addConcept( 'percentage',     'factorexpr',       '(% atomicnumberexpr)' )
converter.addConcept( 'factorial',      'factorexpr',       '(! atomicnumberexpr)' )
converter.addConcept( 'division',       'prodexpr',         '(/ prodexpr prodexpr)' )
converter.addConcept( 'multiplication', 'prodexpr',         '(* prodexpr prodexpr)' )
converter.addConcept( 'numbernegation', 'prodexpr',         '(- prodexpr)' )

converter.addConcept( 'addition',       'sumexpr',          '(+ sumexpr sumexpr)' )
converter.addConcept( 'subtraction',    'sumexpr',          '(- sumexpr sumexpr)' )

converter.addConcept( 'logicvariable',  'atomicpropexpr',   Language.regularExpressions.oneLetterVariable )
converter.addConcept( 'logicaltrue',    'atomicpropexpr',   'true' )
converter.addConcept( 'logicalfalse',   'atomicpropexpr',   'false' )
converter.addConcept( 'contradiction',  'atomicpropexpr',   'contradiction' )

converter.addConcept( 'logicnegation',  'conjunctexpr',     '(not atomicpropexpr)' )
converter.addConcept( 'conjunction',    'conjunctexpr',     '(and conjunctexpr conjunctexpr)' )
converter.addConcept( 'disjunction',    'disjunctexpr',     '(or disjunctexpr disjunctexpr)' )
converter.addConcept( 'implication',    'condexpr',         '(implies condexpr condexpr)' )
converter.addConcept( 'iff',            'condexpr',         '(iff condexpr condexpr)' )

converter.addConcept( 'universal',      'sentenceexpr',     '(forall (numbervariable , sentenceexpr))' )
converter.addConcept( 'existential',    'sentenceexpr',     '(exists (numbervariable , sentenceexpr))' )
converter.addConcept( 'existsunique',   'sentenceexpr',     '(existsunique (numbervariable , sentenceexpr))' )

converter.addConcept( 'setvariable',    'atomicsetexpr',    Language.regularExpressions.oneLetterVariable )

converter.addConcept( 'intersection',   'setexpr',          '(setint intersectionexpr intersectionexpr)' )
converter.addConcept( 'setdifference',  'setexpr',          '(setminus intersectionexpr intersectionexpr)' )
converter.addConcept( 'union',          'setexpr',          '(setuni unionexpr unionexpr)' )
converter.addConcept( 'complement',     'setexpr',          '(setcomp setexpr)' )

converter.addConcept( 'subset',         'atomicpropexpr',   '(subset setexpr setexpr)' )
converter.addConcept( 'subseteq',       'atomicpropexpr',   '(subseteq setexpr setexpr)' )
converter.addConcept( 'numberisin',     'atomicpropexpr',   '(in numberexpr setexpr)' )
converter.addConcept( 'propisin',       'atomicpropexpr',   '(in atomicpropexpr setexpr)' )
converter.addConcept( 'setisin',        'atomicpropexpr',   '(in setexpr setexpr)' )
converter.addConcept( 'numberisnotin',  'atomicpropexpr',   '(not (in numberexpr setexpr))', { primitive : false } )
converter.addConcept( 'propisnotin',    'atomicpropexpr',   '(not (in condexpr setexpr))', { primitive : false } )
converter.addConcept( 'setisnotin',     'atomicpropexpr',   '(not (in setexpr setexpr))', { primitive : false } )

const latex = new Language( 'latex', converter, [ '{', '}', '(', ')' ] )

latex.addNotation( 'infinity',       '\\infty' )

latex.addNotation( 'exponentiation', 'A^B' )
latex.addNotation( 'percentage',     'A\\%' )
latex.addNotation( 'factorial',      'A!' )

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

latex.addNotation( 'union',          'A\\cup B' )
latex.addNotation( 'intersection',   'A\\cap B' )
latex.addNotation( 'setdifference',  'A\\setminus B' )
latex.addNotation( 'setdifference',  'A-B' )
latex.addNotation( 'complement',     '\\bar A' )
latex.addNotation( 'complement',     'A\'' )

latex.addNotation( 'subset',         'A\\subset B' )
latex.addNotation( 'subseteq',       'A\\subseteq B' )
latex.addNotation( 'numberisin',     'A\\in B' )
latex.addNotation( 'propisin',       'A\\in B' )
latex.addNotation( 'setisin',        'A\\in B' )
latex.addNotation( 'numberisnotin',  'A\\notin B' )
latex.addNotation( 'propisnotin',    'A\\notin B' )
latex.addNotation( 'setisnotin',     'A\\notin B' )
