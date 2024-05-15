
import { Converter } from './converter.js'
import { Language } from './language.js'
import { latexNotation } from './latex-notation.js'

export const converter = new Converter()
Language.fromJSON( 'latex', converter, latexNotation )
