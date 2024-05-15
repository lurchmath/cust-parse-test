
export const builtInConcepts = [

	// Atomic number expressions
	{
		"name": "NumberVariable",
		"parentType": "AtomicNumberExpression",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "Number",
		"parentType": "AtomicNumberExpression",
		"regularExpression": "nonnegativeNumber",
	},
	{
		"name": "Infinity",
		"putdown": "infinity",
		"parentType": "AtomicNumberExpression",
	},
	{
		"name": "Pi",
		"putdown": "pi",
		"parentType": "AtomicNumberExpression",
	},
	{
		"name": "EulersNumber",
		"putdown": "eulersnumber",
		"parentType": "AtomicNumberExpression",
	},

	// Foundational arithmetic operations
	{
		"name": "Exponentiation",
		"parentType": "FactorExpression",
		"putdown": "(^ AtomicNumberExpression AtomicNumberExpression)",
	},
	{
		"name": "Percentage",
		"parentType": "FactorExpression",
		"putdown": "(% AtomicNumberExpression)",
	},
	{
		"name": "Factorial",
		"parentType": "FactorExpression",
		"putdown": "(! AtomicNumberExpression)",
	},
	{
		"name": "Division",
		"parentType": "ProductExpression",
		"putdown": "(/ ProductExpression ProductExpression)",
	},
	{
		"name": "Multiplication",
		"parentType": "ProductExpression",
		"putdown": "(* ProductExpression ProductExpression)",
	},
	{
		"name": "NumberNegation",
		"parentType": "ProductExpression",
		"putdown": "(- ProductExpression)",
	},
	{
		"name": "Addition",
		"parentType": "SumExpression",
		"putdown": "(+ SumExpression SumExpression)",
	},
	{
		"name": "Subtraction",
		"parentType": "SumExpression",
		"putdown": "(- SumExpression SumExpression)",
	},
	
		// Atomic propositional expressions
	{
		"name": "LogicVariable",
		"parentType": "AtomicPropositionalExpression",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "LogicalTrue",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "true",
	},
	{
		"name": "LogicalFalse",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "false",
	},
	{
		"name": "Contradiction",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "contradiction",
	},
	
		// Propositional logic operators
	{
		"name": "LogicalNegation",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(not AtomicPropositionalExpression)",
	},
	{
		"name": "Conjunction",
		"parentType": "ConjunctionExpression",
		"putdown": "(and ConjunctionExpression ConjunctionExpression)",
	},
	{
		"name": "Disjunction",
		"parentType": "DisjunctionExpression",
		"putdown": "(or DisjunctionExpression DisjunctionExpression)",
	},
	{
		"name": "Implication",
		"parentType": "ConditionalExpression",
		"putdown": "(implies ConditionalExpression ConditionalExpression)",
	},
	{
		"name": "LogicalEquivalence",
		"parentType": "ConditionalExpression",
		"putdown": "(iff ConditionalExpression ConditionalExpression)",
	},

	// Predicate logic operations
	{
		"name": "UniversalQuantifier",
		"parentType": "SentenceExpression",
		"putdown": "(forall (NumberVariable , SentenceExpression))",
	},
	{
		"name": "ExistentialQuantifier",
		"parentType": "SentenceExpression",
		"putdown": "(exists (NumberVariable , SentenceExpression))",
	},
	{
		"name": "UniqueExistentialQuantifier",
		"parentType": "SentenceExpression",
		"putdown": "(exists! (NumberVariable , SentenceExpression))",
	},

	// Atomic set expressions
	{
		"name": "SetVariable",
		"parentType": "AtomicSetExpression",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "OneElementSequence",
		"parentType": "SequenceExpression",
		"putdown": "(elts NounExpression)",
	},
	{
		"name": "ElementThenSequence",
		"parentType": "SequenceExpression",
		"putdown": "(elts NounExpression SequenceExpression)",
	},
	{
		"name": "FiniteSet",
		"parentType": "AtomicSetExpression",
		"putdown": "(finiteset SequenceExpression)",
	},
	{
		"name": "EmptySet",
		"parentType": "AtomicSetExpression",
		"putdown": "emptyset",
	},

	// Set theoretic operators for building sets
	{
		"name": "SetIntersection",
		"parentType": "SetExpression",
		"putdown": "(intersection SetIntersectionExpression SetIntersectionExpression)",
	},
	{
		"name": "SetDifference",
		"parentType": "SetExpression",
		"putdown": "(setdiff SetIntersectionExpression SetIntersectionExpression)",
	},
	{
		"name": "SetUnion",
		"parentType": "SetExpression",
		"putdown": "(union SetUnionExpression SetUnionExpression)",
	},
	{
		"name": "SetComplement",
		"parentType": "SetIntersectionExpression",
		"putdown": "(complement AtomicSetExpression)",
	},
	{
		"name": "SetCartesianProduct",
		"parentType": "SetIntersectionExpression",
		"putdown": "(cartesianproduct AtomicSetExpression AtomicSetExpression)",
	},

	// Set theoretic relations for building sentences
	{
		"name": "Subset",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(subset SetExpression SetExpression)",
	},
	{
		"name": "SubsetOrEqual",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(subseteq SetExpression SetExpression)",
	},
	{
		"name": "NounIsElement",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(in NounExpression SetExpression)",
	},
	{
		"name": "PropositionIsElement",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(in AtomicPropositionalExpression SetExpression)",
	},
	{
		"name": "NounIsNotElement",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(not (in NounExpression SetExpression))",
		"options": {"primitive":false},
	},
	{
		"name": "PropositionIsNotElement",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(not (in ConditionalExpression SetExpression))",
		"options": {"primitive":false},
	},

	// Atomic expressions for tuples and vectors
	{
		"name": "Tuple",
		"parentType": "TupleExpression",
		"putdown": "(tuple ElementThenSequence)",
	},
	{
		"name": "OneNumberSequence",
		"parentType": "NumberSequenceExpression",
		"putdown": "(elts NumberExpression)",
	},
	{
		"name": "NumberThenSequence",
		"parentType": "NumberSequenceExpression",
		"putdown": "(elts NumberExpression NumberSequenceExpression)",
	},
	{
		"name": "Vector",
		"parentType": "TupleExpression",
		"putdown": "(vector NumberThenSequence)",
	},

	// Functions and their application
	{
		"name": "FunctionVariable",
		"parentType": "AtomicFunctionExpression",
		"regularExpression": "oneLetterVariable",
	},
	{
		"name": "FunctionSignature",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(function FunctionExpression SetExpression SetExpression)",
	},
	{
		"name": "PrefixFunctionApplication",
		"parentType": "FactorExpression",
		"putdown": "(apply PrefixFunctionExpression NumberExpression)",
	},
	{
		"name": "NumberFunctionApplication",
		"parentType": "FactorExpression",
		"putdown": "(apply FunctionExpression NounExpression)",
	},
	{
		"name": "PropositionFunctionApplication",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(apply FunctionExpression NounExpression)",
	},
	{
		"name": "SetFunctionApplication",
		"parentType": "AtomicSetExpression",
		"putdown": "(apply FunctionExpression NounExpression)",
	},
	{
		"name": "FunctionComposition",
		"parentType": "FunctionExpression",
		"putdown": "(compose FunctionExpression FunctionExpression)",
	},
	{
		"name": "FunctionInverse",
		"parentType": "FunctionExpression",
		"putdown": "(inverse FunctionExpression)",
	},
	{
		"name": "PrefixFunctionInverse",
		"parentType": "PrefixFunctionExpression",
		"putdown": "(inverse PrefixFunctionExpression)",
	},

	// Trigonometric functions, which are special because they don't use parens
	{
		"name": "SineFunction",
		"parentType": "PrefixFunctionExpression",
		"putdown": "sin",
	},
	{
		"name": "CosineFunction",
		"parentType": "PrefixFunctionExpression",
		"putdown": "cos",
	},
	{
		"name": "TangentFunction",
		"parentType": "PrefixFunctionExpression",
		"putdown": "tan",
	},
	{
		"name": "CotangentFunction",
		"parentType": "PrefixFunctionExpression",
		"putdown": "cot",
	},
	{
		"name": "SecantFunction",
		"parentType": "PrefixFunctionExpression",
		"putdown": "sec",
	},
	{
		"name": "CosecantFunction",
		"parentType": "PrefixFunctionExpression",
		"putdown": "csc",
	},

	// Logarithms, like the trig funcs above, are special in the same way
	{
		"name": "Logarithm",
		"parentType": "PrefixFunctionExpression",
		"putdown": "log",
	},
	{
		"name": "NaturalLogarithm",
		"parentType": "PrefixFunctionExpression",
		"putdown": "ln",
	},
	{
		"name": "LogarithmWithBase",
		"parentType": "PrefixFunctionExpression",
		"putdown": "(logbase NumberExpression)",
	},

	// Equalities and inequalities
	{
		"name": "Equals",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(= NounExpression NounExpression)",
	},
	{
		"name": "EqualFunctions",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(= FunctionExpression FunctionExpression)",
	},
	{
		"name": "NotEqual",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(not (= NounExpression NounExpression))",
		"options": {"primitive":false},
	},
	{
		"name": "NotEqualFunctions",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(not (= FunctionExpression FunctionExpression))",
		"options": {"primitive":false},
	},
	{
		"name": "LessThan",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(< NounExpression NounExpression)",
	},
	{
		"name": "LessThanOrEqual",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(<= NounExpression NounExpression)",
	},
	{
		"name": "GreaterThan",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(> NounExpression NounExpression)",
	},
	{
		"name": "GreaterThanOrEqual",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(>= NounExpression NounExpression)",
	},

	// Other simple relations and applications of them
	{
		"name": "Divides",
		"parentType": "BinaryRelationExpression",
		"putdown": "|",
	},
	{
		"name": "GenericBinaryRelation",
		"parentType": "BinaryRelationExpression",
		"putdown": "~",
	},
	{
		"name": "ApproximatelyEqual",
		"parentType": "BinaryRelationExpression",
		"putdown": "~~",
	},
	{
		"name": "BinaryRelationHolds",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(relationholds BinaryRelationExpression NounExpression NounExpression)",
	},
	{
		"name": "EquivalentModulo",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(=mod NumberExpression NumberExpression NumberExpression)",
	},

	// Equivalence classes using the relations above
	{
		"name": "EquivalenceClass",
		"parentType": "AtomicSetExpression",
		"putdown": "(equivclass NounExpression BinaryRelationExpression)",
	},
	{
		"name": "GenericEquivalenceClass",
		"parentType": "AtomicSetExpression",
		"putdown": "(equivclass NounExpression ~)",
	},
	{
		"name": "EquivalenceClassModulo",
		"parentType": "AtomicSetExpression",
		"putdown": "(modclass NumberExpression NumberExpression)",
	},

	// Phrases and sentences for types, such as "S is a set"
	{
		"name": "SetType",
		"parentType": "TypePhraseExpression",
		"putdown": "settype",
	},
	{
		"name": "NumberType",
		"parentType": "TypePhraseExpression",
		"putdown": "numbertype",
	},
	{
		"name": "RelationType",
		"parentType": "TypePhraseExpression",
		"putdown": "relationtype",
	},
	{
		"name": "PartialOrderType",
		"parentType": "TypePhraseExpression",
		"putdown": "partialordertype",
	},
	{
		"name": "EquivalenceRelationType",
		"parentType": "TypePhraseExpression",
		"putdown": "equivalencerelationtype",
	},
	{
		"name": "HasType",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(hastype NounExpression TypePhraseExpression)",
	},

	// Expression Function Applications, used only for rule-building
	{
		"name": "NumberEFA",
		"parentType": "FactorExpression",
		"putdown": "(efa FunctionExpression NounExpression)",
	},
	{
		"name": "PropositionEFA",
		"parentType": "AtomicPropositionalExpression",
		"putdown": "(efa FunctionExpression NounExpression)",
	},
	{
		"name": "SetEFA",
		"parentType": "AtomicSetExpression",
		"putdown": "(efa FunctionExpression NounExpression)",
	},

	// Givens (assumptions)
	// (We use multiple variants here to permit alternative spellings/notations)
	{
		"name": "Given_Variant1",
		"parentType": "Expression",
		"putdown": ":SentenceExpression",
	},
	{
		"name": "Given_Variant2",
		"parentType": "Expression",
		"putdown": ":SentenceExpression",
		"options": {"primitive":false},
	},
	{
		"name": "Given_Variant3",
		"parentType": "Expression",
		"putdown": ":SentenceExpression",
		"options": {"primitive":false},
	},
	{
		"name": "Given_Variant4",
		"parentType": "Expression",
		"putdown": ":SentenceExpression",
		"options": {"primitive":false},
	},

	// Variable declarations (both let and for some, with and without body)
	// (We use multiple variants here to permit alternative spellings/notations)
	{
		"name": "Let_Variant1",
		"parentType": "Expression",
		"putdown": ":[NumberVariable]",
	},
	{
		"name": "Let_Variant2",
		"parentType": "Expression",
		"putdown": ":[NumberVariable]",
		"options": {"primitive":false},
	},
	{
		"name": "LetBeSuchThat_Variant1",
		"parentType": "Expression",
		"putdown": ":[NumberVariable , SentenceExpression]",
	},
	{
		"name": "LetBeSuchThat_Variant2",
		"parentType": "Expression",
		"putdown": ":[NumberVariable , SentenceExpression]",
		"options": {"primitive":false},
	},
	{
		"name": "ForSome_Variant1",
		"parentType": "Expression",
		"putdown": "[NumberVariable , SentenceExpression]",
	},
	{
		"name": "ForSome_Variant2",
		"parentType": "Expression",
		"putdown": "[NumberVariable , SentenceExpression]",
		"options": {"primitive":false},
	},
	{
		"name": "ForSome_Variant3",
		"parentType": "Expression",
		"putdown": "[NumberVariable , SentenceExpression]",
		"options": {"primitive":false},
	},
	{
		"name": "ForSome_Variant4",
		"parentType": "Expression",
		"putdown": "[NumberVariable , SentenceExpression]",
		"options": {"primitive":false},
	},
]
