
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
			"concept": "Infinity",
			"notation": "\\infty",
		},
		{
			"concept": "Pi",
			"notation": "\\pi",
		},
		{
			"concept": "EulersNumber",
			"notation": "e",
		},

		// Foundational arithmetic operations and related operators like %, !
		{
			"concept": "Exponentiation",
			"notation": "A^B",
		},
		{
			"concept": "Percentage",
			"notation": "A\\%",
		},
		{
			"concept": "Factorial",
			"notation": "A!",
		},
		{
			"concept": "Division",
			"notation": "A\\div B",
		},
		{
			"concept": "Division",
			"notation": "\\frac A B",
		},
		{
			"concept": "Multiplication",
			"notation": "A\\times B",
		},
		{
			"concept": "Multiplication",
			"notation": "A\\cdot B",
		},
		{
			"concept": "Multiplication",
			"notation": "A\\ast B",
		},
		{
			"concept": "NumberNegation",
			"notation": "-A",
		},
		{
			"concept": "Addition",
			"notation": "A+B",
		},
		{
			"concept": "Subtraction",
			"notation": "A-B",
		},

		// Logical constants
		{
			"concept": "LogicalTrue",
			"notation": "\\top",
		},
		{
			"concept": "LogicalFalse",
			"notation": "\\bot",
		},
		{
			"concept": "Contradiction",
			"notation": "\\rightarrow \\leftarrow",
		},

		// Propositional logical operators
		{
			"concept": "LogicalNegation",
			"notation": "\\neg A",
		},
		{
			"concept": "LogicalNegation",
			"notation": "\\lnot A",
		},
		{
			"concept": "Conjunction",
			"notation": "A\\wedge B",
		},
		{
			"concept": "Conjunction",
			"notation": "A\\land B",
		},
		{
			"concept": "Disjunction",
			"notation": "A\\vee B",
		},
		{
			"concept": "Disjunction",
			"notation": "A\\lor B",
		},
		{
			"concept": "Implication",
			"notation": "A\\Rightarrow B",
		},
		{
			"concept": "Implication",
			"notation": "A\\Rarr B",
		},
		{
			"concept": "Implication",
			"notation": "A\\rArr B",
		},
		{
			"concept": "Implication",
			"notation": "B\\Leftarrow A",
		},
		{
			"concept": "Implication",
			"notation": "B\\Larr A",
		},
		{
			"concept": "Implication",
			"notation": "B\\lArr A",
		},
		{
			"concept": "LogicalEquivalence",
			"notation": "A\\Leftrightarrow B",
		},
		{
			"concept": "LogicalEquivalence",
			"notation": "A\\Lrarr B",
		},
		{
			"concept": "LogicalEquivalence",
			"notation": "A\\lrArr B",
		},

		// Predicate logical operators
		{
			"concept": "UniversalQuantifier",
			"notation": "\\forall A, B",
		},
		{
			"concept": "ExistentialQuantifier",
			"notation": "\\exists A, B",
		},
		{
			"concept": "UniqueExistentialQuantifier",
			"notation": "\\exists ! A, B",
		},

		// Atomic set expressions
		{
			"concept": "EmptySet",
			"notation": "\\emptyset",
		},
		{
			"concept": "EmptySet",
			"notation": "\\{ \\}",
		},
		{
			"concept": "EmptySet",
			"notation": "\\left\\{ \\right\\}",
		},
		{
			"concept": "FiniteSet",
			"notation": "\\{A\\}",
		},
		{
			"concept": "FiniteSet",
			"notation": "\\left\\{A\\right\\}",
		},
		{
			"concept": "OneElementSequence",
			"notation": "A",
		},
		{
			"concept": "ElementThenSequence",
			"notation": "A,B",
		},
		{
			"concept": "OneNumberSequence",
			"notation": "A",
		},
		{
			"concept": "NumberThenSequence",
			"notation": "A,B",
		},

		// Set operators
		{
			"concept": "SetUnion",
			"notation": "A\\cup B",
		},
		{
			"concept": "SetIntersection",
			"notation": "A\\cap B",
		},
		{
			"concept": "SetDifference",
			"notation": "A\\setdiff B",
		},
		{
			"concept": "SetDifference",
			"notation": "A-B",
		},
		{
			"concept": "SetComplement",
			"notation": "\\bar A",
		},
		{
			"concept": "SetComplement",
			"notation": "A'",
		},
		{
			"concept": "SetComplement",
			"notation": "A ^ { \\complement }",
		},
		{
			"concept": "SetCartesianProduct",
			"notation": "A\\times B",
		},

		// Set relations
		{
			"concept": "Subset",
			"notation": "A\\subset B",
		},
		{
			"concept": "SubsetOrEqual",
			"notation": "A\\subseteq B",
		},
		{
			"concept": "NounIsElement",
			"notation": "A\\in B",
		},
		{
			"concept": "PropositionIsElement",
			"notation": "A\\in B",
		},
		{
			"concept": "NounIsNotElement",
			"notation": "A\\notin B",
		},
		{
			"concept": "PropositionIsNotElement",
			"notation": "A\\notin B",
		},

		// Tuples and vectors
		{
			"concept": "Tuple",
			"notation": "(A)",
		},
		{
			"concept": "Vector",
			"notation": "\\langle A\\rangle",
		},

		// Function signatures (f:A->B)
		{
			"concept": "FunctionSignature",
			"notation": "A:B\\to C",
		},
		{
			"concept": "FunctionSignature",
			"notation": "A:B\\rightarrow C",
		},
		{
			"concept": "FunctionSignature",
			"notation": "A:B\\rarr C",
		},
		{
			"concept": "FunctionSignature",
			"notation": "A\\colon B\\to C",
		},
		{
			"concept": "FunctionSignature",
			"notation": "A\\colon B\\rightarrow C",
		},
		{
			"concept": "FunctionSignature",
			"notation": "A\\colon B\\rarr C",
		},

		// Function application (various kinds)
		{
			"concept": "PrefixFunctionApplication",
			"notation": "A B",
		},
		{
			"concept": "NumberFunctionApplication",
			"notation": "A(B)",
		},
		{
			"concept": "PropositionFunctionApplication",
			"notation": "A(B)",
		},
		{
			"concept": "SetFunctionApplication",
			"notation": "A(B)",
		},

		// Function composition and inverting
		{
			"concept": "FunctionComposition",
			"notation": "A\\circ B",
		},
		{
			"concept": "FunctionInverse",
			"notation": "A ^ { - 1 }",
		},
		{
			"concept": "PrefixFunctionInverse",
			"notation": "A ^ { - 1 }",
		},

		// Trig functions
		{
			"concept": "SineFunction",
			"notation": "\\sin",
		},
		{
			"concept": "CosineFunction",
			"notation": "\\cos",
		},
		{
			"concept": "TangentFunction",
			"notation": "\\tan",
		},
		{
			"concept": "CotangentFunction",
			"notation": "\\cot",
		},
		{
			"concept": "SecantFunction",
			"notation": "\\sec",
		},
		{
			"concept": "CosecantFunction",
			"notation": "\\csc",
		},

		// Logarithms
		{
			"concept": "Logarithm",
			"notation": "\\log",
		},
		{
			"concept": "NaturalLogarithm",
			"notation": "\\ln",
		},
		{
			"concept": "LogarithmWithBase",
			"notation": "\\log_A",
		},

		// Equalities and inequalities
		{
			"concept": "Equals",
			"notation": "A=B",
		},
		{
			"concept": "NotEqual",
			"notation": "A\\ne B",
		},
		{
			"concept": "NotEqual",
			"notation": "A\\neq B",
		},
		{
			"concept": "EqualFunctions",
			"notation": "A=B",
		},
		{
			"concept": "NotEqualFunctions",
			"notation": "A\\ne B",
		},
		{
			"concept": "NotEqualFunctions",
			"notation": "A\\neq B",
		},
		{
			"concept": "LessThan",
			"notation": "A<B",
		},
		{
			"concept": "LessThan",
			"notation": "A\\lt B",
		},
		{
			"concept": "LessThanOrEqual",
			"notation": "A\\le B",
		},
		{
			"concept": "LessThanOrEqual",
			"notation": "A\\leq B",
		},
		{
			"concept": "GreaterThan",
			"notation": "A>B",
		},
		{
			"concept": "GreaterThan",
			"notation": "A\\gt B",
		},
		{
			"concept": "GreaterThanOrEqual",
			"notation": "A\\ge B",
		},
		{
			"concept": "GreaterThanOrEqual",
			"notation": "A\\geq B",
		},

		// Other types of relations
		{
			"concept": "BinaryRelationHolds",
			"notation": "B A C",
		},
		{
			"concept": "Divides",
			"notation": "|",
		},
		{
			"concept": "Divides",
			"notation": "\\vert",
		},
		{
			"concept": "ApproximatelyEqual",
			"notation": "\\approx",
		},
		{
			"concept": "GenericBinaryRelation",
			"notation": "\\sim",
		},
		{
			"concept": "EquivalentModulo",
			"notation": "A \\equiv B \\mod C",
		},
		{
			"concept": "EquivalentModulo",
			"notation": "A \\equiv _ C B",
		},

		// Equivalence classes using the above relations
		{
			"concept": "EquivalenceClass",
			"notation": "[A,B]",
		},
		{
			"concept": "EquivalenceClass",
			"notation": "\\lbrack A,B\\rbrack",
		},
		{
			"concept": "EquivalenceClass",
			"notation": "\\left[A,B\\right]",
		},
		{
			"concept": "EquivalenceClass",
			"notation": "\\left\\lbrack A,B\\right\\rbrack",
		},
		{
			"concept": "GenericEquivalenceClass",
			"notation": "[A]",
		},
		{
			"concept": "GenericEquivalenceClass",
			"notation": "\\lbrack A\\rbrack",
		},
		{
			"concept": "GenericEquivalenceClass",
			"notation": "\\left[A\\right]",
		},
		{
			"concept": "GenericEquivalenceClass",
			"notation": "\\left\\lbrack A\\right\\rbrack",
		},
		{
			"concept": "EquivalenceClassModulo",
			"notation": "[A, \\equiv _ B]",
		},
		{
			"concept": "EquivalenceClassModulo",
			"notation": "\\lbrack A, \\equiv _ B\\rbrack",
		},
		{
			"concept": "EquivalenceClassModulo",
			"notation": "\\left[A, \\equiv _ B\\right]",
		},
		{
			"concept": "EquivalenceClassModulo",
			"notation": "\\left\\lbrack A, \\equiv _ B\\right\\rbrack",
		},

		// Type phrases and sentences (such as "S is a set")
		{
			"concept": "SetType",
			"notation": "a set",
		},
		{
			"concept": "NumberType",
			"notation": "a number",
		},
		{
			"concept": "RelationType",
			"notation": "a relation",
		},
		{
			"concept": "PartialOrderType",
			"notation": "a partial order",
		},
		{
			"concept": "EquivalenceRelationType",
			"notation": "an equivalence relation",
		},
		{
			"concept": "HasType",
			"notation": "A \\text{is B}",
		},
		{
			"concept": "HasType",
			"notation": "A \\text{is } \\text{B}",
		},
		{
			"concept": "HasType",
			"notation": "A \\text{is} ~ \\text{B}",
		},

		// Expression Function Applications, used only for rule-building
		{
			"concept": "NumberEFA",
			"notation": "\\mathcal{A} (B)",
		},
		{
			"concept": "PropositionEFA",
			"notation": "\\mathcal{A} (B)",
		},
		{
			"concept": "SetEFA",
			"notation": "\\mathcal{A} (B)",
		},

		// Givens (assumptions)
		// (We use multiple variants here to permit alternative spellings/notations)
		{
			"concept": "Given_Variant1",
			"notation": "\\text{Assume }X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant1",
			"notation": "\\text{Assume}~X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant2",
			"notation": "\\text{assume }X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant2",
			"notation": "\\text{assume}~X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant3",
			"notation": "\\text{Given }X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant3",
			"notation": "\\text{Given}~X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant4",
			"notation": "\\text{given }X",
			"options": {"variables":["X"]},
		},
		{
			"concept": "Given_Variant4",
			"notation": "\\text{given}~X",
			"options": {"variables":["X"]},
		},

		// Variable declarations (both let and for some, with and without body)
		// (We use multiple variants here to permit alternative spellings/notations)
		{
			"concept": "Let_Variant1",
			"notation": "\\text{Let }A",
		},
		{
			"concept": "Let_Variant2",
			"notation": "\\text{let }A",
		},
		{
			"concept": "LetBeSuchThat_Variant1",
			"notation": "\\text{Let }A \\text{ be such that }B",
		},
		{
			"concept": "LetBeSuchThat_Variant2",
			"notation": "\\text{let }A \\text{ be such that }B",
		},
		{
			"concept": "ForSome_Variant1",
			"notation": "\\text{For some }A, B",
		},
		{
			"concept": "ForSome_Variant2",
			"notation": "\\text{for some }A, B",
		},
		{
			"concept": "ForSome_Variant3",
			"notation": "B \\text{ for some } A",
		},
		{
			"concept": "ForSome_Variant4",
			"notation": "B~\\text{for some}~A",
		},
	]
}

latexNotation.addTo = converter => {
	const language = new Language( 'latex', converter, latexNotation.groupers )
	latexNotation.notations.forEach( entry => language.addNotation(
		entry.concept, entry.notation, entry.options ) )
	return language
}
