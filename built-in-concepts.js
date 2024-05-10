
import { Converter } from './converter.js'
import { Language } from './language.js'

export const builtInConcepts = [

	// Atomic number expressions
	{
		"name": "numbervariable",
		"parentType": "atomicnumberexpr",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "number",
		"parentType": "atomicnumberexpr",
		"regularExpression": "nonnegativeNumber",
	},
	{
		"name": "infinity",
		"parentType": "atomicnumberexpr",
	},
	{
		"name": "pi",
		"parentType": "atomicnumberexpr",
	},
	{
		"name": "eulersnumber",
		"parentType": "atomicnumberexpr",
	},

	// Foundational arithmetic operations
	{
		"name": "exponentiation",
		"parentType": "factorexpr",
		"putdown": "(^ atomicnumberexpr atomicnumberexpr)",
	},
	{
		"name": "percentage",
		"parentType": "factorexpr",
		"putdown": "(% atomicnumberexpr)",
	},
	{
		"name": "factorial",
		"parentType": "factorexpr",
		"putdown": "(! atomicnumberexpr)",
	},
	{
		"name": "division",
		"parentType": "prodexpr",
		"putdown": "(/ prodexpr prodexpr)",
	},
	{
		"name": "multiplication",
		"parentType": "prodexpr",
		"putdown": "(* prodexpr prodexpr)",
	},
	{
		"name": "numbernegation",
		"parentType": "prodexpr",
		"putdown": "(- prodexpr)",
	},
	{
		"name": "addition",
		"parentType": "sumexpr",
		"putdown": "(+ sumexpr sumexpr)",
	},
	{
		"name": "subtraction",
		"parentType": "sumexpr",
		"putdown": "(- sumexpr sumexpr)",
	},
	
		// Atomic propositional expressions
	{
		"name": "logicvariable",
		"parentType": "atomicpropexpr",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "logicaltrue",
		"parentType": "atomicpropexpr",
		"putdown": "true",
	},
	{
		"name": "logicalfalse",
		"parentType": "atomicpropexpr",
		"putdown": "false",
	},
	{
		"name": "contradiction",
		"parentType": "atomicpropexpr",
		"putdown": "contradiction",
	},
	
		// Propositional logic operators
	{
		"name": "logicnegation",
		"parentType": "atomicpropexpr",
		"putdown": "(not atomicpropexpr)",
	},
	{
		"name": "conjunction",
		"parentType": "conjunctexpr",
		"putdown": "(and conjunctexpr conjunctexpr)",
	},
	{
		"name": "disjunction",
		"parentType": "disjunctexpr",
		"putdown": "(or disjunctexpr disjunctexpr)",
	},
	{
		"name": "implication",
		"parentType": "condexpr",
		"putdown": "(implies condexpr condexpr)",
	},
	{
		"name": "iff",
		"parentType": "condexpr",
		"putdown": "(iff condexpr condexpr)",
	},

	// Predicate logic operations
	{
		"name": "universal",
		"parentType": "sentenceexpr",
		"putdown": "(forall (numbervariable , sentenceexpr))",
	},
	{
		"name": "existential",
		"parentType": "sentenceexpr",
		"putdown": "(exists (numbervariable , sentenceexpr))",
	},
	{
		"name": "existsunique",
		"parentType": "sentenceexpr",
		"putdown": "(existsunique (numbervariable , sentenceexpr))",
	},

	// Atomic set expressions
	{
		"name": "setvariable",
		"parentType": "atomicsetexpr",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "oneeltseq",
		"parentType": "sequenceexpr",
		"putdown": "(elts nounexpr)",
	},
	{
		"name": "eltthenseq",
		"parentType": "sequenceexpr",
		"putdown": "(elts nounexpr sequenceexpr)",
	},
	{
		"name": "finiteset",
		"parentType": "atomicsetexpr",
		"putdown": "(finiteset sequenceexpr)",
	},
	{
		"name": "emptyset",
		"parentType": "atomicsetexpr",
		"putdown": "emptyset",
	},

	// Set theoretic operators for building sets
	{
		"name": "intersection",
		"parentType": "setexpr",
		"putdown": "(setint intersectionexpr intersectionexpr)",
	},
	{
		"name": "setdifference",
		"parentType": "setexpr",
		"putdown": "(setminus intersectionexpr intersectionexpr)",
	},
	{
		"name": "union",
		"parentType": "setexpr",
		"putdown": "(setuni unionexpr unionexpr)",
	},
	{
		"name": "complement",
		"parentType": "intersectionexpr",
		"putdown": "(setcomp atomicsetexpr)",
	},
	{
		"name": "setproduct",
		"parentType": "intersectionexpr",
		"putdown": "(setprod atomicsetexpr atomicsetexpr)",
	},

	// Set theoretic relations for building sentences
	{
		"name": "subset",
		"parentType": "atomicpropexpr",
		"putdown": "(subset setexpr setexpr)",
	},
	{
		"name": "subseteq",
		"parentType": "atomicpropexpr",
		"putdown": "(subseteq setexpr setexpr)",
	},
	{
		"name": "nounisin",
		"parentType": "atomicpropexpr",
		"putdown": "(in nounexpr setexpr)",
	},
	{
		"name": "propisin",
		"parentType": "atomicpropexpr",
		"putdown": "(in atomicpropexpr setexpr)",
	},
	{
		"name": "nounisnotin",
		"parentType": "atomicpropexpr",
		"putdown": "(not (in nounexpr setexpr))",
		"options": {"primitive":false},
	},
	{
		"name": "propisnotin",
		"parentType": "atomicpropexpr",
		"putdown": "(not (in condexpr setexpr))",
		"options": {"primitive":false},
	},

	// Atomic expressions for tuples and vectors
	{
		"name": "tuple",
		"parentType": "tupleexpr",
		"putdown": "(tuple eltthenseq)",
	},
	{
		"name": "onenumseq",
		"parentType": "numsequenceexpr",
		"putdown": "(elts numberexpr)",
	},
	{
		"name": "numthenseq",
		"parentType": "numsequenceexpr",
		"putdown": "(elts numberexpr numsequenceexpr)",
	},
	{
		"name": "vector",
		"parentType": "tupleexpr",
		"putdown": "(vector numthenseq)",
	},

	// Functions and their application
	{
		"name": "funcvariable",
		"parentType": "atomicfuncexpr",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "funcsignature",
		"parentType": "atomicpropexpr",
		"putdown": "(function funcexpr setexpr setexpr)",
	},
	{
		"name": "prefixfuncapp",
		"parentType": "factorexpr",
		"putdown": "(apply prefixfuncexpr numberexpr)",
	},
	{
		"name": "numfuncapp",
		"parentType": "factorexpr",
		"putdown": "(apply funcexpr nounexpr)",
	},
	{
		"name": "propfuncapp",
		"parentType": "atomicpropexpr",
		"putdown": "(apply funcexpr nounexpr)",
	},
	{
		"name": "setfuncapp",
		"parentType": "atomicsetexpr",
		"putdown": "(apply funcexpr nounexpr)",
	},
	{
		"name": "funccomp",
		"parentType": "funcexpr",
		"putdown": "(compose funcexpr funcexpr)",
	},
	{
		"name": "funcinverse",
		"parentType": "funcexpr",
		"putdown": "(inverse funcexpr)",
	},
	{
		"name": "prefixfuncinv",
		"parentType": "prefixfuncexpr",
		"putdown": "(inverse prefixfuncexpr)",
	},

	// Trigonometric functions, which are special because they don't use parens
	{
		"name": "sinfunc",
		"parentType": "prefixfuncexpr",
		"putdown": "sin",
	},
	{
		"name": "cosfunc",
		"parentType": "prefixfuncexpr",
		"putdown": "cos",
	},
	{
		"name": "tanfunc",
		"parentType": "prefixfuncexpr",
		"putdown": "tan",
	},
	{
		"name": "cotfunc",
		"parentType": "prefixfuncexpr",
		"putdown": "cot",
	},
	{
		"name": "secfunc",
		"parentType": "prefixfuncexpr",
		"putdown": "sec",
	},
	{
		"name": "cscfunc",
		"parentType": "prefixfuncexpr",
		"putdown": "csc",
	},

	// Logarithms, like the trig funcs above, are special in the same way
	{
		"name": "logarithm",
		"parentType": "prefixfuncexpr",
		"putdown": "log",
	},
	{
		"name": "naturallog",
		"parentType": "prefixfuncexpr",
		"putdown": "ln",
	},
	{
		"name": "logwithbase",
		"parentType": "prefixfuncexpr",
		"putdown": "(logbase numberexpr)",
	},

	// Equalities and inequalities
	{
		"name": "equality",
		"parentType": "atomicpropexpr",
		"putdown": "(= nounexpr nounexpr)",
	},
	{
		"name": "funcequality",
		"parentType": "atomicpropexpr",
		"putdown": "(= funcexpr funcexpr)",
	},
	{
		"name": "inequality",
		"parentType": "atomicpropexpr",
		"putdown": "(not (= nounexpr nounexpr))",
		"options": {"primitive":false},
	},
	{
		"name": "funcinequality",
		"parentType": "atomicpropexpr",
		"putdown": "(not (= funcexpr funcexpr))",
		"options": {"primitive":false},
	},
	{
		"name": "lessthan",
		"parentType": "atomicpropexpr",
		"putdown": "(< nounexpr nounexpr)",
	},
	{
		"name": "lessthanoreq",
		"parentType": "atomicpropexpr",
		"putdown": "(<= nounexpr nounexpr)",
	},
	{
		"name": "greaterthan",
		"parentType": "atomicpropexpr",
		"putdown": "(> nounexpr nounexpr)",
	},
	{
		"name": "greaterthanoreq",
		"parentType": "atomicpropexpr",
		"putdown": "(>= nounexpr nounexpr)",
	},

	// Other simple relations and applications of them
	{
		"name": "divisibility",
		"parentType": "binaryrelation",
		"putdown": "|",
	},
	{
		"name": "genericrelation",
		"parentType": "binaryrelation",
		"putdown": "~",
	},
	{
		"name": "approximately",
		"parentType": "binaryrelation",
		"putdown": "~~",
	},
	{
		"name": "binrelapp",
		"parentType": "atomicpropexpr",
		"putdown": "(applyrel binaryrelation nounexpr nounexpr)",
	},
	{
		"name": "equivmodulo",
		"parentType": "atomicpropexpr",
		"putdown": "(=mod numberexpr numberexpr numberexpr)",
	},

	// Equivalence classes using the relations above
	{
		"name": "equivclass",
		"parentType": "atomicsetexpr",
		"putdown": "(eqclass nounexpr binaryrelation)",
	},
	{
		"name": "bareequivclass",
		"parentType": "atomicsetexpr",
		"putdown": "(eqclass nounexpr ~)",
	},
	{
		"name": "eqmodclass",
		"parentType": "atomicsetexpr",
		"putdown": "(modclass numberexpr numberexpr)",
	},

	// Phrases and sentences for types, such as "S is a set"
	{
		"name": "settype",
		"parentType": "typephrase",
		"putdown": "settype",
	},
	{
		"name": "numbertype",
		"parentType": "typephrase",
		"putdown": "numbertype",
	},
	{
		"name": "reltype",
		"parentType": "typephrase",
		"putdown": "relationtype",
	},
	{
		"name": "partialordtype",
		"parentType": "typephrase",
		"putdown": "partialordertype",
	},
	{
		"name": "equivreltype",
		"parentType": "typephrase",
		"putdown": "equivalencerelationtype",
	},
	{
		"name": "hastype",
		"parentType": "atomicpropexpr",
		"putdown": "(hastype nounexpr typephrase)",
	},

	// Expression Function Applications, used only for rule-building
	{
		"name": "numefa",
		"parentType": "factorexpr",
		"putdown": "(efa funcexpr nounexpr)",
	},
	{
		"name": "propefa",
		"parentType": "atomicpropexpr",
		"putdown": "(efa funcexpr nounexpr)",
	},
	{
		"name": "setefa",
		"parentType": "atomicsetexpr",
		"putdown": "(efa funcexpr nounexpr)",
	},

	// Givens (assumptions)
	// (We use multiple variants here to permit alternative spellings/notations)
	{
		"name": "givenvariant1",
		"parentType": "expr",
		"putdown": ":sentenceexpr",
	},
	{
		"name": "givenvariant2",
		"parentType": "expr",
		"putdown": ":sentenceexpr",
		"options": {"primitive":false},
	},
	{
		"name": "givenvariant3",
		"parentType": "expr",
		"putdown": ":sentenceexpr",
		"options": {"primitive":false},
	},
	{
		"name": "givenvariant4",
		"parentType": "expr",
		"putdown": ":sentenceexpr",
		"options": {"primitive":false},
	},

	// Variable declarations (both let and for some, with and without body)
	// (We use multiple variants here to permit alternative spellings/notations)
	{
		"name": "letvariant1",
		"parentType": "expr",
		"putdown": ":[numbervariable]",
	},
	{
		"name": "letvariant2",
		"parentType": "expr",
		"putdown": ":[numbervariable]",
		"options": {"primitive":false},
	},
	{
		"name": "letbevariant1",
		"parentType": "expr",
		"putdown": ":[numbervariable , sentenceexpr]",
	},
	{
		"name": "letbevariant2",
		"parentType": "expr",
		"putdown": ":[numbervariable , sentenceexpr]",
		"options": {"primitive":false},
	},
	{
		"name": "forsomevariant1",
		"parentType": "expr",
		"putdown": "[numbervariable , sentenceexpr]",
	},
	{
		"name": "forsomevariant2",
		"parentType": "expr",
		"putdown": "[numbervariable , sentenceexpr]",
		"options": {"primitive":false},
	},
	{
		"name": "forsomevariant3",
		"parentType": "expr",
		"putdown": "[numbervariable , sentenceexpr]",
		"options": {"primitive":false},
	},
	{
		"name": "forsomevariant4",
		"parentType": "expr",
		"putdown": "[numbervariable , sentenceexpr]",
		"options": {"primitive":false},
	},
]

builtInConcepts.getConverter = () => {
	const result = new Converter()
	builtInConcepts.forEach( concept =>
		result.addConcept(
			concept.name,
			concept.parentType,
			concept.putdown || Language.regularExpressions[concept.regularExpression],
			concept.options
		)
	)
	return result
}
