
import { builtInConcepts } from './built-in-concepts.js'
import { latexNotation } from './latex-notation.js'

export const converter = builtInConcepts.getConverter()
latexNotation.addTo( converter )
