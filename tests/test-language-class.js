
import { expect } from 'chai'
import { Language } from '../language.js'

describe( 'Language instance', () => {

    it( 'should be defined', () => {
        expect( Language ).to.be.ok
        // regularExpressions has three members, each a regexp
        expect( Language.regularExpressions ).to.be.instanceOf( Object )
        expect(
            Language.regularExpressions.oneLetterVariable
        ).to.be.instanceOf( RegExp )
        expect(
            Language.regularExpressions.integer
        ).to.be.instanceOf( RegExp )
        expect(
            Language.regularExpressions.number
        ).to.be.instanceOf( RegExp )
    } )

} )
