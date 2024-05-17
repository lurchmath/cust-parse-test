
/**
 * This module defines and expoerts one object, called `converter`, which is a
 * {@link Converter} instance that includes all of the
 * {@link module:BuiltInConcepts built-in concepts} of this repository, together
 * with the {@link module:LatexNotation standard LaTeX notation} for each, plus
 * natural putdown notation for each as well.  This module is used extensively
 * in the test suite for this repository to ensure that a complex concept
 * hierarchy with multiple languages defined on it is feasible.
 * 
 * @module ExampleConverter
 */

import { Converter } from './converter.js'
import { Language } from './language.js'
import { latexNotation } from './latex-notation.js'

/**
 * The Converter instance mentioned at
 * {@link module:ExampleConverter the top of this module}.
 */
export const converter = new Converter()
Language.fromJSON( 'latex', converter, latexNotation )
