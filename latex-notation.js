
import { Language } from './language.js'

export const latexNotation = {

	// All LaTeX groupers, in pairs
	"groupers": [
		"{", "}",
		"(", ")",
		"\\left(", "\\right)",
	],

	// All LaTeX notations for concepts in the built-in-concepts.js file
	"notations": [

		// Atomic number expressions
		{
			"name": "infinity",
			"notation": "\\infty",
		},
		{
			"name": "pi",
			"notation": "\\pi",
		},
		{
			"name": "eulersnumber",
			"notation": "e",
		},

		// Foundational arithmetic operations and related operators like %, !
		{
			"name": "exponentiation",
			"notation": "A^B",
		},
		{
			"name": "percentage",
			"notation": "A\\%",
		},
		{
			"name": "factorial",
			"notation": "A!",
		},
		{
			"name": "division",
			"notation": "A\\div B",
		},
		{
			"name": "division",
			"notation": "\\frac A B",
		},
		{
			"name": "multiplication",
			"notation": "A\\times B",
		},
		{
			"name": "multiplication",
			"notation": "A\\cdot B",
		},
		{
			"name": "multiplication",
			"notation": "A\\ast B",
		},
		{
			"name": "numbernegation",
			"notation": "-A",
		},
		{
			"name": "addition",
			"notation": "A+B",
		},
		{
			"name": "subtraction",
			"notation": "A-B",
		},

		// Logical constants
		{
			"name": "logicaltrue",
			"notation": "\\top",
		},
		{
			"name": "logicalfalse",
			"notation": "\\bot",
		},
		{
			"name": "contradiction",
			"notation": "\\rightarrow \\leftarrow",
		},

		// Propositional logical operators
		{
			"name": "logicnegation",
			"notation": "\\neg A",
		},
		{
			"name": "logicnegation",
			"notation": "\\lnot A",
		},
		{
			"name": "conjunction",
			"notation": "A\\wedge B",
		},
		{
			"name": "conjunction",
			"notation": "A\\land B",
		},
		{
			"name": "disjunction",
			"notation": "A\\vee B",
		},
		{
			"name": "disjunction",
			"notation": "A\\lor B",
		},
		{
			"name": "implication",
			"notation": "A\\Rightarrow B",
		},
		{
			"name": "implication",
			"notation": "A\\Rarr B",
		},
		{
			"name": "implication",
			"notation": "A\\rArr B",
		},
		{
			"name": "implication",
			"notation": "B\\Leftarrow A",
		},
		{
			"name": "implication",
			"notation": "B\\Larr A",
		},
		{
			"name": "implication",
			"notation": "B\\lArr A",
		},
		{
			"name": "iff",
			"notation": "A\\Leftrightarrow B",
		},
		{
			"name": "iff",
			"notation": "A\\Lrarr B",
		},
		{
			"name": "iff",
			"notation": "A\\lrArr B",
		},

		// Predicate logical operators
		{
			"name": "universal",
			"notation": "\\forall A, B",
		},
		{
			"name": "existential",
			"notation": "\\exists A, B",
		},
		{
			"name": "existsunique",
			"notation": "\\exists ! A, B",
		},

		// Atomic set expressions
		{
			"name": "emptyset",
			"notation": "\\emptyset",
		},
		{
			"name": "emptyset",
			"notation": "\\{ \\}",
		},
		{
			"name": "emptyset",
			"notation": "\\left\\{ \\right\\}",
		},
		{
			"name": "finiteset",
			"notation": "\\{A\\}",
		},
		{
			"name": "finiteset",
			"notation": "\\left\\{A\\right\\}",
		},
		{
			"name": "oneeltseq",
			"notation": "A",
		},
		{
			"name": "eltthenseq",
			"notation": "A,B",
		},
		{
			"name": "onenumseq",
			"notation": "A",
		},
		{
			"name": "numthenseq",
			"notation": "A,B",
		},

		// Set operators
		{
			"name": "union",
			"notation": "A\\cup B",
		},
		{
			"name": "intersection",
			"notation": "A\\cap B",
		},
		{
			"name": "setdifference",
			"notation": "A\\setminus B",
		},
		{
			"name": "setdifference",
			"notation": "A-B",
		},
		{
			"name": "complement",
			"notation": "\\bar A",
		},
		{
			"name": "complement",
			"notation": "A'",
		},
		{
			"name": "complement",
			"notation": "A ^ { \\complement }",
		},
		{
			"name": "setproduct",
			"notation": "A\\times B",
		},

		// Set relations
		{
			"name": "subset",
			"notation": "A\\subset B",
		},
		{
			"name": "subseteq",
			"notation": "A\\subseteq B",
		},
		{
			"name": "nounisin",
			"notation": "A\\in B",
		},
		{
			"name": "propisin",
			"notation": "A\\in B",
		},
		{
			"name": "nounisnotin",
			"notation": "A\\notin B",
		},
		{
			"name": "propisnotin",
			"notation": "A\\notin B",
		},

		// Tuples and vectors
		{
			"name": "tuple",
			"notation": "(A)",
		},
		{
			"name": "vector",
			"notation": "\\langle A\\rangle",
		},

		// Function signatures (f:A->B)
		{
			"name": "funcsignature",
			"notation": "A:B\\to C",
		},
		{
			"name": "funcsignature",
			"notation": "A:B\\rightarrow C",
		},
		{
			"name": "funcsignature",
			"notation": "A:B\\rarr C",
		},
		{
			"name": "funcsignature",
			"notation": "A\\colon B\\to C",
		},
		{
			"name": "funcsignature",
			"notation": "A\\colon B\\rightarrow C",
		},
		{
			"name": "funcsignature",
			"notation": "A\\colon B\\rarr C",
		},

		// Function application (various kinds)
		{
			"name": "prefixfuncapp",
			"notation": "A B",
		},
		{
			"name": "numfuncapp",
			"notation": "A(B)",
		},
		{
			"name": "propfuncapp",
			"notation": "A(B)",
		},
		{
			"name": "setfuncapp",
			"notation": "A(B)",
		},

		// Function composition and inverting
		{
			"name": "funccomp",
			"notation": "A\\circ B",
		},
		{
			"name": "funcinverse",
			"notation": "A ^ { - 1 }",
		},
		{
			"name": "prefixfuncinv",
			"notation": "A ^ { - 1 }",
		},

		// Trig functions
		{
			"name": "sinfunc",
			"notation": "\\sin",
		},
		{
			"name": "cosfunc",
			"notation": "\\cos",
		},
		{
			"name": "tanfunc",
			"notation": "\\tan",
		},
		{
			"name": "cotfunc",
			"notation": "\\cot",
		},
		{
			"name": "secfunc",
			"notation": "\\sec",
		},
		{
			"name": "cscfunc",
			"notation": "\\csc",
		},

		// Logarithms
		{
			"name": "logarithm",
			"notation": "\\log",
		},
		{
			"name": "naturallog",
			"notation": "\\ln",
		},
		{
			"name": "logwithbase",
			"notation": "\\log_A",
		},

		// Equalities and inequalities
		{
			"name": "equality",
			"notation": "A=B",
		},
		{
			"name": "inequality",
			"notation": "A\\ne B",
		},
		{
			"name": "inequality",
			"notation": "A\\neq B",
		},
		{
			"name": "funcequality",
			"notation": "A=B",
		},
		{
			"name": "funcinequality",
			"notation": "A\\ne B",
		},
		{
			"name": "funcinequality",
			"notation": "A\\neq B",
		},
		{
			"name": "lessthan",
			"notation": "A<B",
		},
		{
			"name": "lessthan",
			"notation": "A\\lt B",
		},
		{
			"name": "lessthanoreq",
			"notation": "A\\le B",
		},
		{
			"name": "lessthanoreq",
			"notation": "A\\leq B",
		},
		{
			"name": "greaterthan",
			"notation": "A>B",
		},
		{
			"name": "greaterthan",
			"notation": "A\\gt B",
		},
		{
			"name": "greaterthanoreq",
			"notation": "A\\ge B",
		},
		{
			"name": "greaterthanoreq",
			"notation": "A\\geq B",
		},

		// Other types of relations
		{
			"name": "binrelapp",
			"notation": "B A C",
		},
		{
			"name": "divisibility",
			"notation": "|",
		},
		{
			"name": "divisibility",
			"notation": "\\vert",
		},
		{
			"name": "approximately",
			"notation": "\\approx",
		},
		{
			"name": "genericrelation",
			"notation": "\\sim",
		},
		{
			"name": "equivmodulo",
			"notation": "A \\equiv B \\mod C",
		},
		{
			"name": "equivmodulo",
			"notation": "A \\equiv _ C B",
		},

		// Equivalence classes using the above relations
		{
			"name": "equivclass",
			"notation": "[A,B]",
		},
		{
			"name": "equivclass",
			"notation": "\\lbrack A,B\\rbrack",
		},
		{
			"name": "equivclass",
			"notation": "\\left[A,B\\right]",
		},
		{
			"name": "equivclass",
			"notation": "\\left\\lbrack A,B\\right\\rbrack",
		},
		{
			"name": "bareequivclass",
			"notation": "[A]",
		},
		{
			"name": "bareequivclass",
			"notation": "\\lbrack A\\rbrack",
		},
		{
			"name": "bareequivclass",
			"notation": "\\left[A\\right]",
		},
		{
			"name": "bareequivclass",
			"notation": "\\left\\lbrack A\\right\\rbrack",
		},
		{
			"name": "eqmodclass",
			"notation": "[A, \\equiv _ B]",
		},
		{
			"name": "eqmodclass",
			"notation": "\\lbrack A, \\equiv _ B\\rbrack",
		},
		{
			"name": "eqmodclass",
			"notation": "\\left[A, \\equiv _ B\\right]",
		},
		{
			"name": "eqmodclass",
			"notation": "\\left\\lbrack A, \\equiv _ B\\right\\rbrack",
		},

		// Type phrases and sentences (such as "S is a set")
		{
			"name": "settype",
			"notation": "a set",
		},
		{
			"name": "numbertype",
			"notation": "a number",
		},
		{
			"name": "reltype",
			"notation": "a relation",
		},
		{
			"name": "partialordtype",
			"notation": "a partial order",
		},
		{
			"name": "equivreltype",
			"notation": "an equivalence relation",
		},
		{
			"name": "hastype",
			"notation": "A \\text{is B}",
		},
		{
			"name": "hastype",
			"notation": "A \\text{is } \\text{B}",
		},
		{
			"name": "hastype",
			"notation": "A \\text{is} ~ \\text{B}",
		},

		// Expression Function Applications, used only for rule-building
		{
			"name": "numefa",
			"notation": "\\mathcal{A} (B)",
		},
		{
			"name": "propefa",
			"notation": "\\mathcal{A} (B)",
		},
		{
			"name": "setefa",
			"notation": "\\mathcal{A} (B)",
		},

		// Givens (assumptions)
		// (We use multiple variants here to permit alternative spellings/notations)
		{
			"name": "givenvariant1",
			"notation": "\\text{Assume }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant1",
			"notation": "\\text{Assume}~X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant2",
			"notation": "\\text{assume }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant2",
			"notation": "\\text{assume}~X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant3",
			"notation": "\\text{Given }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant3",
			"notation": "\\text{Given}~X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant4",
			"notation": "\\text{given }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "givenvariant4",
			"notation": "\\text{given}~X",
			"options": {"variables":["X"]},
		},

		// Variable declarations (both let and for some, with and without body)
		// (We use multiple variants here to permit alternative spellings/notations)
		{
			"name": "letvariant1",
			"notation": "\\text{Let }A",
		},
		{
			"name": "letvariant2",
			"notation": "\\text{let }A",
		},
		{
			"name": "letbevariant1",
			"notation": "\\text{Let }A \\text{ be such that }B",
		},
		{
			"name": "letbevariant2",
			"notation": "\\text{let }A \\text{ be such that }B",
		},
		{
			"name": "forsomevariant1",
			"notation": "\\text{For some }A, B",
		},
		{
			"name": "forsomevariant2",
			"notation": "\\text{for some }A, B",
		},
		{
			"name": "forsomevariant3",
			"notation": "B \\text{ for some } A",
		},
		{
			"name": "forsomevariant4",
			"notation": "B~\\text{for some}~A",
		},
	]
}

latexNotation.addTo = converter => {
	const language = new Language( 'latex', converter, latexNotation.groupers )
	latexNotation.notations.forEach( notation => language.addNotation(
		notation.name, notation.notation, notation.options ) )
	return language
}
