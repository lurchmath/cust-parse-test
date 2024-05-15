
import { Converter } from './converter.js'
import { latexNotation } from './latex-notation.js'

export const converter = new Converter()
converter.addBuiltIns()
latexNotation.addTo( converter )
