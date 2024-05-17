
The following page lists all tests run using the example converter in this
repository, which was built to verify that the language-building and conversion
tools in this repository work.  It can convert among LaTeX, putdown, and JSON
formats (as of this writing).  The specific conversions it performed (to
satisfy the requirements of the test suite) are shown below.

## Table of contents

- [Parsing putdown](#Parsing-putdown)
- [Rendering JSON into putdown](#Rendering-JSON-into-putdown)
- [Parsing LaTeX](#Parsing-LaTeX)
- [Rendering JSON into LaTeX](#Rendering-JSON-into-LaTeX)
- [Converting putdown to LaTeX](#Converting-putdown-to-LaTeX)
- [Converting LaTeX to putdown](#Converting-LaTeX-to-putdown)
- [Parsing MathLive-style LaTeX](#Parsing-MathLive-style-LaTeX)


## <a name="Parsing-putdown">Parsing putdown</a>

### can convert putdown numbers to JSON

- Test 1
   - input: putdown `0`
   - output: JSON `["Number","0"]`
- Test 2
   - input: putdown `453789`
   - output: JSON `["Number","453789"]`
- Test 3
   - input: putdown `99999999999999999999999999999999999999999`
   - output: JSON `["Number","99999999999999999999999999999999999999999"]`
- Test 4
   - input: putdown `(- 453789)`
   - output: JSON `["NumberNegation",["Number","453789"]]`
- Test 5
   - input: putdown `(- 99999999999999999999999999999999999999999)`
   - output: JSON `["NumberNegation",["Number","99999999999999999999999999999999999999999"]]`
- Test 6
   - input: putdown `0.0`
   - output: JSON `["Number","0.0"]`
- Test 7
   - input: putdown `29835.6875940`
   - output: JSON `["Number","29835.6875940"]`
- Test 8
   - input: putdown `653280458689.`
   - output: JSON `["Number","653280458689."]`
- Test 9
   - input: putdown `.000006327589`
   - output: JSON `["Number",".000006327589"]`
- Test 10
   - input: putdown `(- 29835.6875940)`
   - output: JSON `["NumberNegation",["Number","29835.6875940"]]`
- Test 11
   - input: putdown `(- 653280458689.)`
   - output: JSON `["NumberNegation",["Number","653280458689."]]`
- Test 12
   - input: putdown `(- .000006327589)`
   - output: JSON `["NumberNegation",["Number",".000006327589"]]`


### can convert any size variable name to JSON

- Test 1
   - input: putdown `foo`
   - output: JSON `null`
- Test 2
   - input: putdown `bar`
   - output: JSON `null`
- Test 3
   - input: putdown `to`
   - output: JSON `null`


### can convert numeric constants from putdown to JSON

- Test 1
   - input: putdown `infinity`
   - output: JSON `"Infinity"`
- Test 2
   - input: putdown `pi`
   - output: JSON `"Pi"`
- Test 3
   - input: putdown `eulersnumber`
   - output: JSON `"EulersNumber"`


### can convert exponentiation of atomics to JSON

- Test 1
   - input: putdown `(^ 1 2)`
   - output: JSON `["Exponentiation",["Number","1"],["Number","2"]]`
- Test 2
   - input: putdown `(^ e x)`
   - output: JSON `["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]`
- Test 3
   - input: putdown `(^ 1 infinity)`
   - output: JSON `["Exponentiation",["Number","1"],"Infinity"]`


### can convert atomic percentages and factorials to JSON

- Test 1
   - input: putdown `(% 10)`
   - output: JSON `["Percentage",["Number","10"]]`
- Test 2
   - input: putdown `(% t)`
   - output: JSON `["Percentage",["NumberVariable","t"]]`
- Test 3
   - input: putdown `(! 6)`
   - output: JSON `["Factorial",["Number","6"]]`
- Test 4
   - input: putdown `(! n)`
   - output: JSON `["Factorial",["NumberVariable","n"]]`


### can convert division of atomics or factors to JSON

- Test 1
   - input: putdown `(/ 1 2)`
   - output: JSON `["Division",["Number","1"],["Number","2"]]`
- Test 2
   - input: putdown `(/ x y)`
   - output: JSON `["Division",["NumberVariable","x"],["NumberVariable","y"]]`
- Test 3
   - input: putdown `(/ 0 infinity)`
   - output: JSON `["Division",["Number","0"],"Infinity"]`
- Test 4
   - input: putdown `(/ (^ x 2) 3)`
   - output: JSON `["Division",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
- Test 5
   - input: putdown `(/ 1 (^ e x))`
   - output: JSON `["Division",["Number","1"],["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]]`
- Test 6
   - input: putdown `(/ (% 10) (^ 2 100))`
   - output: JSON `["Division",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`


### can convert multiplication of atomics or factors to JSON

- Test 1
   - input: putdown `(* 1 2)`
   - output: JSON `["Multiplication",["Number","1"],["Number","2"]]`
- Test 2
   - input: putdown `(* x y)`
   - output: JSON `["Multiplication",["NumberVariable","x"],["NumberVariable","y"]]`
- Test 3
   - input: putdown `(* 0 infinity)`
   - output: JSON `["Multiplication",["Number","0"],"Infinity"]`
- Test 4
   - input: putdown `(* (^ x 2) 3)`
   - output: JSON `["Multiplication",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
- Test 5
   - input: putdown `(* 1 (^ e x))`
   - output: JSON `["Multiplication",["Number","1"],["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]]`
- Test 6
   - input: putdown `(* (% 10) (^ 2 100))`
   - output: JSON `["Multiplication",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`


### can convert negations of atomics or factors to JSON

- Test 1
   - input: putdown `(* (- 1) 2)`
   - output: JSON `["Multiplication",["NumberNegation",["Number","1"]],["Number","2"]]`
- Test 2
   - input: putdown `(* x (- y))`
   - output: JSON `["Multiplication",["NumberVariable","x"],["NumberNegation",["NumberVariable","y"]]]`
- Test 3
   - input: putdown `(* (- (^ x 2)) (- 3))`
   - output: JSON `["Multiplication",["NumberNegation",["Exponentiation",["NumberVariable","x"],["Number","2"]]],["NumberNegation",["Number","3"]]]`
- Test 4
   - input: putdown `(- (- (- (- 1000))))`
   - output: JSON `["NumberNegation",["NumberNegation",["NumberNegation",["NumberNegation",["Number","1000"]]]]]`


### can convert additions and subtractions to JSON

- Test 1
   - input: putdown `(+ x y)`
   - output: JSON `["Addition",["NumberVariable","x"],["NumberVariable","y"]]`
- Test 2
   - input: putdown `(- 1 (- 3))`
   - output: JSON `["Subtraction",["Number","1"],["NumberNegation",["Number","3"]]]`
- Test 3
   - input: putdown `(+ (^ A B) (- C pi))`
   - output: JSON `["Addition",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]],["Subtraction",["NumberVariable","C"],"Pi"]]`


### can convert Number exprs that normally require groupers to JSON

- Test 1
   - input: putdown `(- (* 1 2))`
   - output: JSON `["NumberNegation",["Multiplication",["Number","1"],["Number","2"]]]`
- Test 2
   - input: putdown `(! (^ x 2))`
   - output: JSON `["Factorial",["Exponentiation",["NumberVariable","x"],["Number","2"]]]`
- Test 3
   - input: putdown `(^ (- x) (* 2 (- 3)))`
   - output: JSON `["Exponentiation",["NumberNegation",["NumberVariable","x"]],["Multiplication",["Number","2"],["NumberNegation",["Number","3"]]]]`
- Test 4
   - input: putdown `(^ (- 3) (+ 1 2))`
   - output: JSON `["Exponentiation",["NumberNegation",["Number","3"]],["Addition",["Number","1"],["Number","2"]]]`


### can convert relations of numeric expressions to JSON

- Test 1
   - input: putdown `(> 1 2)`
   - output: JSON `["GreaterThan",["Number","1"],["Number","2"]]`
- Test 2
   - input: putdown `(< (- 1 2) (+ 1 2))`
   - output: JSON `["LessThan",["Subtraction",["Number","1"],["Number","2"]],["Addition",["Number","1"],["Number","2"]]]`
- Test 3
   - input: putdown `(not (= 1 2))`
   - output: JSON `["LogicalNegation",["Equals",["Number","1"],["Number","2"]]]`
- Test 4
   - input: putdown `(and (>= 2 1) (<= 2 3))`
   - output: JSON `["Conjunction",["GreaterThanOrEqual",["Number","2"],["Number","1"]],["LessThanOrEqual",["Number","2"],["Number","3"]]]`
- Test 5
   - input: putdown `(relationholds | 7 14)`
   - output: JSON `["BinaryRelationHolds","Divides",["Number","7"],["Number","14"]]`
- Test 6
   - input: putdown `(relationholds | (apply A k) (! n))`
   - output: JSON `["BinaryRelationHolds","Divides",["NumberFunctionApplication",["FunctionVariable","A"],["NumberVariable","k"]],["Factorial",["NumberVariable","n"]]]`
- Test 7
   - input: putdown `(relationholds ~ (- 1 k) (+ 1 k))`
   - output: JSON `["BinaryRelationHolds","GenericBinaryRelation",["Subtraction",["Number","1"],["NumberVariable","k"]],["Addition",["Number","1"],["NumberVariable","k"]]]`
- Test 8
   - input: putdown `(relationholds ~~ 0.99 1.01)`
   - output: JSON `["BinaryRelationHolds","ApproximatelyEqual",["Number","0.99"],["Number","1.01"]]`


### can convert propositional logic atomics to JSON

- Test 1
   - input: putdown `true`
   - output: JSON `"LogicalTrue"`
- Test 2
   - input: putdown `false`
   - output: JSON `"LogicalFalse"`
- Test 3
   - input: putdown `contradiction`
   - output: JSON `"Contradiction"`


### can convert propositional logic conjuncts to JSON

- Test 1
   - input: putdown `(and true false)`
   - output: JSON `["Conjunction","LogicalTrue","LogicalFalse"]`
- Test 2
   - input: putdown `(and (not P) (not true))`
   - output: JSON `["Conjunction",["LogicalNegation",["LogicVariable","P"]],["LogicalNegation","LogicalTrue"]]`
- Test 3
   - input: putdown `(and (and a b) c)`
   - output: JSON `["Conjunction",["Conjunction",["LogicVariable","a"],["LogicVariable","b"]],["LogicVariable","c"]]`


### can convert propositional logic disjuncts to JSON

- Test 1
   - input: putdown `(or true (not A))`
   - output: JSON `["Disjunction","LogicalTrue",["LogicalNegation",["LogicVariable","A"]]]`
- Test 2
   - input: putdown `(or (and P Q) (and Q P))`
   - output: JSON `["Disjunction",["Conjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]]`


### can convert propositional logic conditionals to JSON

- Test 1
   - input: putdown `(implies A (and Q (not P)))`
   - output: JSON `["Implication",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
- Test 2
   - input: putdown `(implies (implies (or P Q) (and Q P)) T)`
   - output: JSON `["Implication",["Implication",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]],["LogicVariable","T"]]`


### can convert propositional logic biconditionals to JSON

- Test 1
   - input: putdown `(iff A (and Q (not P)))`
   - output: JSON `["LogicalEquivalence",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
- Test 2
   - input: putdown `(implies (iff (or P Q) (and Q P)) T)`
   - output: JSON `["Implication",["LogicalEquivalence",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]],["LogicVariable","T"]]`


### can convert propositional expressions with groupers to JSON

- Test 1
   - input: putdown `(or P (and (iff Q Q) P))`
   - output: JSON `["Disjunction",["LogicVariable","P"],["Conjunction",["LogicalEquivalence",["LogicVariable","Q"],["LogicVariable","Q"]],["LogicVariable","P"]]]`
- Test 2
   - input: putdown `(not (iff true false))`
   - output: JSON `["LogicalNegation",["LogicalEquivalence","LogicalTrue","LogicalFalse"]]`


### can convert simple predicate logic expressions to JSON

- Test 1
   - input: putdown `(forall (x , P))`
   - output: JSON `["UniversalQuantifier",["NumberVariable","x"],["LogicVariable","P"]]`
- Test 2
   - input: putdown `(exists (t , (not Q)))`
   - output: JSON `["ExistentialQuantifier",["NumberVariable","t"],["LogicalNegation",["LogicVariable","Q"]]]`
- Test 3
   - input: putdown `(exists! (k , (implies m n)))`
   - output: JSON `["UniqueExistentialQuantifier",["NumberVariable","k"],["Implication",["LogicVariable","m"],["LogicVariable","n"]]]`


### can convert finite and empty sets to JSON

- Test 1
   - input: putdown `emptyset`
   - output: JSON `"EmptySet"`
- Test 2
   - input: putdown `(finiteset (elts 1))`
   - output: JSON `["FiniteSet",["OneElementSequence",["Number","1"]]]`
- Test 3
   - input: putdown `(finiteset (elts 1 (elts 2)))`
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]`
- Test 4
   - input: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["OneElementSequence",["Number","3"]]]]]`
- Test 5
   - input: putdown `(finiteset (elts emptyset (elts emptyset)))`
   - output: JSON `["FiniteSet",["ElementThenSequence","EmptySet",["OneElementSequence","EmptySet"]]]`
- Test 6
   - input: putdown `(finiteset (elts (finiteset (elts emptyset))))`
   - output: JSON `["FiniteSet",["OneElementSequence",["FiniteSet",["OneElementSequence","EmptySet"]]]]`
- Test 7
   - input: putdown `(finiteset (elts 3 (elts x)))`
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","3"],["OneElementSequence",["NumberVariable","x"]]]]`
- Test 8
   - input: putdown `(finiteset (elts (union A B) (elts (intersection A B))))`
   - output: JSON `["FiniteSet",["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["SetIntersection",["SetVariable","A"],["SetVariable","B"]]]]]`
- Test 9
   - input: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["ElementThenSequence","EmptySet",["ElementThenSequence",["NumberVariable","K"],["OneElementSequence",["NumberVariable","P"]]]]]]]`


### can convert tuples and vectors to JSON

- Test 1
   - input: putdown `(tuple (elts 5 (elts 6)))`
   - output: JSON `["Tuple",["ElementThenSequence",["Number","5"],["OneElementSequence",["Number","6"]]]]`
- Test 2
   - input: putdown `(tuple (elts 5 (elts (union A B) (elts k))))`
   - output: JSON `["Tuple",["ElementThenSequence",["Number","5"],["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["NumberVariable","k"]]]]]`
- Test 3
   - input: putdown `(vector (elts 5 (elts 6)))`
   - output: JSON `["Vector",["NumberThenSequence",["Number","5"],["OneNumberSequence",["Number","6"]]]]`
- Test 4
   - input: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
   - output: JSON `["Vector",["NumberThenSequence",["Number","5"],["NumberThenSequence",["NumberNegation",["Number","7"]],["OneNumberSequence",["NumberVariable","k"]]]]]`
- Test 5
   - input: putdown `(tuple)`
   - output: JSON `null`
- Test 6
   - input: putdown `(tuple (elts))`
   - output: JSON `null`
- Test 7
   - input: putdown `(tuple (elts 3))`
   - output: JSON `null`
- Test 8
   - input: putdown `(vector)`
   - output: JSON `null`
- Test 9
   - input: putdown `(vector (elts))`
   - output: JSON `null`
- Test 10
   - input: putdown `(vector (elts 3))`
   - output: JSON `null`
- Test 11
   - input: putdown `(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))`
   - output: JSON `["Tuple",["ElementThenSequence",["Tuple",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]],["OneElementSequence",["Number","6"]]]]`
- Test 12
   - input: putdown `(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))`
   - output: JSON `null`
- Test 13
   - input: putdown `(vector (elts (vector (elts 1 (elts 2))) (elts 6)))`
   - output: JSON `null`
- Test 14
   - input: putdown `(vector (elts (union A B) (elts 6)))`
   - output: JSON `null`


### can convert simple set memberships and subsets to JSON

- Test 1
   - input: putdown `(in b B)`
   - output: JSON `["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]`
- Test 2
   - input: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
   - output: JSON `["NounIsElement",["Number","2"],["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]]`
- Test 3
   - input: putdown `(in X (union a b))`
   - output: JSON `["NounIsElement",["NumberVariable","X"],["SetUnion",["SetVariable","a"],["SetVariable","b"]]]`
- Test 4
   - input: putdown `(in (union A B) (union X Y))`
   - output: JSON `["NounIsElement",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["SetUnion",["SetVariable","X"],["SetVariable","Y"]]]`
- Test 5
   - input: putdown `(subset A (complement B))`
   - output: JSON `["Subset",["SetVariable","A"],["SetComplement",["SetVariable","B"]]]`
- Test 6
   - input: putdown `(subseteq (intersection u v) (union u v))`
   - output: JSON `["SubsetOrEqual",["SetIntersection",["SetVariable","u"],["SetVariable","v"]],["SetUnion",["SetVariable","u"],["SetVariable","v"]]]`
- Test 7
   - input: putdown `(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))`
   - output: JSON `["SubsetOrEqual",["FiniteSet",["OneElementSequence",["Number","1"]]],["SetUnion",["FiniteSet",["OneElementSequence",["Number","1"]]],["FiniteSet",["OneElementSequence",["Number","2"]]]]]`
- Test 8
   - input: putdown `(in p (cartesianproduct U V))`
   - output: JSON `["NounIsElement",["NumberVariable","p"],["SetCartesianProduct",["SetVariable","U"],["SetVariable","V"]]]`
- Test 9
   - input: putdown `(in q (union (complement U) (cartesianproduct V W)))`
   - output: JSON `["NounIsElement",["NumberVariable","q"],["SetUnion",["SetComplement",["SetVariable","U"]],["SetCartesianProduct",["SetVariable","V"],["SetVariable","W"]]]]`
- Test 10
   - input: putdown `(in (tuple (elts a (elts b))) (cartesianproduct A B))`
   - output: JSON `["NounIsElement",["Tuple",["ElementThenSequence",["NumberVariable","a"],["OneElementSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
- Test 11
   - input: putdown `(in (vector (elts a (elts b))) (cartesianproduct A B))`
   - output: JSON `["NounIsElement",["Vector",["NumberThenSequence",["NumberVariable","a"],["OneNumberSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`


### does not undo the canonical form for "notin" notation

- Test 1
   - input: putdown `(not (in a A))`
   - output: JSON `["LogicalNegation",["NounIsElement",["NumberVariable","a"],["SetVariable","A"]]]`
- Test 2
   - input: putdown `(not (in emptyset emptyset))`
   - output: JSON `["LogicalNegation",["NounIsElement","EmptySet","EmptySet"]]`
- Test 3
   - input: putdown `(not (in (- 3 5) (intersection K P)))`
   - output: JSON `["LogicalNegation",["NounIsElement",["Subtraction",["Number","3"],["Number","5"]],["SetIntersection",["SetVariable","K"],["SetVariable","P"]]]]`


### can parse to JSON sentences built from various relations

- Test 1
   - input: putdown `(or P (in b B))`
   - output: JSON `["Disjunction",["LogicVariable","P"],["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]]`
- Test 2
   - input: putdown `(forall (x , (in x X)))`
   - output: JSON `["UniversalQuantifier",["NumberVariable","x"],["NounIsElement",["NumberVariable","x"],["SetVariable","X"]]]`
- Test 3
   - input: putdown `(and (subseteq A B) (subseteq B A))`
   - output: JSON `["Conjunction",["SubsetOrEqual",["SetVariable","A"],["SetVariable","B"]],["SubsetOrEqual",["SetVariable","B"],["SetVariable","A"]]]`
- Test 4
   - input: putdown `(= R (cartesianproduct A B))`
   - output: JSON `["Equals",["NumberVariable","R"],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
- Test 5
   - input: putdown `(forall (n , (relationholds | n (! n))))`
   - output: JSON `["UniversalQuantifier",["NumberVariable","n"],["BinaryRelationHolds","Divides",["NumberVariable","n"],["Factorial",["NumberVariable","n"]]]]`
- Test 6
   - input: putdown `(implies (relationholds ~ a b) (relationholds ~ b a))`
   - output: JSON `["Implication",["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","a"],["NumberVariable","b"]],["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","b"],["NumberVariable","a"]]]`


### can parse notation related to functions

- Test 1
   - input: putdown `(function f A B)`
   - output: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`
- Test 2
   - input: putdown `(not (function F (union X Y) Z))`
   - output: JSON `["LogicalNegation",["FunctionSignature",["FunctionVariable","F"],["SetUnion",["SetVariable","X"],["SetVariable","Y"]],["SetVariable","Z"]]]`
- Test 3
   - input: putdown `(function (compose f g) A C)`
   - output: JSON `["FunctionSignature",["FunctionComposition",["FunctionVariable","f"],["FunctionVariable","g"]],["SetVariable","A"],["SetVariable","C"]]`
- Test 4
   - input: putdown `(apply f x)`
   - output: JSON `["NumberFunctionApplication",["FunctionVariable","f"],["NumberVariable","x"]]`
- Test 5
   - input: putdown `(apply (inverse f) (apply (inverse g) 10))`
   - output: JSON `["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","f"]],["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","g"]],["Number","10"]]]`
- Test 6
   - input: putdown `(apply E (complement L))`
   - output: JSON `["NumberFunctionApplication",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
- Test 7
   - input: putdown `(intersection emptyset (apply f 2))`
   - output: JSON `["SetIntersection","EmptySet",["SetFunctionApplication",["FunctionVariable","f"],["Number","2"]]]`
- Test 8
   - input: putdown `(and (apply P e) (apply Q (+ 3 b)))`
   - output: JSON `["Conjunction",["PropositionFunctionApplication",["FunctionVariable","P"],["NumberVariable","e"]],["PropositionFunctionApplication",["FunctionVariable","Q"],["Addition",["Number","3"],["NumberVariable","b"]]]]`
- Test 9
   - input: putdown `(= (apply f x) 3)`
   - output: JSON `["Equals",["NumberFunctionApplication",["FunctionVariable","f"],["NumberVariable","x"]],["Number","3"]]`
- Test 10
   - input: putdown `(= F (compose G (inverse H)))`
   - output: JSON `["EqualFunctions",["FunctionVariable","F"],["FunctionComposition",["FunctionVariable","G"],["FunctionInverse",["FunctionVariable","H"]]]]`


### can parse trigonometric functions correctly

- Test 1
   - input: putdown `(apply sin x)`
   - output: JSON `["PrefixFunctionApplication","SineFunction",["NumberVariable","x"]]`
- Test 2
   - input: putdown `(apply cos (* pi x))`
   - output: JSON `["PrefixFunctionApplication","CosineFunction",["Multiplication","Pi",["NumberVariable","x"]]]`
- Test 3
   - input: putdown `(apply tan t)`
   - output: JSON `["PrefixFunctionApplication","TangentFunction",["NumberVariable","t"]]`
- Test 4
   - input: putdown `(/ 1 (apply cot pi))`
   - output: JSON `["Division",["Number","1"],["PrefixFunctionApplication","CotangentFunction","Pi"]]`
- Test 5
   - input: putdown `(= (apply sec y) (apply csc y))`
   - output: JSON `["Equals",["PrefixFunctionApplication","SecantFunction",["NumberVariable","y"]],["PrefixFunctionApplication","CosecantFunction",["NumberVariable","y"]]]`


### can parse logarithms correctly

- Test 1
   - input: putdown `(apply log n)`
   - output: JSON `["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]`
- Test 2
   - input: putdown `(+ 1 (apply ln x))`
   - output: JSON `["Addition",["Number","1"],["PrefixFunctionApplication","NaturalLogarithm",["NumberVariable","x"]]]`
- Test 3
   - input: putdown `(apply (logbase 2) 1024)`
   - output: JSON `["PrefixFunctionApplication",["LogarithmWithBase",["Number","2"]],["Number","1024"]]`
- Test 4
   - input: putdown `(/ (apply log n) (apply log (apply log n)))`
   - output: JSON `["Division",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]],["PrefixFunctionApplication","Logarithm",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]]]`


### can parse equivalence classes and treat them as sets

- Test 1
   - input: putdown `(equivclass 1 ~~)`
   - output: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
- Test 2
   - input: putdown `(union (equivclass 1 ~~) (equivclass 2 ~~))`
   - output: JSON `["SetUnion",["EquivalenceClass",["Number","1"],"ApproximatelyEqual"],["EquivalenceClass",["Number","2"],"ApproximatelyEqual"]]`


### can parse equivalence and classes mod a Number

- Test 1
   - input: putdown `(=mod 5 11 3)`
   - output: JSON `["EquivalentModulo",["Number","5"],["Number","11"],["Number","3"]]`
- Test 2
   - input: putdown `(=mod k m n)`
   - output: JSON `["EquivalentModulo",["NumberVariable","k"],["NumberVariable","m"],["NumberVariable","n"]]`
- Test 3
   - input: putdown `(subset emptyset (modclass (- 1) 10))`
   - output: JSON `["Subset","EmptySet",["EquivalenceClassModulo",["NumberNegation",["Number","1"]],["Number","10"]]]`


### can parse type sentences and combinations of them

- Test 1
   - input: putdown `(hastype x settype)`
   - output: JSON `["HasType",["NumberVariable","x"],"SetType"]`
- Test 2
   - input: putdown `(hastype n numbertype)`
   - output: JSON `["HasType",["NumberVariable","n"],"NumberType"]`
- Test 3
   - input: putdown `(hastype S partialordertype)`
   - output: JSON `["HasType",["NumberVariable","S"],"PartialOrderType"]`
- Test 4
   - input: putdown `(and (hastype 1 numbertype) (hastype 10 numbertype))`
   - output: JSON `["Conjunction",["HasType",["Number","1"],"NumberType"],["HasType",["Number","10"],"NumberType"]]`
- Test 5
   - input: putdown `(implies (hastype R equivalencerelationtype) (hastype R relationtype))`
   - output: JSON `["Implication",["HasType",["NumberVariable","R"],"EquivalenceRelationType"],["HasType",["NumberVariable","R"],"RelationType"]]`


### can parse notation for expression function application

- Test 1
   - input: putdown `(efa f x)`
   - output: JSON `["NumberEFA",["FunctionVariable","f"],["NumberVariable","x"]]`
- Test 2
   - input: putdown `(apply F (efa k 10))`
   - output: JSON `["NumberFunctionApplication",["FunctionVariable","F"],["NumberEFA",["FunctionVariable","k"],["Number","10"]]]`
- Test 3
   - input: putdown `(efa E (complement L))`
   - output: JSON `["NumberEFA",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
- Test 4
   - input: putdown `(intersection emptyset (efa f 2))`
   - output: JSON `["SetIntersection","EmptySet",["SetEFA",["FunctionVariable","f"],["Number","2"]]]`
- Test 5
   - input: putdown `(and (efa P x) (efa Q y))`
   - output: JSON `["Conjunction",["PropositionEFA",["FunctionVariable","P"],["NumberVariable","x"]],["PropositionEFA",["FunctionVariable","Q"],["NumberVariable","y"]]]`


### can parse notation for assumptions

- Test 1
   - input: putdown `:X`
   - output: JSON `["Given_Variant1",["LogicVariable","X"]]`
- Test 2
   - input: putdown `:(= k 1000)`
   - output: JSON `["Given_Variant1",["Equals",["NumberVariable","k"],["Number","1000"]]]`
- Test 3
   - input: putdown `:true`
   - output: JSON `["Given_Variant1","LogicalTrue"]`
- Test 4
   - input: putdown `:50`
   - output: JSON `null`
- Test 5
   - input: putdown `:(tuple (elts 5 (elts 6)))`
   - output: JSON `null`
- Test 6
   - input: putdown `:(compose f g)`
   - output: JSON `null`
- Test 7
   - input: putdown `:emptyset`
   - output: JSON `null`
- Test 8
   - input: putdown `:infinity`
   - output: JSON `null`


### can parse notation for Let-style declarations

- Test 1
   - input: putdown `:[x]`
   - output: JSON `["Let_Variant1",["NumberVariable","x"]]`
- Test 2
   - input: putdown `:[T]`
   - output: JSON `["Let_Variant1",["NumberVariable","T"]]`
- Test 3
   - input: putdown `:[x , (> x 0)]`
   - output: JSON `["LetBeSuchThat_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 4
   - input: putdown `:[T , (or (= T 5) (in T S))]`
   - output: JSON `["LetBeSuchThat_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 5
   - input: putdown `:[(> x 5)]`
   - output: JSON `null`
- Test 6
   - input: putdown `:[(= 1 1)]`
   - output: JSON `null`
- Test 7
   - input: putdown `:[emptyset]`
   - output: JSON `null`
- Test 8
   - input: putdown `:[x , 1]`
   - output: JSON `null`
- Test 9
   - input: putdown `:[x , (or 1 2)]`
   - output: JSON `null`
- Test 10
   - input: putdown `:[x , [y]]`
   - output: JSON `null`
- Test 11
   - input: putdown `:[x , :B]`
   - output: JSON `null`


### can parse notation for For Some-style declarations

- Test 1
   - input: putdown `[x , (> x 0)]`
   - output: JSON `["ForSome_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 2
   - input: putdown `[T , (or (= T 5) (in T S))]`
   - output: JSON `["ForSome_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 3
   - input: putdown `[x]`
   - output: JSON `null`
- Test 4
   - input: putdown `[T]`
   - output: JSON `null`
- Test 5
   - input: putdown `[(> x 5)]`
   - output: JSON `null`
- Test 6
   - input: putdown `[(= 1 1)]`
   - output: JSON `null`
- Test 7
   - input: putdown `[emptyset]`
   - output: JSON `null`
- Test 8
   - input: putdown `[x , 1]`
   - output: JSON `null`
- Test 9
   - input: putdown `[x , (or 1 2)]`
   - output: JSON `null`
- Test 10
   - input: putdown `[x , [y]]`
   - output: JSON `null`
- Test 11
   - input: putdown `[x , :B]`
   - output: JSON `null`


## <a name="Rendering-JSON-into-putdown">Rendering JSON into putdown</a>

### can convert JSON numbers to putdown

- Test 1
   - input: JSON `["Number","0"]`
   - output: putdown `0`
- Test 2
   - input: JSON `["Number","453789"]`
   - output: putdown `453789`
- Test 3
   - input: JSON `["Number","99999999999999999999999999999999999999999"]`
   - output: putdown `99999999999999999999999999999999999999999`
- Test 4
   - input: JSON `["NumberNegation",["Number","453789"]]`
   - output: putdown `(- 453789)`
- Test 5
   - input: JSON `["NumberNegation",["Number","99999999999999999999999999999999999999999"]]`
   - output: putdown `(- 99999999999999999999999999999999999999999)`
- Test 6
   - input: JSON `["Number","0.0"]`
   - output: putdown `0.0`
- Test 7
   - input: JSON `["Number","29835.6875940"]`
   - output: putdown `29835.6875940`
- Test 8
   - input: JSON `["Number","653280458689."]`
   - output: putdown `653280458689.`
- Test 9
   - input: JSON `["Number",".000006327589"]`
   - output: putdown `.000006327589`
- Test 10
   - input: JSON `["NumberNegation",["Number","29835.6875940"]]`
   - output: putdown `(- 29835.6875940)`
- Test 11
   - input: JSON `["NumberNegation",["Number","653280458689."]]`
   - output: putdown `(- 653280458689.)`
- Test 12
   - input: JSON `["NumberNegation",["Number",".000006327589"]]`
   - output: putdown `(- .000006327589)`


### can convert any size variable name from JSON to putdown

- Test 1
   - input: JSON `["NumberVariable","x"]`
   - output: putdown `x`
- Test 2
   - input: JSON `["NumberVariable","E"]`
   - output: putdown `E`
- Test 3
   - input: JSON `["NumberVariable","q"]`
   - output: putdown `q`
- Test 4
   - input: JSON `["NumberVariable","foo"]`
   - output: putdown `foo`
- Test 5
   - input: JSON `["NumberVariable","bar"]`
   - output: putdown `bar`
- Test 6
   - input: JSON `["NumberVariable","to"]`
   - output: putdown `to`


### can convert numeric constants from JSON to putdown

- Test 1
   - input: JSON `"Infinity"`
   - output: putdown `infinity`
- Test 2
   - input: JSON `"Pi"`
   - output: putdown `pi`
- Test 3
   - input: JSON `"EulersNumber"`
   - output: putdown `eulersnumber`


### can convert exponentiation of atomics to putdown

- Test 1
   - input: JSON `["Exponentiation",["Number","1"],["Number","2"]]`
   - output: putdown `(^ 1 2)`
- Test 2
   - input: JSON `["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]`
   - output: putdown `(^ e x)`
- Test 3
   - input: JSON `["Exponentiation",["Number","1"],"Infinity"]`
   - output: putdown `(^ 1 infinity)`


### can convert atomic percentages and factorials to putdown

- Test 1
   - input: JSON `["Percentage",["Number","10"]]`
   - output: putdown `(% 10)`
- Test 2
   - input: JSON `["Percentage",["NumberVariable","t"]]`
   - output: putdown `(% t)`
- Test 3
   - input: JSON `["Factorial",["Number","100"]]`
   - output: putdown `(! 100)`
- Test 4
   - input: JSON `["Factorial",["NumberVariable","J"]]`
   - output: putdown `(! J)`


### can convert division of atomics or factors to putdown

- Test 1
   - input: JSON `["Division",["Number","1"],["Number","2"]]`
   - output: putdown `(/ 1 2)`
- Test 2
   - input: JSON `["Division",["NumberVariable","x"],["NumberVariable","y"]]`
   - output: putdown `(/ x y)`
- Test 3
   - input: JSON `["Division",["Number","0"],"Infinity"]`
   - output: putdown `(/ 0 infinity)`
- Test 4
   - input: JSON `["Division",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
   - output: putdown `(/ (^ x 2) 3)`
- Test 5
   - input: JSON `["Division",["Number","1"],["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]]`
   - output: putdown `(/ 1 (^ e x))`
- Test 6
   - input: JSON `["Division",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`
   - output: putdown `(/ (% 10) (^ 2 100))`


### can convert multiplication of atomics or factors to putdown

- Test 1
   - input: JSON `["Multiplication",["Number","1"],["Number","2"]]`
   - output: putdown `(* 1 2)`
- Test 2
   - input: JSON `["Multiplication",["NumberVariable","x"],["NumberVariable","y"]]`
   - output: putdown `(* x y)`
- Test 3
   - input: JSON `["Multiplication",["Number","0"],"Infinity"]`
   - output: putdown `(* 0 infinity)`
- Test 4
   - input: JSON `["Multiplication",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
   - output: putdown `(* (^ x 2) 3)`
- Test 5
   - input: JSON `["Multiplication",["Number","1"],["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]]`
   - output: putdown `(* 1 (^ e x))`
- Test 6
   - input: JSON `["Multiplication",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`
   - output: putdown `(* (% 10) (^ 2 100))`


### can convert negations of atomics or factors to putdown

- Test 1
   - input: JSON `["Multiplication",["NumberNegation",["Number","1"]],["Number","2"]]`
   - output: putdown `(* (- 1) 2)`
- Test 2
   - input: JSON `["Multiplication",["NumberVariable","x"],["NumberNegation",["NumberVariable","y"]]]`
   - output: putdown `(* x (- y))`
- Test 3
   - input: JSON `["Multiplication",["NumberNegation",["Exponentiation",["NumberVariable","x"],["Number","2"]]],["NumberNegation",["Number","3"]]]`
   - output: putdown `(* (- (^ x 2)) (- 3))`
- Test 4
   - input: JSON `["NumberNegation",["NumberNegation",["NumberNegation",["NumberNegation",["Number","1000"]]]]]`
   - output: putdown `(- (- (- (- 1000))))`


### can convert additions and subtractions to putdown

- Test 1
   - input: JSON `["Addition",["NumberVariable","x"],["NumberVariable","y"]]`
   - output: putdown `(+ x y)`
- Test 2
   - input: JSON `["Subtraction",["Number","1"],["NumberNegation",["Number","3"]]]`
   - output: putdown `(- 1 (- 3))`
- Test 3
   - input: JSON `["Addition",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]],["Subtraction",["NumberVariable","C"],"Pi"]]`
   - output: putdown `(+ (^ A B) (- C pi))`


### can convert number expressions with groupers to putdown

- Test 1
   - input: JSON `["NumberNegation",["Multiplication",["Number","1"],["Number","2"]]]`
   - output: putdown `(- (* 1 2))`
- Test 2
   - input: JSON `["Factorial",["Exponentiation",["NumberVariable","x"],["Number","2"]]]`
   - output: putdown `(! (^ x 2))`
- Test 3
   - input: JSON `["Exponentiation",["NumberNegation",["NumberVariable","x"]],["Multiplication",["Number","2"],["NumberNegation",["Number","3"]]]]`
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 4
   - input: JSON `["Exponentiation",["NumberNegation",["Number","3"]],["Addition",["Number","1"],["Number","2"]]]`
   - output: putdown `(^ (- 3) (+ 1 2))`


### can convert relations of numeric expressions to putdown

- Test 1
   - input: JSON `["GreaterThan",["Number","1"],["Number","2"]]`
   - output: putdown `(> 1 2)`
- Test 2
   - input: JSON `["LessThan",["Subtraction",["Number","1"],["Number","2"]],["Addition",["Number","1"],["Number","2"]]]`
   - output: putdown `(< (- 1 2) (+ 1 2))`
- Test 3
   - input: JSON `["LogicalNegation",["Equals",["Number","1"],["Number","2"]]]`
   - output: putdown `(not (= 1 2))`
- Test 4
   - input: JSON `["Conjunction",["GreaterThanOrEqual",["Number","2"],["Number","1"]],["LessThanOrEqual",["Number","2"],["Number","3"]]]`
   - output: putdown `(and (>= 2 1) (<= 2 3))`
- Test 5
   - input: JSON `["BinaryRelationHolds","Divides",["Number","7"],["Number","14"]]`
   - output: putdown `(relationholds | 7 14)`
- Test 6
   - input: JSON `["BinaryRelationHolds","Divides",["NumberFunctionApplication",["FunctionVariable","A"],["NumberVariable","k"]],["Factorial",["NumberVariable","n"]]]`
   - output: putdown `(relationholds | (apply A k) (! n))`
- Test 7
   - input: JSON `["BinaryRelationHolds","GenericBinaryRelation",["Subtraction",["Number","1"],["NumberVariable","k"]],["Addition",["Number","1"],["NumberVariable","k"]]]`
   - output: putdown `(relationholds ~ (- 1 k) (+ 1 k))`
- Test 8
   - input: JSON `["BinaryRelationHolds","ApproximatelyEqual",["Number","0.99"],["Number","1.01"]]`
   - output: putdown `(relationholds ~~ 0.99 1.01)`


### creates the canonical form for inequality

- Test 1
   - input: JSON `["NotEqual",["FunctionVariable","f"],["FunctionVariable","g"]]`
   - output: putdown `(not (= f g))`


### can convert propositional logic atomics to putdown

- Test 1
   - input: JSON `"LogicalTrue"`
   - output: putdown `true`
- Test 2
   - input: JSON `"LogicalFalse"`
   - output: putdown `false`
- Test 3
   - input: JSON `"Contradiction"`
   - output: putdown `contradiction`
- Test 4
   - input: JSON `["LogicVariable","P"]`
   - output: putdown `P`
- Test 5
   - input: JSON `["LogicVariable","a"]`
   - output: putdown `a`
- Test 6
   - input: JSON `["LogicVariable","somethingLarge"]`
   - output: putdown `somethingLarge`


### can convert propositional logic conjuncts to putdown

- Test 1
   - input: JSON `["Conjunction","LogicalTrue","LogicalFalse"]`
   - output: putdown `(and true false)`
- Test 2
   - input: JSON `["Conjunction",["LogicalNegation",["LogicVariable","P"]],["LogicalNegation","LogicalTrue"]]`
   - output: putdown `(and (not P) (not true))`
- Test 3
   - input: JSON `["Conjunction",["Conjunction",["LogicVariable","a"],["LogicVariable","b"]],["LogicVariable","c"]]`
   - output: putdown `(and (and a b) c)`


### can convert propositional logic disjuncts to putdown

- Test 1
   - input: JSON `["Disjunction","LogicalTrue",["LogicalNegation",["LogicVariable","A"]]]`
   - output: putdown `(or true (not A))`
- Test 2
   - input: JSON `["Disjunction",["Conjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]]`
   - output: putdown `(or (and P Q) (and Q P))`


### can convert propositional logic conditionals to putdown

- Test 1
   - input: JSON `["Implication",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
   - output: putdown `(implies A (and Q (not P)))`
- Test 2
   - input: JSON `["Implication",["Implication",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]],["LogicVariable","T"]]`
   - output: putdown `(implies (implies (or P Q) (and Q P)) T)`


### can convert propositional logic biconditionals to putdown

- Test 1
   - input: JSON `["LogicalEquivalence",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
   - output: putdown `(iff A (and Q (not P)))`
- Test 2
   - input: JSON `["Implication",["LogicalEquivalence",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]],["LogicVariable","T"]]`
   - output: putdown `(implies (iff (or P Q) (and Q P)) T)`


### can convert propositional expressions with groupers to putdown

- Test 1
   - input: JSON `["Disjunction",["LogicVariable","P"],["Conjunction",["LogicalEquivalence",["LogicVariable","Q"],["LogicVariable","Q"]],["LogicVariable","P"]]]`
   - output: putdown `(or P (and (iff Q Q) P))`
- Test 2
   - input: JSON `["LogicalNegation",["LogicalEquivalence","LogicalTrue","LogicalFalse"]]`
   - output: putdown `(not (iff true false))`


### can convert simple predicate logic expressions to putdown

- Test 1
   - input: JSON `["UniversalQuantifier",["NumberVariable","x"],["LogicVariable","P"]]`
   - output: putdown `(forall (x , P))`
- Test 2
   - input: JSON `["ExistentialQuantifier",["NumberVariable","t"],["LogicalNegation",["LogicVariable","Q"]]]`
   - output: putdown `(exists (t , (not Q)))`
- Test 3
   - input: JSON `["UniqueExistentialQuantifier",["NumberVariable","k"],["Implication",["LogicVariable","m"],["LogicVariable","n"]]]`
   - output: putdown `(exists! (k , (implies m n)))`


### can convert finite and empty sets to putdown

- Test 1
   - input: JSON `"EmptySet"`
   - output: putdown `emptyset`
- Test 2
   - input: JSON `["FiniteSet",["OneElementSequence",["Number","1"]]]`
   - output: putdown `(finiteset (elts 1))`
- Test 3
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2)))`
- Test 4
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["OneElementSequence",["Number","3"]]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
- Test 5
   - input: JSON `["FiniteSet",["ElementThenSequence","EmptySet",["OneElementSequence","EmptySet"]]]`
   - output: putdown `(finiteset (elts emptyset (elts emptyset)))`
- Test 6
   - input: JSON `["FiniteSet",["OneElementSequence",["FiniteSet",["OneElementSequence","EmptySet"]]]]`
   - output: putdown `(finiteset (elts (finiteset (elts emptyset))))`
- Test 7
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","3"],["OneElementSequence",["NumberVariable","x"]]]]`
   - output: putdown `(finiteset (elts 3 (elts x)))`
- Test 8
   - input: JSON `["FiniteSet",["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["SetIntersection",["SetVariable","A"],["SetVariable","B"]]]]]`
   - output: putdown `(finiteset (elts (union A B) (elts (intersection A B))))`
- Test 9
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["ElementThenSequence","EmptySet",["ElementThenSequence",["NumberVariable","K"],["OneElementSequence",["NumberVariable","P"]]]]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`


### can convert tuples and vectors to putdown

- Test 1
   - input: JSON `["Tuple",["ElementThenSequence",["Number","5"],["OneElementSequence",["Number","6"]]]]`
   - output: putdown `(tuple (elts 5 (elts 6)))`
- Test 2
   - input: JSON `["Tuple",["ElementThenSequence",["Number","5"],["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["NumberVariable","k"]]]]]`
   - output: putdown `(tuple (elts 5 (elts (union A B) (elts k))))`
- Test 3
   - input: JSON `["Vector",["NumberThenSequence",["Number","5"],["OneNumberSequence",["Number","6"]]]]`
   - output: putdown `(vector (elts 5 (elts 6)))`
- Test 4
   - input: JSON `["Vector",["NumberThenSequence",["Number","5"],["NumberThenSequence",["NumberNegation",["Number","7"]],["OneNumberSequence",["NumberVariable","k"]]]]]`
   - output: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
- Test 5
   - input: JSON `["Tuple",["ElementThenSequence",["Tuple",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]],["OneElementSequence",["Number","6"]]]]`
   - output: putdown `(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))`


### can convert simple set memberships and subsets to putdown

- Test 1
   - input: JSON `["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]`
   - output: putdown `(in b B)`
- Test 2
   - input: JSON `["NounIsElement",["Number","2"],["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]]`
   - output: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
- Test 3
   - input: JSON `["NounIsElement",["NumberVariable","X"],["SetUnion",["SetVariable","a"],["SetVariable","b"]]]`
   - output: putdown `(in X (union a b))`
- Test 4
   - input: JSON `["NounIsElement",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["SetUnion",["SetVariable","X"],["SetVariable","Y"]]]`
   - output: putdown `(in (union A B) (union X Y))`
- Test 5
   - input: JSON `["Subset",["SetVariable","A"],["SetComplement",["SetVariable","B"]]]`
   - output: putdown `(subset A (complement B))`
- Test 6
   - input: JSON `["SubsetOrEqual",["SetIntersection",["SetVariable","u"],["SetVariable","v"]],["SetUnion",["SetVariable","u"],["SetVariable","v"]]]`
   - output: putdown `(subseteq (intersection u v) (union u v))`
- Test 7
   - input: JSON `["SubsetOrEqual",["FiniteSet",["OneElementSequence",["Number","1"]]],["SetUnion",["FiniteSet",["OneElementSequence",["Number","1"]]],["FiniteSet",["OneElementSequence",["Number","2"]]]]]`
   - output: putdown `(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))`
- Test 8
   - input: JSON `["NounIsElement",["NumberVariable","p"],["SetCartesianProduct",["SetVariable","U"],["SetVariable","V"]]]`
   - output: putdown `(in p (cartesianproduct U V))`
- Test 9
   - input: JSON `["NounIsElement",["NumberVariable","q"],["SetUnion",["SetComplement",["SetVariable","U"]],["SetCartesianProduct",["SetVariable","V"],["SetVariable","W"]]]]`
   - output: putdown `(in q (union (complement U) (cartesianproduct V W)))`
- Test 10
   - input: JSON `["NounIsElement",["Tuple",["ElementThenSequence",["NumberVariable","a"],["OneElementSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
   - output: putdown `(in (tuple (elts a (elts b))) (cartesianproduct A B))`
- Test 11
   - input: JSON `["NounIsElement",["Vector",["NumberThenSequence",["NumberVariable","a"],["OneNumberSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
   - output: putdown `(in (vector (elts a (elts b))) (cartesianproduct A B))`


### creates the canonical form for "notin" notation

- Test 1
   - input: JSON `["NounIsNotElement",["NumberVariable","a"],["SetVariable","A"]]`
   - output: putdown `(not (in a A))`
- Test 2
   - input: JSON `["LogicalNegation",["NounIsElement","EmptySet","EmptySet"]]`
   - output: putdown `(not (in emptyset emptyset))`
- Test 3
   - input: JSON `["NounIsNotElement",["Subtraction",["Number","3"],["Number","5"]],["SetIntersection",["SetVariable","K"],["SetVariable","P"]]]`
   - output: putdown `(not (in (- 3 5) (intersection K P)))`


### can convert to putdown sentences built from various relations

- Test 1
   - input: JSON `["Disjunction",["LogicVariable","P"],["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]]`
   - output: putdown `(or P (in b B))`
- Test 2
   - input: JSON `["UniversalQuantifier",["NumberVariable","x"],["NounIsElement",["NumberVariable","x"],["SetVariable","X"]]]`
   - output: putdown `(forall (x , (in x X)))`
- Test 3
   - input: JSON `["Conjunction",["SubsetOrEqual",["SetVariable","A"],["SetVariable","B"]],["SubsetOrEqual",["SetVariable","B"],["SetVariable","A"]]]`
   - output: putdown `(and (subseteq A B) (subseteq B A))`
- Test 4
   - input: JSON `["Equals",["NumberVariable","R"],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
   - output: putdown `(= R (cartesianproduct A B))`
- Test 5
   - input: JSON `["UniversalQuantifier",["NumberVariable","n"],["BinaryRelationHolds","Divides",["NumberVariable","n"],["Factorial",["NumberVariable","n"]]]]`
   - output: putdown `(forall (n , (relationholds | n (! n))))`
- Test 6
   - input: JSON `["Implication",["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","a"],["NumberVariable","b"]],["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","b"],["NumberVariable","a"]]]`
   - output: putdown `(implies (relationholds ~ a b) (relationholds ~ b a))`


### can create putdown notation related to functions

- Test 1
   - input: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`
   - output: putdown `(function f A B)`
- Test 2
   - input: JSON `["LogicalNegation",["FunctionSignature",["FunctionVariable","F"],["SetUnion",["SetVariable","X"],["SetVariable","Y"]],["SetVariable","Z"]]]`
   - output: putdown `(not (function F (union X Y) Z))`
- Test 3
   - input: JSON `["FunctionSignature",["FunctionComposition",["FunctionVariable","f"],["FunctionVariable","g"]],["SetVariable","A"],["SetVariable","C"]]`
   - output: putdown `(function (compose f g) A C)`
- Test 4
   - input: JSON `["NumberFunctionApplication",["FunctionVariable","f"],["NumberVariable","x"]]`
   - output: putdown `(apply f x)`
- Test 5
   - input: JSON `["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","f"]],["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","g"]],["Number","10"]]]`
   - output: putdown `(apply (inverse f) (apply (inverse g) 10))`
- Test 6
   - input: JSON `["NumberFunctionApplication",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
   - output: putdown `(apply E (complement L))`
- Test 7
   - input: JSON `["SetIntersection","EmptySet",["SetFunctionApplication",["FunctionVariable","f"],["Number","2"]]]`
   - output: putdown `(intersection emptyset (apply f 2))`
- Test 8
   - input: JSON `["Conjunction",["PropositionFunctionApplication",["FunctionVariable","P"],["NumberVariable","e"]],["PropositionFunctionApplication",["FunctionVariable","Q"],["Addition",["Number","3"],["NumberVariable","b"]]]]`
   - output: putdown `(and (apply P e) (apply Q (+ 3 b)))`
- Test 9
   - input: JSON `["EqualFunctions",["FunctionVariable","F"],["FunctionComposition",["FunctionVariable","G"],["FunctionInverse",["FunctionVariable","H"]]]]`
   - output: putdown `(= F (compose G (inverse H)))`


### can express trigonometric functions correctly

- Test 1
   - input: JSON `["NumberFunctionApplication","SineFunction",["NumberVariable","x"]]`
   - output: putdown `(apply sin x)`
- Test 2
   - input: JSON `["NumberFunctionApplication","CosineFunction",["Multiplication","Pi",["NumberVariable","x"]]]`
   - output: putdown `(apply cos (* pi x))`
- Test 3
   - input: JSON `["NumberFunctionApplication","TangentFunction",["NumberVariable","t"]]`
   - output: putdown `(apply tan t)`
- Test 4
   - input: JSON `["Division",["Number","1"],["NumberFunctionApplication","CotangentFunction","Pi"]]`
   - output: putdown `(/ 1 (apply cot pi))`
- Test 5
   - input: JSON `["Equals",["NumberFunctionApplication","SecantFunction",["NumberVariable","y"]],["NumberFunctionApplication","CosecantFunction",["NumberVariable","y"]]]`
   - output: putdown `(= (apply sec y) (apply csc y))`


### can express logarithms correctly

- Test 1
   - input: JSON `["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]`
   - output: putdown `(apply log n)`
- Test 2
   - input: JSON `["Addition",["Number","1"],["PrefixFunctionApplication","NaturalLogarithm",["NumberVariable","x"]]]`
   - output: putdown `(+ 1 (apply ln x))`
- Test 3
   - input: JSON `["PrefixFunctionApplication",["LogarithmWithBase",["Number","2"]],["Number","1024"]]`
   - output: putdown `(apply (logbase 2) 1024)`
- Test 4
   - input: JSON `["Division",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]],["PrefixFunctionApplication","Logarithm",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]]]`
   - output: putdown `(/ (apply log n) (apply log (apply log n)))`


### can express equivalence classes and expressions that use them

- Test 1
   - input: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
   - output: putdown `(equivclass 1 ~~)`
- Test 2
   - input: JSON `["EquivalenceClass",["Addition",["NumberVariable","x"],["Number","2"]],"GenericBinaryRelation"]`
   - output: putdown `(equivclass (+ x 2) ~)`
- Test 3
   - input: JSON `["SetUnion",["EquivalenceClass",["Number","1"],"ApproximatelyEqual"],["EquivalenceClass",["Number","2"],"ApproximatelyEqual"]]`
   - output: putdown `(union (equivclass 1 ~~) (equivclass 2 ~~))`
- Test 4
   - input: JSON `["NounIsElement",["Number","7"],["EquivalenceClass",["Number","7"],"GenericBinaryRelation"]]`
   - output: putdown `(in 7 (equivclass 7 ~))`
- Test 5
   - input: JSON `["EquivalenceClass",["FunctionVariable","P"],"GenericBinaryRelation"]`
   - output: putdown `(equivclass P ~)`


### can express equivalence and classes mod a number

- Test 1
   - input: JSON `["EquivalentModulo",["Number","5"],["Number","11"],["Number","3"]]`
   - output: putdown `(=mod 5 11 3)`
- Test 2
   - input: JSON `["EquivalentModulo",["NumberVariable","k"],["NumberVariable","m"],["NumberVariable","n"]]`
   - output: putdown `(=mod k m n)`
- Test 3
   - input: JSON `["Subset","EmptySet",["EquivalenceClassModulo",["NumberNegation",["Number","1"]],["Number","10"]]]`
   - output: putdown `(subset emptyset (modclass (- 1) 10))`


### can construct type sentences and combinations of them

- Test 1
   - input: JSON `["HasType",["NumberVariable","x"],"SetType"]`
   - output: putdown `(hastype x settype)`
- Test 2
   - input: JSON `["HasType",["NumberVariable","n"],"NumberType"]`
   - output: putdown `(hastype n numbertype)`
- Test 3
   - input: JSON `["HasType",["NumberVariable","S"],"PartialOrderType"]`
   - output: putdown `(hastype S partialordertype)`
- Test 4
   - input: JSON `["Conjunction",["HasType",["Number","1"],"NumberType"],["HasType",["Number","10"],"NumberType"]]`
   - output: putdown `(and (hastype 1 numbertype) (hastype 10 numbertype))`
- Test 5
   - input: JSON `["Implication",["HasType",["NumberVariable","R"],"EquivalenceRelationType"],["HasType",["NumberVariable","R"],"RelationType"]]`
   - output: putdown `(implies (hastype R equivalencerelationtype) (hastype R relationtype))`


### can create notation for expression function application

- Test 1
   - input: JSON `["NumberEFA",["FunctionVariable","f"],["NumberVariable","x"]]`
   - output: putdown `(efa f x)`
- Test 2
   - input: JSON `["NumberFunctionApplication",["FunctionVariable","F"],["NumberEFA",["FunctionVariable","k"],["Number","10"]]]`
   - output: putdown `(apply F (efa k 10))`
- Test 3
   - input: JSON `["NumberEFA",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
   - output: putdown `(efa E (complement L))`
- Test 4
   - input: JSON `["SetIntersection","EmptySet",["SetEFA",["FunctionVariable","f"],["Number","2"]]]`
   - output: putdown `(intersection emptyset (efa f 2))`
- Test 5
   - input: JSON `["Conjunction",["PropositionEFA",["FunctionVariable","P"],["NumberVariable","x"]],["PropositionEFA",["FunctionVariable","Q"],["NumberVariable","y"]]]`
   - output: putdown `(and (efa P x) (efa Q y))`


### can create notation for assumptions

- Test 1
   - input: JSON `["Given_Variant1",["LogicVariable","X"]]`
   - output: putdown `:X`
- Test 2
   - input: JSON `["Given_Variant2",["LogicVariable","X"]]`
   - output: putdown `:X`
- Test 3
   - input: JSON `["Given_Variant3",["LogicVariable","X"]]`
   - output: putdown `:X`
- Test 4
   - input: JSON `["Given_Variant4",["LogicVariable","X"]]`
   - output: putdown `:X`
- Test 5
   - input: JSON `["Given_Variant1",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: putdown `:(= k 1000)`
- Test 6
   - input: JSON `["Given_Variant2",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: putdown `:(= k 1000)`
- Test 7
   - input: JSON `["Given_Variant3",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: putdown `:(= k 1000)`
- Test 8
   - input: JSON `["Given_Variant4",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: putdown `:(= k 1000)`
- Test 9
   - input: JSON `["Given_Variant1","LogicalTrue"]`
   - output: putdown `:true`
- Test 10
   - input: JSON `["Given_Variant2","LogicalTrue"]`
   - output: putdown `:true`
- Test 11
   - input: JSON `["Given_Variant3","LogicalTrue"]`
   - output: putdown `:true`
- Test 12
   - input: JSON `["Given_Variant4","LogicalTrue"]`
   - output: putdown `:true`


### can create notation for Let-style declarations

- Test 1
   - input: JSON `["Let_Variant1",["NumberVariable","x"]]`
   - output: putdown `:[x]`
- Test 2
   - input: JSON `["Let_Variant1",["NumberVariable","T"]]`
   - output: putdown `:[T]`
- Test 3
   - input: JSON `["LetBeSuchThat_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: putdown `:[x , (> x 0)]`
- Test 4
   - input: JSON `["LetBeSuchThat_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: putdown `:[T , (or (= T 5) (in T S))]`


### can create notation for For Some-style declarations

- Test 1
   - input: JSON `["ForSome_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: putdown `[x , (> x 0)]`
- Test 2
   - input: JSON `["ForSome_Variant2",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: putdown `[x , (> x 0)]`
- Test 3
   - input: JSON `["ForSome_Variant3",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: putdown `[x , (> x 0)]`
- Test 4
   - input: JSON `["ForSome_Variant4",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: putdown `[x , (> x 0)]`
- Test 5
   - input: JSON `["ForSome_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: putdown `[T , (or (= T 5) (in T S))]`
- Test 6
   - input: JSON `["ForSome_Variant2",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: putdown `[T , (or (= T 5) (in T S))]`
- Test 7
   - input: JSON `["ForSome_Variant3",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: putdown `[T , (or (= T 5) (in T S))]`
- Test 8
   - input: JSON `["ForSome_Variant4",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: putdown `[T , (or (= T 5) (in T S))]`


## <a name="Parsing-LaTeX">Parsing LaTeX</a>

### can parse many kinds of numbers to JSON

- Test 1
   - input: LaTeX `0`, typeset $0$
   - output: JSON `["Number","0"]`
- Test 2
   - input: LaTeX `453789`, typeset $453789$
   - output: JSON `["Number","453789"]`
- Test 3
   - input: LaTeX `99999999999999999999999999999999999999999`, typeset $99999999999999999999999999999999999999999$
   - output: JSON `["Number","99999999999999999999999999999999999999999"]`
- Test 4
   - input: LaTeX `-453789`, typeset $-453789$
   - output: JSON `["NumberNegation",["Number","453789"]]`
- Test 5
   - input: LaTeX `-99999999999999999999999999999999999999999`, typeset $-99999999999999999999999999999999999999999$
   - output: JSON `["NumberNegation",["Number","99999999999999999999999999999999999999999"]]`
- Test 6
   - input: LaTeX `0.0`, typeset $0.0$
   - output: JSON `["Number","0.0"]`
- Test 7
   - input: LaTeX `29835.6875940`, typeset $29835.6875940$
   - output: JSON `["Number","29835.6875940"]`
- Test 8
   - input: LaTeX `653280458689.`, typeset $653280458689.$
   - output: JSON `["Number","653280458689."]`
- Test 9
   - input: LaTeX `.000006327589`, typeset $.000006327589$
   - output: JSON `["Number",".000006327589"]`
- Test 10
   - input: LaTeX `-29835.6875940`, typeset $-29835.6875940$
   - output: JSON `["NumberNegation",["Number","29835.6875940"]]`
- Test 11
   - input: LaTeX `-653280458689.`, typeset $-653280458689.$
   - output: JSON `["NumberNegation",["Number","653280458689."]]`
- Test 12
   - input: LaTeX `-.000006327589`, typeset $-.000006327589$
   - output: JSON `["NumberNegation",["Number",".000006327589"]]`


### can parse one-letter variable names to JSON

- Test 1
   - input: LaTeX `foo`, typeset $foo$
   - output: JSON `null`
- Test 2
   - input: LaTeX `bar`, typeset $bar$
   - output: JSON `null`
- Test 3
   - input: LaTeX `to`, typeset $to$
   - output: JSON `null`


### can parse LaTeX numeric constants to JSON

- Test 1
   - input: LaTeX `\infty`, typeset $\infty$
   - output: JSON `"Infinity"`
- Test 2
   - input: LaTeX `\pi`, typeset $\pi$
   - output: JSON `"Pi"`


### can parse exponentiation of atomics to JSON

- Test 1
   - input: LaTeX `1^2`, typeset $1^2$
   - output: JSON `["Exponentiation",["Number","1"],["Number","2"]]`
- Test 2
   - input: LaTeX `e^x`, typeset $e^x$
   - output: JSON `["Exponentiation","EulersNumber",["NumberVariable","x"]]`
- Test 3
   - input: LaTeX `1^\infty`, typeset $1^\infty$
   - output: JSON `["Exponentiation",["Number","1"],"Infinity"]`


### can parse atomic percentages and factorials to JSON

- Test 1
   - input: LaTeX `10\%`, typeset $10\\%$
   - output: JSON `["Percentage",["Number","10"]]`
- Test 2
   - input: LaTeX `t\%`, typeset $t\\%$
   - output: JSON `["Percentage",["NumberVariable","t"]]`
- Test 3
   - input: LaTeX `77!`, typeset $77!$
   - output: JSON `["Factorial",["Number","77"]]`
- Test 4
   - input: LaTeX `y!`, typeset $y!$
   - output: JSON `["Factorial",["NumberVariable","y"]]`


### can parse division of atomics or factors to JSON

- Test 1
   - input: LaTeX `1\div2`, typeset $1\div2$
   - output: JSON `["Division",["Number","1"],["Number","2"]]`
- Test 2
   - input: LaTeX `x\div y`, typeset $x\div y$
   - output: JSON `["Division",["NumberVariable","x"],["NumberVariable","y"]]`
- Test 3
   - input: LaTeX `0\div\infty`, typeset $0\div\infty$
   - output: JSON `["Division",["Number","0"],"Infinity"]`
- Test 4
   - input: LaTeX `x^2\div3`, typeset $x^2\div3$
   - output: JSON `["Division",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
- Test 5
   - input: LaTeX `1\div e^x`, typeset $1\div e^x$
   - output: JSON `["Division",["Number","1"],["Exponentiation","EulersNumber",["NumberVariable","x"]]]`
- Test 6
   - input: LaTeX `10\%\div2^{100}`, typeset $10\\%\div2^{100}$
   - output: JSON `["Division",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`


### can parse multiplication of atomics or factors to JSON

- Test 1
   - input: LaTeX `1\times2`, typeset $1\times2$
   - output: JSON `["Multiplication",["Number","1"],["Number","2"]]`
- Test 2
   - input: LaTeX `x\cdot y`, typeset $x\cdot y$
   - output: JSON `["Multiplication",["NumberVariable","x"],["NumberVariable","y"]]`
- Test 3
   - input: LaTeX `0\times\infty`, typeset $0\times\infty$
   - output: JSON `["Multiplication",["Number","0"],"Infinity"]`
- Test 4
   - input: LaTeX `x^2\cdot3`, typeset $x^2\cdot3$
   - output: JSON `["Multiplication",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
- Test 5
   - input: LaTeX `1\times e^x`, typeset $1\times e^x$
   - output: JSON `["Multiplication",["Number","1"],["Exponentiation","EulersNumber",["NumberVariable","x"]]]`
- Test 6
   - input: LaTeX `10\%\cdot2^{100}`, typeset $10\\%\cdot2^{100}$
   - output: JSON `["Multiplication",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`


### can parse negations of atomics or factors to JSON

- Test 1
   - input: LaTeX `-1\times2`, typeset $-1\times2$
   - output: JSON `["Multiplication",["NumberNegation",["Number","1"]],["Number","2"]]`
- Test 2
   - input: LaTeX `x\cdot{-y}`, typeset $x\cdot{-y}$
   - output: JSON `["Multiplication",["NumberVariable","x"],["NumberNegation",["NumberVariable","y"]]]`
- Test 3
   - input: LaTeX `{-x^2}\cdot{-3}`, typeset ${-x^2}\cdot{-3}$
   - output: JSON `["Multiplication",["NumberNegation",["Exponentiation",["NumberVariable","x"],["Number","2"]]],["NumberNegation",["Number","3"]]]`
- Test 4
   - input: LaTeX `(-x^2)\cdot(-3)`, typeset $(-x^2)\cdot(-3)$
   - output: JSON `["Multiplication",["NumberNegation",["Exponentiation",["NumberVariable","x"],["Number","2"]]],["NumberNegation",["Number","3"]]]`
- Test 5
   - input: LaTeX `----1000`, typeset $----1000$
   - output: JSON `["NumberNegation",["NumberNegation",["NumberNegation",["NumberNegation",["Number","1000"]]]]]`


### can convert additions and subtractions to JSON

- Test 1
   - input: LaTeX `x+y`, typeset $x+y$
   - output: JSON `["Addition",["NumberVariable","x"],["NumberVariable","y"]]`
- Test 2
   - input: LaTeX `1--3`, typeset $1--3$
   - output: JSON `["Subtraction",["Number","1"],["NumberNegation",["Number","3"]]]`


### can parse number expressions with groupers to JSON

- Test 1
   - input: LaTeX `-{1\times2}`, typeset $-{1\times2}$
   - output: JSON `["NumberNegation",["Multiplication",["Number","1"],["Number","2"]]]`
- Test 2
   - input: LaTeX `-(1\times2)`, typeset $-(1\times2)$
   - output: JSON `["NumberNegation",["Multiplication",["Number","1"],["Number","2"]]]`
- Test 3
   - input: LaTeX `(N-1)!`, typeset $(N-1)!$
   - output: JSON `["Factorial",["Subtraction",["NumberVariable","N"],["Number","1"]]]`
- Test 4
   - input: LaTeX `\left(N-1\right)!`, typeset $\left(N-1\right)!$
   - output: JSON `["Factorial",["Subtraction",["NumberVariable","N"],["Number","1"]]]`
- Test 5
   - input: LaTeX `\left(N-1)!`, typeset $\left(N-1)!$
   - output: JSON `null`
- Test 6
   - input: LaTeX `(N-1\right)!`, typeset $(N-1\right)!$
   - output: JSON `null`
- Test 7
   - input: LaTeX `{-x}^{2\cdot{-3}}`, typeset ${-x}^{2\cdot{-3}}$
   - output: JSON `["Exponentiation",["NumberNegation",["NumberVariable","x"]],["Multiplication",["Number","2"],["NumberNegation",["Number","3"]]]]`
- Test 8
   - input: LaTeX `(-x)^(2\cdot(-3))`, typeset $(-x)^(2\cdot(-3))$
   - output: JSON `["Exponentiation",["NumberNegation",["NumberVariable","x"]],["Multiplication",["Number","2"],["NumberNegation",["Number","3"]]]]`
- Test 9
   - input: LaTeX `(-x)^{2\cdot(-3)}`, typeset $(-x)^{2\cdot(-3)}$
   - output: JSON `["Exponentiation",["NumberNegation",["NumberVariable","x"]],["Multiplication",["Number","2"],["NumberNegation",["Number","3"]]]]`
- Test 10
   - input: LaTeX `A^B+(C-D)`, typeset $A^B+(C-D)$
   - output: JSON `["Addition",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]],["Subtraction",["NumberVariable","C"],["NumberVariable","D"]]]`
- Test 11
   - input: LaTeX `A^B+\left(C-D\right)`, typeset $A^B+\left(C-D\right)$
   - output: JSON `["Addition",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]],["Subtraction",["NumberVariable","C"],["NumberVariable","D"]]]`
- Test 12
   - input: LaTeX `k^{1-y}\cdot(2+k)`, typeset $k^{1-y}\cdot(2+k)$
   - output: JSON `["Multiplication",["Exponentiation",["NumberVariable","k"],["Subtraction",["Number","1"],["NumberVariable","y"]]],["Addition",["Number","2"],["NumberVariable","k"]]]`


### can parse relations of numeric expressions to JSON

- Test 1
   - input: LaTeX `1>2`, typeset $1>2$
   - output: JSON `["GreaterThan",["Number","1"],["Number","2"]]`
- Test 2
   - input: LaTeX `1\gt2`, typeset $1\gt2$
   - output: JSON `["GreaterThan",["Number","1"],["Number","2"]]`
- Test 3
   - input: LaTeX `1-2<1+2`, typeset $1-2<1+2$
   - output: JSON `["LessThan",["Subtraction",["Number","1"],["Number","2"]],["Addition",["Number","1"],["Number","2"]]]`
- Test 4
   - input: LaTeX `1-2\lt1+2`, typeset $1-2\lt1+2$
   - output: JSON `["LessThan",["Subtraction",["Number","1"],["Number","2"]],["Addition",["Number","1"],["Number","2"]]]`
- Test 5
   - input: LaTeX `\neg 1=2`, typeset $\neg 1=2$
   - output: JSON `["LogicalNegation",["Equals",["Number","1"],["Number","2"]]]`
- Test 6
   - input: LaTeX `2\ge1\wedge2\le3`, typeset $2\ge1\wedge2\le3$
   - output: JSON `["Conjunction",["GreaterThanOrEqual",["Number","2"],["Number","1"]],["LessThanOrEqual",["Number","2"],["Number","3"]]]`
- Test 7
   - input: LaTeX `2\geq1\wedge2\leq3`, typeset $2\geq1\wedge2\leq3$
   - output: JSON `["Conjunction",["GreaterThanOrEqual",["Number","2"],["Number","1"]],["LessThanOrEqual",["Number","2"],["Number","3"]]]`
- Test 8
   - input: LaTeX `7|14`, typeset $7|14$
   - output: JSON `["BinaryRelationHolds","Divides",["Number","7"],["Number","14"]]`
- Test 9
   - input: LaTeX `7\vert14`, typeset $7\vert14$
   - output: JSON `["BinaryRelationHolds","Divides",["Number","7"],["Number","14"]]`
- Test 10
   - input: LaTeX `A(k) | n!`, typeset $A(k) | n!$
   - output: JSON `["BinaryRelationHolds","Divides",["NumberFunctionApplication",["FunctionVariable","A"],["NumberVariable","k"]],["Factorial",["NumberVariable","n"]]]`
- Test 11
   - input: LaTeX `A(k) \vert n!`, typeset $A(k) \vert n!$
   - output: JSON `["BinaryRelationHolds","Divides",["NumberFunctionApplication",["FunctionVariable","A"],["NumberVariable","k"]],["Factorial",["NumberVariable","n"]]]`
- Test 12
   - input: LaTeX `1-k \sim 1+k`, typeset $1-k \sim 1+k$
   - output: JSON `["BinaryRelationHolds","GenericBinaryRelation",["Subtraction",["Number","1"],["NumberVariable","k"]],["Addition",["Number","1"],["NumberVariable","k"]]]`
- Test 13
   - input: LaTeX `0.99\approx1.01`, typeset $0.99\approx1.01$
   - output: JSON `["BinaryRelationHolds","ApproximatelyEqual",["Number","0.99"],["Number","1.01"]]`


### converts inequality to its placeholder concept

- Test 1
   - input: LaTeX `1\ne2`, typeset $1\ne2$
   - output: JSON `["NotEqual",["Number","1"],["Number","2"]]`
- Test 2
   - input: LaTeX `1\neq2`, typeset $1\neq2$
   - output: JSON `["NotEqual",["Number","1"],["Number","2"]]`


### can parse propositional logic atomics to JSON

- Test 1
   - input: LaTeX `\top`, typeset $\top$
   - output: JSON `"LogicalTrue"`
- Test 2
   - input: LaTeX `\bot`, typeset $\bot$
   - output: JSON `"LogicalFalse"`
- Test 3
   - input: LaTeX `\rightarrow\leftarrow`, typeset $\rightarrow\leftarrow$
   - output: JSON `"Contradiction"`


### can parse propositional logic conjuncts to JSON

- Test 1
   - input: LaTeX `\top\wedge\bot`, typeset $\top\wedge\bot$
   - output: JSON `["Conjunction","LogicalTrue","LogicalFalse"]`
- Test 2
   - input: LaTeX `\neg P\wedge\neg\top`, typeset $\neg P\wedge\neg\top$
   - output: JSON `["Conjunction",["LogicalNegation",["LogicVariable","P"]],["LogicalNegation","LogicalTrue"]]`


### can parse propositional logic disjuncts to JSON

- Test 1
   - input: LaTeX `\top\vee \neg A`, typeset $\top\vee \neg A$
   - output: JSON `["Disjunction","LogicalTrue",["LogicalNegation",["LogicVariable","A"]]]`
- Test 2
   - input: LaTeX `P\wedge Q\vee Q\wedge P`, typeset $P\wedge Q\vee Q\wedge P$
   - output: JSON `["Disjunction",["Conjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]]`


### can parse propositional logic conditionals to JSON

- Test 1
   - input: LaTeX `A\Rightarrow Q\wedge\neg P`, typeset $A\Rightarrow Q\wedge\neg P$
   - output: JSON `["Implication",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
- Test 2
   - input: LaTeX `P\vee Q\Rightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Rightarrow Q\wedge P\Rightarrow T$
   - output: JSON `["Implication",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Implication",["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]],["LogicVariable","T"]]]`


### can parse propositional logic biconditionals to JSON

- Test 1
   - input: LaTeX `A\Leftrightarrow Q\wedge\neg P`, typeset $A\Leftrightarrow Q\wedge\neg P$
   - output: JSON `["LogicalEquivalence",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`


### can parse propositional expressions with groupers to JSON

- Test 1
   - input: LaTeX `P\lor {Q\Leftrightarrow Q}\land P`, typeset $P\lor {Q\Leftrightarrow Q}\land P$
   - output: JSON `["Disjunction",["LogicVariable","P"],["Conjunction",["LogicalEquivalence",["LogicVariable","Q"],["LogicVariable","Q"]],["LogicVariable","P"]]]`
- Test 2
   - input: LaTeX `\lnot{\top\Leftrightarrow\bot}`, typeset $\lnot{\top\Leftrightarrow\bot}$
   - output: JSON `["LogicalNegation",["LogicalEquivalence","LogicalTrue","LogicalFalse"]]`
- Test 3
   - input: LaTeX `\lnot\left(\top\Leftrightarrow\bot\right)`, typeset $\lnot\left(\top\Leftrightarrow\bot\right)$
   - output: JSON `["LogicalNegation",["LogicalEquivalence","LogicalTrue","LogicalFalse"]]`
- Test 4
   - input: LaTeX `\lnot(\top\Leftrightarrow\bot)`, typeset $\lnot(\top\Leftrightarrow\bot)$
   - output: JSON `["LogicalNegation",["LogicalEquivalence","LogicalTrue","LogicalFalse"]]`


### can parse simple predicate logic expressions to JSON

- Test 1
   - input: LaTeX `\forall x, P`, typeset $\forall x, P$
   - output: JSON `["UniversalQuantifier",["NumberVariable","x"],["LogicVariable","P"]]`
- Test 2
   - input: LaTeX `\exists t,\neg Q`, typeset $\exists t,\neg Q$
   - output: JSON `["ExistentialQuantifier",["NumberVariable","t"],["LogicalNegation",["LogicVariable","Q"]]]`
- Test 3
   - input: LaTeX `\exists! k,m\Rightarrow n`, typeset $\exists! k,m\Rightarrow n$
   - output: JSON `["UniqueExistentialQuantifier",["NumberVariable","k"],["Implication",["LogicVariable","m"],["LogicVariable","n"]]]`


### can convert finite and empty sets to JSON

- Test 1
   - input: LaTeX `\emptyset`, typeset $\emptyset$
   - output: JSON `"EmptySet"`
- Test 2
   - input: LaTeX `\{\}`, typeset $\{\}$
   - output: JSON `"EmptySet"`
- Test 3
   - input: LaTeX `\{ \}`, typeset $\{ \}$
   - output: JSON `"EmptySet"`
- Test 4
   - input: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
   - output: JSON `["FiniteSet",["OneElementSequence",["Number","1"]]]`
- Test 5
   - input: LaTeX `\left\{ 1 \right\}`, typeset $\left\{ 1 \right\}$
   - output: JSON `["FiniteSet",["OneElementSequence",["Number","1"]]]`
- Test 6
   - input: LaTeX `\{1,2\}`, typeset $\{1,2\}$
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]`
- Test 7
   - input: LaTeX `\{1, 2,   3 \}`, typeset $\{1, 2,   3 \}$
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["OneElementSequence",["Number","3"]]]]]`
- Test 8
   - input: LaTeX `\{\{\},\emptyset\}`, typeset $\{\{\},\emptyset\}$
   - output: JSON `["FiniteSet",["ElementThenSequence","EmptySet",["OneElementSequence","EmptySet"]]]`
- Test 9
   - input: LaTeX `\{\{\emptyset\}\}`, typeset $\{\{\emptyset\}\}$
   - output: JSON `["FiniteSet",["OneElementSequence",["FiniteSet",["OneElementSequence","EmptySet"]]]]`
- Test 10
   - input: LaTeX `\{ 3,x \}`, typeset $\{ 3,x \}$
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","3"],["OneElementSequence",["NumberVariable","x"]]]]`
- Test 11
   - input: LaTeX `\left\{ 3,x \right\}`, typeset $\left\{ 3,x \right\}$
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","3"],["OneElementSequence",["NumberVariable","x"]]]]`
- Test 12
   - input: LaTeX `\{ A\cup B, A\cap B \}`, typeset $\{ A\cup B, A\cap B \}$
   - output: JSON `["FiniteSet",["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["SetIntersection",["SetVariable","A"],["SetVariable","B"]]]]]`
- Test 13
   - input: LaTeX `\{ 1, 2, \emptyset, K, P \}`, typeset $\{ 1, 2, \emptyset, K, P \}$
   - output: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["ElementThenSequence","EmptySet",["ElementThenSequence",["NumberVariable","K"],["OneElementSequence",["NumberVariable","P"]]]]]]]`


### can convert tuples and vectors to JSON

- Test 1
   - input: LaTeX `(5,6)`, typeset $(5,6)$
   - output: JSON `["Tuple",["ElementThenSequence",["Number","5"],["OneElementSequence",["Number","6"]]]]`
- Test 2
   - input: LaTeX `(5,A\cup B,k)`, typeset $(5,A\cup B,k)$
   - output: JSON `["Tuple",["ElementThenSequence",["Number","5"],["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["NumberVariable","k"]]]]]`
- Test 3
   - input: LaTeX `\langle5,6\rangle`, typeset $\langle5,6\rangle$
   - output: JSON `["Vector",["NumberThenSequence",["Number","5"],["OneNumberSequence",["Number","6"]]]]`
- Test 4
   - input: LaTeX `\langle5,-7,k\rangle`, typeset $\langle5,-7,k\rangle$
   - output: JSON `["Vector",["NumberThenSequence",["Number","5"],["NumberThenSequence",["NumberNegation",["Number","7"]],["OneNumberSequence",["NumberVariable","k"]]]]]`
- Test 5
   - input: LaTeX `()`, typeset $()$
   - output: JSON `null`
- Test 6
   - input: LaTeX `(())`, typeset $(())$
   - output: JSON `null`
- Test 7
   - input: LaTeX `(3)`, typeset $(3)$
   - output: JSON `["Number","3"]`
- Test 8
   - input: LaTeX `\langle\rangle`, typeset $\langle\rangle$
   - output: JSON `null`
- Test 9
   - input: LaTeX `\langle3\rangle`, typeset $\langle3\rangle$
   - output: JSON `null`
- Test 10
   - input: LaTeX `((1,2),6)`, typeset $((1,2),6)$
   - output: JSON `["Tuple",["ElementThenSequence",["Tuple",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]],["OneElementSequence",["Number","6"]]]]`
- Test 11
   - input: LaTeX `\langle(1,2),6\rangle`, typeset $\langle(1,2),6\rangle$
   - output: JSON `null`
- Test 12
   - input: LaTeX `\langle\langle1,2\rangle,6\rangle`, typeset $\langle\langle1,2\rangle,6\rangle$
   - output: JSON `null`
- Test 13
   - input: LaTeX `\langle A\cup B,6\rangle`, typeset $\langle A\cup B,6\rangle$
   - output: JSON `null`


### can convert simple set memberships and subsets to JSON

- Test 1
   - input: LaTeX `b\in B`, typeset $b\in B$
   - output: JSON `["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]`
- Test 2
   - input: LaTeX `2\in\{1,2\}`, typeset $2\in\{1,2\}$
   - output: JSON `["NounIsElement",["Number","2"],["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]]`
- Test 3
   - input: LaTeX `X\in a\cup b`, typeset $X\in a\cup b$
   - output: JSON `["NounIsElement",["NumberVariable","X"],["SetUnion",["SetVariable","a"],["SetVariable","b"]]]`
- Test 4
   - input: LaTeX `A\cup B\in X\cup Y`, typeset $A\cup B\in X\cup Y$
   - output: JSON `["NounIsElement",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["SetUnion",["SetVariable","X"],["SetVariable","Y"]]]`
- Test 5
   - input: LaTeX `A\subset\bar B`, typeset $A\subset\bar B$
   - output: JSON `["Subset",["SetVariable","A"],["SetComplement",["SetVariable","B"]]]`
- Test 6
   - input: LaTeX `A\subset B'`, typeset $A\subset B'$
   - output: JSON `["Subset",["SetVariable","A"],["SetComplement",["SetVariable","B"]]]`
- Test 7
   - input: LaTeX `u\cap v\subseteq u\cup v`, typeset $u\cap v\subseteq u\cup v$
   - output: JSON `["SubsetOrEqual",["SetIntersection",["SetVariable","u"],["SetVariable","v"]],["SetUnion",["SetVariable","u"],["SetVariable","v"]]]`
- Test 8
   - input: LaTeX `\{1\}\subseteq\{1\}\cup\{2\}`, typeset $\{1\}\subseteq\{1\}\cup\{2\}$
   - output: JSON `["SubsetOrEqual",["FiniteSet",["OneElementSequence",["Number","1"]]],["SetUnion",["FiniteSet",["OneElementSequence",["Number","1"]]],["FiniteSet",["OneElementSequence",["Number","2"]]]]]`
- Test 9
   - input: LaTeX `p\in U\times V`, typeset $p\in U\times V$
   - output: JSON `["NounIsElement",["NumberVariable","p"],["SetCartesianProduct",["SetVariable","U"],["SetVariable","V"]]]`
- Test 10
   - input: LaTeX `q \in U'\cup V\times W`, typeset $q \in U'\cup V\times W$
   - output: JSON `["NounIsElement",["NumberVariable","q"],["SetUnion",["SetComplement",["SetVariable","U"]],["SetCartesianProduct",["SetVariable","V"],["SetVariable","W"]]]]`
- Test 11
   - input: LaTeX `(a,b)\in A\times B`, typeset $(a,b)\in A\times B$
   - output: JSON `["NounIsElement",["Tuple",["ElementThenSequence",["NumberVariable","a"],["OneElementSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
- Test 12
   - input: LaTeX `\langle a,b\rangle\in A\times B`, typeset $\langle a,b\rangle\in A\times B$
   - output: JSON `["NounIsElement",["Vector",["NumberThenSequence",["NumberVariable","a"],["OneNumberSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`


### converts "notin" notation to its placeholder concept

- Test 1
   - input: LaTeX `a\notin A`, typeset $a\notin A$
   - output: JSON `["NounIsNotElement",["NumberVariable","a"],["SetVariable","A"]]`
- Test 2
   - input: LaTeX `\emptyset\notin\emptyset`, typeset $\emptyset\notin\emptyset$
   - output: JSON `["NounIsNotElement","EmptySet","EmptySet"]`
- Test 3
   - input: LaTeX `3-5 \notin K\cap P`, typeset $3-5 \notin K\cap P$
   - output: JSON `["NounIsNotElement",["Subtraction",["Number","3"],["Number","5"]],["SetIntersection",["SetVariable","K"],["SetVariable","P"]]]`


### can parse to JSON sentences built from various relations

- Test 1
   - input: LaTeX `P\vee b\in B`, typeset $P\vee b\in B$
   - output: JSON `["Disjunction",["LogicVariable","P"],["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]]`
- Test 2
   - input: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
   - output: JSON `["PropositionIsElement",["Disjunction",["LogicVariable","P"],["LogicVariable","b"]],["SetVariable","B"]]`
- Test 3
   - input: LaTeX `\forall x, x\in X`, typeset $\forall x, x\in X$
   - output: JSON `["UniversalQuantifier",["NumberVariable","x"],["NounIsElement",["NumberVariable","x"],["SetVariable","X"]]]`
- Test 4
   - input: LaTeX `A\subseteq B\wedge B\subseteq A`, typeset $A\subseteq B\wedge B\subseteq A$
   - output: JSON `["Conjunction",["SubsetOrEqual",["SetVariable","A"],["SetVariable","B"]],["SubsetOrEqual",["SetVariable","B"],["SetVariable","A"]]]`
- Test 5
   - input: LaTeX `R = A\cup B`, typeset $R = A\cup B$
   - output: JSON `["Equals",["NumberVariable","R"],["SetUnion",["SetVariable","A"],["SetVariable","B"]]]`
- Test 6
   - input: LaTeX `\forall n, n|n!`, typeset $\forall n, n|n!$
   - output: JSON `["UniversalQuantifier",["NumberVariable","n"],["BinaryRelationHolds","Divides",["NumberVariable","n"],["Factorial",["NumberVariable","n"]]]]`
- Test 7
   - input: LaTeX `a\sim b\Rightarrow b\sim a`, typeset $a\sim b\Rightarrow b\sim a$
   - output: JSON `["Implication",["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","a"],["NumberVariable","b"]],["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","b"],["NumberVariable","a"]]]`


### can parse notation related to functions

- Test 1
   - input: LaTeX `f:A\to B`, typeset $f:A\to B$
   - output: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`
- Test 2
   - input: LaTeX `f\colon A\to B`, typeset $f\colon A\to B$
   - output: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`
- Test 3
   - input: LaTeX `\neg F:X\cup Y\rightarrow Z`, typeset $\neg F:X\cup Y\rightarrow Z$
   - output: JSON `["LogicalNegation",["FunctionSignature",["FunctionVariable","F"],["SetUnion",["SetVariable","X"],["SetVariable","Y"]],["SetVariable","Z"]]]`
- Test 4
   - input: LaTeX `\neg F\colon X\cup Y\rightarrow Z`, typeset $\neg F\colon X\cup Y\rightarrow Z$
   - output: JSON `["LogicalNegation",["FunctionSignature",["FunctionVariable","F"],["SetUnion",["SetVariable","X"],["SetVariable","Y"]],["SetVariable","Z"]]]`
- Test 5
   - input: LaTeX `f\circ g:A\to C`, typeset $f\circ g:A\to C$
   - output: JSON `["FunctionSignature",["FunctionComposition",["FunctionVariable","f"],["FunctionVariable","g"]],["SetVariable","A"],["SetVariable","C"]]`
- Test 6
   - input: LaTeX `f(x)`, typeset $f(x)$
   - output: JSON `["NumberFunctionApplication",["FunctionVariable","f"],["NumberVariable","x"]]`
- Test 7
   - input: LaTeX `f^{-1}(g^{-1}(10))`, typeset $f^{-1}(g^{-1}(10))$
   - output: JSON `["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","f"]],["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","g"]],["Number","10"]]]`
- Test 8
   - input: LaTeX `E(L')`, typeset $E(L')$
   - output: JSON `["NumberFunctionApplication",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
- Test 9
   - input: LaTeX `\emptyset\cap f(2)`, typeset $\emptyset\cap f(2)$
   - output: JSON `["SetIntersection","EmptySet",["SetFunctionApplication",["FunctionVariable","f"],["Number","2"]]]`
- Test 10
   - input: LaTeX `P(e)\wedge Q(3+b)`, typeset $P(e)\wedge Q(3+b)$
   - output: JSON `["Conjunction",["PropositionFunctionApplication",["FunctionVariable","P"],"EulersNumber"],["PropositionFunctionApplication",["FunctionVariable","Q"],["Addition",["Number","3"],["NumberVariable","b"]]]]`
- Test 11
   - input: LaTeX `F=G\circ H^{-1}`, typeset $F=G\circ H^{-1}$
   - output: JSON `["EqualFunctions",["FunctionVariable","F"],["FunctionComposition",["FunctionVariable","G"],["FunctionInverse",["FunctionVariable","H"]]]]`


### can parse trigonometric functions correctly

- Test 1
   - input: LaTeX `\sin x`, typeset $\sin x$
   - output: JSON `["PrefixFunctionApplication","SineFunction",["NumberVariable","x"]]`
- Test 2
   - input: LaTeX `\cos\pi\cdot x`, typeset $\cos\pi\cdot x$
   - output: JSON `["PrefixFunctionApplication","CosineFunction",["Multiplication","Pi",["NumberVariable","x"]]]`
- Test 3
   - input: LaTeX `\tan t`, typeset $\tan t$
   - output: JSON `["PrefixFunctionApplication","TangentFunction",["NumberVariable","t"]]`
- Test 4
   - input: LaTeX `1\div\cot\pi`, typeset $1\div\cot\pi$
   - output: JSON `["Division",["Number","1"],["PrefixFunctionApplication","CotangentFunction","Pi"]]`
- Test 5
   - input: LaTeX `\sec y=\csc y`, typeset $\sec y=\csc y$
   - output: JSON `["Equals",["PrefixFunctionApplication","SecantFunction",["NumberVariable","y"]],["PrefixFunctionApplication","CosecantFunction",["NumberVariable","y"]]]`


### can parse logarithms correctly

- Test 1
   - input: LaTeX `\log n`, typeset $\log n$
   - output: JSON `["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]`
- Test 2
   - input: LaTeX `1+\ln{x}`, typeset $1+\ln{x}$
   - output: JSON `["Addition",["Number","1"],["PrefixFunctionApplication","NaturalLogarithm",["NumberVariable","x"]]]`
- Test 3
   - input: LaTeX `\log_2 1024`, typeset $\log_2 1024$
   - output: JSON `["PrefixFunctionApplication",["LogarithmWithBase",["Number","2"]],["Number","1024"]]`
- Test 4
   - input: LaTeX `\log_{2}{1024}`, typeset $\log_{2}{1024}$
   - output: JSON `["PrefixFunctionApplication",["LogarithmWithBase",["Number","2"]],["Number","1024"]]`
- Test 5
   - input: LaTeX `\log n \div \log\log n`, typeset $\log n \div \log\log n$
   - output: JSON `["Division",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]],["PrefixFunctionApplication","Logarithm",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]]]`


### can parse equivalence classes and treat them as sets

- Test 1
   - input: LaTeX `[1,\approx]`, typeset $[1,\approx]$
   - output: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
- Test 2
   - input: LaTeX `\left[1,\approx\right]`, typeset $\left[1,\approx\right]$
   - output: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
- Test 3
   - input: LaTeX `\lbrack1,\approx\rbrack`, typeset $\lbrack1,\approx\rbrack$
   - output: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
- Test 4
   - input: LaTeX `\left\lbrack1,\approx\right\rbrack`, typeset $\left\lbrack1,\approx\right\rbrack$
   - output: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
- Test 5
   - input: LaTeX `\left[1,\approx]`, typeset $\left[1,\approx]$
   - output: JSON `null`
- Test 6
   - input: LaTeX `[1,\approx\right]`, typeset $[1,\approx\right]$
   - output: JSON `null`
- Test 7
   - input: LaTeX `[x+2,\sim]`, typeset $[x+2,\sim]$
   - output: JSON `["EquivalenceClass",["Addition",["NumberVariable","x"],["Number","2"]],"GenericBinaryRelation"]`
- Test 8
   - input: LaTeX `[1,\approx]\cup[2,\approx]`, typeset $[1,\approx]\cup[2,\approx]$
   - output: JSON `["SetUnion",["EquivalenceClass",["Number","1"],"ApproximatelyEqual"],["EquivalenceClass",["Number","2"],"ApproximatelyEqual"]]`
- Test 9
   - input: LaTeX `7\in[7,\sim]`, typeset $7\in[7,\sim]$
   - output: JSON `["NounIsElement",["Number","7"],["EquivalenceClass",["Number","7"],"GenericBinaryRelation"]]`
- Test 10
   - input: LaTeX `[P]`, typeset $[P]$
   - output: JSON `["GenericEquivalenceClass",["NumberVariable","P"]]`
- Test 11
   - input: LaTeX `\left[P\right]`, typeset $\left[P\right]$
   - output: JSON `["GenericEquivalenceClass",["NumberVariable","P"]]`


### can parse equivalence and classes mod a number

- Test 1
   - input: LaTeX `5\equiv11\mod3`, typeset $5\equiv11\mod3$
   - output: JSON `["EquivalentModulo",["Number","5"],["Number","11"],["Number","3"]]`
- Test 2
   - input: LaTeX `5\equiv_3 11`, typeset $5\equiv_3 11$
   - output: JSON `["EquivalentModulo",["Number","5"],["Number","11"],["Number","3"]]`
- Test 3
   - input: LaTeX `k \equiv m \mod n`, typeset $k \equiv m \mod n$
   - output: JSON `["EquivalentModulo",["NumberVariable","k"],["NumberVariable","m"],["NumberVariable","n"]]`
- Test 4
   - input: LaTeX `k \equiv_n m`, typeset $k \equiv_n m$
   - output: JSON `["EquivalentModulo",["NumberVariable","k"],["NumberVariable","m"],["NumberVariable","n"]]`
- Test 5
   - input: LaTeX `k \equiv_{n} m`, typeset $k \equiv_{n} m$
   - output: JSON `["EquivalentModulo",["NumberVariable","k"],["NumberVariable","m"],["NumberVariable","n"]]`
- Test 6
   - input: LaTeX `\emptyset \subset [-1,\equiv_10]`, typeset $\emptyset \subset [-1,\equiv_10]$
   - output: JSON `["Subset","EmptySet",["EquivalenceClassModulo",["NumberNegation",["Number","1"]],["Number","10"]]]`
- Test 7
   - input: LaTeX `\emptyset \subset \left[-1,\equiv_10\right]`, typeset $\emptyset \subset \left[-1,\equiv_10\right]$
   - output: JSON `["Subset","EmptySet",["EquivalenceClassModulo",["NumberNegation",["Number","1"]],["Number","10"]]]`


### can parse type sentences and combinations of them

- Test 1
   - input: LaTeX `x \text{is a set}`, typeset $x \text{is a set}$
   - output: JSON `["HasType",["NumberVariable","x"],"SetType"]`
- Test 2
   - input: LaTeX `n \text{is }\text{a number}`, typeset $n \text{is }\text{a number}$
   - output: JSON `["HasType",["NumberVariable","n"],"NumberType"]`
- Test 3
   - input: LaTeX `S\text{is}~\text{a partial order}`, typeset $S\text{is}~\text{a partial order}$
   - output: JSON `["HasType",["NumberVariable","S"],"PartialOrderType"]`
- Test 4
   - input: LaTeX `1\text{is a number}\wedge 10\text{is a number}`, typeset $1\text{is a number}\wedge 10\text{is a number}$
   - output: JSON `["Conjunction",["HasType",["Number","1"],"NumberType"],["HasType",["Number","10"],"NumberType"]]`
- Test 5
   - input: LaTeX `R\text{is an equivalence relation}\Rightarrow R\text{is a relation}`, typeset $R\text{is an equivalence relation}\Rightarrow R\text{is a relation}$
   - output: JSON `["Implication",["HasType",["NumberVariable","R"],"EquivalenceRelationType"],["HasType",["NumberVariable","R"],"RelationType"]]`


### can parse notation for expression function application

- Test 1
   - input: LaTeX `\mathcal{f}(x)`, typeset $\mathcal{f}(x)$
   - output: JSON `["NumberEFA",["FunctionVariable","f"],["NumberVariable","x"]]`
- Test 2
   - input: LaTeX `F(\mathcal{k}(10))`, typeset $F(\mathcal{k}(10))$
   - output: JSON `["NumberFunctionApplication",["FunctionVariable","F"],["NumberEFA",["FunctionVariable","k"],["Number","10"]]]`
- Test 3
   - input: LaTeX `\mathcal{E}(L')`, typeset $\mathcal{E}(L')$
   - output: JSON `["NumberEFA",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
- Test 4
   - input: LaTeX `\emptyset\cap\mathcal{f}(2)`, typeset $\emptyset\cap\mathcal{f}(2)$
   - output: JSON `["SetIntersection","EmptySet",["SetEFA",["FunctionVariable","f"],["Number","2"]]]`
- Test 5
   - input: LaTeX `\mathcal{P}(x)\wedge\mathcal{Q}(y)`, typeset $\mathcal{P}(x)\wedge\mathcal{Q}(y)$
   - output: JSON `["Conjunction",["PropositionEFA",["FunctionVariable","P"],["NumberVariable","x"]],["PropositionEFA",["FunctionVariable","Q"],["NumberVariable","y"]]]`


### can parse notation for assumptions

- Test 1
   - input: LaTeX `\text{Assume }X`, typeset $\text{Assume }X$
   - output: JSON `["Given_Variant1",["LogicVariable","X"]]`
- Test 2
   - input: LaTeX `\text{assume }X`, typeset $\text{assume }X$
   - output: JSON `["Given_Variant2",["LogicVariable","X"]]`
- Test 3
   - input: LaTeX `\text{Given }X`, typeset $\text{Given }X$
   - output: JSON `["Given_Variant3",["LogicVariable","X"]]`
- Test 4
   - input: LaTeX `\text{given }X`, typeset $\text{given }X$
   - output: JSON `["Given_Variant4",["LogicVariable","X"]]`
- Test 5
   - input: LaTeX `\text{Assume }k=1000`, typeset $\text{Assume }k=1000$
   - output: JSON `["Given_Variant1",["Equals",["NumberVariable","k"],["Number","1000"]]]`
- Test 6
   - input: LaTeX `\text{assume }k=1000`, typeset $\text{assume }k=1000$
   - output: JSON `["Given_Variant2",["Equals",["NumberVariable","k"],["Number","1000"]]]`
- Test 7
   - input: LaTeX `\text{Given }k=1000`, typeset $\text{Given }k=1000$
   - output: JSON `["Given_Variant3",["Equals",["NumberVariable","k"],["Number","1000"]]]`
- Test 8
   - input: LaTeX `\text{given }k=1000`, typeset $\text{given }k=1000$
   - output: JSON `["Given_Variant4",["Equals",["NumberVariable","k"],["Number","1000"]]]`
- Test 9
   - input: LaTeX `\text{Assume }\top`, typeset $\text{Assume }\top$
   - output: JSON `["Given_Variant1","LogicalTrue"]`
- Test 10
   - input: LaTeX `\text{assume }\top`, typeset $\text{assume }\top$
   - output: JSON `["Given_Variant2","LogicalTrue"]`
- Test 11
   - input: LaTeX `\text{Given }\top`, typeset $\text{Given }\top$
   - output: JSON `["Given_Variant3","LogicalTrue"]`
- Test 12
   - input: LaTeX `\text{given }\top`, typeset $\text{given }\top$
   - output: JSON `["Given_Variant4","LogicalTrue"]`
- Test 13
   - input: LaTeX `\text{Assume }50`, typeset $\text{Assume }50$
   - output: JSON `null`
- Test 14
   - input: LaTeX `\text{assume }(5,6)`, typeset $\text{assume }(5,6)$
   - output: JSON `null`
- Test 15
   - input: LaTeX `\text{Given }f\circ g`, typeset $\text{Given }f\circ g$
   - output: JSON `null`
- Test 16
   - input: LaTeX `\text{given }\emptyset`, typeset $\text{given }\emptyset$
   - output: JSON `null`
- Test 17
   - input: LaTeX `\text{Assume }\infty`, typeset $\text{Assume }\infty$
   - output: JSON `null`


### can parse notation for Let-style declarations

- Test 1
   - input: LaTeX `\text{Let }x`, typeset $\text{Let }x$
   - output: JSON `["Let_Variant1",["NumberVariable","x"]]`
- Test 2
   - input: LaTeX `\text{let }x`, typeset $\text{let }x$
   - output: JSON `["Let_Variant2",["NumberVariable","x"]]`
- Test 3
   - input: LaTeX `\text{Let }T`, typeset $\text{Let }T$
   - output: JSON `["Let_Variant1",["NumberVariable","T"]]`
- Test 4
   - input: LaTeX `\text{let }T`, typeset $\text{let }T$
   - output: JSON `["Let_Variant2",["NumberVariable","T"]]`
- Test 5
   - input: LaTeX `\text{Let }x \text{ be such that }x>0`, typeset $\text{Let }x \text{ be such that }x>0$
   - output: JSON `["LetBeSuchThat_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 6
   - input: LaTeX `\text{let }x \text{ be such that }x>0`, typeset $\text{let }x \text{ be such that }x>0$
   - output: JSON `["LetBeSuchThat_Variant2",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 7
   - input: LaTeX `\text{Let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{Let }T \text{ be such that }T=5\vee T\in S$
   - output: JSON `["LetBeSuchThat_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 8
   - input: LaTeX `\text{let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{let }T \text{ be such that }T=5\vee T\in S$
   - output: JSON `["LetBeSuchThat_Variant2",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 9
   - input: LaTeX `\text{Let }x>5`, typeset $\text{Let }x>5$
   - output: JSON `null`
- Test 10
   - input: LaTeX `\text{Let }1=1`, typeset $\text{Let }1=1$
   - output: JSON `null`
- Test 11
   - input: LaTeX `\text{Let }\emptyset`, typeset $\text{Let }\emptyset$
   - output: JSON `null`
- Test 12
   - input: LaTeX `\text{Let }x \text{ be such that }1`, typeset $\text{Let }x \text{ be such that }1$
   - output: JSON `null`
- Test 13
   - input: LaTeX `\text{Let }x \text{ be such that }1\vee 2`, typeset $\text{Let }x \text{ be such that }1\vee 2$
   - output: JSON `null`
- Test 14
   - input: LaTeX `\text{Let }x \text{ be such that }\text{Let }y`, typeset $\text{Let }x \text{ be such that }\text{Let }y$
   - output: JSON `null`
- Test 15
   - input: LaTeX `\text{Let }x \text{ be such that }\text{Assume }B`, typeset $\text{Let }x \text{ be such that }\text{Assume }B$
   - output: JSON `null`


### can parse notation for For Some-style declarations

- Test 1
   - input: LaTeX `\text{For some }x, x>0`, typeset $\text{For some }x, x>0$
   - output: JSON `["ForSome_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 2
   - input: LaTeX `\text{for some }x, x>0`, typeset $\text{for some }x, x>0$
   - output: JSON `["ForSome_Variant2",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 3
   - input: LaTeX `x>0 \text{ for some } x`, typeset $x>0 \text{ for some } x$
   - output: JSON `["ForSome_Variant3",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 4
   - input: LaTeX `x>0~\text{for some}~x`, typeset $x>0~\text{for some}~x$
   - output: JSON `["ForSome_Variant4",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
- Test 5
   - input: LaTeX `\text{For some }T, T=5\vee T\in S`, typeset $\text{For some }T, T=5\vee T\in S$
   - output: JSON `["ForSome_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 6
   - input: LaTeX `\text{for some }T, T=5\vee T\in S`, typeset $\text{for some }T, T=5\vee T\in S$
   - output: JSON `["ForSome_Variant2",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 7
   - input: LaTeX `T=5\vee T\in S \text{ for some } T`, typeset $T=5\vee T\in S \text{ for some } T$
   - output: JSON `["ForSome_Variant3",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 8
   - input: LaTeX `T=5\vee T\in S~\text{for some}~T`, typeset $T=5\vee T\in S~\text{for some}~T$
   - output: JSON `["ForSome_Variant4",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
- Test 9
   - input: LaTeX `\text{For some }x`, typeset $\text{For some }x$
   - output: JSON `null`
- Test 10
   - input: LaTeX `\text{for some }x`, typeset $\text{for some }x$
   - output: JSON `null`
- Test 11
   - input: LaTeX `\text{For some }T`, typeset $\text{For some }T$
   - output: JSON `null`
- Test 12
   - input: LaTeX `\text{for some }T`, typeset $\text{for some }T$
   - output: JSON `null`
- Test 13
   - input: LaTeX `\text{For some }x>5, x>55`, typeset $\text{For some }x>5, x>55$
   - output: JSON `null`
- Test 14
   - input: LaTeX `\text{For some }1=1, P`, typeset $\text{For some }1=1, P$
   - output: JSON `null`
- Test 15
   - input: LaTeX `\text{For some }\emptyset, 1+1=2`, typeset $\text{For some }\emptyset, 1+1=2$
   - output: JSON `null`
- Test 16
   - input: LaTeX `x>55 \text{ for some } x>5`, typeset $x>55 \text{ for some } x>5$
   - output: JSON `null`
- Test 17
   - input: LaTeX `P \text{ for some } 1=1`, typeset $P \text{ for some } 1=1$
   - output: JSON `null`
- Test 18
   - input: LaTeX `\emptyset \text{ for some } 1+1=2`, typeset $\emptyset \text{ for some } 1+1=2$
   - output: JSON `null`
- Test 19
   - input: LaTeX `\text{For some }x, 1`, typeset $\text{For some }x, 1$
   - output: JSON `null`
- Test 20
   - input: LaTeX `\text{For some }x, 1\vee 2`, typeset $\text{For some }x, 1\vee 2$
   - output: JSON `null`
- Test 21
   - input: LaTeX `\text{For some }x, \text{Let }y`, typeset $\text{For some }x, \text{Let }y$
   - output: JSON `null`
- Test 22
   - input: LaTeX `\text{For some }x, \text{Assume }B`, typeset $\text{For some }x, \text{Assume }B$
   - output: JSON `null`
- Test 23
   - input: LaTeX `1~\text{for some}~x`, typeset $1~\text{for some}~x$
   - output: JSON `null`
- Test 24
   - input: LaTeX `1\vee 2~\text{for some}~x`, typeset $1\vee 2~\text{for some}~x$
   - output: JSON `null`
- Test 25
   - input: LaTeX `\text{Let }y~\text{for some}~x`, typeset $\text{Let }y~\text{for some}~x$
   - output: JSON `null`
- Test 26
   - input: LaTeX `\text{Assume }B~\text{for some}~x`, typeset $\text{Assume }B~\text{for some}~x$
   - output: JSON `null`


## <a name="Rendering-JSON-into-LaTeX">Rendering JSON into LaTeX</a>

### can convert JSON numbers to LaTeX

- Test 1
   - input: JSON `["Number","0"]`
   - output: LaTeX `0`, typeset $0$
- Test 2
   - input: JSON `["Number","453789"]`
   - output: LaTeX `453789`, typeset $453789$
- Test 3
   - input: JSON `["Number","99999999999999999999999999999999999999999"]`
   - output: LaTeX `99999999999999999999999999999999999999999`, typeset $99999999999999999999999999999999999999999$
- Test 4
   - input: JSON `["NumberNegation",["Number","453789"]]`
   - output: LaTeX `-453789`, typeset $-453789$
- Test 5
   - input: JSON `["NumberNegation",["Number","99999999999999999999999999999999999999999"]]`
   - output: LaTeX `-99999999999999999999999999999999999999999`, typeset $-99999999999999999999999999999999999999999$
- Test 6
   - input: JSON `["Number","0.0"]`
   - output: LaTeX `0.0`, typeset $0.0$
- Test 7
   - input: JSON `["Number","29835.6875940"]`
   - output: LaTeX `29835.6875940`, typeset $29835.6875940$
- Test 8
   - input: JSON `["Number","653280458689."]`
   - output: LaTeX `653280458689.`, typeset $653280458689.$
- Test 9
   - input: JSON `["Number",".000006327589"]`
   - output: LaTeX `.000006327589`, typeset $.000006327589$
- Test 10
   - input: JSON `["NumberNegation",["Number","29835.6875940"]]`
   - output: LaTeX `-29835.6875940`, typeset $-29835.6875940$
- Test 11
   - input: JSON `["NumberNegation",["Number","653280458689."]]`
   - output: LaTeX `-653280458689.`, typeset $-653280458689.$
- Test 12
   - input: JSON `["NumberNegation",["Number",".000006327589"]]`
   - output: LaTeX `-.000006327589`, typeset $-.000006327589$


### can convert any size variable name from JSON to LaTeX

- Test 1
   - input: JSON `["NumberVariable","x"]`
   - output: LaTeX `x`, typeset $x$
- Test 2
   - input: JSON `["NumberVariable","E"]`
   - output: LaTeX `E`, typeset $E$
- Test 3
   - input: JSON `["NumberVariable","q"]`
   - output: LaTeX `q`, typeset $q$
- Test 4
   - input: JSON `["NumberVariable","foo"]`
   - output: LaTeX `foo`, typeset $foo$
- Test 5
   - input: JSON `["NumberVariable","bar"]`
   - output: LaTeX `bar`, typeset $bar$
- Test 6
   - input: JSON `["NumberVariable","to"]`
   - output: LaTeX `to`, typeset $to$


### can convert numeric constants from JSON to LaTeX

- Test 1
   - input: JSON `"Infinity"`
   - output: LaTeX `\infty`, typeset $\infty$
- Test 2
   - input: JSON `"Pi"`
   - output: LaTeX `\pi`, typeset $\pi$
- Test 3
   - input: JSON `"EulersNumber"`
   - output: LaTeX `e`, typeset $e$


### can convert exponentiation of atomics from JSON to LaTeX

- Test 1
   - input: JSON `["Exponentiation",["Number","1"],["Number","2"]]`
   - output: LaTeX `1^2`, typeset $1^2$
- Test 2
   - input: JSON `["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]`
   - output: LaTeX `e^x`, typeset $e^x$
- Test 3
   - input: JSON `["Exponentiation",["Number","1"],"Infinity"]`
   - output: LaTeX `1^\infty`, typeset $1^\infty$


### can convert atomic percentages and factorials from JSON to LaTeX

- Test 1
   - input: JSON `["Percentage",["Number","10"]]`
   - output: LaTeX `10\%`, typeset $10\\%$
- Test 2
   - input: JSON `["Percentage",["NumberVariable","t"]]`
   - output: LaTeX `t\%`, typeset $t\\%$
- Test 3
   - input: JSON `["Factorial",["Number","10"]]`
   - output: LaTeX `10!`, typeset $10!$
- Test 4
   - input: JSON `["Factorial",["NumberVariable","t"]]`
   - output: LaTeX `t!`, typeset $t!$


### can convert division of atomics or factors from JSON to LaTeX

- Test 1
   - input: JSON `["Division",["Number","1"],["Number","2"]]`
   - output: LaTeX `1\div 2`, typeset $1\div 2$
- Test 2
   - input: JSON `["Division",["NumberVariable","x"],["NumberVariable","y"]]`
   - output: LaTeX `x\div y`, typeset $x\div y$
- Test 3
   - input: JSON `["Division",["Number","0"],"Infinity"]`
   - output: LaTeX `0\div \infty`, typeset $0\div \infty$
- Test 4
   - input: JSON `["Division",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
   - output: LaTeX `x^2\div 3`, typeset $x^2\div 3$
- Test 5
   - input: JSON `["Division",["Number","1"],["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]]`
   - output: LaTeX `1\div e^x`, typeset $1\div e^x$
- Test 6
   - input: JSON `["Division",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`
   - output: LaTeX `10\%\div 2^100`, typeset $10\\%\div 2^100$


### can convert multiplication of atomics or factors from JSON to LaTeX

- Test 1
   - input: JSON `["Multiplication",["Number","1"],["Number","2"]]`
   - output: LaTeX `1\times 2`, typeset $1\times 2$
- Test 2
   - input: JSON `["Multiplication",["NumberVariable","x"],["NumberVariable","y"]]`
   - output: LaTeX `x\times y`, typeset $x\times y$
- Test 3
   - input: JSON `["Multiplication",["Number","0"],"Infinity"]`
   - output: LaTeX `0\times \infty`, typeset $0\times \infty$
- Test 4
   - input: JSON `["Multiplication",["Exponentiation",["NumberVariable","x"],["Number","2"]],["Number","3"]]`
   - output: LaTeX `x^2\times 3`, typeset $x^2\times 3$
- Test 5
   - input: JSON `["Multiplication",["Number","1"],["Exponentiation",["NumberVariable","e"],["NumberVariable","x"]]]`
   - output: LaTeX `1\times e^x`, typeset $1\times e^x$
- Test 6
   - input: JSON `["Multiplication",["Percentage",["Number","10"]],["Exponentiation",["Number","2"],["Number","100"]]]`
   - output: LaTeX `10\%\times 2^100`, typeset $10\\%\times 2^100$


### can convert negations of atomics or factors from JSON to LaTeX

- Test 1
   - input: JSON `["Multiplication",["NumberNegation",["Number","1"]],["Number","2"]]`
   - output: LaTeX `-1\times 2`, typeset $-1\times 2$
- Test 2
   - input: JSON `["Multiplication",["NumberVariable","x"],["NumberNegation",["NumberVariable","y"]]]`
   - output: LaTeX `x\times -y`, typeset $x\times -y$
- Test 3
   - input: JSON `["Multiplication",["NumberNegation",["Exponentiation",["NumberVariable","x"],["Number","2"]]],["NumberNegation",["Number","3"]]]`
   - output: LaTeX `-x^2\times -3`, typeset $-x^2\times -3$
- Test 4
   - input: JSON `["NumberNegation",["NumberNegation",["NumberNegation",["NumberNegation",["Number","1000"]]]]]`
   - output: LaTeX `----1000`, typeset $----1000$


### can convert additions and subtractions from JSON to LaTeX

- Test 1
   - input: JSON `["Addition",["NumberVariable","x"],["NumberVariable","y"]]`
   - output: LaTeX `x+y`, typeset $x+y$
- Test 2
   - input: JSON `["Subtraction",["Number","1"],["NumberNegation",["Number","3"]]]`
   - output: LaTeX `1--3`, typeset $1--3$
- Test 3
   - input: JSON `["Subtraction",["Addition",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]],["NumberVariable","C"]],"Pi"]`
   - output: LaTeX `A^B+C-\pi`, typeset $A^B+C-\pi$


### can convert Number expressions with groupers from JSON to LaTeX

- Test 1
   - input: JSON `["NumberNegation",["Multiplication",["Number","1"],["Number","2"]]]`
   - output: LaTeX `-1\times 2`, typeset $-1\times 2$
- Test 2
   - input: JSON `["Factorial",["Addition",["Number","1"],["Number","2"]]]`
   - output: LaTeX `{1+2}!`, typeset ${1+2}!$
- Test 3
   - input: JSON `["Exponentiation",["NumberNegation",["NumberVariable","x"]],["Multiplication",["Number","2"],["NumberNegation",["Number","3"]]]]`
   - output: LaTeX `{-x}^{2\times -3}`, typeset ${-x}^{2\times -3}$
- Test 4
   - input: JSON `["Addition",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]],["Subtraction",["NumberVariable","C"],["NumberVariable","D"]]]`
   - output: LaTeX `A^B+C-D`, typeset $A^B+C-D$
- Test 5
   - input: JSON `["Multiplication",["Exponentiation",["NumberVariable","k"],["Subtraction",["Number","1"],["NumberVariable","y"]]],["Addition",["Number","2"],["NumberVariable","k"]]]`
   - output: LaTeX `k^{1-y}\times {2+k}`, typeset $k^{1-y}\times {2+k}$


### can parse relations of numeric expressions from JSON to LaTeX

- Test 1
   - input: JSON `["GreaterThan",["Number","1"],["Number","2"]]`
   - output: LaTeX `1>2`, typeset $1>2$
- Test 2
   - input: JSON `["LessThan",["Subtraction",["Number","1"],["Number","2"]],["Addition",["Number","1"],["Number","2"]]]`
   - output: LaTeX `1-2<1+2`, typeset $1-2<1+2$
- Test 3
   - input: JSON `["Conjunction",["GreaterThanOrEqual",["Number","2"],["Number","1"]],["LessThanOrEqual",["Number","2"],["Number","3"]]]`
   - output: LaTeX `2\ge 1\wedge 2\le 3`, typeset $2\ge 1\wedge 2\le 3$
- Test 4
   - input: JSON `["BinaryRelationHolds","Divides",["Number","7"],["Number","14"]]`
   - output: LaTeX `7 | 14`, typeset $7 | 14$
- Test 5
   - input: JSON `["BinaryRelationHolds","Divides",["NumberFunctionApplication",["FunctionVariable","A"],["NumberVariable","k"]],["Factorial",["NumberVariable","n"]]]`
   - output: LaTeX `A(k) | n!`, typeset $A(k) | n!$
- Test 6
   - input: JSON `["BinaryRelationHolds","GenericBinaryRelation",["Subtraction",["Number","1"],["NumberVariable","k"]],["Addition",["Number","1"],["NumberVariable","k"]]]`
   - output: LaTeX `1-k \sim 1+k`, typeset $1-k \sim 1+k$
- Test 7
   - input: JSON `["BinaryRelationHolds","ApproximatelyEqual",["Number","0.99"],["Number","1.01"]]`
   - output: LaTeX `0.99 \approx 1.01`, typeset $0.99 \approx 1.01$


### can represent inequality if JSON explicitly requests it

- Test 1
   - input: JSON `["NotEqual",["Number","1"],["Number","2"]]`
   - output: LaTeX `1\ne 2`, typeset $1\ne 2$
- Test 2
   - input: JSON `["LogicalNegation",["Equals",["Number","1"],["Number","2"]]]`
   - output: LaTeX `\neg 1=2`, typeset $\neg 1=2$


### can convert propositional logic atomics from JSON to LaTeX

- Test 1
   - input: JSON `"LogicalTrue"`
   - output: LaTeX `\top`, typeset $\top$
- Test 2
   - input: JSON `"LogicalFalse"`
   - output: LaTeX `\bot`, typeset $\bot$
- Test 3
   - input: JSON `"Contradiction"`
   - output: LaTeX `\rightarrow \leftarrow`, typeset $\rightarrow \leftarrow$


### can convert propositional logic conjuncts from JSON to LaTeX

- Test 1
   - input: JSON `["Conjunction","LogicalTrue","LogicalFalse"]`
   - output: LaTeX `\top\wedge \bot`, typeset $\top\wedge \bot$
- Test 2
   - input: JSON `["Conjunction",["LogicalNegation",["LogicVariable","P"]],["LogicalNegation","LogicalTrue"]]`
   - output: LaTeX `\neg P\wedge \neg \top`, typeset $\neg P\wedge \neg \top$
- Test 3
   - input: JSON `["Conjunction",["Conjunction",["LogicVariable","a"],["LogicVariable","b"]],["LogicVariable","c"]]`
   - output: LaTeX `a\wedge b\wedge c`, typeset $a\wedge b\wedge c$


### can convert propositional logic disjuncts from JSON to LaTeX

- Test 1
   - input: JSON `["Disjunction","LogicalTrue",["LogicalNegation",["LogicVariable","A"]]]`
   - output: LaTeX `\top\vee \neg A`, typeset $\top\vee \neg A$
- Test 2
   - input: JSON `["Disjunction",["Conjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]]`
   - output: LaTeX `P\wedge Q\vee Q\wedge P`, typeset $P\wedge Q\vee Q\wedge P$


### can convert propositional logic conditionals from JSON to LaTeX

- Test 1
   - input: JSON `["Implication",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
   - output: LaTeX `A\Rightarrow Q\wedge \neg P`, typeset $A\Rightarrow Q\wedge \neg P$
- Test 2
   - input: JSON `["Implication",["Implication",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]],["LogicVariable","T"]]`
   - output: LaTeX `P\vee Q\Rightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Rightarrow Q\wedge P\Rightarrow T$


### can convert propositional logic biconditionals from JSON to LaTeX

- Test 1
   - input: JSON `["LogicalEquivalence",["LogicVariable","A"],["Conjunction",["LogicVariable","Q"],["LogicalNegation",["LogicVariable","P"]]]]`
   - output: LaTeX `A\Leftrightarrow Q\wedge \neg P`, typeset $A\Leftrightarrow Q\wedge \neg P$
- Test 2
   - input: JSON `["Implication",["LogicalEquivalence",["Disjunction",["LogicVariable","P"],["LogicVariable","Q"]],["Conjunction",["LogicVariable","Q"],["LogicVariable","P"]]],["LogicVariable","T"]]`
   - output: LaTeX `P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T$


### can convert propositional expressions with groupers from JSON to LaTeX

- Test 1
   - input: JSON `["Disjunction",["LogicVariable","P"],["Conjunction",["LogicalEquivalence",["LogicVariable","Q"],["LogicVariable","Q"]],["LogicVariable","P"]]]`
   - output: LaTeX `P\vee {Q\Leftrightarrow Q}\wedge P`, typeset $P\vee {Q\Leftrightarrow Q}\wedge P$
- Test 2
   - input: JSON `["LogicalNegation",["LogicalEquivalence","LogicalTrue","LogicalFalse"]]`
   - output: LaTeX `\neg {\top\Leftrightarrow \bot}`, typeset $\neg {\top\Leftrightarrow \bot}$


### can convert simple predicate logic expressions from JSON to LaTeX

- Test 1
   - input: JSON `["UniversalQuantifier",["NumberVariable","x"],["LogicVariable","P"]]`
   - output: LaTeX `\forall x, P`, typeset $\forall x, P$
- Test 2
   - input: JSON `["ExistentialQuantifier",["NumberVariable","t"],["LogicalNegation",["LogicVariable","Q"]]]`
   - output: LaTeX `\exists t, \neg Q`, typeset $\exists t, \neg Q$
- Test 3
   - input: JSON `["UniqueExistentialQuantifier",["NumberVariable","k"],["Implication",["LogicVariable","m"],["LogicVariable","n"]]]`
   - output: LaTeX `\exists ! k, m\Rightarrow n`, typeset $\exists ! k, m\Rightarrow n$


### can convert finite and empty sets from JSON to LaTeX

- Test 1
   - input: JSON `"EmptySet"`
   - output: LaTeX `\emptyset`, typeset $\emptyset$
- Test 2
   - input: JSON `["FiniteSet",["OneElementSequence",["Number","1"]]]`
   - output: LaTeX `\{1\}`, typeset $\{1\}$
- Test 3
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]`
   - output: LaTeX `\{1,2\}`, typeset $\{1,2\}$
- Test 4
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["OneElementSequence",["Number","3"]]]]]`
   - output: LaTeX `\{1,2,3\}`, typeset $\{1,2,3\}$
- Test 5
   - input: JSON `["FiniteSet",["ElementThenSequence","EmptySet",["OneElementSequence","EmptySet"]]]`
   - output: LaTeX `\{\emptyset,\emptyset\}`, typeset $\{\emptyset,\emptyset\}$
- Test 6
   - input: JSON `["FiniteSet",["OneElementSequence",["FiniteSet",["OneElementSequence","EmptySet"]]]]`
   - output: LaTeX `\{\{\emptyset\}\}`, typeset $\{\{\emptyset\}\}$
- Test 7
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","3"],["OneElementSequence",["NumberVariable","x"]]]]`
   - output: LaTeX `\{3,x\}`, typeset $\{3,x\}$
- Test 8
   - input: JSON `["FiniteSet",["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["SetIntersection",["SetVariable","A"],["SetVariable","B"]]]]]`
   - output: LaTeX `\{A\cup B,A\cap B\}`, typeset $\{A\cup B,A\cap B\}$
- Test 9
   - input: JSON `["FiniteSet",["ElementThenSequence",["Number","1"],["ElementThenSequence",["Number","2"],["ElementThenSequence","EmptySet",["ElementThenSequence",["NumberVariable","K"],["OneElementSequence",["NumberVariable","P"]]]]]]]`
   - output: LaTeX `\{1,2,\emptyset,K,P\}`, typeset $\{1,2,\emptyset,K,P\}$


### can convert tuples and vectors from JSON to LaTeX

- Test 1
   - input: JSON `["Tuple",["ElementThenSequence",["Number","5"],["OneElementSequence",["Number","6"]]]]`
   - output: LaTeX `(5,6)`, typeset $(5,6)$
- Test 2
   - input: JSON `["Tuple",["ElementThenSequence",["Number","5"],["ElementThenSequence",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["OneElementSequence",["NumberVariable","k"]]]]]`
   - output: LaTeX `(5,A\cup B,k)`, typeset $(5,A\cup B,k)$
- Test 3
   - input: JSON `["Vector",["NumberThenSequence",["Number","5"],["OneNumberSequence",["Number","6"]]]]`
   - output: LaTeX `\langle 5,6\rangle`, typeset $\langle 5,6\rangle$
- Test 4
   - input: JSON `["Vector",["NumberThenSequence",["Number","5"],["NumberThenSequence",["NumberNegation",["Number","7"]],["OneNumberSequence",["NumberVariable","k"]]]]]`
   - output: LaTeX `\langle 5,-7,k\rangle`, typeset $\langle 5,-7,k\rangle$
- Test 5
   - input: JSON `["Tuple",["ElementThenSequence",["Tuple",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]],["OneElementSequence",["Number","6"]]]]`
   - output: LaTeX `((1,2),6)`, typeset $((1,2),6)$


### can convert simple set memberships and subsets to LaTeX

- Test 1
   - input: JSON `["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]`
   - output: LaTeX `b\in B`, typeset $b\in B$
- Test 2
   - input: JSON `["NounIsElement",["Number","2"],["FiniteSet",["ElementThenSequence",["Number","1"],["OneElementSequence",["Number","2"]]]]]`
   - output: LaTeX `2\in \{1,2\}`, typeset $2\in \{1,2\}$
- Test 3
   - input: JSON `["NounIsElement",["NumberVariable","X"],["SetUnion",["SetVariable","a"],["SetVariable","b"]]]`
   - output: LaTeX `X\in a\cup b`, typeset $X\in a\cup b$
- Test 4
   - input: JSON `["NounIsElement",["SetUnion",["SetVariable","A"],["SetVariable","B"]],["SetUnion",["SetVariable","X"],["SetVariable","Y"]]]`
   - output: LaTeX `A\cup B\in X\cup Y`, typeset $A\cup B\in X\cup Y$
- Test 5
   - input: JSON `["Subset",["SetVariable","A"],["SetComplement",["SetVariable","B"]]]`
   - output: LaTeX `A\subset \bar B`, typeset $A\subset \bar B$
- Test 6
   - input: JSON `["SubsetOrEqual",["SetIntersection",["SetVariable","u"],["SetVariable","v"]],["SetUnion",["SetVariable","u"],["SetVariable","v"]]]`
   - output: LaTeX `u\cap v\subseteq u\cup v`, typeset $u\cap v\subseteq u\cup v$
- Test 7
   - input: JSON `["SubsetOrEqual",["FiniteSet",["OneElementSequence",["Number","1"]]],["SetUnion",["FiniteSet",["OneElementSequence",["Number","1"]]],["FiniteSet",["OneElementSequence",["Number","2"]]]]]`
   - output: LaTeX `\{1\}\subseteq \{1\}\cup \{2\}`, typeset $\{1\}\subseteq \{1\}\cup \{2\}$
- Test 8
   - input: JSON `["NounIsElement",["NumberVariable","p"],["SetCartesianProduct",["SetVariable","U"],["SetVariable","V"]]]`
   - output: LaTeX `p\in U\times V`, typeset $p\in U\times V$
- Test 9
   - input: JSON `["NounIsElement",["NumberVariable","q"],["SetUnion",["SetComplement",["SetVariable","U"]],["SetCartesianProduct",["SetVariable","V"],["SetVariable","W"]]]]`
   - output: LaTeX `q\in \bar U\cup V\times W`, typeset $q\in \bar U\cup V\times W$
- Test 10
   - input: JSON `["NounIsElement",["Tuple",["ElementThenSequence",["NumberVariable","a"],["OneElementSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
   - output: LaTeX `(a,b)\in A\times B`, typeset $(a,b)\in A\times B$
- Test 11
   - input: JSON `["NounIsElement",["Vector",["NumberThenSequence",["NumberVariable","a"],["OneNumberSequence",["NumberVariable","b"]]]],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
   - output: LaTeX `\langle a,b\rangle\in A\times B`, typeset $\langle a,b\rangle\in A\times B$


### can represent "notin" notation if JSON explicitly requests it

- Test 1
   - input: JSON `["LogicalNegation",["NounIsElement",["NumberVariable","a"],["SetVariable","A"]]]`
   - output: LaTeX `\neg a\in A`, typeset $\neg a\in A$
- Test 2
   - input: JSON `["LogicalNegation",["NounIsElement","EmptySet","EmptySet"]]`
   - output: LaTeX `\neg \emptyset\in \emptyset`, typeset $\neg \emptyset\in \emptyset$
- Test 3
   - input: JSON `["LogicalNegation",["NounIsElement",["Subtraction",["Number","3"],["Number","5"]],["SetIntersection",["SetVariable","K"],["SetVariable","P"]]]]`
   - output: LaTeX `\neg 3-5\in K\cap P`, typeset $\neg 3-5\in K\cap P$
- Test 4
   - input: JSON `["NounIsNotElement",["NumberVariable","a"],["SetVariable","A"]]`
   - output: LaTeX `a\notin A`, typeset $a\notin A$
- Test 5
   - input: JSON `["NounIsNotElement","EmptySet","EmptySet"]`
   - output: LaTeX `\emptyset\notin \emptyset`, typeset $\emptyset\notin \emptyset$
- Test 6
   - input: JSON `["NounIsNotElement",["Subtraction",["Number","3"],["Number","5"]],["SetIntersection",["SetVariable","K"],["SetVariable","P"]]]`
   - output: LaTeX `3-5\notin K\cap P`, typeset $3-5\notin K\cap P$


### can convert to LaTeX sentences built from various relations

- Test 1
   - input: JSON `["Disjunction",["LogicVariable","P"],["NounIsElement",["NumberVariable","b"],["SetVariable","B"]]]`
   - output: LaTeX `P\vee b\in B`, typeset $P\vee b\in B$
- Test 2
   - input: JSON `["PropositionIsElement",["Disjunction",["LogicVariable","P"],["LogicVariable","b"]],["SetVariable","B"]]`
   - output: LaTeX `{P\vee b}\in B`, typeset ${P\vee b}\in B$
- Test 3
   - input: JSON `["UniversalQuantifier",["NumberVariable","x"],["NounIsElement",["NumberVariable","x"],["SetVariable","X"]]]`
   - output: LaTeX `\forall x, x\in X`, typeset $\forall x, x\in X$
- Test 4
   - input: JSON `["Conjunction",["SubsetOrEqual",["SetVariable","A"],["SetVariable","B"]],["SubsetOrEqual",["SetVariable","B"],["SetVariable","A"]]]`
   - output: LaTeX `A\subseteq B\wedge B\subseteq A`, typeset $A\subseteq B\wedge B\subseteq A$
- Test 5
   - input: JSON `["Equals",["SetVariable","R"],["SetCartesianProduct",["SetVariable","A"],["SetVariable","B"]]]`
   - output: LaTeX `R=A\times B`, typeset $R=A\times B$
- Test 6
   - input: JSON `["UniversalQuantifier",["NumberVariable","n"],["BinaryRelationHolds","Divides",["NumberVariable","n"],["Factorial",["NumberVariable","n"]]]]`
   - output: LaTeX `\forall n, n | n!`, typeset $\forall n, n | n!$
- Test 7
   - input: JSON `["Implication",["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","a"],["NumberVariable","b"]],["BinaryRelationHolds","GenericBinaryRelation",["NumberVariable","b"],["NumberVariable","a"]]]`
   - output: LaTeX `a \sim b\Rightarrow b \sim a`, typeset $a \sim b\Rightarrow b \sim a$


### can create LaTeX notation related to functions

- Test 1
   - input: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`
   - output: LaTeX `f:A\to B`, typeset $f:A\to B$
- Test 2
   - input: JSON `["LogicalNegation",["FunctionSignature",["FunctionVariable","F"],["SetUnion",["SetVariable","X"],["SetVariable","Y"]],["SetVariable","Z"]]]`
   - output: LaTeX `\neg F:X\cup Y\to Z`, typeset $\neg F:X\cup Y\to Z$
- Test 3
   - input: JSON `["FunctionSignature",["FunctionComposition",["FunctionVariable","f"],["FunctionVariable","g"]],["SetVariable","A"],["SetVariable","C"]]`
   - output: LaTeX `f\circ g:A\to C`, typeset $f\circ g:A\to C$
- Test 4
   - input: JSON `["NumberFunctionApplication",["FunctionVariable","f"],["NumberVariable","x"]]`
   - output: LaTeX `f(x)`, typeset $f(x)$
- Test 5
   - input: JSON `["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","f"]],["NumberFunctionApplication",["FunctionInverse",["FunctionVariable","g"]],["Number","10"]]]`
   - output: LaTeX `f ^ { - 1 }(g ^ { - 1 }(10))`, typeset $f ^ { - 1 }(g ^ { - 1 }(10))$
- Test 6
   - input: JSON `["NumberFunctionApplication",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
   - output: LaTeX `E(\bar L)`, typeset $E(\bar L)$
- Test 7
   - input: JSON `["SetIntersection","EmptySet",["SetFunctionApplication",["FunctionVariable","f"],["Number","2"]]]`
   - output: LaTeX `\emptyset\cap f(2)`, typeset $\emptyset\cap f(2)$
- Test 8
   - input: JSON `["Conjunction",["PropositionFunctionApplication",["FunctionVariable","P"],["NumberVariable","e"]],["PropositionFunctionApplication",["FunctionVariable","Q"],["Addition",["Number","3"],["NumberVariable","b"]]]]`
   - output: LaTeX `P(e)\wedge Q(3+b)`, typeset $P(e)\wedge Q(3+b)$
- Test 9
   - input: JSON `["EqualFunctions",["FunctionVariable","F"],["FunctionComposition",["FunctionVariable","G"],["FunctionInverse",["FunctionVariable","H"]]]]`
   - output: LaTeX `F=G\circ H ^ { - 1 }`, typeset $F=G\circ H ^ { - 1 }$


### can represent trigonometric functions correctly

- Test 1
   - input: JSON `["PrefixFunctionApplication","SineFunction",["NumberVariable","x"]]`
   - output: LaTeX `\sin x`, typeset $\sin x$
- Test 2
   - input: JSON `["PrefixFunctionApplication","CosineFunction",["Multiplication","Pi",["NumberVariable","x"]]]`
   - output: LaTeX `\cos \pi\times x`, typeset $\cos \pi\times x$
- Test 3
   - input: JSON `["PrefixFunctionApplication","TangentFunction",["NumberVariable","t"]]`
   - output: LaTeX `\tan t`, typeset $\tan t$
- Test 4
   - input: JSON `["Division",["Number","1"],["PrefixFunctionApplication","CotangentFunction","Pi"]]`
   - output: LaTeX `1\div \cot \pi`, typeset $1\div \cot \pi$
- Test 5
   - input: JSON `["Equals",["PrefixFunctionApplication","SecantFunction",["NumberVariable","y"]],["PrefixFunctionApplication","CosecantFunction",["NumberVariable","y"]]]`
   - output: LaTeX `\sec y=\csc y`, typeset $\sec y=\csc y$


### can express logarithms correctly

- Test 1
   - input: JSON `["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]`
   - output: LaTeX `\log n`, typeset $\log n$
- Test 2
   - input: JSON `["Addition",["Number","1"],["PrefixFunctionApplication","NaturalLogarithm",["NumberVariable","x"]]]`
   - output: LaTeX `1+\ln x`, typeset $1+\ln x$
- Test 3
   - input: JSON `["PrefixFunctionApplication",["LogarithmWithBase",["Number","2"]],["Number","1024"]]`
   - output: LaTeX `\log_2 1024`, typeset $\log_2 1024$
- Test 4
   - input: JSON `["Division",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]],["PrefixFunctionApplication","Logarithm",["PrefixFunctionApplication","Logarithm",["NumberVariable","n"]]]]`
   - output: LaTeX `\log n\div \log \log n`, typeset $\log n\div \log \log n$


### can express equivalence classes and expressions that use them

- Test 1
   - input: JSON `["EquivalenceClass",["Number","1"],"ApproximatelyEqual"]`
   - output: LaTeX `[1,\approx]`, typeset $[1,\approx]$
- Test 2
   - input: JSON `["EquivalenceClass",["Addition",["NumberVariable","x"],["Number","2"]],"GenericBinaryRelation"]`
   - output: LaTeX `[x+2,\sim]`, typeset $[x+2,\sim]$
- Test 3
   - input: JSON `["SetUnion",["EquivalenceClass",["Number","1"],"ApproximatelyEqual"],["EquivalenceClass",["Number","2"],"ApproximatelyEqual"]]`
   - output: LaTeX `[1,\approx]\cup [2,\approx]`, typeset $[1,\approx]\cup [2,\approx]$
- Test 4
   - input: JSON `["NounIsElement",["Number","7"],["EquivalenceClass",["Number","7"],"GenericBinaryRelation"]]`
   - output: LaTeX `7\in [7,\sim]`, typeset $7\in [7,\sim]$
- Test 5
   - input: JSON `["GenericEquivalenceClass",["NumberVariable","P"]]`
   - output: LaTeX `[P]`, typeset $[P]$


### can express equivalence and classes mod a number

- Test 1
   - input: JSON `["EquivalentModulo",["Number","5"],["Number","11"],["Number","3"]]`
   - output: LaTeX `5 \equiv 11 \mod 3`, typeset $5 \equiv 11 \mod 3$
- Test 2
   - input: JSON `["EquivalentModulo",["NumberVariable","k"],["NumberVariable","m"],["NumberVariable","n"]]`
   - output: LaTeX `k \equiv m \mod n`, typeset $k \equiv m \mod n$
- Test 3
   - input: JSON `["Subset","EmptySet",["EquivalenceClassModulo",["NumberNegation",["Number","1"]],["Number","10"]]]`
   - output: LaTeX `\emptyset\subset [-1, \equiv _ 10]`, typeset $\emptyset\subset [-1, \equiv _ 10]$


### can construct type sentences and combinations of them

- Test 1
   - input: JSON `["HasType",["NumberVariable","x"],"SetType"]`
   - output: LaTeX `x \text{is a set}`, typeset $x \text{is a set}$
- Test 2
   - input: JSON `["HasType",["NumberVariable","n"],"NumberType"]`
   - output: LaTeX `n \text{is a number}`, typeset $n \text{is a number}$
- Test 3
   - input: JSON `["HasType",["NumberVariable","S"],"PartialOrderType"]`
   - output: LaTeX `S \text{is a partial order}`, typeset $S \text{is a partial order}$
- Test 4
   - input: JSON `["Conjunction",["HasType",["Number","1"],"NumberType"],["HasType",["Number","10"],"NumberType"]]`
   - output: LaTeX `1 \text{is a number}\wedge 10 \text{is a number}`, typeset $1 \text{is a number}\wedge 10 \text{is a number}$
- Test 5
   - input: JSON `["Implication",["HasType",["NumberVariable","R"],"EquivalenceRelationType"],["HasType",["NumberVariable","R"],"RelationType"]]`
   - output: LaTeX `R \text{is an equivalence relation}\Rightarrow R \text{is a relation}`, typeset $R \text{is an equivalence relation}\Rightarrow R \text{is a relation}$


### can create notation for expression function application

- Test 1
   - input: JSON `["NumberEFA",["FunctionVariable","f"],["NumberVariable","x"]]`
   - output: LaTeX `\mathcal{f} (x)`, typeset $\mathcal{f} (x)$
- Test 2
   - input: JSON `["NumberFunctionApplication",["FunctionVariable","F"],["NumberEFA",["FunctionVariable","k"],["Number","10"]]]`
   - output: LaTeX `F(\mathcal{k} (10))`, typeset $F(\mathcal{k} (10))$
- Test 3
   - input: JSON `["NumberEFA",["FunctionVariable","E"],["SetComplement",["SetVariable","L"]]]`
   - output: LaTeX `\mathcal{E} (\bar L)`, typeset $\mathcal{E} (\bar L)$
- Test 4
   - input: JSON `["SetIntersection","EmptySet",["SetEFA",["FunctionVariable","f"],["Number","2"]]]`
   - output: LaTeX `\emptyset\cap \mathcal{f} (2)`, typeset $\emptyset\cap \mathcal{f} (2)$
- Test 5
   - input: JSON `["Conjunction",["PropositionEFA",["FunctionVariable","P"],["NumberVariable","x"]],["PropositionEFA",["FunctionVariable","Q"],["NumberVariable","y"]]]`
   - output: LaTeX `\mathcal{P} (x)\wedge \mathcal{Q} (y)`, typeset $\mathcal{P} (x)\wedge \mathcal{Q} (y)$


### can create notation for assumptions

- Test 1
   - input: JSON `["Given_Variant1",["LogicVariable","X"]]`
   - output: LaTeX `\text{Assume }X`, typeset $\text{Assume }X$
- Test 2
   - input: JSON `["Given_Variant2",["LogicVariable","X"]]`
   - output: LaTeX `\text{assume }X`, typeset $\text{assume }X$
- Test 3
   - input: JSON `["Given_Variant3",["LogicVariable","X"]]`
   - output: LaTeX `\text{Given }X`, typeset $\text{Given }X$
- Test 4
   - input: JSON `["Given_Variant4",["LogicVariable","X"]]`
   - output: LaTeX `\text{given }X`, typeset $\text{given }X$
- Test 5
   - input: JSON `["Given_Variant1",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: LaTeX `\text{Assume }k=1000`, typeset $\text{Assume }k=1000$
- Test 6
   - input: JSON `["Given_Variant2",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: LaTeX `\text{assume }k=1000`, typeset $\text{assume }k=1000$
- Test 7
   - input: JSON `["Given_Variant3",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: LaTeX `\text{Given }k=1000`, typeset $\text{Given }k=1000$
- Test 8
   - input: JSON `["Given_Variant4",["Equals",["NumberVariable","k"],["Number","1000"]]]`
   - output: LaTeX `\text{given }k=1000`, typeset $\text{given }k=1000$
- Test 9
   - input: JSON `["Given_Variant1","LogicalTrue"]`
   - output: LaTeX `\text{Assume }\top`, typeset $\text{Assume }\top$
- Test 10
   - input: JSON `["Given_Variant2","LogicalTrue"]`
   - output: LaTeX `\text{assume }\top`, typeset $\text{assume }\top$
- Test 11
   - input: JSON `["Given_Variant3","LogicalTrue"]`
   - output: LaTeX `\text{Given }\top`, typeset $\text{Given }\top$
- Test 12
   - input: JSON `["Given_Variant4","LogicalTrue"]`
   - output: LaTeX `\text{given }\top`, typeset $\text{given }\top$


### can create notation for Let-style declarations

- Test 1
   - input: JSON `["Let_Variant1",["NumberVariable","x"]]`
   - output: LaTeX `\text{Let }x`, typeset $\text{Let }x$
- Test 2
   - input: JSON `["Let_Variant2",["NumberVariable","x"]]`
   - output: LaTeX `\text{let }x`, typeset $\text{let }x$
- Test 3
   - input: JSON `["Let_Variant1",["NumberVariable","T"]]`
   - output: LaTeX `\text{Let }T`, typeset $\text{Let }T$
- Test 4
   - input: JSON `["Let_Variant2",["NumberVariable","T"]]`
   - output: LaTeX `\text{let }T`, typeset $\text{let }T$
- Test 5
   - input: JSON `["LetBeSuchThat_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: LaTeX `\text{Let }x \text{ be such that }x>0`, typeset $\text{Let }x \text{ be such that }x>0$
- Test 6
   - input: JSON `["LetBeSuchThat_Variant2",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: LaTeX `\text{let }x \text{ be such that }x>0`, typeset $\text{let }x \text{ be such that }x>0$
- Test 7
   - input: JSON `["LetBeSuchThat_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: LaTeX `\text{Let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{Let }T \text{ be such that }T=5\vee T\in S$
- Test 8
   - input: JSON `["LetBeSuchThat_Variant2",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: LaTeX `\text{let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{let }T \text{ be such that }T=5\vee T\in S$


### can parse notation for For Some-style declarations

- Test 1
   - input: JSON `["ForSome_Variant1",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: LaTeX `\text{For some }x, x>0`, typeset $\text{For some }x, x>0$
- Test 2
   - input: JSON `["ForSome_Variant2",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: LaTeX `\text{for some }x, x>0`, typeset $\text{for some }x, x>0$
- Test 3
   - input: JSON `["ForSome_Variant3",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: LaTeX `x>0 \text{ for some } x`, typeset $x>0 \text{ for some } x$
- Test 4
   - input: JSON `["ForSome_Variant4",["NumberVariable","x"],["GreaterThan",["NumberVariable","x"],["Number","0"]]]`
   - output: LaTeX `x>0~\text{for some}~x`, typeset $x>0~\text{for some}~x$
- Test 5
   - input: JSON `["ForSome_Variant1",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: LaTeX `\text{For some }T, T=5\vee T\in S`, typeset $\text{For some }T, T=5\vee T\in S$
- Test 6
   - input: JSON `["ForSome_Variant2",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: LaTeX `\text{for some }T, T=5\vee T\in S`, typeset $\text{for some }T, T=5\vee T\in S$
- Test 7
   - input: JSON `["ForSome_Variant3",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: LaTeX `T=5\vee T\in S \text{ for some } T`, typeset $T=5\vee T\in S \text{ for some } T$
- Test 8
   - input: JSON `["ForSome_Variant4",["NumberVariable","T"],["Disjunction",["Equals",["NumberVariable","T"],["Number","5"]],["NounIsElement",["NumberVariable","T"],["SetVariable","S"]]]]`
   - output: LaTeX `T=5\vee T\in S~\text{for some}~T`, typeset $T=5\vee T\in S~\text{for some}~T$


## <a name="Converting-putdown-to-LaTeX">Converting putdown to LaTeX</a>

### correctly converts many kinds of numbers but not malformed ones

- Test 1
   - input: putdown `0`
   - output: LaTeX `0`, typeset $0$
- Test 2
   - input: putdown `328975289`
   - output: LaTeX `328975289`, typeset $328975289$
- Test 3
   - input: putdown `(- 9097285323)`
   - output: LaTeX `-9097285323`, typeset $-9097285323$
- Test 4
   - input: putdown `0.0`
   - output: LaTeX `0.0`, typeset $0.0$
- Test 5
   - input: putdown `32897.5289`
   - output: LaTeX `32897.5289`, typeset $32897.5289$
- Test 6
   - input: putdown `(- 1.9097285323)`
   - output: LaTeX `-1.9097285323`, typeset $-1.9097285323$
- Test 7
   - input: putdown `0.0.0`
   - output: LaTeX `null`, typeset $undefined$
- Test 8
   - input: putdown `0k0`
   - output: LaTeX `null`, typeset $undefined$


### correctly converts one-letter variable names but not larger ones

- Test 1
   - input: putdown `x`
   - output: LaTeX `x`, typeset $x$
- Test 2
   - input: putdown `U`
   - output: LaTeX `U`, typeset $U$
- Test 3
   - input: putdown `Q`
   - output: LaTeX `Q`, typeset $Q$
- Test 4
   - input: putdown `m`
   - output: LaTeX `m`, typeset $m$
- Test 5
   - input: putdown `foo`
   - output: LaTeX `null`, typeset $undefined$
- Test 6
   - input: putdown `Hi`
   - output: LaTeX `null`, typeset $undefined$


### correctly converts numeric constants

- Test 1
   - input: putdown `infinity`
   - output: LaTeX `\infty`, typeset $\infty$
- Test 2
   - input: putdown `pi`
   - output: LaTeX `\pi`, typeset $\pi$
- Test 3
   - input: putdown `eulersnumber`
   - output: LaTeX `e`, typeset $e$


### correctly converts exponentiation of atomics

- Test 1
   - input: putdown `(^ 1 2)`
   - output: LaTeX `1^2`, typeset $1^2$
- Test 2
   - input: putdown `(^ e x)`
   - output: LaTeX `e^x`, typeset $e^x$
- Test 3
   - input: putdown `(^ 1 infinity)`
   - output: LaTeX `1^\infty`, typeset $1^\infty$


### correctly converts atomic percentages and factorials

- Test 1
   - input: putdown `(% 10)`
   - output: LaTeX `10\%`, typeset $10\\%$
- Test 2
   - input: putdown `(% t)`
   - output: LaTeX `t\%`, typeset $t\\%$
- Test 3
   - input: putdown `(! 10)`
   - output: LaTeX `10!`, typeset $10!$
- Test 4
   - input: putdown `(! t)`
   - output: LaTeX `t!`, typeset $t!$


### correctly converts division of atomics or factors

- Test 1
   - input: putdown `(/ 1 2)`
   - output: LaTeX `1\div 2`, typeset $1\div 2$
- Test 2
   - input: putdown `(/ x y)`
   - output: LaTeX `x\div y`, typeset $x\div y$
- Test 3
   - input: putdown `(/ 0 infinity)`
   - output: LaTeX `0\div \infty`, typeset $0\div \infty$
- Test 4
   - input: putdown `(/ (^ x 2) 3)`
   - output: LaTeX `x^2\div 3`, typeset $x^2\div 3$
- Test 5
   - input: putdown `(/ 1 (^ e x))`
   - output: LaTeX `1\div e^x`, typeset $1\div e^x$
- Test 6
   - input: putdown `(/ (% 10) (^ 2 100))`
   - output: LaTeX `10\%\div 2^100`, typeset $10\\%\div 2^100$


### correctly converts multiplication of atomics or factors

- Test 1
   - input: putdown `(* 1 2)`
   - output: LaTeX `1\times 2`, typeset $1\times 2$
- Test 2
   - input: putdown `(* x y)`
   - output: LaTeX `x\times y`, typeset $x\times y$
- Test 3
   - input: putdown `(* 0 infinity)`
   - output: LaTeX `0\times \infty`, typeset $0\times \infty$
- Test 4
   - input: putdown `(* (^ x 2) 3)`
   - output: LaTeX `x^2\times 3`, typeset $x^2\times 3$
- Test 5
   - input: putdown `(* 1 (^ e x))`
   - output: LaTeX `1\times e^x`, typeset $1\times e^x$
- Test 6
   - input: putdown `(* (% 10) (^ 2 100))`
   - output: LaTeX `10\%\times 2^100`, typeset $10\\%\times 2^100$


### correctly converts negations of atomics or factors

- Test 1
   - input: putdown `(* (- 1) 2)`
   - output: LaTeX `-1\times 2`, typeset $-1\times 2$
- Test 2
   - input: putdown `(* x (- y))`
   - output: LaTeX `x\times -y`, typeset $x\times -y$
- Test 3
   - input: putdown `(* (- (^ x 2)) (- 3))`
   - output: LaTeX `-x^2\times -3`, typeset $-x^2\times -3$
- Test 4
   - input: putdown `(- (- (- (- 1000))))`
   - output: LaTeX `----1000`, typeset $----1000$


### correctly converts additions and subtractions

- Test 1
   - input: putdown `(+ x y)`
   - output: LaTeX `x+y`, typeset $x+y$
- Test 2
   - input: putdown `(- 1 (- 3))`
   - output: LaTeX `1--3`, typeset $1--3$
- Test 3
   - input: putdown `(+ (^ A B) (- C pi))`
   - output: LaTeX `A^B+C-\pi`, typeset $A^B+C-\pi$


### correctly converts number expressions with groupers

- Test 1
   - input: putdown `(- (* 1 2))`
   - output: LaTeX `-1\times 2`, typeset $-1\times 2$
- Test 2
   - input: putdown `(! (^ x 2))`
   - output: LaTeX `{x^2}!`, typeset ${x^2}!$
- Test 3
   - input: putdown `(^ (- x) (* 2 (- 3)))`
   - output: LaTeX `{-x}^{2\times -3}`, typeset ${-x}^{2\times -3}$
- Test 4
   - input: putdown `(^ (- 3) (+ 1 2))`
   - output: LaTeX `{-3}^{1+2}`, typeset ${-3}^{1+2}$


### can convert relations of numeric expressions

- Test 1
   - input: putdown `(> 1 2)`
   - output: LaTeX `1>2`, typeset $1>2$
- Test 2
   - input: putdown `(< (- 1 2) (+ 1 2))`
   - output: LaTeX `1-2<1+2`, typeset $1-2<1+2$
- Test 3
   - input: putdown `(not (= 1 2))`
   - output: LaTeX `\neg 1=2`, typeset $\neg 1=2$
- Test 4
   - input: putdown `(and (>= 2 1) (<= 2 3))`
   - output: LaTeX `2\ge 1\wedge 2\le 3`, typeset $2\ge 1\wedge 2\le 3$
- Test 5
   - input: putdown `(relationholds | 7 14)`
   - output: LaTeX `7 | 14`, typeset $7 | 14$
- Test 6
   - input: putdown `(relationholds | (apply A k) (! n))`
   - output: LaTeX `A(k) | n!`, typeset $A(k) | n!$
- Test 7
   - input: putdown `(relationholds ~ (- 1 k) (+ 1 k))`
   - output: LaTeX `1-k \sim 1+k`, typeset $1-k \sim 1+k$
- Test 8
   - input: putdown `(relationholds ~~ 0.99 1.01)`
   - output: LaTeX `0.99 \approx 1.01`, typeset $0.99 \approx 1.01$


### does not undo the canonical form for inequality

- Test 1
   - input: putdown `(not (= x y))`
   - output: LaTeX `\neg x=y`, typeset $\neg x=y$


### correctly converts propositional logic atomics

- Test 1
   - input: putdown `true`
   - output: LaTeX `\top`, typeset $\top$
- Test 2
   - input: putdown `false`
   - output: LaTeX `\bot`, typeset $\bot$
- Test 3
   - input: putdown `contradiction`
   - output: LaTeX `\rightarrow \leftarrow`, typeset $\rightarrow \leftarrow$


### correctly converts propositional logic conjuncts

- Test 1
   - input: putdown `(and true false)`
   - output: LaTeX `\top\wedge \bot`, typeset $\top\wedge \bot$
- Test 2
   - input: putdown `(and (not P) (not true))`
   - output: LaTeX `\neg P\wedge \neg \top`, typeset $\neg P\wedge \neg \top$
- Test 3
   - input: putdown `(and (and a b) c)`
   - output: LaTeX `a\wedge b\wedge c`, typeset $a\wedge b\wedge c$


### correctly converts propositional logic disjuncts

- Test 1
   - input: putdown `(or true (not A))`
   - output: LaTeX `\top\vee \neg A`, typeset $\top\vee \neg A$
- Test 2
   - input: putdown `(or (and P Q) (and Q P))`
   - output: LaTeX `P\wedge Q\vee Q\wedge P`, typeset $P\wedge Q\vee Q\wedge P$


### correctly converts propositional logic conditionals

- Test 1
   - input: putdown `(implies A (and Q (not P)))`
   - output: LaTeX `A\Rightarrow Q\wedge \neg P`, typeset $A\Rightarrow Q\wedge \neg P$
- Test 2
   - input: putdown `(implies (implies (or P Q) (and Q P)) T)`
   - output: LaTeX `P\vee Q\Rightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Rightarrow Q\wedge P\Rightarrow T$


### correctly converts propositional logic biconditionals

- Test 1
   - input: putdown `(iff A (and Q (not P)))`
   - output: LaTeX `A\Leftrightarrow Q\wedge \neg P`, typeset $A\Leftrightarrow Q\wedge \neg P$
- Test 2
   - input: putdown `(implies (iff (or P Q) (and Q P)) T)`
   - output: LaTeX `P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T$


### correctly converts propositional expressions with groupers

- Test 1
   - input: putdown `(or P (and (iff Q Q) P))`
   - output: LaTeX `P\vee {Q\Leftrightarrow Q}\wedge P`, typeset $P\vee {Q\Leftrightarrow Q}\wedge P$
- Test 2
   - input: putdown `(not (iff true false))`
   - output: LaTeX `\neg {\top\Leftrightarrow \bot}`, typeset $\neg {\top\Leftrightarrow \bot}$


### correctly converts simple predicate logic expressions

- Test 1
   - input: putdown `(forall (x , P))`
   - output: LaTeX `\forall x, P`, typeset $\forall x, P$
- Test 2
   - input: putdown `(exists (t , (not Q)))`
   - output: LaTeX `\exists t, \neg Q`, typeset $\exists t, \neg Q$
- Test 3
   - input: putdown `(exists! (k , (implies m n)))`
   - output: LaTeX `\exists ! k, m\Rightarrow n`, typeset $\exists ! k, m\Rightarrow n$


### can convert finite and empty sets

- Test 1
   - input: putdown `emptyset`
   - output: LaTeX `\emptyset`, typeset $\emptyset$
- Test 2
   - input: putdown `(finiteset (elts 1))`
   - output: LaTeX `\{1\}`, typeset $\{1\}$
- Test 3
   - input: putdown `(finiteset (elts 1 (elts 2)))`
   - output: LaTeX `\{1,2\}`, typeset $\{1,2\}$
- Test 4
   - input: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
   - output: LaTeX `\{1,2,3\}`, typeset $\{1,2,3\}$
- Test 5
   - input: putdown `(finiteset (elts emptyset (elts emptyset)))`
   - output: LaTeX `\{\emptyset,\emptyset\}`, typeset $\{\emptyset,\emptyset\}$
- Test 6
   - input: putdown `(finiteset (elts (finiteset (elts emptyset))))`
   - output: LaTeX `\{\{\emptyset\}\}`, typeset $\{\{\emptyset\}\}$
- Test 7
   - input: putdown `(finiteset (elts 3 (elts x)))`
   - output: LaTeX `\{3,x\}`, typeset $\{3,x\}$
- Test 8
   - input: putdown `(finiteset (elts (union A B) (elts (intersection A B))))`
   - output: LaTeX `\{A\cup B,A\cap B\}`, typeset $\{A\cup B,A\cap B\}$
- Test 9
   - input: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`
   - output: LaTeX `\{1,2,\emptyset,K,P\}`, typeset $\{1,2,\emptyset,K,P\}$


### correctly converts tuples and vectors

- Test 1
   - input: putdown `(tuple (elts 5 (elts 6)))`
   - output: LaTeX `(5,6)`, typeset $(5,6)$
- Test 2
   - input: putdown `(tuple (elts 5 (elts (union A B) (elts k))))`
   - output: LaTeX `(5,A\cup B,k)`, typeset $(5,A\cup B,k)$
- Test 3
   - input: putdown `(vector (elts 5 (elts 6)))`
   - output: LaTeX `\langle 5,6\rangle`, typeset $\langle 5,6\rangle$
- Test 4
   - input: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
   - output: LaTeX `\langle 5,-7,k\rangle`, typeset $\langle 5,-7,k\rangle$
- Test 5
   - input: putdown `(tuple)`
   - output: LaTeX `null`, typeset $undefined$
- Test 6
   - input: putdown `(tuple (elts))`
   - output: LaTeX `null`, typeset $undefined$
- Test 7
   - input: putdown `(tuple (elts 3))`
   - output: LaTeX `null`, typeset $undefined$
- Test 8
   - input: putdown `(vector)`
   - output: LaTeX `null`, typeset $undefined$
- Test 9
   - input: putdown `(vector (elts))`
   - output: LaTeX `null`, typeset $undefined$
- Test 10
   - input: putdown `(vector (elts 3))`
   - output: LaTeX `null`, typeset $undefined$
- Test 11
   - input: putdown `(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))`
   - output: LaTeX `((1,2),6)`, typeset $((1,2),6)$
- Test 12
   - input: putdown `(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$
- Test 13
   - input: putdown `(vector (elts (vector (elts 1 (elts 2))) (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$
- Test 14
   - input: putdown `(vector (elts (union A B) (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$


### can convert simple set memberships and subsets

- Test 1
   - input: putdown `(in b B)`
   - output: LaTeX `b\in B`, typeset $b\in B$
- Test 2
   - input: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
   - output: LaTeX `2\in \{1,2\}`, typeset $2\in \{1,2\}$
- Test 3
   - input: putdown `(in X (union a b))`
   - output: LaTeX `X\in a\cup b`, typeset $X\in a\cup b$
- Test 4
   - input: putdown `(in (union A B) (union X Y))`
   - output: LaTeX `A\cup B\in X\cup Y`, typeset $A\cup B\in X\cup Y$
- Test 5
   - input: putdown `(subset A (complement B))`
   - output: LaTeX `A\subset \bar B`, typeset $A\subset \bar B$
- Test 6
   - input: putdown `(subseteq (intersection u v) (union u v))`
   - output: LaTeX `u\cap v\subseteq u\cup v`, typeset $u\cap v\subseteq u\cup v$
- Test 7
   - input: putdown `(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))`
   - output: LaTeX `\{1\}\subseteq \{1\}\cup \{2\}`, typeset $\{1\}\subseteq \{1\}\cup \{2\}$
- Test 8
   - input: putdown `(in p (cartesianproduct U V))`
   - output: LaTeX `p\in U\times V`, typeset $p\in U\times V$
- Test 9
   - input: putdown `(in q (union (complement U) (cartesianproduct V W)))`
   - output: LaTeX `q\in \bar U\cup V\times W`, typeset $q\in \bar U\cup V\times W$
- Test 10
   - input: putdown `(in (tuple (elts a (elts b))) (cartesianproduct A B))`
   - output: LaTeX `(a,b)\in A\times B`, typeset $(a,b)\in A\times B$
- Test 11
   - input: putdown `(in (vector (elts a (elts b))) (cartesianproduct A B))`
   - output: LaTeX `\langle a,b\rangle\in A\times B`, typeset $\langle a,b\rangle\in A\times B$


### does not undo the canonical form for "notin" notation

- Test 1
   - input: putdown `(not (in a A))`
   - output: LaTeX `\neg a\in A`, typeset $\neg a\in A$
- Test 2
   - input: putdown `(not (in emptyset emptyset))`
   - output: LaTeX `\neg \emptyset\in \emptyset`, typeset $\neg \emptyset\in \emptyset$
- Test 3
   - input: putdown `(not (in (- 3 5) (intersection K P)))`
   - output: LaTeX `\neg 3-5\in K\cap P`, typeset $\neg 3-5\in K\cap P$


### can convert sentences built from set operators

- Test 1
   - input: putdown `(or P (in b B))`
   - output: LaTeX `P\vee b\in B`, typeset $P\vee b\in B$
- Test 2
   - input: putdown `(in (or P b) B)`
   - output: LaTeX `{P\vee b}\in B`, typeset ${P\vee b}\in B$
- Test 3
   - input: putdown `(forall (x , (in x X)))`
   - output: LaTeX `\forall x, x\in X`, typeset $\forall x, x\in X$
- Test 4
   - input: putdown `(and (subseteq A B) (subseteq B A))`
   - output: LaTeX `A\subseteq B\wedge B\subseteq A`, typeset $A\subseteq B\wedge B\subseteq A$
- Test 5
   - input: putdown `(= R (cartesianproduct A B))`
   - output: LaTeX `R=A\times B`, typeset $R=A\times B$
- Test 6
   - input: putdown `(forall (n , (relationholds | n (! n))))`
   - output: LaTeX `\forall n, n | n!`, typeset $\forall n, n | n!$
- Test 7
   - input: putdown `(implies (relationholds ~ a b) (relationholds ~ b a))`
   - output: LaTeX `a \sim b\Rightarrow b \sim a`, typeset $a \sim b\Rightarrow b \sim a$


### can convert notation related to functions

- Test 1
   - input: putdown `(function f A B)`
   - output: LaTeX `f:A\to B`, typeset $f:A\to B$
- Test 2
   - input: putdown `(not (function F (union X Y) Z))`
   - output: LaTeX `\neg F:X\cup Y\to Z`, typeset $\neg F:X\cup Y\to Z$
- Test 3
   - input: putdown `(function (compose f g) A C)`
   - output: LaTeX `f\circ g:A\to C`, typeset $f\circ g:A\to C$
- Test 4
   - input: putdown `(apply f x)`
   - output: LaTeX `f(x)`, typeset $f(x)$
- Test 5
   - input: putdown `(apply (inverse f) (apply (inverse g) 10))`
   - output: LaTeX `f ^ { - 1 }(g ^ { - 1 }(10))`, typeset $f ^ { - 1 }(g ^ { - 1 }(10))$
- Test 6
   - input: putdown `(apply E (complement L))`
   - output: LaTeX `E(\bar L)`, typeset $E(\bar L)$
- Test 7
   - input: putdown `(intersection emptyset (apply f 2))`
   - output: LaTeX `\emptyset\cap f(2)`, typeset $\emptyset\cap f(2)$
- Test 8
   - input: putdown `(and (apply P e) (apply Q (+ 3 b)))`
   - output: LaTeX `P(e)\wedge Q(3+b)`, typeset $P(e)\wedge Q(3+b)$
- Test 9
   - input: putdown `(= F (compose G (inverse H)))`
   - output: LaTeX `F=G\circ H ^ { - 1 }`, typeset $F=G\circ H ^ { - 1 }$


### can convert expressions with trigonometric functions

- Test 1
   - input: putdown `(apply sin x)`
   - output: LaTeX `\sin x`, typeset $\sin x$
- Test 2
   - input: putdown `(apply cos (* pi x))`
   - output: LaTeX `\cos \pi\times x`, typeset $\cos \pi\times x$
- Test 3
   - input: putdown `(apply tan t)`
   - output: LaTeX `\tan t`, typeset $\tan t$
- Test 4
   - input: putdown `(/ 1 (apply cot pi))`
   - output: LaTeX `1\div \cot \pi`, typeset $1\div \cot \pi$
- Test 5
   - input: putdown `(= (apply sec y) (apply csc y))`
   - output: LaTeX `\sec y=\csc y`, typeset $\sec y=\csc y$


### can convert expressions with logarithms

- Test 1
   - input: putdown `(apply log n)`
   - output: LaTeX `\log n`, typeset $\log n$
- Test 2
   - input: putdown `(+ 1 (apply ln x))`
   - output: LaTeX `1+\ln x`, typeset $1+\ln x$
- Test 3
   - input: putdown `(apply (logbase 2) 1024)`
   - output: LaTeX `\log_2 1024`, typeset $\log_2 1024$
- Test 4
   - input: putdown `(/ (apply log n) (apply log (apply log n)))`
   - output: LaTeX `\log n\div \log \log n`, typeset $\log n\div \log \log n$


### can convert equivalence classes and expressions that use them

- Test 1
   - input: putdown `(equivclass 1 ~~)`
   - output: LaTeX `[1,\approx]`, typeset $[1,\approx]$
- Test 2
   - input: putdown `(union (equivclass 1 ~~) (equivclass 2 ~~))`
   - output: LaTeX `[1,\approx]\cup [2,\approx]`, typeset $[1,\approx]\cup [2,\approx]$


### can convert equivalence and classes mod a number

- Test 1
   - input: putdown `(=mod 5 11 3)`
   - output: LaTeX `5 \equiv 11 \mod 3`, typeset $5 \equiv 11 \mod 3$
- Test 2
   - input: putdown `(=mod k m n)`
   - output: LaTeX `k \equiv m \mod n`, typeset $k \equiv m \mod n$
- Test 3
   - input: putdown `(subset emptyset (modclass (- 1) 10))`
   - output: LaTeX `\emptyset\subset [-1, \equiv _ 10]`, typeset $\emptyset\subset [-1, \equiv _ 10]$


### can convert type sentences and combinations of them

- Test 1
   - input: putdown `(hastype x settype)`
   - output: LaTeX `x \text{is a set}`, typeset $x \text{is a set}$
- Test 2
   - input: putdown `(hastype n numbertype)`
   - output: LaTeX `n \text{is a number}`, typeset $n \text{is a number}$
- Test 3
   - input: putdown `(hastype S partialordertype)`
   - output: LaTeX `S \text{is a partial order}`, typeset $S \text{is a partial order}$
- Test 4
   - input: putdown `(and (hastype 1 numbertype) (hastype 10 numbertype))`
   - output: LaTeX `1 \text{is a number}\wedge 10 \text{is a number}`, typeset $1 \text{is a number}\wedge 10 \text{is a number}$
- Test 5
   - input: putdown `(implies (hastype R equivalencerelationtype) (hastype R relationtype))`
   - output: LaTeX `R \text{is an equivalence relation}\Rightarrow R \text{is a relation}`, typeset $R \text{is an equivalence relation}\Rightarrow R \text{is a relation}$


### can convert notation for expression function application

- Test 1
   - input: putdown `(efa f x)`
   - output: LaTeX `\mathcal{f} (x)`, typeset $\mathcal{f} (x)$
- Test 2
   - input: putdown `(apply F (efa k 10))`
   - output: LaTeX `F(\mathcal{k} (10))`, typeset $F(\mathcal{k} (10))$
- Test 3
   - input: putdown `(efa E (complement L))`
   - output: LaTeX `\mathcal{E} (\bar L)`, typeset $\mathcal{E} (\bar L)$
- Test 4
   - input: putdown `(intersection emptyset (efa f 2))`
   - output: LaTeX `\emptyset\cap \mathcal{f} (2)`, typeset $\emptyset\cap \mathcal{f} (2)$
- Test 5
   - input: putdown `(and (efa P x) (efa Q y))`
   - output: LaTeX `\mathcal{P} (x)\wedge \mathcal{Q} (y)`, typeset $\mathcal{P} (x)\wedge \mathcal{Q} (y)$


### can convert notation for assumptions

- Test 1
   - input: putdown `:X`
   - output: LaTeX `\text{Assume }X`, typeset $\text{Assume }X$
- Test 2
   - input: putdown `:(= k 1000)`
   - output: LaTeX `\text{Assume }k=1000`, typeset $\text{Assume }k=1000$
- Test 3
   - input: putdown `:true`
   - output: LaTeX `\text{Assume }\top`, typeset $\text{Assume }\top$
- Test 4
   - input: putdown `:50`
   - output: LaTeX `null`, typeset $undefined$
- Test 5
   - input: putdown `:(tuple (elts 5 (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$
- Test 6
   - input: putdown `:(compose f g)`
   - output: LaTeX `null`, typeset $undefined$
- Test 7
   - input: putdown `:emptyset`
   - output: LaTeX `null`, typeset $undefined$
- Test 8
   - input: putdown `:infinity`
   - output: LaTeX `null`, typeset $undefined$


### can convert notation for Let-style declarations

- Test 1
   - input: putdown `:[x]`
   - output: LaTeX `\text{Let }x`, typeset $\text{Let }x$
- Test 2
   - input: putdown `:[T]`
   - output: LaTeX `\text{Let }T`, typeset $\text{Let }T$
- Test 3
   - input: putdown `:[x , (> x 0)]`
   - output: LaTeX `\text{Let }x \text{ be such that }x>0`, typeset $\text{Let }x \text{ be such that }x>0$
- Test 4
   - input: putdown `:[T , (or (= T 5) (in T S))]`
   - output: LaTeX `\text{Let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{Let }T \text{ be such that }T=5\vee T\in S$
- Test 5
   - input: putdown `:[(> x 5)]`
   - output: LaTeX `null`, typeset $undefined$
- Test 6
   - input: putdown `:[(= 1 1)]`
   - output: LaTeX `null`, typeset $undefined$
- Test 7
   - input: putdown `:[emptyset]`
   - output: LaTeX `null`, typeset $undefined$
- Test 8
   - input: putdown `:[x , 1]`
   - output: LaTeX `null`, typeset $undefined$
- Test 9
   - input: putdown `:[x , (or 1 2)]`
   - output: LaTeX `null`, typeset $undefined$
- Test 10
   - input: putdown `:[x , [y]]`
   - output: LaTeX `null`, typeset $undefined$
- Test 11
   - input: putdown `:[x , :B]`
   - output: LaTeX `null`, typeset $undefined$


### can convert notation for For Some-style declarations

- Test 1
   - input: putdown `[x , (> x 0)]`
   - output: LaTeX `\text{For some }x, x>0`, typeset $\text{For some }x, x>0$
- Test 2
   - input: putdown `[T , (or (= T 5) (in T S))]`
   - output: LaTeX `\text{For some }T, T=5\vee T\in S`, typeset $\text{For some }T, T=5\vee T\in S$
- Test 3
   - input: putdown `[x]`
   - output: LaTeX `null`, typeset $undefined$
- Test 4
   - input: putdown `[T]`
   - output: LaTeX `null`, typeset $undefined$
- Test 5
   - input: putdown `[(> x 5)]`
   - output: LaTeX `null`, typeset $undefined$
- Test 6
   - input: putdown `[(= 1 1)]`
   - output: LaTeX `null`, typeset $undefined$
- Test 7
   - input: putdown `[emptyset]`
   - output: LaTeX `null`, typeset $undefined$
- Test 8
   - input: putdown `[x , 1]`
   - output: LaTeX `null`, typeset $undefined$
- Test 9
   - input: putdown `[x , (or 1 2)]`
   - output: LaTeX `null`, typeset $undefined$
- Test 10
   - input: putdown `[x , [y]]`
   - output: LaTeX `null`, typeset $undefined$
- Test 11
   - input: putdown `[x , :B]`
   - output: LaTeX `null`, typeset $undefined$


## <a name="Converting-LaTeX-to-putdown">Converting LaTeX to putdown</a>

### correctly converts many kinds of numbers but not malformed ones

- Test 1
   - input: LaTeX `0`, typeset $0$
   - output: putdown `0`
- Test 2
   - input: LaTeX `328975289`, typeset $328975289$
   - output: putdown `328975289`
- Test 3
   - input: LaTeX `-9097285323`, typeset $-9097285323$
   - output: putdown `(- 9097285323)`
- Test 4
   - input: LaTeX `0.0`, typeset $0.0$
   - output: putdown `0.0`
- Test 5
   - input: LaTeX `32897.5289`, typeset $32897.5289$
   - output: putdown `32897.5289`
- Test 6
   - input: LaTeX `-1.9097285323`, typeset $-1.9097285323$
   - output: putdown `(- 1.9097285323)`
- Test 7
   - input: LaTeX `0.0.0`, typeset $0.0.0$
   - output: putdown `null`
- Test 8
   - input: LaTeX `0k0`, typeset $0k0$
   - output: putdown `null`


### correctly converts one-letter variable names but not larger ones

- Test 1
   - input: LaTeX `x`, typeset $x$
   - output: putdown `x`
- Test 2
   - input: LaTeX `U`, typeset $U$
   - output: putdown `U`
- Test 3
   - input: LaTeX `Q`, typeset $Q$
   - output: putdown `Q`
- Test 4
   - input: LaTeX `m`, typeset $m$
   - output: putdown `m`
- Test 5
   - input: LaTeX `foo`, typeset $foo$
   - output: putdown `null`
- Test 6
   - input: LaTeX `Hi`, typeset $Hi$
   - output: putdown `null`


### correctly converts numeric constants

- Test 1
   - input: LaTeX `\infty`, typeset $\infty$
   - output: putdown `infinity`
- Test 2
   - input: LaTeX `\pi`, typeset $\pi$
   - output: putdown `pi`


### correctly converts exponentiation of atomics

- Test 1
   - input: LaTeX `1^2`, typeset $1^2$
   - output: putdown `(^ 1 2)`
- Test 2
   - input: LaTeX `e^x`, typeset $e^x$
   - output: putdown `(^ eulersnumber x)`
- Test 3
   - input: LaTeX `1^\infty`, typeset $1^\infty$
   - output: putdown `(^ 1 infinity)`


### correctly converts atomic percentages

- Test 1
   - input: LaTeX `10\%`, typeset $10\\%$
   - output: putdown `(% 10)`
- Test 2
   - input: LaTeX `t\%`, typeset $t\\%$
   - output: putdown `(% t)`
- Test 3
   - input: LaTeX `10!`, typeset $10!$
   - output: putdown `(! 10)`
- Test 4
   - input: LaTeX `t!`, typeset $t!$
   - output: putdown `(! t)`


### correctly converts division of atomics or factors

- Test 1
   - input: LaTeX `1\div2`, typeset $1\div2$
   - output: putdown `(/ 1 2)`
- Test 2
   - input: LaTeX `x\div y`, typeset $x\div y$
   - output: putdown `(/ x y)`
- Test 3
   - input: LaTeX `0\div\infty`, typeset $0\div\infty$
   - output: putdown `(/ 0 infinity)`
- Test 4
   - input: LaTeX `x^2\div3`, typeset $x^2\div3$
   - output: putdown `(/ (^ x 2) 3)`
- Test 5
   - input: LaTeX `1\div e^x`, typeset $1\div e^x$
   - output: putdown `(/ 1 (^ eulersnumber x))`
- Test 6
   - input: LaTeX `10\%\div2^{100}`, typeset $10\\%\div2^{100}$
   - output: putdown `(/ (% 10) (^ 2 100))`


### correctly converts multiplication of atomics or factors

- Test 1
   - input: LaTeX `1\times2`, typeset $1\times2$
   - output: putdown `(* 1 2)`
- Test 2
   - input: LaTeX `x\cdot y`, typeset $x\cdot y$
   - output: putdown `(* x y)`
- Test 3
   - input: LaTeX `0\times\infty`, typeset $0\times\infty$
   - output: putdown `(* 0 infinity)`
- Test 4
   - input: LaTeX `x^2\cdot3`, typeset $x^2\cdot3$
   - output: putdown `(* (^ x 2) 3)`
- Test 5
   - input: LaTeX `1\times e^x`, typeset $1\times e^x$
   - output: putdown `(* 1 (^ eulersnumber x))`
- Test 6
   - input: LaTeX `10\%\cdot2^{100}`, typeset $10\\%\cdot2^{100}$
   - output: putdown `(* (% 10) (^ 2 100))`


### correctly converts negations of atomics or factors

- Test 1
   - input: LaTeX `-1\times2`, typeset $-1\times2$
   - output: putdown `(* (- 1) 2)`
- Test 2
   - input: LaTeX `x\cdot{-y}`, typeset $x\cdot{-y}$
   - output: putdown `(* x (- y))`
- Test 3
   - input: LaTeX `x\cdot(-y)`, typeset $x\cdot(-y)$
   - output: putdown `(* x (- y))`
- Test 4
   - input: LaTeX `{-x^2}\cdot{-3}`, typeset ${-x^2}\cdot{-3}$
   - output: putdown `(* (- (^ x 2)) (- 3))`
- Test 5
   - input: LaTeX `(-x^2)\cdot(-3)`, typeset $(-x^2)\cdot(-3)$
   - output: putdown `(* (- (^ x 2)) (- 3))`
- Test 6
   - input: LaTeX `----1000`, typeset $----1000$
   - output: putdown `(- (- (- (- 1000))))`


### correctly converts additions and subtractions

- Test 1
   - input: LaTeX `x + y`, typeset $x + y$
   - output: putdown `(+ x y)`
- Test 2
   - input: LaTeX `1 - - 3`, typeset $1 - - 3$
   - output: putdown `(- 1 (- 3))`


### correctly converts number expressions with groupers

- Test 1
   - input: LaTeX `-{1\times2}`, typeset $-{1\times2}$
   - output: putdown `(- (* 1 2))`
- Test 2
   - input: LaTeX `-(1\times2)`, typeset $-(1\times2)$
   - output: putdown `(- (* 1 2))`
- Test 3
   - input: LaTeX `{x^2}!`, typeset ${x^2}!$
   - output: putdown `(! (^ x 2))`
- Test 4
   - input: LaTeX `(N-1)!`, typeset $(N-1)!$
   - output: putdown `(! (- N 1))`
- Test 5
   - input: LaTeX `\left(N-1\right)!`, typeset $\left(N-1\right)!$
   - output: putdown `(! (- N 1))`
- Test 6
   - input: LaTeX `\left(N-1)!`, typeset $\left(N-1)!$
   - output: putdown `null`
- Test 7
   - input: LaTeX `(N-1\right)!`, typeset $(N-1\right)!$
   - output: putdown `null`
- Test 8
   - input: LaTeX `3!\cdot4!`, typeset $3!\cdot4!$
   - output: putdown `(* (! 3) (! 4))`
- Test 9
   - input: LaTeX `{-x}^{2\cdot{-3}}`, typeset ${-x}^{2\cdot{-3}}$
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 10
   - input: LaTeX `(-x)^(2\cdot(-3))`, typeset $(-x)^(2\cdot(-3))$
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 11
   - input: LaTeX `(-x)^{2\cdot(-3)}`, typeset $(-x)^{2\cdot(-3)}$
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 12
   - input: LaTeX `{-3}^{1+2}`, typeset ${-3}^{1+2}$
   - output: putdown `(^ (- 3) (+ 1 2))`
- Test 13
   - input: LaTeX `k^{1-y}\cdot(2+k)`, typeset $k^{1-y}\cdot(2+k)$
   - output: putdown `(* (^ k (- 1 y)) (+ 2 k))`
- Test 14
   - input: LaTeX `0.99\approx1.01`, typeset $0.99\approx1.01$
   - output: putdown `(relationholds ~~ 0.99 1.01)`


### can convert relations of numeric expressions

- Test 1
   - input: LaTeX `1 > 2`, typeset $1 > 2$
   - output: putdown `(> 1 2)`
- Test 2
   - input: LaTeX `1 \gt 2`, typeset $1 \gt 2$
   - output: putdown `(> 1 2)`
- Test 3
   - input: LaTeX `1 - 2 < 1 + 2`, typeset $1 - 2 < 1 + 2$
   - output: putdown `(< (- 1 2) (+ 1 2))`
- Test 4
   - input: LaTeX `1 - 2 \lt 1 + 2`, typeset $1 - 2 \lt 1 + 2$
   - output: putdown `(< (- 1 2) (+ 1 2))`
- Test 5
   - input: LaTeX `\neg 1 = 2`, typeset $\neg 1 = 2$
   - output: putdown `(not (= 1 2))`
- Test 6
   - input: LaTeX `2 \ge 1 \wedge 2 \le 3`, typeset $2 \ge 1 \wedge 2 \le 3$
   - output: putdown `(and (>= 2 1) (<= 2 3))`
- Test 7
   - input: LaTeX `2\geq1\wedge2\leq3`, typeset $2\geq1\wedge2\leq3$
   - output: putdown `(and (>= 2 1) (<= 2 3))`
- Test 8
   - input: LaTeX `7 | 14`, typeset $7 | 14$
   - output: putdown `(relationholds | 7 14)`
- Test 9
   - input: LaTeX `7 \vert 14`, typeset $7 \vert 14$
   - output: putdown `(relationholds | 7 14)`
- Test 10
   - input: LaTeX `A ( k ) | n !`, typeset $A ( k ) | n !$
   - output: putdown `(relationholds | (apply A k) (! n))`
- Test 11
   - input: LaTeX `A ( k )\vert n !`, typeset $A ( k )\vert n !$
   - output: putdown `(relationholds | (apply A k) (! n))`
- Test 12
   - input: LaTeX `1 - k \sim 1 + k`, typeset $1 - k \sim 1 + k$
   - output: putdown `(relationholds ~ (- 1 k) (+ 1 k))`


### creates the canonical form for inequality

- Test 1
   - input: LaTeX `x \ne y`, typeset $x \ne y$
   - output: putdown `(not (= x y))`
- Test 2
   - input: LaTeX `x \neq y`, typeset $x \neq y$
   - output: putdown `(not (= x y))`
- Test 3
   - input: LaTeX `\neg x = y`, typeset $\neg x = y$
   - output: putdown `(not (= x y))`


### correctly converts propositional logic atomics

- Test 1
   - input: LaTeX `\top`, typeset $\top$
   - output: putdown `true`
- Test 2
   - input: LaTeX `\bot`, typeset $\bot$
   - output: putdown `false`
- Test 3
   - input: LaTeX `\rightarrow\leftarrow`, typeset $\rightarrow\leftarrow$
   - output: putdown `contradiction`


### correctly converts propositional logic conjuncts

- Test 1
   - input: LaTeX `\top\wedge\bot`, typeset $\top\wedge\bot$
   - output: putdown `(and true false)`
- Test 2
   - input: LaTeX `\neg P\wedge\neg\top`, typeset $\neg P\wedge\neg\top$
   - output: putdown `(and (not P) (not true))`


### correctly converts propositional logic disjuncts

- Test 1
   - input: LaTeX `\top\vee \neg A`, typeset $\top\vee \neg A$
   - output: putdown `(or true (not A))`
- Test 2
   - input: LaTeX `P\wedge Q\vee Q\wedge P`, typeset $P\wedge Q\vee Q\wedge P$
   - output: putdown `(or (and P Q) (and Q P))`


### correctly converts propositional logic conditionals

- Test 1
   - input: LaTeX `A\Rightarrow Q\wedge\neg P`, typeset $A\Rightarrow Q\wedge\neg P$
   - output: putdown `(implies A (and Q (not P)))`
- Test 2
   - input: LaTeX `P\vee Q\Rightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Rightarrow Q\wedge P\Rightarrow T$
   - output: putdown `(implies (or P Q) (implies (and Q P) T))`


### correctly converts propositional logic biconditionals

- Test 1
   - input: LaTeX `A\Leftrightarrow Q\wedge\neg P`, typeset $A\Leftrightarrow Q\wedge\neg P$
   - output: putdown `(iff A (and Q (not P)))`


### correctly converts propositional expressions with groupers

- Test 1
   - input: LaTeX `P\lor {Q\Leftrightarrow Q}\land P`, typeset $P\lor {Q\Leftrightarrow Q}\land P$
   - output: putdown `(or P (and (iff Q Q) P))`
- Test 2
   - input: LaTeX `\lnot{\top\Leftrightarrow\bot}`, typeset $\lnot{\top\Leftrightarrow\bot}$
   - output: putdown `(not (iff true false))`
- Test 3
   - input: LaTeX `\lnot\left(\top\Leftrightarrow\bot\right)`, typeset $\lnot\left(\top\Leftrightarrow\bot\right)$
   - output: putdown `(not (iff true false))`
- Test 4
   - input: LaTeX `\lnot(\top\Leftrightarrow\bot)`, typeset $\lnot(\top\Leftrightarrow\bot)$
   - output: putdown `(not (iff true false))`


### correctly converts simple predicate logic expressions

- Test 1
   - input: LaTeX `\forall x, P`, typeset $\forall x, P$
   - output: putdown `(forall (x , P))`
- Test 2
   - input: LaTeX `\exists t,\neg Q`, typeset $\exists t,\neg Q$
   - output: putdown `(exists (t , (not Q)))`
- Test 3
   - input: LaTeX `\exists! k,m\Rightarrow n`, typeset $\exists! k,m\Rightarrow n$
   - output: putdown `(exists! (k , (implies m n)))`


### can convert finite and empty sets

- Test 1
   - input: LaTeX `\emptyset`, typeset $\emptyset$
   - output: putdown `emptyset`
- Test 2
   - input: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
   - output: putdown `(finiteset (elts 1))`
- Test 3
   - input: LaTeX `\left\{ 1 \right\}`, typeset $\left\{ 1 \right\}$
   - output: putdown `(finiteset (elts 1))`
- Test 4
   - input: LaTeX `\{ 1 , 2 \}`, typeset $\{ 1 , 2 \}$
   - output: putdown `(finiteset (elts 1 (elts 2)))`
- Test 5
   - input: LaTeX `\{ 1 , 2 , 3 \}`, typeset $\{ 1 , 2 , 3 \}$
   - output: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
- Test 6
   - input: LaTeX `\{ \emptyset , \emptyset \}`, typeset $\{ \emptyset , \emptyset \}$
   - output: putdown `(finiteset (elts emptyset (elts emptyset)))`
- Test 7
   - input: LaTeX `\{ \{ \emptyset \} \}`, typeset $\{ \{ \emptyset \} \}$
   - output: putdown `(finiteset (elts (finiteset (elts emptyset))))`
- Test 8
   - input: LaTeX `\{ 3 , x \}`, typeset $\{ 3 , x \}$
   - output: putdown `(finiteset (elts 3 (elts x)))`
- Test 9
   - input: LaTeX `\left\{ 3 , x \right\}`, typeset $\left\{ 3 , x \right\}$
   - output: putdown `(finiteset (elts 3 (elts x)))`
- Test 10
   - input: LaTeX `\{ A \cup B , A \cap B \}`, typeset $\{ A \cup B , A \cap B \}$
   - output: putdown `(finiteset (elts (union A B) (elts (intersection A B))))`
- Test 11
   - input: LaTeX `\{ 1 , 2 , \emptyset , K , P \}`, typeset $\{ 1 , 2 , \emptyset , K , P \}$
   - output: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`


### correctly converts tuples and vectors

- Test 1
   - input: LaTeX `( 5 , 6 )`, typeset $( 5 , 6 )$
   - output: putdown `(tuple (elts 5 (elts 6)))`
- Test 2
   - input: LaTeX `( 5 , A \cup B , k )`, typeset $( 5 , A \cup B , k )$
   - output: putdown `(tuple (elts 5 (elts (union A B) (elts k))))`
- Test 3
   - input: LaTeX `\langle 5 , 6 \rangle`, typeset $\langle 5 , 6 \rangle$
   - output: putdown `(vector (elts 5 (elts 6)))`
- Test 4
   - input: LaTeX `\langle 5 , - 7 , k \rangle`, typeset $\langle 5 , - 7 , k \rangle$
   - output: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
- Test 5
   - input: LaTeX `()`, typeset $()$
   - output: putdown `null`
- Test 6
   - input: LaTeX `(())`, typeset $(())$
   - output: putdown `null`
- Test 7
   - input: LaTeX `(3)`, typeset $(3)$
   - output: putdown `3`
- Test 8
   - input: LaTeX `\langle\rangle`, typeset $\langle\rangle$
   - output: putdown `null`
- Test 9
   - input: LaTeX `\langle3\rangle`, typeset $\langle3\rangle$
   - output: putdown `null`
- Test 10
   - input: LaTeX `( ( 1 , 2 ) , 6 )`, typeset $( ( 1 , 2 ) , 6 )$
   - output: putdown `(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))`
- Test 11
   - input: LaTeX `\langle(1,2),6\rangle`, typeset $\langle(1,2),6\rangle$
   - output: putdown `null`
- Test 12
   - input: LaTeX `\langle\langle1,2\rangle,6\rangle`, typeset $\langle\langle1,2\rangle,6\rangle$
   - output: putdown `null`
- Test 13
   - input: LaTeX `\langle A\cup B,6\rangle`, typeset $\langle A\cup B,6\rangle$
   - output: putdown `null`


### can convert simple set memberships and subsets

- Test 1
   - input: LaTeX `b \in B`, typeset $b \in B$
   - output: putdown `(in b B)`
- Test 2
   - input: LaTeX `2 \in \{ 1 , 2 \}`, typeset $2 \in \{ 1 , 2 \}$
   - output: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
- Test 3
   - input: LaTeX `X \in a \cup b`, typeset $X \in a \cup b$
   - output: putdown `(in X (union a b))`
- Test 4
   - input: LaTeX `A \cup B \in X \cup Y`, typeset $A \cup B \in X \cup Y$
   - output: putdown `(in (union A B) (union X Y))`
- Test 5
   - input: LaTeX `A \subset \bar B`, typeset $A \subset \bar B$
   - output: putdown `(subset A (complement B))`
- Test 6
   - input: LaTeX `u \cap v \subseteq u \cup v`, typeset $u \cap v \subseteq u \cup v$
   - output: putdown `(subseteq (intersection u v) (union u v))`
- Test 7
   - input: LaTeX `\{1\}\subseteq\{1\}\cup\{2\}`, typeset $\{1\}\subseteq\{1\}\cup\{2\}$
   - output: putdown `(subseteq (finiteset (elts 1)) (union (finiteset (elts 1)) (finiteset (elts 2))))`
- Test 8
   - input: LaTeX `p \in U \times V`, typeset $p \in U \times V$
   - output: putdown `(in p (cartesianproduct U V))`
- Test 9
   - input: LaTeX `q \in \bar U \cup V \times W`, typeset $q \in \bar U \cup V \times W$
   - output: putdown `(in q (union (complement U) (cartesianproduct V W)))`
- Test 10
   - input: LaTeX `( a , b ) \in A \times B`, typeset $( a , b ) \in A \times B$
   - output: putdown `(in (tuple (elts a (elts b))) (cartesianproduct A B))`
- Test 11
   - input: LaTeX `\langle a , b \rangle \in A \times B`, typeset $\langle a , b \rangle \in A \times B$
   - output: putdown `(in (vector (elts a (elts b))) (cartesianproduct A B))`


### expands "notin" notation into canonical form

- Test 1
   - input: LaTeX `a\notin A`, typeset $a\notin A$
   - output: putdown `(not (in a A))`
- Test 2
   - input: LaTeX `\emptyset \notin \emptyset`, typeset $\emptyset \notin \emptyset$
   - output: putdown `(not (in emptyset emptyset))`
- Test 3
   - input: LaTeX `3-5\notin K\cap P`, typeset $3-5\notin K\cap P$
   - output: putdown `(not (in (- 3 5) (intersection K P)))`


### can convert sentences built from set operators

- Test 1
   - input: LaTeX `P \vee b \in B`, typeset $P \vee b \in B$
   - output: putdown `(or P (in b B))`
- Test 2
   - input: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
   - output: putdown `(in (or P b) B)`
- Test 3
   - input: LaTeX `\forall x , x \in X`, typeset $\forall x , x \in X$
   - output: putdown `(forall (x , (in x X)))`
- Test 4
   - input: LaTeX `A \subseteq B \wedge B \subseteq A`, typeset $A \subseteq B \wedge B \subseteq A$
   - output: putdown `(and (subseteq A B) (subseteq B A))`
- Test 5
   - input: LaTeX `R = A \times B`, typeset $R = A \times B$
   - output: putdown `(= R (* A B))`
- Test 6
   - input: LaTeX `R = A \cup B`, typeset $R = A \cup B$
   - output: putdown `(= R (union A B))`
- Test 7
   - input: LaTeX `\forall n , n | n !`, typeset $\forall n , n | n !$
   - output: putdown `(forall (n , (relationholds | n (! n))))`
- Test 8
   - input: LaTeX `a \sim b \Rightarrow b \sim a`, typeset $a \sim b \Rightarrow b \sim a$
   - output: putdown `(implies (relationholds ~ a b) (relationholds ~ b a))`


### can convert notation related to functions

- Test 1
   - input: LaTeX `f:A\to B`, typeset $f:A\to B$
   - output: putdown `(function f A B)`
- Test 2
   - input: LaTeX `f\colon A\to B`, typeset $f\colon A\to B$
   - output: putdown `(function f A B)`
- Test 3
   - input: LaTeX `\neg F:X\cup Y\to Z`, typeset $\neg F:X\cup Y\to Z$
   - output: putdown `(not (function F (union X Y) Z))`
- Test 4
   - input: LaTeX `\neg F\colon X\cup Y\to Z`, typeset $\neg F\colon X\cup Y\to Z$
   - output: putdown `(not (function F (union X Y) Z))`
- Test 5
   - input: LaTeX `f \circ g : A \to C`, typeset $f \circ g : A \to C$
   - output: putdown `(function (compose f g) A C)`
- Test 6
   - input: LaTeX `f(x)`, typeset $f(x)$
   - output: putdown `(apply f x)`
- Test 7
   - input: LaTeX `f ^ {-1} ( g ^ {-1} ( 10 ) )`, typeset $f ^ {-1} ( g ^ {-1} ( 10 ) )$
   - output: putdown `(apply (inverse f) (apply (inverse g) 10))`
- Test 8
   - input: LaTeX `E(\bar L)`, typeset $E(\bar L)$
   - output: putdown `(apply E (complement L))`
- Test 9
   - input: LaTeX `\emptyset\cap f(2)`, typeset $\emptyset\cap f(2)$
   - output: putdown `(intersection emptyset (apply f 2))`
- Test 10
   - input: LaTeX `P(e)\wedge Q(3+b)`, typeset $P(e)\wedge Q(3+b)$
   - output: putdown `(and (apply P eulersnumber) (apply Q (+ 3 b)))`
- Test 11
   - input: LaTeX `F=G\circ H^{-1}`, typeset $F=G\circ H^{-1}$
   - output: putdown `(= F (compose G (inverse H)))`


### can convert expressions with trigonometric functions

- Test 1
   - input: LaTeX `\sin x`, typeset $\sin x$
   - output: putdown `(apply sin x)`
- Test 2
   - input: LaTeX `\cos \pi \times x`, typeset $\cos \pi \times x$
   - output: putdown `(apply cos (* pi x))`
- Test 3
   - input: LaTeX `\tan t`, typeset $\tan t$
   - output: putdown `(apply tan t)`
- Test 4
   - input: LaTeX `1 \div \cot \pi`, typeset $1 \div \cot \pi$
   - output: putdown `(/ 1 (apply cot pi))`
- Test 5
   - input: LaTeX `\sec y = \csc y`, typeset $\sec y = \csc y$
   - output: putdown `(= (apply sec y) (apply csc y))`


### can convert expressions with logarithms

- Test 1
   - input: LaTeX `\log n`, typeset $\log n$
   - output: putdown `(apply log n)`
- Test 2
   - input: LaTeX `1 + \ln x`, typeset $1 + \ln x$
   - output: putdown `(+ 1 (apply ln x))`
- Test 3
   - input: LaTeX `\log_ 2 1024`, typeset $\log_ 2 1024$
   - output: putdown `(apply (logbase 2) 1024)`
- Test 4
   - input: LaTeX `\log n \div \log \log n`, typeset $\log n \div \log \log n$
   - output: putdown `(/ (apply log n) (apply log (apply log n)))`


### can convert equivalence classes and expressions that use them

- Test 1
   - input: LaTeX `[ 1 , \approx ]`, typeset $[ 1 , \approx ]$
   - output: putdown `(equivclass 1 ~~)`
- Test 2
   - input: LaTeX `\left[ 1 , \approx \right]`, typeset $\left[ 1 , \approx \right]$
   - output: putdown `(equivclass 1 ~~)`
- Test 3
   - input: LaTeX `\left[ 1 , \approx ]`, typeset $\left[ 1 , \approx ]$
   - output: putdown `null`
- Test 4
   - input: LaTeX `[ 1 , \approx \right]`, typeset $[ 1 , \approx \right]$
   - output: putdown `null`
- Test 5
   - input: LaTeX `[ x + 2 , \sim ]`, typeset $[ x + 2 , \sim ]$
   - output: putdown `(equivclass (+ x 2) ~)`
- Test 6
   - input: LaTeX `[ 1 , \approx ] \cup [ 2 , \approx ]`, typeset $[ 1 , \approx ] \cup [ 2 , \approx ]$
   - output: putdown `(union (equivclass 1 ~~) (equivclass 2 ~~))`
- Test 7
   - input: LaTeX `7 \in [ 7 , \sim ]`, typeset $7 \in [ 7 , \sim ]$
   - output: putdown `(in 7 (equivclass 7 ~))`
- Test 8
   - input: LaTeX `[P]`, typeset $[P]$
   - output: putdown `(equivclass P ~)`
- Test 9
   - input: LaTeX `\left[P\right]`, typeset $\left[P\right]$
   - output: putdown `(equivclass P ~)`


### can convert equivalence and classes mod a number

- Test 1
   - input: LaTeX `5 \equiv 11 \mod 3`, typeset $5 \equiv 11 \mod 3$
   - output: putdown `(=mod 5 11 3)`
- Test 2
   - input: LaTeX `k \equiv m \mod n`, typeset $k \equiv m \mod n$
   - output: putdown `(=mod k m n)`
- Test 3
   - input: LaTeX `\emptyset \subset [ - 1 , \equiv _ 10 ]`, typeset $\emptyset \subset [ - 1 , \equiv _ 10 ]$
   - output: putdown `(subset emptyset (modclass (- 1) 10))`
- Test 4
   - input: LaTeX `\emptyset \subset \left[ - 1 , \equiv _ 10 \right]`, typeset $\emptyset \subset \left[ - 1 , \equiv _ 10 \right]$
   - output: putdown `(subset emptyset (modclass (- 1) 10))`


### can convert type sentences and combinations of them

- Test 1
   - input: LaTeX `x \text{is a set}`, typeset $x \text{is a set}$
   - output: putdown `(hastype x settype)`
- Test 2
   - input: LaTeX `n \text{is }\text{a number}`, typeset $n \text{is }\text{a number}$
   - output: putdown `(hastype n numbertype)`
- Test 3
   - input: LaTeX `S\text{is}~\text{a partial order}`, typeset $S\text{is}~\text{a partial order}$
   - output: putdown `(hastype S partialordertype)`
- Test 4
   - input: LaTeX `1\text{is a number}\wedge 10\text{is a number}`, typeset $1\text{is a number}\wedge 10\text{is a number}$
   - output: putdown `(and (hastype 1 numbertype) (hastype 10 numbertype))`
- Test 5
   - input: LaTeX `R\text{is an equivalence relation}\Rightarrow R\text{is a relation}`, typeset $R\text{is an equivalence relation}\Rightarrow R\text{is a relation}$
   - output: putdown `(implies (hastype R equivalencerelationtype) (hastype R relationtype))`


### can convert notation for expression function application

- Test 1
   - input: LaTeX `\mathcal{f} (x)`, typeset $\mathcal{f} (x)$
   - output: putdown `(efa f x)`
- Test 2
   - input: LaTeX `F(\mathcal{k} (10))`, typeset $F(\mathcal{k} (10))$
   - output: putdown `(apply F (efa k 10))`
- Test 3
   - input: LaTeX `\mathcal{E} (\bar L)`, typeset $\mathcal{E} (\bar L)$
   - output: putdown `(efa E (complement L))`
- Test 4
   - input: LaTeX `\emptyset\cap \mathcal{f} (2)`, typeset $\emptyset\cap \mathcal{f} (2)$
   - output: putdown `(intersection emptyset (efa f 2))`
- Test 5
   - input: LaTeX `\mathcal{P} (x)\wedge \mathcal{Q} (y)`, typeset $\mathcal{P} (x)\wedge \mathcal{Q} (y)$
   - output: putdown `(and (efa P x) (efa Q y))`


### can convert notation for assumptions

- Test 1
   - input: LaTeX `\text{Assume }X`, typeset $\text{Assume }X$
   - output: putdown `:X`
- Test 2
   - input: LaTeX `\text{Assume }k=1000`, typeset $\text{Assume }k=1000$
   - output: putdown `:(= k 1000)`
- Test 3
   - input: LaTeX `\text{Assume }\top`, typeset $\text{Assume }\top$
   - output: putdown `:true`
- Test 4
   - input: LaTeX `\text{Assume }50`, typeset $\text{Assume }50$
   - output: putdown `null`
- Test 5
   - input: LaTeX `\text{assume }(5,6)`, typeset $\text{assume }(5,6)$
   - output: putdown `null`
- Test 6
   - input: LaTeX `\text{Given }f\circ g`, typeset $\text{Given }f\circ g$
   - output: putdown `null`
- Test 7
   - input: LaTeX `\text{given }\emptyset`, typeset $\text{given }\emptyset$
   - output: putdown `null`
- Test 8
   - input: LaTeX `\text{Assume }\infty`, typeset $\text{Assume }\infty$
   - output: putdown `null`


### can convert notation for Let-style declarations

- Test 1
   - input: LaTeX `\text{Let }x`, typeset $\text{Let }x$
   - output: putdown `:[x]`
- Test 2
   - input: LaTeX `\text{let }x`, typeset $\text{let }x$
   - output: putdown `:[x]`
- Test 3
   - input: LaTeX `\text{Let }T`, typeset $\text{Let }T$
   - output: putdown `:[T]`
- Test 4
   - input: LaTeX `\text{let }T`, typeset $\text{let }T$
   - output: putdown `:[T]`
- Test 5
   - input: LaTeX `\text{Let }x \text{ be such that }x>0`, typeset $\text{Let }x \text{ be such that }x>0$
   - output: putdown `:[x , (> x 0)]`
- Test 6
   - input: LaTeX `\text{let }x \text{ be such that }x>0`, typeset $\text{let }x \text{ be such that }x>0$
   - output: putdown `:[x , (> x 0)]`
- Test 7
   - input: LaTeX `\text{Let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{Let }T \text{ be such that }T=5\vee T\in S$
   - output: putdown `:[T , (or (= T 5) (in T S))]`
- Test 8
   - input: LaTeX `\text{let }T \text{ be such that }T=5\vee T\in S`, typeset $\text{let }T \text{ be such that }T=5\vee T\in S$
   - output: putdown `:[T , (or (= T 5) (in T S))]`
- Test 9
   - input: LaTeX `\text{Let }x>5`, typeset $\text{Let }x>5$
   - output: putdown `null`
- Test 10
   - input: LaTeX `\text{Let }1=1`, typeset $\text{Let }1=1$
   - output: putdown `null`
- Test 11
   - input: LaTeX `\text{Let }\emptyset`, typeset $\text{Let }\emptyset$
   - output: putdown `null`
- Test 12
   - input: LaTeX `\text{Let }x \text{ be such that }1`, typeset $\text{Let }x \text{ be such that }1$
   - output: putdown `null`
- Test 13
   - input: LaTeX `\text{Let }x \text{ be such that }1\vee 2`, typeset $\text{Let }x \text{ be such that }1\vee 2$
   - output: putdown `null`
- Test 14
   - input: LaTeX `\text{Let }x \text{ be such that }\text{Let }y`, typeset $\text{Let }x \text{ be such that }\text{Let }y$
   - output: putdown `null`
- Test 15
   - input: LaTeX `\text{Let }x \text{ be such that }\text{Assume }B`, typeset $\text{Let }x \text{ be such that }\text{Assume }B$
   - output: putdown `null`


### can convert notation for For Some-style declarations

- Test 1
   - input: LaTeX `\text{For some }x, x>0`, typeset $\text{For some }x, x>0$
   - output: putdown `[x , (> x 0)]`
- Test 2
   - input: LaTeX `\text{For some }T, T=5\vee T\in S`, typeset $\text{For some }T, T=5\vee T\in S$
   - output: putdown `[T , (or (= T 5) (in T S))]`
- Test 3
   - input: LaTeX `\text{For some }x`, typeset $\text{For some }x$
   - output: putdown `null`
- Test 4
   - input: LaTeX `\text{for some }x`, typeset $\text{for some }x$
   - output: putdown `null`
- Test 5
   - input: LaTeX `\text{For some }T`, typeset $\text{For some }T$
   - output: putdown `null`
- Test 6
   - input: LaTeX `\text{for some }T`, typeset $\text{for some }T$
   - output: putdown `null`
- Test 7
   - input: LaTeX `\text{For some }x>5, x>55`, typeset $\text{For some }x>5, x>55$
   - output: putdown `null`
- Test 8
   - input: LaTeX `\text{For some }1=1, P`, typeset $\text{For some }1=1, P$
   - output: putdown `null`
- Test 9
   - input: LaTeX `\text{For some }\emptyset, 1+1=2`, typeset $\text{For some }\emptyset, 1+1=2$
   - output: putdown `null`
- Test 10
   - input: LaTeX `x>55 \text{ for some } x>5`, typeset $x>55 \text{ for some } x>5$
   - output: putdown `null`
- Test 11
   - input: LaTeX `P \text{ for some } 1=1`, typeset $P \text{ for some } 1=1$
   - output: putdown `null`
- Test 12
   - input: LaTeX `\emptyset \text{ for some } 1+1=2`, typeset $\emptyset \text{ for some } 1+1=2$
   - output: putdown `null`
- Test 13
   - input: LaTeX `\text{For some }x, 1`, typeset $\text{For some }x, 1$
   - output: putdown `null`
- Test 14
   - input: LaTeX `\text{For some }x, 1\vee 2`, typeset $\text{For some }x, 1\vee 2$
   - output: putdown `null`
- Test 15
   - input: LaTeX `\text{For some }x, \text{Let }y`, typeset $\text{For some }x, \text{Let }y$
   - output: putdown `null`
- Test 16
   - input: LaTeX `\text{For some }x, \text{Assume }B`, typeset $\text{For some }x, \text{Assume }B$
   - output: putdown `null`
- Test 17
   - input: LaTeX `1~\text{for some}~x`, typeset $1~\text{for some}~x$
   - output: putdown `null`
- Test 18
   - input: LaTeX `1\vee 2~\text{for some}~x`, typeset $1\vee 2~\text{for some}~x$
   - output: putdown `null`
- Test 19
   - input: LaTeX `\text{Let }y~\text{for some}~x`, typeset $\text{Let }y~\text{for some}~x$
   - output: putdown `null`
- Test 20
   - input: LaTeX `\text{Assume }B~\text{for some}~x`, typeset $\text{Assume }B~\text{for some}~x$
   - output: putdown `null`


## <a name="Parsing-MathLive-style-LaTeX">Parsing MathLive-style LaTeX</a>

### correctly parses basic expressions

- Test 1
   - input: LaTeX `6+k`, typeset $6+k$
   - output: JSON `["Addition",["Number","6"],["NumberVariable","k"]]`
- Test 2
   - input: LaTeX `1.9-T`, typeset $1.9-T$
   - output: JSON `["Subtraction",["Number","1.9"],["NumberVariable","T"]]`
- Test 3
   - input: LaTeX `0.2\cdot0.3`, typeset $0.2\cdot0.3$
   - output: JSON `["Multiplication",["Number","0.2"],["Number","0.3"]]`
- Test 4
   - input: LaTeX `0.2\ast0.3`, typeset $0.2\ast0.3$
   - output: JSON `["Multiplication",["Number","0.2"],["Number","0.3"]]`
- Test 5
   - input: LaTeX `v\div w`, typeset $v\div w$
   - output: JSON `["Division",["NumberVariable","v"],["NumberVariable","w"]]`
- Test 6
   - input: LaTeX `2^{k}`, typeset $2^{k}$
   - output: JSON `["Exponentiation",["Number","2"],["NumberVariable","k"]]`
- Test 7
   - input: LaTeX `5.0-K+e`, typeset $5.0-K+e$
   - output: JSON `["Addition",["Subtraction",["Number","5.0"],["NumberVariable","K"]],"EulersNumber"]`
- Test 8
   - input: LaTeX `5.0\times K\div e`, typeset $5.0\times K\div e$
   - output: JSON `["Division",["Multiplication",["Number","5.0"],["NumberVariable","K"]],"EulersNumber"]`
- Test 9
   - input: LaTeX `\left(a^{b}\right)^{c}`, typeset $\left(a^{b}\right)^{c}$
   - output: JSON `["Exponentiation",["Exponentiation",["NumberVariable","a"],["NumberVariable","b"]],["NumberVariable","c"]]`
- Test 10
   - input: LaTeX `5.0-K\cdot e`, typeset $5.0-K\cdot e$
   - output: JSON `["Subtraction",["Number","5.0"],["Multiplication",["NumberVariable","K"],"EulersNumber"]]`
- Test 11
   - input: LaTeX `u^{v}\times w^{x}`, typeset $u^{v}\times w^{x}$
   - output: JSON `["Multiplication",["Exponentiation",["NumberVariable","u"],["NumberVariable","v"]],["Exponentiation",["NumberVariable","w"],["NumberVariable","x"]]]`
- Test 12
   - input: LaTeX `-A^{B}`, typeset $-A^{B}$
   - output: JSON `["NumberNegation",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]]]`


### respects groupers while parsing

- Test 1
   - input: LaTeX `6+\left(k+5\right)`, typeset $6+\left(k+5\right)$
   - output: JSON `["Addition",["Number","6"],["Addition",["NumberVariable","k"],["Number","5"]]]`
- Test 2
   - input: LaTeX `\left(5.0-K\right)\cdot e`, typeset $\left(5.0-K\right)\cdot e$
   - output: JSON `["Multiplication",["Subtraction",["Number","5.0"],["NumberVariable","K"]],"EulersNumber"]`
- Test 3
   - input: LaTeX `5.0\times\left(K+e\right)`, typeset $5.0\times\left(K+e\right)$
   - output: JSON `["Multiplication",["Number","5.0"],["Addition",["NumberVariable","K"],"EulersNumber"]]`
- Test 4
   - input: LaTeX `-\left(K+e\right)`, typeset $-\left(K+e\right)$
   - output: JSON `["NumberNegation",["Addition",["NumberVariable","K"],"EulersNumber"]]`
- Test 5
   - input: LaTeX `-\left(A^{B}\right)`, typeset $-\left(A^{B}\right)$
   - output: JSON `["NumberNegation",["Exponentiation",["NumberVariable","A"],["NumberVariable","B"]]]`


### correctly parses logarithms

- Test 1
   - input: LaTeX `\log1000`, typeset $\log1000$
   - output: JSON `["PrefixFunctionApplication","Logarithm",["Number","1000"]]`
- Test 2
   - input: LaTeX `\log e^{x}\times y`, typeset $\log e^{x}\times y$
   - output: JSON `["PrefixFunctionApplication","Logarithm",["Multiplication",["Exponentiation","EulersNumber",["NumberVariable","x"]],["NumberVariable","y"]]]`
- Test 3
   - input: LaTeX `\log_{-t}\left(k+5\right)`, typeset $\log_{-t}\left(k+5\right)$
   - output: JSON `["PrefixFunctionApplication",["LogarithmWithBase",["NumberNegation",["NumberVariable","t"]]],["Addition",["NumberVariable","k"],["Number","5"]]]`


### correctly parses fractions

- Test 1
   - input: LaTeX `\frac 1 2`, typeset $\frac 1 2$
   - output: JSON `["Division",["Number","1"],["Number","2"]]`
- Test 2
   - input: LaTeX `\frac{7-k}{1+x^2}`, typeset $\frac{7-k}{1+x^2}$
   - output: JSON `["Division",["Subtraction",["Number","7"],["NumberVariable","k"]],["Addition",["Number","1"],["Exponentiation",["NumberVariable","x"],["Number","2"]]]]`


### correctly parses sentences of arithmetic and algebra

- Test 1
   - input: LaTeX `t+u\ne t+v`, typeset $t+u\ne t+v$
   - output: JSON `["NotEqual",["Addition",["NumberVariable","t"],["NumberVariable","u"]],["Addition",["NumberVariable","t"],["NumberVariable","v"]]]`
- Test 2
   - input: LaTeX `a\div{7+b}\approx0.75`, typeset $a\div{7+b}\approx0.75$
   - output: JSON `["BinaryRelationHolds","ApproximatelyEqual",["Division",["NumberVariable","a"],["Addition",["Number","7"],["NumberVariable","b"]]],["Number","0.75"]]`
- Test 3
   - input: LaTeX `\frac{a}{7+b}\approx0.75`, typeset $\frac{a}{7+b}\approx0.75$
   - output: JSON `["BinaryRelationHolds","ApproximatelyEqual",["Division",["NumberVariable","a"],["Addition",["Number","7"],["NumberVariable","b"]]],["Number","0.75"]]`
- Test 4
   - input: LaTeX `t^2\le10`, typeset $t^2\le10$
   - output: JSON `["LessThanOrEqual",["Exponentiation",["NumberVariable","t"],["Number","2"]],["Number","10"]]`
- Test 5
   - input: LaTeX `1+2+3\ge6`, typeset $1+2+3\ge6$
   - output: JSON `["GreaterThanOrEqual",["Addition",["Addition",["Number","1"],["Number","2"]],["Number","3"]],["Number","6"]]`
- Test 6
   - input: LaTeX `\neg A+B=C^{D}`, typeset $\neg A+B=C^{D}$
   - output: JSON `["LogicalNegation",["Equals",["Addition",["NumberVariable","A"],["NumberVariable","B"]],["Exponentiation",["NumberVariable","C"],["NumberVariable","D"]]]]`
- Test 7
   - input: LaTeX `\lnot\lnot x=x`, typeset $\lnot\lnot x=x$
   - output: JSON `["LogicalNegation",["LogicalNegation",["EqualFunctions",["FunctionVariable","x"],["FunctionVariable","x"]]]]`
- Test 8
   - input: LaTeX `3\vert 9`, typeset $3\vert 9$
   - output: JSON `["BinaryRelationHolds","Divides",["Number","3"],["Number","9"]]`


### correctly parses trigonometric function applications

- Test 1
   - input: LaTeX `\cos x+1`, typeset $\cos x+1$
   - output: JSON `["Addition",["PrefixFunctionApplication","CosineFunction",["NumberVariable","x"]],["Number","1"]]`
- Test 2
   - input: LaTeX `\cot\left(a-9.9\right)`, typeset $\cot\left(a-9.9\right)$
   - output: JSON `["PrefixFunctionApplication","CotangentFunction",["Subtraction",["NumberVariable","a"],["Number","9.9"]]]`
- Test 3
   - input: LaTeX `\csc^{-1}\left(1+g\right)`, typeset $\csc^{-1}\left(1+g\right)$
   - output: JSON `["PrefixFunctionApplication",["PrefixFunctionInverse","CosecantFunction"],["Addition",["Number","1"],["NumberVariable","g"]]]`


### correctly parses factorials

- Test 1
   - input: LaTeX `\left(W+R\right)!`, typeset $\left(W+R\right)!$
   - output: JSON `["Factorial",["Addition",["NumberVariable","W"],["NumberVariable","R"]]]`


### correctly parses unusual implication symbols

- Test 1
   - input: LaTeX `P\Rarr Q`, typeset $P\Rarr Q$
   - output: JSON `["Implication",["LogicVariable","P"],["LogicVariable","Q"]]`
- Test 2
   - input: LaTeX `P\rArr Q`, typeset $P\rArr Q$
   - output: JSON `["Implication",["LogicVariable","P"],["LogicVariable","Q"]]`
- Test 3
   - input: LaTeX `Q\Larr P`, typeset $Q\Larr P$
   - output: JSON `["Implication",["LogicVariable","P"],["LogicVariable","Q"]]`
- Test 4
   - input: LaTeX `Q\lArr P`, typeset $Q\lArr P$
   - output: JSON `["Implication",["LogicVariable","P"],["LogicVariable","Q"]]`
- Test 5
   - input: LaTeX `P\lrArr Q`, typeset $P\lrArr Q$
   - output: JSON `["LogicalEquivalence",["LogicVariable","P"],["LogicVariable","Q"]]`
- Test 6
   - input: LaTeX `P\Lrarr Q`, typeset $P\Lrarr Q$
   - output: JSON `["LogicalEquivalence",["LogicVariable","P"],["LogicVariable","Q"]]`


### correctly parses unusual set theory notation

- Test 1
   - input: LaTeX `(A\cup B)^{\complement}`, typeset $(A\cup B)^{\complement}$
   - output: JSON `["SetComplement",["SetUnion",["SetVariable","A"],["SetVariable","B"]]]`


### correctly parses unusual function signature notation

- Test 1
   - input: LaTeX `f:A\rarr B`, typeset $f:A\rarr B$
   - output: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`
- Test 2
   - input: LaTeX `f\colon A\rarr B`, typeset $f\colon A\rarr B$
   - output: JSON `["FunctionSignature",["FunctionVariable","f"],["SetVariable","A"],["SetVariable","B"]]`


