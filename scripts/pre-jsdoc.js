
// This script runs before jsDoc runs, and it builds the Test Results.md file
// in the tutorials folder, so that it can be incorporated into the jsDoc build.

import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs'

// read from the file log.json in the tests directory
const infile = path.join(
    path.dirname( url.fileURLToPath( import.meta.url ) ),
    '../tests/log.json'
)
console.log( `Reading test results from file: ${infile}` )
if ( !fs.existsSync( infile ) ) {
    console.error( 'The file does not exist: ' + infile )
    console.error( 'Run "npm run log-test" to generate it.' )
    console.error( 'Do not check the resulting file into version control.' )
    process.exit( 1 )
}
const logJSON = JSON.parse( fs.readFileSync( infile ) )

// we will write to the file test-results.md in the tutorials directory
const outfile = path.join(
    path.dirname( url.fileURLToPath( import.meta.url ) ),
    '../tutorials/Test Results.md'
)

// utility functions for generating markdown
const toMd = ( dataType, data ) => {
    switch ( dataType ) {
        case 'JSON': return 'JSON `' + JSON.stringify( data ) + '`'
        case 'LaTeX' :
            const escaped = data?.replaceAll( '\\%', '\\\\%' )
            return 'LaTeX `' + data + '`, typeset $' + escaped + '$'
        case 'putdown' : return 'putdown `' + data + '`'
        default : throw new Error( `Unknown data type: ${ dataType }` )
    }
}

// generate the markdown to write
let markdown = ''
let toc = ''
logJSON.forEach( suite => {
    const anchor = suite.name.replaceAll( ' ', '-' )
    toc += '- [' + suite.name + '](#' + anchor + ')\n'
    markdown += `## <a name="${anchor}">${ suite.name }</a>\n\n`
    suite.contents.forEach( test => {
        markdown += `### ${ test.name }\n\n`
        test.inputs.forEach( ( input, index ) => {
            const output = test.outputs[index]
            markdown += `- Test ${index+1}\n`
            markdown += `   - input: ${toMd(test.input,input)}\n`
            markdown += `   - output: ${toMd(test.output,output)}\n`
        } )
        markdown += '\n\n'
    } )
} )

// write the markdown
console.log( `Writing test summary to file: ${outfile}...` )
fs.writeFileSync( outfile, `
The following page lists all tests run using the example converter in this
repository, which was build to verify that the language-building and conversion
tools in this repository work.  It can convert among LaTeX, putdown, and JSON
formats (as of this writing).  The specific conversions it performed (to
satisfy the requirements of the test suite) are shown below.

## Table of contents

${toc}

${markdown}` )
console.log( 'Done.' )
