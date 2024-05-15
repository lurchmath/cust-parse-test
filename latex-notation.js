
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
			"name": "Infinity",
			"notation": "\\infty",
		},
		{
			"name": "Pi",
			"notation": "\\pi",
		},
		{
			"name": "EulersNumber",
			"notation": "e",
		},

		// Foundational arithmetic operations and related operators like %, !
		{
			"name": "Exponentiation",
			"notation": "A^B",
		},
		{
			"name": "Percentage",
			"notation": "A\\%",
		},
		{
			"name": "Factorial",
			"notation": "A!",
		},
		{
			"name": "Division",
			"notation": "A\\div B",
		},
		{
			"name": "Division",
			"notation": "\\frac A B",
		},
		{
			"name": "Multiplication",
			"notation": "A\\times B",
		},
		{
			"name": "Multiplication",
			"notation": "A\\cdot B",
		},
		{
			"name": "Multiplication",
			"notation": "A\\ast B",
		},
		{
			"name": "NumberNegation",
			"notation": "-A",
		},
		{
			"name": "Addition",
			"notation": "A+B",
		},
		{
			"name": "Subtraction",
			"notation": "A-B",
		},

		// Logical constants
		{
			"name": "LogicalTrue",
			"notation": "\\top",
		},
		{
			"name": "LogicalFalse",
			"notation": "\\bot",
		},
		{
			"name": "Contradiction",
			"notation": "\\rightarrow \\leftarrow",
		},

		// Propositional logical operators
		{
			"name": "LogicalNegation",
			"notation": "\\neg A",
		},
		{
			"name": "LogicalNegation",
			"notation": "\\lnot A",
		},
		{
			"name": "Conjunction",
			"notation": "A\\wedge B",
		},
		{
			"name": "Conjunction",
			"notation": "A\\land B",
		},
		{
			"name": "Disjunction",
			"notation": "A\\vee B",
		},
		{
			"name": "Disjunction",
			"notation": "A\\lor B",
		},
		{
			"name": "Implication",
			"notation": "A\\Rightarrow B",
		},
		{
			"name": "Implication",
			"notation": "A\\Rarr B",
		},
		{
			"name": "Implication",
			"notation": "A\\rArr B",
		},
		{
			"name": "Implication",
			"notation": "B\\Leftarrow A",
		},
		{
			"name": "Implication",
			"notation": "B\\Larr A",
		},
		{
			"name": "Implication",
			"notation": "B\\lArr A",
		},
		{
			"name": "LogicalEquivalence",
			"notation": "A\\Leftrightarrow B",
		},
		{
			"name": "LogicalEquivalence",
			"notation": "A\\Lrarr B",
		},
		{
			"name": "LogicalEquivalence",
			"notation": "A\\lrArr B",
		},

		// Predicate logical operators
		{
			"name": "UniversalQuantifier",
			"notation": "\\forall A, B",
		},
		{
			"name": "ExistentialQuantifier",
			"notation": "\\exists A, B",
		},
		{
			"name": "UniqueExistentialQuantifier",
			"notation": "\\exists ! A, B",
		},

		// Atomic set expressions
		{
			"name": "EmptySet",
			"notation": "\\emptyset",
		},
		{
			"name": "EmptySet",
			"notation": "\\{ \\}",
		},
		{
			"name": "EmptySet",
			"notation": "\\left\\{ \\right\\}",
		},
		{
			"name": "FiniteSet",
			"notation": "\\{A\\}",
		},
		{
			"name": "FiniteSet",
			"notation": "\\left\\{A\\right\\}",
		},
		{
			"name": "OneElementSequence",
			"notation": "A",
		},
		{
			"name": "ElementThenSequence",
			"notation": "A,B",
		},
		{
			"name": "OneNumberSequence",
			"notation": "A",
		},
		{
			"name": "NumberThenSequence",
			"notation": "A,B",
		},

		// Set operators
		{
			"name": "SetUnion",
			"notation": "A\\cup B",
		},
		{
			"name": "SetIntersection",
			"notation": "A\\cap B",
		},
		{
			"name": "SetDifference",
			"notation": "A\\setdiff B",
		},
		{
			"name": "SetDifference",
			"notation": "A-B",
		},
		{
			"name": "SetComplement",
			"notation": "\\bar A",
		},
		{
			"name": "SetComplement",
			"notation": "A'",
		},
		{
			"name": "SetComplement",
			"notation": "A ^ { \\complement }",
		},
		{
			"name": "SetCartesianProduct",
			"notation": "A\\times B",
		},

		// Set relations
		{
			"name": "Subset",
			"notation": "A\\subset B",
		},
		{
			"name": "SubsetOrEqual",
			"notation": "A\\subseteq B",
		},
		{
			"name": "NounIsElement",
			"notation": "A\\in B",
		},
		{
			"name": "PropositionIsElement",
			"notation": "A\\in B",
		},
		{
			"name": "NounIsNotElement",
			"notation": "A\\notin B",
		},
		{
			"name": "PropositionIsNotElement",
			"notation": "A\\notin B",
		},

		// Tuples and vectors
		{
			"name": "Tuple",
			"notation": "(A)",
		},
		{
			"name": "Vector",
			"notation": "\\langle A\\rangle",
		},

		// Function signatures (f:A->B)
		{
			"name": "FunctionSignature",
			"notation": "A:B\\to C",
		},
		{
			"name": "FunctionSignature",
			"notation": "A:B\\rightarrow C",
		},
		{
			"name": "FunctionSignature",
			"notation": "A:B\\rarr C",
		},
		{
			"name": "FunctionSignature",
			"notation": "A\\colon B\\to C",
		},
		{
			"name": "FunctionSignature",
			"notation": "A\\colon B\\rightarrow C",
		},
		{
			"name": "FunctionSignature",
			"notation": "A\\colon B\\rarr C",
		},

		// Function application (various kinds)
		{
			"name": "PrefixFunctionApplication",
			"notation": "A B",
		},
		{
			"name": "NumberFunctionApplication",
			"notation": "A(B)",
		},
		{
			"name": "PropositionFunctionApplication",
			"notation": "A(B)",
		},
		{
			"name": "SetFunctionApplication",
			"notation": "A(B)",
		},

		// Function composition and inverting
		{
			"name": "FunctionComposition",
			"notation": "A\\circ B",
		},
		{
			"name": "FunctionInverse",
			"notation": "A ^ { - 1 }",
		},
		{
			"name": "PrefixFunctionInverse",
			"notation": "A ^ { - 1 }",
		},

		// Trig functions
		{
			"name": "SineFunction",
			"notation": "\\sin",
		},
		{
			"name": "CosineFunction",
			"notation": "\\cos",
		},
		{
			"name": "TangentFunction",
			"notation": "\\tan",
		},
		{
			"name": "CotangentFunction",
			"notation": "\\cot",
		},
		{
			"name": "SecantFunction",
			"notation": "\\sec",
		},
		{
			"name": "CosecantFunction",
			"notation": "\\csc",
		},

		// Logarithms
		{
			"name": "Logarithm",
			"notation": "\\log",
		},
		{
			"name": "NaturalLogarithm",
			"notation": "\\ln",
		},
		{
			"name": "LogarithmWithBase",
			"notation": "\\log_A",
		},

		// Equalities and inequalities
		{
			"name": "Equals",
			"notation": "A=B",
		},
		{
			"name": "NotEqual",
			"notation": "A\\ne B",
		},
		{
			"name": "NotEqual",
			"notation": "A\\neq B",
		},
		{
			"name": "EqualFunctions",
			"notation": "A=B",
		},
		{
			"name": "NotEqualFunctions",
			"notation": "A\\ne B",
		},
		{
			"name": "NotEqualFunctions",
			"notation": "A\\neq B",
		},
		{
			"name": "LessThan",
			"notation": "A<B",
		},
		{
			"name": "LessThan",
			"notation": "A\\lt B",
		},
		{
			"name": "LessThanOrEqual",
			"notation": "A\\le B",
		},
		{
			"name": "LessThanOrEqual",
			"notation": "A\\leq B",
		},
		{
			"name": "GreaterThan",
			"notation": "A>B",
		},
		{
			"name": "GreaterThan",
			"notation": "A\\gt B",
		},
		{
			"name": "GreaterThanOrEqual",
			"notation": "A\\ge B",
		},
		{
			"name": "GreaterThanOrEqual",
			"notation": "A\\geq B",
		},

		// Other types of relations
		{
			"name": "BinaryRelationHolds",
			"notation": "B A C",
		},
		{
			"name": "Divides",
			"notation": "|",
		},
		{
			"name": "Divides",
			"notation": "\\vert",
		},
		{
			"name": "ApproximatelyEqual",
			"notation": "\\approx",
		},
		{
			"name": "GenericBinaryRelation",
			"notation": "\\sim",
		},
		{
			"name": "EquivalentModulo",
			"notation": "A \\equiv B \\mod C",
		},
		{
			"name": "EquivalentModulo",
			"notation": "A \\equiv _ C B",
		},

		// Equivalence classes using the above relations
		{
			"name": "EquivalenceClass",
			"notation": "[A,B]",
		},
		{
			"name": "EquivalenceClass",
			"notation": "\\lbrack A,B\\rbrack",
		},
		{
			"name": "EquivalenceClass",
			"notation": "\\left[A,B\\right]",
		},
		{
			"name": "EquivalenceClass",
			"notation": "\\left\\lbrack A,B\\right\\rbrack",
		},
		{
			"name": "GenericEquivalenceClass",
			"notation": "[A]",
		},
		{
			"name": "GenericEquivalenceClass",
			"notation": "\\lbrack A\\rbrack",
		},
		{
			"name": "GenericEquivalenceClass",
			"notation": "\\left[A\\right]",
		},
		{
			"name": "GenericEquivalenceClass",
			"notation": "\\left\\lbrack A\\right\\rbrack",
		},
		{
			"name": "EquivalenceClassModulo",
			"notation": "[A, \\equiv _ B]",
		},
		{
			"name": "EquivalenceClassModulo",
			"notation": "\\lbrack A, \\equiv _ B\\rbrack",
		},
		{
			"name": "EquivalenceClassModulo",
			"notation": "\\left[A, \\equiv _ B\\right]",
		},
		{
			"name": "EquivalenceClassModulo",
			"notation": "\\left\\lbrack A, \\equiv _ B\\right\\rbrack",
		},

		// Type phrases and sentences (such as "S is a set")
		{
			"name": "SetType",
			"notation": "a set",
		},
		{
			"name": "NumberType",
			"notation": "a number",
		},
		{
			"name": "RelationType",
			"notation": "a relation",
		},
		{
			"name": "PartialOrderType",
			"notation": "a partial order",
		},
		{
			"name": "EquivalenceRelationType",
			"notation": "an equivalence relation",
		},
		{
			"name": "HasType",
			"notation": "A \\text{is B}",
		},
		{
			"name": "HasType",
			"notation": "A \\text{is } \\text{B}",
		},
		{
			"name": "HasType",
			"notation": "A \\text{is} ~ \\text{B}",
		},

		// Expression Function Applications, used only for rule-building
		{
			"name": "NumberEFA",
			"notation": "\\mathcal{A} (B)",
		},
		{
			"name": "PropositionEFA",
			"notation": "\\mathcal{A} (B)",
		},
		{
			"name": "SetEFA",
			"notation": "\\mathcal{A} (B)",
		},

		// Givens (assumptions)
		// (We use multiple variants here to permit alternative spellings/notations)
		{
			"name": "Given_Variant1",
			"notation": "\\text{Assume }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant1",
			"notation": "\\text{Assume}~X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant2",
			"notation": "\\text{assume }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant2",
			"notation": "\\text{assume}~X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant3",
			"notation": "\\text{Given }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant3",
			"notation": "\\text{Given}~X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant4",
			"notation": "\\text{given }X",
			"options": {"variables":["X"]},
		},
		{
			"name": "Given_Variant4",
			"notation": "\\text{given}~X",
			"options": {"variables":["X"]},
		},

		// Variable declarations (both let and for some, with and without body)
		// (We use multiple variants here to permit alternative spellings/notations)
		{
			"name": "Let_Variant1",
			"notation": "\\text{Let }A",
		},
		{
			"name": "Let_Variant2",
			"notation": "\\text{let }A",
		},
		{
			"name": "LetBeSuchThat_Variant1",
			"notation": "\\text{Let }A \\text{ be such that }B",
		},
		{
			"name": "LetBeSuchThat_Variant2",
			"notation": "\\text{let }A \\text{ be such that }B",
		},
		{
			"name": "ForSome_Variant1",
			"notation": "\\text{For some }A, B",
		},
		{
			"name": "ForSome_Variant2",
			"notation": "\\text{for some }A, B",
		},
		{
			"name": "ForSome_Variant3",
			"notation": "B \\text{ for some } A",
		},
		{
			"name": "ForSome_Variant4",
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
