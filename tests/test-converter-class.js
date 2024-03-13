
import { expect } from 'chai'
import { Converter } from '../converter.js'

describe( 'Converter instance', () => {

    it( 'should be defined and have several necessary static members', () => {
        expect( Converter ).to.be.ok
        // regularExpressions has three members, each a regexp
        expect( Converter.regularExpressions ).to.be.instanceOf( Object )
        expect(
            Converter.regularExpressions.oneLetterVariable
        ).to.be.instanceOf( RegExp )
        expect(
            Converter.regularExpressions.integer
        ).to.be.instanceOf( RegExp )
        expect(
            Converter.regularExpressions.number
        ).to.be.instanceOf( RegExp )
    } )

} )
