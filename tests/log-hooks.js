
// This script can be brought into a Mocha test run by passing the argument
// --require tests/log-hooks.js to mocha.js.  It adds logging functionality to
// the main tests in this repository, causing them to dump a large JSON object
// into the tests folder, which can then be built into a test report in the
// jsDoc output, using scripts/pre-jsdoc.js.
// If you run "npm run test" then this file is not incorporated.
// If you run "npm run log-test" then this file is incorporated.

import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs'

// log to the file log.json in the tests directory
const outfile = path.join(
    path.dirname( url.fileURLToPath( import.meta.url ) ),
    'log.json'
)

// the data we will write to that file will be stored here
// (we pre-populate it so that we control the order)
const logJSON = [
    { name : 'Parsing putdown', contents : [ ] },
    { name : 'Rendering JSON into putdown', contents : [ ] },
    { name : 'Parsing LaTeX', contents : [ ] },
    { name : 'Rendering JSON into LaTeX', contents : [ ] },
    { name : 'Converting putdown to LaTeX', contents : [ ] },
    { name : 'Converting LaTeX to putdown', contents : [ ] }
]

// globals to store the current suite and test titles
let suiteTitle, testTitle

// install some hooks into Mocha, the test-runner
export const mochaHooks = {
    // before everything, install a global logging function that writes data
    // into logJSON, using this format:
    // [
    //     {
    //         name: 'suite title here',
    //         contents: [
    //             {
    //                 name: 'test title here',
    //                 input: 'name of input variable',
    //                 output: 'name of output variable',
    //                 inputs: [ input1, input2, ... ],  // these are pairs that
    //                 outputs: [ output1, output2, ... ] // were tested
    //             },
    //             // more tests
    //         ]
    //     },
    //     // more suites
    // ]
    beforeAll: async function () {
        global.log = ( inputName, input, outputName, output ) => {
            let suite = logJSON.find( one => one.name == suiteTitle )
            if ( !suite ) {
                logJSON.push( suite = {
                    name: suiteTitle,
                    contents: [ ]
                } )
            }
            let lastTest = suite.contents[suite.contents.length - 1]
            if ( !lastTest || lastTest.name !== testTitle ) {
                suite.contents.push( lastTest = {
                    name: testTitle,
                    input: inputName,
                    output: outputName,
                    inputs: [ ],
                    outputs: [ ]
                } )
            }
            lastTest.inputs.push( input )
            lastTest.outputs.push( output )
        }
    },
    // before each test, store the name of the suite and test
    beforeEach: async function () {
        suiteTitle = this.currentTest.parent.title
        testTitle = this.currentTest.title
    },
    // after all tests, save the JSON to a log file in the tests folder
    afterAll: async function () {
        fs.writeFileSync( outfile, JSON.stringify( logJSON, null, 2 ) )
    }
}
