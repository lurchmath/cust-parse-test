
import { Converter } from './converter.js'

export const converter = new Converter()

converter.addLanguage( 'latex', '{', '}' )

converter.addConcept( 'numbervariable', { parentType: 'atomicnumber' } )
converter.addConcept( 'number',         { parentType: 'atomicnumber' } )
converter.addConcept( 'infinity',       { parentType: 'atomicnumber' } )

converter.addConcept( 'exponentiation', { parentType: 'factor',  putdown : '^' } )
converter.addConcept( 'percentage',     { parentType: 'factor',  putdown : '%' } )
converter.addConcept( 'division',       { parentType: 'product', putdown : '/' } )
converter.addConcept( 'multiplication', { parentType: 'product', putdown : '*' } )
converter.addConcept( 'numbernegation', { parentType: 'product', putdown : '-' } )

converter.addConcept( 'logicvariable',  { parentType: 'atomicprop' } )
converter.addConcept( 'logicconstant',  { parentType: 'atomicprop' } )

converter.addConcept( 'logicnegation',  { parentType: 'conjunct', putdown : 'not' } )
converter.addConcept( 'conjunction',    { parentType: 'conjunct', putdown : 'and' } )
converter.addConcept( 'disjunction',    { parentType: 'disjunct', putdown : 'or' } )
converter.addConcept( 'implication',    { parentType: 'conditional', putdown : 'implies' } )
converter.addConcept( 'iff',            { parentType: 'conditional', putdown : 'iff' } )

converter.addConcept( 'universal',      { parentType: 'sentence', 'putdown' : 'forall', body : 2 } )
converter.addConcept( 'existential',    { parentType: 'sentence', 'putdown' : 'exists', body : 2 } )
converter.addConcept( 'existsunique',   { parentType: 'sentence', 'putdown' : 'existsunique', body : 2 } )

converter.addNotation( 'latex', 'numbervariable', /[a-zA-Z]/ )
converter.addNotation( 'latex', 'number',         /\.[0-9]+|[0-9]+\.?[0-9]*/ )
converter.addNotation( 'latex', 'infinity',       '\\infty' )

converter.addNotation( 'latex', 'exponentiation', 'atomicnumber^atomicnumber' )
converter.addNotation( 'latex', 'percentage',     'atomicnumber\\%' )
converter.addNotation( 'latex', 'division',       'product\\div product' )
converter.addNotation( 'latex', 'multiplication', 'product\\times product' )
converter.addNotation( 'latex', 'multiplication', 'product\\cdot product' )
converter.addNotation( 'latex', 'numbernegation', '-product' )

converter.addNotation( 'latex', 'logicvariable',  /[a-zA-Z]/ )
converter.addNotation( 'latex', 'logicconstant',  '\\top' )
converter.addNotation( 'latex', 'logicconstant',  '\\bot' )
converter.addNotation( 'latex', 'logicconstant',  '\\rightarrow \\leftarrow' )

converter.addNotation( 'latex', 'logicnegation',  '\\neg conjunct' )
converter.addNotation( 'latex', 'logicnegation',  '\\lnot conjunct' )
converter.addNotation( 'latex', 'conjunction',    'conjunct\\wedge conjunct' )
converter.addNotation( 'latex', 'conjunction',    'conjunct\\land conjunct' )
converter.addNotation( 'latex', 'disjunction',    'disjunct\\vee disjunct' )
converter.addNotation( 'latex', 'disjunction',    'disjunct\\lor disjunct' )
converter.addNotation( 'latex', 'implication',    'conditional\\Rightarrow conditional' )
converter.addNotation( 'latex', 'iff',            'conditional\\Leftrightarrow conditional' )

converter.addNotation( 'latex', 'universal',      '\\forall numbervariable, sentence' )
converter.addNotation( 'latex', 'existential',    '\\exists numbervariable, sentence' )
converter.addNotation( 'latex', 'existsunique',   '\\exists ! numbervariable, sentence' )

// For later:
// ----------
// infinity  : '\u221e', // ∞
// longMinus : '\u2212', // −
// divide    : '\u00f7', // ÷
// times     : '\u00d7', // ×
// cdot      : '\u00b7', // ·
