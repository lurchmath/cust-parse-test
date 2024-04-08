
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

converter.addConcept( 'oneeltseq',      'sequenceexpr',     '(elts nounexpr)' )
converter.addConcept( 'eltthenseq',     'sequenceexpr',     '(elts nounexpr sequenceexpr)' )
converter.addConcept( 'finiteset',      'atomicsetexpr',    '(finiteset sequenceexpr)' )
converter.addConcept( 'emptyset',       'atomicsetexpr',    'emptyset' )

converter.addConcept( 'intersection',   'setexpr',          '(setint intersectionexpr intersectionexpr)' )
converter.addConcept( 'setdifference',  'setexpr',          '(setminus intersectionexpr intersectionexpr)' )
converter.addConcept( 'union',          'setexpr',          '(setuni unionexpr unionexpr)' )
converter.addConcept( 'complement',     'intersectionexpr', '(setcomp atomicsetexpr)' )
converter.addConcept( 'setproduct',     'intersectionexpr', '(setprod atomicsetexpr atomicsetexpr)' )

converter.addConcept( 'subset',         'atomicpropexpr',   '(subset setexpr setexpr)' )
converter.addConcept( 'subseteq',       'atomicpropexpr',   '(subseteq setexpr setexpr)' )
converter.addConcept( 'nounisin',       'atomicpropexpr',   '(in nounexpr setexpr)' )
converter.addConcept( 'propisin',       'atomicpropexpr',   '(in atomicpropexpr setexpr)' )
converter.addConcept( 'nounisnotin',    'atomicpropexpr',   '(not (in nounexpr setexpr))', { primitive : false } )
converter.addConcept( 'propisnotin',    'atomicpropexpr',   '(not (in condexpr setexpr))', { primitive : false } )

converter.addConcept( 'tuple',          'tupleexpr',        '(tuple eltthenseq)' )
converter.addConcept( 'onenumseq',      'numsequenceexpr',  '(elts numberexpr)' )
converter.addConcept( 'numthenseq',     'numsequenceexpr',  '(elts numberexpr numsequenceexpr)' )
converter.addConcept( 'vector',         'tupleexpr',        '(vector numthenseq)' )

converter.addConcept( 'funcvariable',   'atomicfuncexpr',   Language.regularExpressions.oneLetterVariable )
converter.addConcept( 'funcsignature',  'atomicpropexpr',   '(function funcexpr setexpr setexpr)' )
converter.addConcept( 'numfuncapp',     'factorexpr',       '(apply funcexpr nounexpr)' )
converter.addConcept( 'propfuncapp',    'atomicpropexpr',   '(apply funcexpr nounexpr)' )
converter.addConcept( 'setfuncapp',     'atomicsetexpr',    '(apply funcexpr nounexpr)' )

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

latex.addNotation( 'emptyset',       '\\emptyset' )
latex.addNotation( 'emptyset',       '\\{ \\}' )
latex.addNotation( 'finiteset',      '\\{A\\}' )
latex.addNotation( 'oneeltseq',      'A' )
latex.addNotation( 'eltthenseq',     'A,B' )
latex.addNotation( 'onenumseq',      'A' )
latex.addNotation( 'numthenseq',     'A,B' )

latex.addNotation( 'union',          'A\\cup B' )
latex.addNotation( 'intersection',   'A\\cap B' )
latex.addNotation( 'setdifference',  'A\\setminus B' )
latex.addNotation( 'setdifference',  'A-B' )
latex.addNotation( 'complement',     '\\bar A' )
latex.addNotation( 'complement',     'A\'' )
latex.addNotation( 'setproduct',     'A\\times B' )

latex.addNotation( 'subset',         'A\\subset B' )
latex.addNotation( 'subseteq',       'A\\subseteq B' )
latex.addNotation( 'nounisin',       'A\\in B' )
latex.addNotation( 'propisin',       'A\\in B' )
latex.addNotation( 'nounisnotin',    'A\\notin B' )
latex.addNotation( 'propisnotin',    'A\\notin B' )

latex.addNotation( 'tuple',          '(A)' )
latex.addNotation( 'vector',         '\\langle A\\rangle' )

latex.addNotation( 'funcsignature',  'A:B\\to C' )
latex.addNotation( 'funcsignature',  'A:B\\rightarrow C' )
latex.addNotation( 'funcsignature',  'A\\colon B\\to C' )
latex.addNotation( 'funcsignature',  'A\\colon B\\rightarrow C' )
latex.addNotation( 'numfuncapp',     'A(B)' )
latex.addNotation( 'propfuncapp',    'A(B)' )
latex.addNotation( 'setfuncapp',     'A(B)' )
