
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


## <a name="Parsing-putdown">Parsing putdown</a>

### can convert putdown numbers to JSON

- Test 1
   - input: putdown `0`
   - output: JSON `["number","0"]`
- Test 2
   - input: putdown `453789`
   - output: JSON `["number","453789"]`
- Test 3
   - input: putdown `99999999999999999999999999999999999999999`
   - output: JSON `["number","99999999999999999999999999999999999999999"]`
- Test 4
   - input: putdown `(- 453789)`
   - output: JSON `["numbernegation",["number","453789"]]`
- Test 5
   - input: putdown `(- 99999999999999999999999999999999999999999)`
   - output: JSON `["numbernegation",["number","99999999999999999999999999999999999999999"]]`
- Test 6
   - input: putdown `0.0`
   - output: JSON `["number","0.0"]`
- Test 7
   - input: putdown `29835.6875940`
   - output: JSON `["number","29835.6875940"]`
- Test 8
   - input: putdown `653280458689.`
   - output: JSON `["number","653280458689."]`
- Test 9
   - input: putdown `.000006327589`
   - output: JSON `["number",".000006327589"]`
- Test 10
   - input: putdown `(- 29835.6875940)`
   - output: JSON `["numbernegation",["number","29835.6875940"]]`
- Test 11
   - input: putdown `(- 653280458689.)`
   - output: JSON `["numbernegation",["number","653280458689."]]`
- Test 12
   - input: putdown `(- .000006327589)`
   - output: JSON `["numbernegation",["number",".000006327589"]]`


### can convert any size variable name to JSON

- Test 1
   - input: putdown `x`
   - output: JSON `["funcvariable","x"]`
- Test 2
   - input: putdown `E`
   - output: JSON `["funcvariable","E"]`
- Test 3
   - input: putdown `q`
   - output: JSON `["funcvariable","q"]`
- Test 4
   - input: putdown `foo`
   - output: JSON `null`
- Test 5
   - input: putdown `bar`
   - output: JSON `null`
- Test 6
   - input: putdown `to`
   - output: JSON `null`


### can convert numeric constants from putdown to JSON

- Test 1
   - input: putdown `infinity`
   - output: JSON `["infinity"]`
- Test 2
   - input: putdown `pi`
   - output: JSON `["pi"]`
- Test 3
   - input: putdown `eulersnumber`
   - output: JSON `["eulersnumber"]`


### can convert exponentiation of atomics to JSON

- Test 1
   - input: putdown `(^ 1 2)`
   - output: JSON `["exponentiation",["number","1"],["number","2"]]`
- Test 2
   - input: putdown `(^ e x)`
   - output: JSON `["exponentiation",["numbervariable","e"],["numbervariable","x"]]`
- Test 3
   - input: putdown `(^ 1 infinity)`
   - output: JSON `["exponentiation",["number","1"],["infinity"]]`


### can convert atomic percentages and factorials to JSON

- Test 1
   - input: putdown `(% 10)`
   - output: JSON `["percentage",["number","10"]]`
- Test 2
   - input: putdown `(% t)`
   - output: JSON `["percentage",["numbervariable","t"]]`
- Test 3
   - input: putdown `(! 6)`
   - output: JSON `["factorial",["number","6"]]`
- Test 4
   - input: putdown `(! n)`
   - output: JSON `["factorial",["numbervariable","n"]]`


### can convert division of atomics or factors to JSON

- Test 1
   - input: putdown `(/ 1 2)`
   - output: JSON `["division",["number","1"],["number","2"]]`
- Test 2
   - input: putdown `(/ x y)`
   - output: JSON `["division",["numbervariable","x"],["numbervariable","y"]]`
- Test 3
   - input: putdown `(/ 0 infinity)`
   - output: JSON `["division",["number","0"],["infinity"]]`
- Test 4
   - input: putdown `(/ (^ x 2) 3)`
   - output: JSON `["division",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
- Test 5
   - input: putdown `(/ 1 (^ e x))`
   - output: JSON `["division",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
- Test 6
   - input: putdown `(/ (% 10) (^ 2 100))`
   - output: JSON `["division",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`


### can convert multiplication of atomics or factors to JSON

- Test 1
   - input: putdown `(* 1 2)`
   - output: JSON `["multiplication",["number","1"],["number","2"]]`
- Test 2
   - input: putdown `(* x y)`
   - output: JSON `["multiplication",["numbervariable","x"],["numbervariable","y"]]`
- Test 3
   - input: putdown `(* 0 infinity)`
   - output: JSON `["multiplication",["number","0"],["infinity"]]`
- Test 4
   - input: putdown `(* (^ x 2) 3)`
   - output: JSON `["multiplication",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
- Test 5
   - input: putdown `(* 1 (^ e x))`
   - output: JSON `["multiplication",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
- Test 6
   - input: putdown `(* (% 10) (^ 2 100))`
   - output: JSON `["multiplication",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`


### can convert negations of atomics or factors to JSON

- Test 1
   - input: putdown `(* (- 1) 2)`
   - output: JSON `["multiplication",["numbernegation",["number","1"]],["number","2"]]`
- Test 2
   - input: putdown `(* x (- y))`
   - output: JSON `["multiplication",["numbervariable","x"],["numbernegation",["numbervariable","y"]]]`
- Test 3
   - input: putdown `(* (- (^ x 2)) (- 3))`
   - output: JSON `["multiplication",["numbernegation",["exponentiation",["numbervariable","x"],["number","2"]]],["numbernegation",["number","3"]]]`
- Test 4
   - input: putdown `(- (- (- (- 1000))))`
   - output: JSON `["numbernegation",["numbernegation",["numbernegation",["numbernegation",["number","1000"]]]]]`


### can convert additions and subtractions to JSON

- Test 1
   - input: putdown `(+ x y)`
   - output: JSON `["addition",["numbervariable","x"],["numbervariable","y"]]`
- Test 2
   - input: putdown `(- 1 (- 3))`
   - output: JSON `["subtraction",["number","1"],["numbernegation",["number","3"]]]`
- Test 3
   - input: putdown `(+ (^ A B) (- C pi))`
   - output: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["pi"]]]`


### can convert number exprs that normally require groupers to JSON

- Test 1
   - input: putdown `(- (* 1 2))`
   - output: JSON `["numbernegation",["multiplication",["number","1"],["number","2"]]]`
- Test 2
   - input: putdown `(! (^ x 2))`
   - output: JSON `["factorial",["exponentiation",["numbervariable","x"],["number","2"]]]`
- Test 3
   - input: putdown `(^ (- x) (* 2 (- 3)))`
   - output: JSON `["exponentiation",["numbernegation",["numbervariable","x"]],["multiplication",["number","2"],["numbernegation",["number","3"]]]]`
- Test 4
   - input: putdown `(^ (- 3) (+ 1 2))`
   - output: JSON `["exponentiation",["numbernegation",["number","3"]],["addition",["number","1"],["number","2"]]]`


### can convert relations of numeric expressions to JSON

- Test 1
   - input: putdown `(> 1 2)`
   - output: JSON `["greaterthan",["number","1"],["number","2"]]`
- Test 2
   - input: putdown `(< (- 1 2) (+ 1 2))`
   - output: JSON `["lessthan",["subtraction",["number","1"],["number","2"]],["addition",["number","1"],["number","2"]]]`
- Test 3
   - input: putdown `(not (= 1 2))`
   - output: JSON `["logicnegation",["equality",["number","1"],["number","2"]]]`
- Test 4
   - input: putdown `(and (>= 2 1) (<= 2 3))`
   - output: JSON `["conjunction",["greaterthanoreq",["number","2"],["number","1"]],["lessthanoreq",["number","2"],["number","3"]]]`
- Test 5
   - input: putdown `(divides 7 14)`
   - output: JSON `["divides",["number","7"],["number","14"]]`
- Test 6
   - input: putdown `(divides (apply A k) (! n))`
   - output: JSON `["divides",["numfuncapp",["funcvariable","A"],["numbervariable","k"]],["factorial",["numbervariable","n"]]]`
- Test 7
   - input: putdown `(~ (- 1 k) (+ 1 k))`
   - output: JSON `["genericrelation",["subtraction",["number","1"],["numbervariable","k"]],["addition",["number","1"],["numbervariable","k"]]]`


### does not undo the canonical form for inequality

- Test 1
   - input: putdown `(not (= x y))`
   - output: JSON `["logicnegation",["equality",["numbervariable","x"],["numbervariable","y"]]]`


### can convert propositional logic atomics to JSON

- Test 1
   - input: putdown `true`
   - output: JSON `["logicaltrue"]`
- Test 2
   - input: putdown `false`
   - output: JSON `["logicalfalse"]`
- Test 3
   - input: putdown `contradiction`
   - output: JSON `["contradiction"]`


### can convert propositional logic conjuncts to JSON

- Test 1
   - input: putdown `(and true false)`
   - output: JSON `["conjunction",["logicaltrue"],["logicalfalse"]]`
- Test 2
   - input: putdown `(and (not P) (not true))`
   - output: JSON `["conjunction",["logicnegation",["logicvariable","P"]],["logicnegation",["logicaltrue"]]]`
- Test 3
   - input: putdown `(and (and a b) c)`
   - output: JSON `["conjunction",["conjunction",["logicvariable","a"],["logicvariable","b"]],["logicvariable","c"]]`


### can convert propositional logic disjuncts to JSON

- Test 1
   - input: putdown `(or true (not A))`
   - output: JSON `["disjunction",["logicaltrue"],["logicnegation",["logicvariable","A"]]]`
- Test 2
   - input: putdown `(or (and P Q) (and Q P))`
   - output: JSON `["disjunction",["conjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]]`


### can convert propositional logic conditionals to JSON

- Test 1
   - input: putdown `(implies A (and Q (not P)))`
   - output: JSON `["implication",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
- Test 2
   - input: putdown `(implies (implies (or P Q) (and Q P)) T)`
   - output: JSON `["implication",["implication",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]],["logicvariable","T"]]`


### can convert propositional logic biconditionals to JSON

- Test 1
   - input: putdown `(iff A (and Q (not P)))`
   - output: JSON `["iff",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
- Test 2
   - input: putdown `(implies (iff (or P Q) (and Q P)) T)`
   - output: JSON `["implication",["iff",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]],["logicvariable","T"]]`


### can convert propositional expressions with groupers to JSON

- Test 1
   - input: putdown `(or P (and (iff Q Q) P))`
   - output: JSON `["disjunction",["logicvariable","P"],["conjunction",["iff",["logicvariable","Q"],["logicvariable","Q"]],["logicvariable","P"]]]`
- Test 2
   - input: putdown `(not (iff true false))`
   - output: JSON `["logicnegation",["iff",["logicaltrue"],["logicalfalse"]]]`


### can convert simple predicate logic expressions to JSON

- Test 1
   - input: putdown `(forall (x , P))`
   - output: JSON `["universal",["numbervariable","x"],["logicvariable","P"]]`
- Test 2
   - input: putdown `(exists (t , (not Q)))`
   - output: JSON `["existential",["numbervariable","t"],["logicnegation",["logicvariable","Q"]]]`
- Test 3
   - input: putdown `(existsunique (k , (implies m n)))`
   - output: JSON `["existsunique",["numbervariable","k"],["implication",["logicvariable","m"],["logicvariable","n"]]]`


### can convert finite and empty sets to JSON

- Test 1
   - input: putdown `emptyset`
   - output: JSON `["emptyset"]`
- Test 2
   - input: putdown `(finiteset (elts 1))`
   - output: JSON `["finiteset",["oneeltseq",["number","1"]]]`
- Test 3
   - input: putdown `(finiteset (elts 1 (elts 2)))`
   - output: JSON `["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]`
- Test 4
   - input: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
   - output: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["oneeltseq",["number","3"]]]]]`
- Test 5
   - input: putdown `(finiteset (elts emptyset (elts emptyset)))`
   - output: JSON `["finiteset",["eltthenseq",["emptyset"],["oneeltseq",["emptyset"]]]]`
- Test 6
   - input: putdown `(finiteset (elts (finiteset (elts emptyset))))`
   - output: JSON `["finiteset",["oneeltseq",["finiteset",["oneeltseq",["emptyset"]]]]]`
- Test 7
   - input: putdown `(finiteset (elts 3 (elts x)))`
   - output: JSON `["finiteset",["eltthenseq",["number","3"],["oneeltseq",["numbervariable","x"]]]]`
- Test 8
   - input: putdown `(finiteset (elts (setuni A B) (elts (setint A B))))`
   - output: JSON `["finiteset",["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
- Test 9
   - input: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`
   - output: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["eltthenseq",["emptyset"],["eltthenseq",["numbervariable","K"],["oneeltseq",["numbervariable","P"]]]]]]]`


### can convert tuples and vectors to JSON

- Test 1
   - input: putdown `(tuple (elts 5 (elts 6)))`
   - output: JSON `["tuple",["eltthenseq",["number","5"],["oneeltseq",["number","6"]]]]`
- Test 2
   - input: putdown `(tuple (elts 5 (elts (setuni A B) (elts k))))`
   - output: JSON `["tuple",["eltthenseq",["number","5"],["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["numbervariable","k"]]]]]`
- Test 3
   - input: putdown `(vector (elts 5 (elts 6)))`
   - output: JSON `["vector",["numthenseq",["number","5"],["onenumseq",["number","6"]]]]`
- Test 4
   - input: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
   - output: JSON `["vector",["numthenseq",["number","5"],["numthenseq",["numbernegation",["number","7"]],["onenumseq",["numbervariable","k"]]]]]`
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
   - output: JSON `["tuple",["eltthenseq",["tuple",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]],["oneeltseq",["number","6"]]]]`
- Test 12
   - input: putdown `(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))`
   - output: JSON `null`
- Test 13
   - input: putdown `(vector (elts (vector (elts 1 (elts 2))) (elts 6)))`
   - output: JSON `null`
- Test 14
   - input: putdown `(vector (elts (setuni A B) (elts 6)))`
   - output: JSON `null`


### can convert simple set memberships and subsets to JSON

- Test 1
   - input: putdown `(in b B)`
   - output: JSON `["nounisin",["numbervariable","b"],["setvariable","B"]]`
- Test 2
   - input: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
   - output: JSON `["nounisin",["number","2"],["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]]`
- Test 3
   - input: putdown `(in X (setuni a b))`
   - output: JSON `["nounisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
- Test 4
   - input: putdown `(in (setuni A B) (setuni X Y))`
   - output: JSON `["nounisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
- Test 5
   - input: putdown `(subset A (setcomp B))`
   - output: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
- Test 6
   - input: putdown `(subseteq (setint u v) (setuni u v))`
   - output: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
- Test 7
   - input: putdown `(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))`
   - output: JSON `["subseteq",["finiteset",["oneeltseq",["number","1"]]],["union",["finiteset",["oneeltseq",["number","1"]]],["finiteset",["oneeltseq",["number","2"]]]]]`
- Test 8
   - input: putdown `(in p (setprod U V))`
   - output: JSON `["nounisin",["numbervariable","p"],["setproduct",["setvariable","U"],["setvariable","V"]]]`
- Test 9
   - input: putdown `(in q (setuni (setcomp U) (setprod V W)))`
   - output: JSON `["nounisin",["numbervariable","q"],["union",["complement",["setvariable","U"]],["setproduct",["setvariable","V"],["setvariable","W"]]]]`
- Test 10
   - input: putdown `(in (tuple (elts a (elts b))) (setprod A B))`
   - output: JSON `["nounisin",["tuple",["eltthenseq",["numbervariable","a"],["oneeltseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`
- Test 11
   - input: putdown `(in (vector (elts a (elts b))) (setprod A B))`
   - output: JSON `["nounisin",["vector",["numthenseq",["numbervariable","a"],["onenumseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`


### does not undo the canonical form for "notin" notation

- Test 1
   - input: putdown `(not (in a A))`
   - output: JSON `["logicnegation",["nounisin",["numbervariable","a"],["setvariable","A"]]]`
- Test 2
   - input: putdown `(not (in emptyset emptyset))`
   - output: JSON `["logicnegation",["nounisin",["emptyset"],["emptyset"]]]`
- Test 3
   - input: putdown `(not (in (- 3 5) (setint K P)))`
   - output: JSON `["logicnegation",["nounisin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]]`


### can parse to JSON sentences built from various relations

- Test 1
   - input: putdown `(or P (in b B))`
   - output: JSON `["disjunction",["logicvariable","P"],["nounisin",["numbervariable","b"],["setvariable","B"]]]`
- Test 2
   - input: putdown `(forall (x , (in x X)))`
   - output: JSON `["universal",["numbervariable","x"],["nounisin",["numbervariable","x"],["setvariable","X"]]]`
- Test 3
   - input: putdown `(and (subseteq A B) (subseteq B A))`
   - output: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`
- Test 4
   - input: putdown `(= R (setprod A B))`
   - output: JSON `["equality",["numbervariable","R"],["setproduct",["setvariable","A"],["setvariable","B"]]]`
- Test 5
   - input: putdown `(forall (n , (divides n (! n))))`
   - output: JSON `["universal",["numbervariable","n"],["divides",["numbervariable","n"],["factorial",["numbervariable","n"]]]]`
- Test 6
   - input: putdown `(implies (~ a b) (~ b a))`
   - output: JSON `["implication",["genericrelation",["numbervariable","a"],["numbervariable","b"]],["genericrelation",["numbervariable","b"],["numbervariable","a"]]]`


### can parse notation related to functions

- Test 1
   - input: putdown `(function f A B)`
   - output: JSON `["funcsignature",["funcvariable","f"],["setvariable","A"],["setvariable","B"]]`
- Test 2
   - input: putdown `(not (function F (setuni X Y) Z))`
   - output: JSON `["logicnegation",["funcsignature",["funcvariable","F"],["union",["setvariable","X"],["setvariable","Y"]],["setvariable","Z"]]]`
- Test 3
   - input: putdown `(function (compose f g) A C)`
   - output: JSON `["funcsignature",["funccomp",["funcvariable","f"],["funcvariable","g"]],["setvariable","A"],["setvariable","C"]]`
- Test 4
   - input: putdown `(apply f x)`
   - output: JSON `["numfuncapp",["funcvariable","f"],["numbervariable","x"]]`
- Test 5
   - input: putdown `(apply (inverse f) (apply (inverse g) 10))`
   - output: JSON `["numfuncapp",["funcinverse",["funcvariable","f"]],["numfuncapp",["funcinverse",["funcvariable","g"]],["number","10"]]]`
- Test 6
   - input: putdown `(apply E (setcomp L))`
   - output: JSON `["numfuncapp",["funcvariable","E"],["complement",["setvariable","L"]]]`
- Test 7
   - input: putdown `(setint emptyset (apply f 2))`
   - output: JSON `["intersection",["emptyset"],["setfuncapp",["funcvariable","f"],["number","2"]]]`
- Test 8
   - input: putdown `(and (apply P e) (apply Q (+ 3 b)))`
   - output: JSON `["conjunction",["propfuncapp",["funcvariable","P"],["numbervariable","e"]],["propfuncapp",["funcvariable","Q"],["addition",["number","3"],["numbervariable","b"]]]]`
- Test 9
   - input: putdown `(= (apply f x) 3)`
   - output: JSON `["equality",["numfuncapp",["funcvariable","f"],["numbervariable","x"]],["number","3"]]`
- Test 10
   - input: putdown `(= F (compose G (inverse H)))`
   - output: JSON `["funcequality",["funcvariable","F"],["funccomp",["funcvariable","G"],["funcinverse",["funcvariable","H"]]]]`


### can parse trigonometric functions correctly

- Test 1
   - input: putdown `(apply sin x)`
   - output: JSON `["prefixfuncapp",["sinfunc"],["numbervariable","x"]]`
- Test 2
   - input: putdown `(apply cos (* pi x))`
   - output: JSON `["prefixfuncapp",["cosfunc"],["multiplication",["pi"],["numbervariable","x"]]]`
- Test 3
   - input: putdown `(apply tan t)`
   - output: JSON `["prefixfuncapp",["tanfunc"],["numbervariable","t"]]`
- Test 4
   - input: putdown `(/ 1 (apply cot pi))`
   - output: JSON `["division",["number","1"],["prefixfuncapp",["cotfunc"],["pi"]]]`
- Test 5
   - input: putdown `(= (apply sec y) (apply csc y))`
   - output: JSON `["equality",["prefixfuncapp",["secfunc"],["numbervariable","y"]],["prefixfuncapp",["cscfunc"],["numbervariable","y"]]]`


### can parse logarithms correctly

- Test 1
   - input: putdown `(apply log n)`
   - output: JSON `["prefixfuncapp",["logarithm"],["numbervariable","n"]]`
- Test 2
   - input: putdown `(+ 1 (apply ln x))`
   - output: JSON `["addition",["number","1"],["prefixfuncapp",["naturallog"],["numbervariable","x"]]]`
- Test 3
   - input: putdown `(apply (logbase 2) 1024)`
   - output: JSON `["prefixfuncapp",["logwithbase",["number","2"]],["number","1024"]]`
- Test 4
   - input: putdown `(/ (apply log n) (apply log (apply log n)))`
   - output: JSON `["division",["prefixfuncapp",["logarithm"],["numbervariable","n"]],["prefixfuncapp",["logarithm"],["prefixfuncapp",["logarithm"],["numbervariable","n"]]]]`


## <a name="Rendering-JSON-into-putdown">Rendering JSON into putdown</a>

### can convert JSON numbers to putdown

- Test 1
   - input: JSON `["number","0"]`
   - output: putdown `0`
- Test 2
   - input: JSON `["number","453789"]`
   - output: putdown `453789`
- Test 3
   - input: JSON `["number","99999999999999999999999999999999999999999"]`
   - output: putdown `99999999999999999999999999999999999999999`
- Test 4
   - input: JSON `["numbernegation",["number","453789"]]`
   - output: putdown `(- 453789)`
- Test 5
   - input: JSON `["numbernegation",["number","99999999999999999999999999999999999999999"]]`
   - output: putdown `(- 99999999999999999999999999999999999999999)`
- Test 6
   - input: JSON `["number","0.0"]`
   - output: putdown `0.0`
- Test 7
   - input: JSON `["number","29835.6875940"]`
   - output: putdown `29835.6875940`
- Test 8
   - input: JSON `["number","653280458689."]`
   - output: putdown `653280458689.`
- Test 9
   - input: JSON `["number",".000006327589"]`
   - output: putdown `.000006327589`
- Test 10
   - input: JSON `["numbernegation",["number","29835.6875940"]]`
   - output: putdown `(- 29835.6875940)`
- Test 11
   - input: JSON `["numbernegation",["number","653280458689."]]`
   - output: putdown `(- 653280458689.)`
- Test 12
   - input: JSON `["numbernegation",["number",".000006327589"]]`
   - output: putdown `(- .000006327589)`


### can convert any size variable name from JSON to putdown

- Test 1
   - input: JSON `["numbervariable","x"]`
   - output: putdown `x`
- Test 2
   - input: JSON `["numbervariable","E"]`
   - output: putdown `E`
- Test 3
   - input: JSON `["numbervariable","q"]`
   - output: putdown `q`
- Test 4
   - input: JSON `["numbervariable","foo"]`
   - output: putdown `foo`
- Test 5
   - input: JSON `["numbervariable","bar"]`
   - output: putdown `bar`
- Test 6
   - input: JSON `["numbervariable","to"]`
   - output: putdown `to`


### can convert numeric constants from JSON to putdown

- Test 1
   - input: JSON `["infinity"]`
   - output: putdown `infinity`
- Test 2
   - input: JSON `["pi"]`
   - output: putdown `pi`
- Test 3
   - input: JSON `["eulersnumber"]`
   - output: putdown `eulersnumber`


### can convert exponentiation of atomics to putdown

- Test 1
   - input: JSON `["exponentiation",["number","1"],["number","2"]]`
   - output: putdown `(^ 1 2)`
- Test 2
   - input: JSON `["exponentiation",["numbervariable","e"],["numbervariable","x"]]`
   - output: putdown `(^ e x)`
- Test 3
   - input: JSON `["exponentiation",["number","1"],["infinity"]]`
   - output: putdown `(^ 1 infinity)`


### can convert atomic percentages and factorials to putdown

- Test 1
   - input: JSON `["percentage",["number","10"]]`
   - output: putdown `(% 10)`
- Test 2
   - input: JSON `["percentage",["numbervariable","t"]]`
   - output: putdown `(% t)`
- Test 3
   - input: JSON `["factorial",["number","100"]]`
   - output: putdown `(! 100)`
- Test 4
   - input: JSON `["factorial",["numbervariable","J"]]`
   - output: putdown `(! J)`


### can convert division of atomics or factors to putdown

- Test 1
   - input: JSON `["division",["number","1"],["number","2"]]`
   - output: putdown `(/ 1 2)`
- Test 2
   - input: JSON `["division",["numbervariable","x"],["numbervariable","y"]]`
   - output: putdown `(/ x y)`
- Test 3
   - input: JSON `["division",["number","0"],["infinity"]]`
   - output: putdown `(/ 0 infinity)`
- Test 4
   - input: JSON `["division",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
   - output: putdown `(/ (^ x 2) 3)`
- Test 5
   - input: JSON `["division",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
   - output: putdown `(/ 1 (^ e x))`
- Test 6
   - input: JSON `["division",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`
   - output: putdown `(/ (% 10) (^ 2 100))`


### can convert multiplication of atomics or factors to putdown

- Test 1
   - input: JSON `["multiplication",["number","1"],["number","2"]]`
   - output: putdown `(* 1 2)`
- Test 2
   - input: JSON `["multiplication",["numbervariable","x"],["numbervariable","y"]]`
   - output: putdown `(* x y)`
- Test 3
   - input: JSON `["multiplication",["number","0"],["infinity"]]`
   - output: putdown `(* 0 infinity)`
- Test 4
   - input: JSON `["multiplication",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
   - output: putdown `(* (^ x 2) 3)`
- Test 5
   - input: JSON `["multiplication",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
   - output: putdown `(* 1 (^ e x))`
- Test 6
   - input: JSON `["multiplication",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`
   - output: putdown `(* (% 10) (^ 2 100))`


### can convert negations of atomics or factors to putdown

- Test 1
   - input: JSON `["multiplication",["numbernegation",["number","1"]],["number","2"]]`
   - output: putdown `(* (- 1) 2)`
- Test 2
   - input: JSON `["multiplication",["numbervariable","x"],["numbernegation",["numbervariable","y"]]]`
   - output: putdown `(* x (- y))`
- Test 3
   - input: JSON `["multiplication",["numbernegation",["exponentiation",["numbervariable","x"],["number","2"]]],["numbernegation",["number","3"]]]`
   - output: putdown `(* (- (^ x 2)) (- 3))`
- Test 4
   - input: JSON `["numbernegation",["numbernegation",["numbernegation",["numbernegation",["number","1000"]]]]]`
   - output: putdown `(- (- (- (- 1000))))`


### can convert additions and subtractions to putdown

- Test 1
   - input: JSON `["addition",["numbervariable","x"],["numbervariable","y"]]`
   - output: putdown `(+ x y)`
- Test 2
   - input: JSON `["subtraction",["number","1"],["numbernegation",["number","3"]]]`
   - output: putdown `(- 1 (- 3))`
- Test 3
   - input: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["pi"]]]`
   - output: putdown `(+ (^ A B) (- C pi))`


### can convert number expressions with groupers to putdown

- Test 1
   - input: JSON `["numbernegation",["multiplication",["number","1"],["number","2"]]]`
   - output: putdown `(- (* 1 2))`
- Test 2
   - input: JSON `["factorial",["exponentiation",["numbervariable","x"],["number","2"]]]`
   - output: putdown `(! (^ x 2))`
- Test 3
   - input: JSON `["exponentiation",["numbernegation",["numbervariable","x"]],["multiplication",["number","2"],["numbernegation",["number","3"]]]]`
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 4
   - input: JSON `["exponentiation",["numbernegation",["number","3"]],["addition",["number","1"],["number","2"]]]`
   - output: putdown `(^ (- 3) (+ 1 2))`


### can convert relations of numeric expressions to putdown

- Test 1
   - input: JSON `["greaterthan",["number","1"],["number","2"]]`
   - output: putdown `(> 1 2)`
- Test 2
   - input: JSON `["lessthan",["subtraction",["number","1"],["number","2"]],["addition",["number","1"],["number","2"]]]`
   - output: putdown `(< (- 1 2) (+ 1 2))`
- Test 3
   - input: JSON `["logicnegation",["equality",["number","1"],["number","2"]]]`
   - output: putdown `(not (= 1 2))`
- Test 4
   - input: JSON `["conjunction",["greaterthanoreq",["number","2"],["number","1"]],["lessthanoreq",["number","2"],["number","3"]]]`
   - output: putdown `(and (>= 2 1) (<= 2 3))`
- Test 5
   - input: JSON `["divides",["number","7"],["number","14"]]`
   - output: putdown `(divides 7 14)`
- Test 6
   - input: JSON `["divides",["numfuncapp",["funcvariable","A"],["numbervariable","k"]],["factorial",["numbervariable","n"]]]`
   - output: putdown `(divides (apply A k) (! n))`
- Test 7
   - input: JSON `["genericrelation",["subtraction",["number","1"],["numbervariable","k"]],["addition",["number","1"],["numbervariable","k"]]]`
   - output: putdown `(~ (- 1 k) (+ 1 k))`


### creates the canonical form for inequality

- Test 1
   - input: JSON `["inequality",["funcvariable","f"],["funcvariable","g"]]`
   - output: putdown `(not (= f g))`


### can convert propositional logic atomics to putdown

- Test 1
   - input: JSON `["logicaltrue"]`
   - output: putdown `true`
- Test 2
   - input: JSON `["logicalfalse"]`
   - output: putdown `false`
- Test 3
   - input: JSON `["contradiction"]`
   - output: putdown `contradiction`
- Test 4
   - input: JSON `["logicvariable","P"]`
   - output: putdown `P`
- Test 5
   - input: JSON `["logicvariable","a"]`
   - output: putdown `a`
- Test 6
   - input: JSON `["logicvariable","somethingLarge"]`
   - output: putdown `somethingLarge`


### can convert propositional logic conjuncts to putdown

- Test 1
   - input: JSON `["conjunction",["logicaltrue"],["logicalfalse"]]`
   - output: putdown `(and true false)`
- Test 2
   - input: JSON `["conjunction",["logicnegation",["logicvariable","P"]],["logicnegation",["logicaltrue"]]]`
   - output: putdown `(and (not P) (not true))`
- Test 3
   - input: JSON `["conjunction",["conjunction",["logicvariable","a"],["logicvariable","b"]],["logicvariable","c"]]`
   - output: putdown `(and (and a b) c)`


### can convert propositional logic disjuncts to putdown

- Test 1
   - input: JSON `["disjunction",["logicaltrue"],["logicnegation",["logicvariable","A"]]]`
   - output: putdown `(or true (not A))`
- Test 2
   - input: JSON `["disjunction",["conjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]]`
   - output: putdown `(or (and P Q) (and Q P))`


### can convert propositional logic conditionals to putdown

- Test 1
   - input: JSON `["implication",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
   - output: putdown `(implies A (and Q (not P)))`
- Test 2
   - input: JSON `["implication",["implication",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]],["logicvariable","T"]]`
   - output: putdown `(implies (implies (or P Q) (and Q P)) T)`


### can convert propositional logic biconditionals to putdown

- Test 1
   - input: JSON `["iff",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
   - output: putdown `(iff A (and Q (not P)))`
- Test 2
   - input: JSON `["implication",["iff",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]],["logicvariable","T"]]`
   - output: putdown `(implies (iff (or P Q) (and Q P)) T)`


### can convert propositional expressions with groupers to putdown

- Test 1
   - input: JSON `["disjunction",["logicvariable","P"],["conjunction",["iff",["logicvariable","Q"],["logicvariable","Q"]],["logicvariable","P"]]]`
   - output: putdown `(or P (and (iff Q Q) P))`
- Test 2
   - input: JSON `["logicnegation",["iff",["logicaltrue"],["logicalfalse"]]]`
   - output: putdown `(not (iff true false))`


### can convert simple predicate logic expressions to putdown

- Test 1
   - input: JSON `["universal",["numbervariable","x"],["logicvariable","P"]]`
   - output: putdown `(forall (x , P))`
- Test 2
   - input: JSON `["existential",["numbervariable","t"],["logicnegation",["logicvariable","Q"]]]`
   - output: putdown `(exists (t , (not Q)))`
- Test 3
   - input: JSON `["existsunique",["numbervariable","k"],["implication",["logicvariable","m"],["logicvariable","n"]]]`
   - output: putdown `(existsunique (k , (implies m n)))`


### can convert finite and empty sets to putdown

- Test 1
   - input: JSON `["emptyset"]`
   - output: putdown `emptyset`
- Test 2
   - input: JSON `["finiteset",["oneeltseq",["number","1"]]]`
   - output: putdown `(finiteset (elts 1))`
- Test 3
   - input: JSON `["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2)))`
- Test 4
   - input: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["oneeltseq",["number","3"]]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
- Test 5
   - input: JSON `["finiteset",["eltthenseq",["emptyset"],["oneeltseq",["emptyset"]]]]`
   - output: putdown `(finiteset (elts emptyset (elts emptyset)))`
- Test 6
   - input: JSON `["finiteset",["oneeltseq",["finiteset",["oneeltseq",["emptyset"]]]]]`
   - output: putdown `(finiteset (elts (finiteset (elts emptyset))))`
- Test 7
   - input: JSON `["finiteset",["eltthenseq",["number","3"],["oneeltseq",["numbervariable","x"]]]]`
   - output: putdown `(finiteset (elts 3 (elts x)))`
- Test 8
   - input: JSON `["finiteset",["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
   - output: putdown `(finiteset (elts (setuni A B) (elts (setint A B))))`
- Test 9
   - input: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["eltthenseq",["emptyset"],["eltthenseq",["numbervariable","K"],["oneeltseq",["numbervariable","P"]]]]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`


### can convert tuples and vectors to putdown

- Test 1
   - input: JSON `["tuple",["eltthenseq",["number","5"],["oneeltseq",["number","6"]]]]`
   - output: putdown `(tuple (elts 5 (elts 6)))`
- Test 2
   - input: JSON `["tuple",["eltthenseq",["number","5"],["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["numbervariable","k"]]]]]`
   - output: putdown `(tuple (elts 5 (elts (setuni A B) (elts k))))`
- Test 3
   - input: JSON `["vector",["numthenseq",["number","5"],["onenumseq",["number","6"]]]]`
   - output: putdown `(vector (elts 5 (elts 6)))`
- Test 4
   - input: JSON `["vector",["numthenseq",["number","5"],["numthenseq",["numbernegation",["number","7"]],["onenumseq",["numbervariable","k"]]]]]`
   - output: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
- Test 5
   - input: JSON `["tuple",["eltthenseq",["tuple",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]],["oneeltseq",["number","6"]]]]`
   - output: putdown `(tuple (elts (tuple (elts 1 (elts 2))) (elts 6)))`


### can convert simple set memberships and subsets to putdown

- Test 1
   - input: JSON `["nounisin",["numbervariable","b"],["setvariable","B"]]`
   - output: putdown `(in b B)`
- Test 2
   - input: JSON `["nounisin",["number","2"],["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]]`
   - output: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
- Test 3
   - input: JSON `["nounisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
   - output: putdown `(in X (setuni a b))`
- Test 4
   - input: JSON `["nounisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
   - output: putdown `(in (setuni A B) (setuni X Y))`
- Test 5
   - input: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
   - output: putdown `(subset A (setcomp B))`
- Test 6
   - input: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
   - output: putdown `(subseteq (setint u v) (setuni u v))`
- Test 7
   - input: JSON `["subseteq",["finiteset",["oneeltseq",["number","1"]]],["union",["finiteset",["oneeltseq",["number","1"]]],["finiteset",["oneeltseq",["number","2"]]]]]`
   - output: putdown `(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))`
- Test 8
   - input: JSON `["nounisin",["numbervariable","p"],["setproduct",["setvariable","U"],["setvariable","V"]]]`
   - output: putdown `(in p (setprod U V))`
- Test 9
   - input: JSON `["nounisin",["numbervariable","q"],["union",["complement",["setvariable","U"]],["setproduct",["setvariable","V"],["setvariable","W"]]]]`
   - output: putdown `(in q (setuni (setcomp U) (setprod V W)))`
- Test 10
   - input: JSON `["nounisin",["tuple",["eltthenseq",["numbervariable","a"],["oneeltseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`
   - output: putdown `(in (tuple (elts a (elts b))) (setprod A B))`
- Test 11
   - input: JSON `["nounisin",["vector",["numthenseq",["numbervariable","a"],["onenumseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`
   - output: putdown `(in (vector (elts a (elts b))) (setprod A B))`


### creates the canonical form for "notin" notation

- Test 1
   - input: JSON `["nounisnotin",["numbervariable","a"],["setvariable","A"]]`
   - output: putdown `(not (in a A))`
- Test 2
   - input: JSON `["logicnegation",["nounisin",["emptyset"],["emptyset"]]]`
   - output: putdown `(not (in emptyset emptyset))`
- Test 3
   - input: JSON `["nounisnotin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]`
   - output: putdown `(not (in (- 3 5) (setint K P)))`


### can convert to putdown sentences built from various relations

- Test 1
   - input: JSON `["disjunction",["logicvariable","P"],["nounisin",["numbervariable","b"],["setvariable","B"]]]`
   - output: putdown `(or P (in b B))`
- Test 2
   - input: JSON `["universal",["numbervariable","x"],["nounisin",["numbervariable","x"],["setvariable","X"]]]`
   - output: putdown `(forall (x , (in x X)))`
- Test 3
   - input: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`
   - output: putdown `(and (subseteq A B) (subseteq B A))`
- Test 4
   - input: JSON `["equality",["numbervariable","R"],["setproduct",["setvariable","A"],["setvariable","B"]]]`
   - output: putdown `(= R (setprod A B))`
- Test 5
   - input: JSON `["universal",["numbervariable","n"],["divides",["numbervariable","n"],["factorial",["numbervariable","n"]]]]`
   - output: putdown `(forall (n , (divides n (! n))))`
- Test 6
   - input: JSON `["implication",["genericrelation",["numbervariable","a"],["numbervariable","b"]],["genericrelation",["numbervariable","b"],["numbervariable","a"]]]`
   - output: putdown `(implies (~ a b) (~ b a))`


### can create putdown notation related to functions

- Test 1
   - input: JSON `["funcsignature",["funcvariable","f"],["setvariable","A"],["setvariable","B"]]`
   - output: putdown `(function f A B)`
- Test 2
   - input: JSON `["logicnegation",["funcsignature",["funcvariable","F"],["union",["setvariable","X"],["setvariable","Y"]],["setvariable","Z"]]]`
   - output: putdown `(not (function F (setuni X Y) Z))`
- Test 3
   - input: JSON `["funcsignature",["funccomp",["funcvariable","f"],["funcvariable","g"]],["setvariable","A"],["setvariable","C"]]`
   - output: putdown `(function (compose f g) A C)`
- Test 4
   - input: JSON `["numfuncapp",["funcvariable","f"],["numbervariable","x"]]`
   - output: putdown `(apply f x)`
- Test 5
   - input: JSON `["numfuncapp",["funcinverse",["funcvariable","f"]],["numfuncapp",["funcinverse",["funcvariable","g"]],["number","10"]]]`
   - output: putdown `(apply (inverse f) (apply (inverse g) 10))`
- Test 6
   - input: JSON `["numfuncapp",["funcvariable","E"],["complement",["setvariable","L"]]]`
   - output: putdown `(apply E (setcomp L))`
- Test 7
   - input: JSON `["intersection",["emptyset"],["setfuncapp",["funcvariable","f"],["number","2"]]]`
   - output: putdown `(setint emptyset (apply f 2))`
- Test 8
   - input: JSON `["conjunction",["propfuncapp",["funcvariable","P"],["numbervariable","e"]],["propfuncapp",["funcvariable","Q"],["addition",["number","3"],["numbervariable","b"]]]]`
   - output: putdown `(and (apply P e) (apply Q (+ 3 b)))`
- Test 9
   - input: JSON `["funcequality",["funcvariable","F"],["funccomp",["funcvariable","G"],["funcinverse",["funcvariable","H"]]]]`
   - output: putdown `(= F (compose G (inverse H)))`


### can express trigonometric functions correctly

- Test 1
   - input: JSON `["numfuncapp",["sinfunc"],["numbervariable","x"]]`
   - output: putdown `(apply sin x)`
- Test 2
   - input: JSON `["numfuncapp",["cosfunc"],["multiplication",["pi"],["numbervariable","x"]]]`
   - output: putdown `(apply cos (* pi x))`
- Test 3
   - input: JSON `["numfuncapp",["tanfunc"],["numbervariable","t"]]`
   - output: putdown `(apply tan t)`
- Test 4
   - input: JSON `["division",["number","1"],["numfuncapp",["cotfunc"],["pi"]]]`
   - output: putdown `(/ 1 (apply cot pi))`
- Test 5
   - input: JSON `["equality",["numfuncapp",["secfunc"],["numbervariable","y"]],["numfuncapp",["cscfunc"],["numbervariable","y"]]]`
   - output: putdown `(= (apply sec y) (apply csc y))`


### can express logarithms correctly

- Test 1
   - input: JSON `["prefixfuncapp",["logarithm"],["numbervariable","n"]]`
   - output: putdown `(apply log n)`
- Test 2
   - input: JSON `["addition",["number","1"],["prefixfuncapp",["naturallog"],["numbervariable","x"]]]`
   - output: putdown `(+ 1 (apply ln x))`
- Test 3
   - input: JSON `["prefixfuncapp",["logwithbase",["number","2"]],["number","1024"]]`
   - output: putdown `(apply (logbase 2) 1024)`
- Test 4
   - input: JSON `["division",["prefixfuncapp",["logarithm"],["numbervariable","n"]],["prefixfuncapp",["logarithm"],["prefixfuncapp",["logarithm"],["numbervariable","n"]]]]`
   - output: putdown `(/ (apply log n) (apply log (apply log n)))`


## <a name="Parsing-LaTeX">Parsing LaTeX</a>

### can parse many kinds of numbers to JSON

- Test 1
   - input: LaTeX `0`, typeset $0$
   - output: JSON `["number","0"]`
- Test 2
   - input: LaTeX `453789`, typeset $453789$
   - output: JSON `["number","453789"]`
- Test 3
   - input: LaTeX `99999999999999999999999999999999999999999`, typeset $99999999999999999999999999999999999999999$
   - output: JSON `["number","99999999999999999999999999999999999999999"]`
- Test 4
   - input: LaTeX `-453789`, typeset $-453789$
   - output: JSON `["numbernegation",["number","453789"]]`
- Test 5
   - input: LaTeX `-99999999999999999999999999999999999999999`, typeset $-99999999999999999999999999999999999999999$
   - output: JSON `["numbernegation",["number","99999999999999999999999999999999999999999"]]`
- Test 6
   - input: LaTeX `0.0`, typeset $0.0$
   - output: JSON `["number","0.0"]`
- Test 7
   - input: LaTeX `29835.6875940`, typeset $29835.6875940$
   - output: JSON `["number","29835.6875940"]`
- Test 8
   - input: LaTeX `653280458689.`, typeset $653280458689.$
   - output: JSON `["number","653280458689."]`
- Test 9
   - input: LaTeX `.000006327589`, typeset $.000006327589$
   - output: JSON `["number",".000006327589"]`
- Test 10
   - input: LaTeX `-29835.6875940`, typeset $-29835.6875940$
   - output: JSON `["numbernegation",["number","29835.6875940"]]`
- Test 11
   - input: LaTeX `-653280458689.`, typeset $-653280458689.$
   - output: JSON `["numbernegation",["number","653280458689."]]`
- Test 12
   - input: LaTeX `-.000006327589`, typeset $-.000006327589$
   - output: JSON `["numbernegation",["number",".000006327589"]]`


### can parse one-letter variable names to JSON

- Test 1
   - input: LaTeX `x`, typeset $x$
   - output: JSON `["funcvariable","x"]`
- Test 2
   - input: LaTeX `E`, typeset $E$
   - output: JSON `["funcvariable","E"]`
- Test 3
   - input: LaTeX `q`, typeset $q$
   - output: JSON `["funcvariable","q"]`
- Test 4
   - input: LaTeX `foo`, typeset $foo$
   - output: JSON `null`
- Test 5
   - input: LaTeX `bar`, typeset $bar$
   - output: JSON `null`
- Test 6
   - input: LaTeX `to`, typeset $to$
   - output: JSON `null`


### can parse LaTeX numeric constants to JSON

- Test 1
   - input: LaTeX `\infty`, typeset $\infty$
   - output: JSON `["infinity"]`
- Test 2
   - input: LaTeX `\pi`, typeset $\pi$
   - output: JSON `["pi"]`
- Test 3
   - input: LaTeX `e`, typeset $e$
   - output: JSON `["funcvariable","e"]`


### can parse exponentiation of atomics to JSON

- Test 1
   - input: LaTeX `1^2`, typeset $1^2$
   - output: JSON `["exponentiation",["number","1"],["number","2"]]`
- Test 2
   - input: LaTeX `e^x`, typeset $e^x$
   - output: JSON `["exponentiation",["eulersnumber"],["numbervariable","x"]]`
- Test 3
   - input: LaTeX `1^\infty`, typeset $1^\infty$
   - output: JSON `["exponentiation",["number","1"],["infinity"]]`


### can parse atomic percentages and factorials to JSON

- Test 1
   - input: LaTeX `10\%`, typeset $10\\%$
   - output: JSON `["percentage",["number","10"]]`
- Test 2
   - input: LaTeX `t\%`, typeset $t\\%$
   - output: JSON `["percentage",["numbervariable","t"]]`
- Test 3
   - input: LaTeX `77!`, typeset $77!$
   - output: JSON `["factorial",["number","77"]]`
- Test 4
   - input: LaTeX `y!`, typeset $y!$
   - output: JSON `["factorial",["numbervariable","y"]]`


### can parse division of atomics or factors to JSON

- Test 1
   - input: LaTeX `1\div2`, typeset $1\div2$
   - output: JSON `["division",["number","1"],["number","2"]]`
- Test 2
   - input: LaTeX `x\div y`, typeset $x\div y$
   - output: JSON `["division",["numbervariable","x"],["numbervariable","y"]]`
- Test 3
   - input: LaTeX `0\div\infty`, typeset $0\div\infty$
   - output: JSON `["division",["number","0"],["infinity"]]`
- Test 4
   - input: LaTeX `x^2\div3`, typeset $x^2\div3$
   - output: JSON `["division",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
- Test 5
   - input: LaTeX `1\div e^x`, typeset $1\div e^x$
   - output: JSON `["division",["number","1"],["exponentiation",["eulersnumber"],["numbervariable","x"]]]`
- Test 6
   - input: LaTeX `10\%\div2^{100}`, typeset $10\\%\div2^{100}$
   - output: JSON `["division",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`


### can parse multiplication of atomics or factors to JSON

- Test 1
   - input: LaTeX `1\times2`, typeset $1\times2$
   - output: JSON `["multiplication",["number","1"],["number","2"]]`
- Test 2
   - input: LaTeX `x\cdot y`, typeset $x\cdot y$
   - output: JSON `["multiplication",["numbervariable","x"],["numbervariable","y"]]`
- Test 3
   - input: LaTeX `0\times\infty`, typeset $0\times\infty$
   - output: JSON `["multiplication",["number","0"],["infinity"]]`
- Test 4
   - input: LaTeX `x^2\cdot3`, typeset $x^2\cdot3$
   - output: JSON `["multiplication",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
- Test 5
   - input: LaTeX `1\times e^x`, typeset $1\times e^x$
   - output: JSON `["multiplication",["number","1"],["exponentiation",["eulersnumber"],["numbervariable","x"]]]`
- Test 6
   - input: LaTeX `10\%\cdot2^{100}`, typeset $10\\%\cdot2^{100}$
   - output: JSON `["multiplication",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`


### can parse negations of atomics or factors to JSON

- Test 1
   - input: LaTeX `-1\times2`, typeset $-1\times2$
   - output: JSON `["multiplication",["numbernegation",["number","1"]],["number","2"]]`
- Test 2
   - input: LaTeX `x\cdot{-y}`, typeset $x\cdot{-y}$
   - output: JSON `["multiplication",["numbervariable","x"],["numbernegation",["numbervariable","y"]]]`
- Test 3
   - input: LaTeX `{-x^2}\cdot{-3}`, typeset ${-x^2}\cdot{-3}$
   - output: JSON `["multiplication",["numbernegation",["exponentiation",["numbervariable","x"],["number","2"]]],["numbernegation",["number","3"]]]`
- Test 4
   - input: LaTeX `(-x^2)\cdot(-3)`, typeset $(-x^2)\cdot(-3)$
   - output: JSON `["multiplication",["numbernegation",["exponentiation",["numbervariable","x"],["number","2"]]],["numbernegation",["number","3"]]]`
- Test 5
   - input: LaTeX `----1000`, typeset $----1000$
   - output: JSON `["numbernegation",["numbernegation",["numbernegation",["numbernegation",["number","1000"]]]]]`


### can convert additions and subtractions to JSON

- Test 1
   - input: LaTeX `x+y`, typeset $x+y$
   - output: JSON `["addition",["numbervariable","x"],["numbervariable","y"]]`
- Test 2
   - input: LaTeX `1--3`, typeset $1--3$
   - output: JSON `["subtraction",["number","1"],["numbernegation",["number","3"]]]`
- Test 3
   - input: LaTeX `A^B+C-\pi`, typeset $A^B+C-\pi$
   - output: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["pi"]]]`


### can parse number expressions with groupers to JSON

- Test 1
   - input: LaTeX `-{1\times2}`, typeset $-{1\times2}$
   - output: JSON `["numbernegation",["multiplication",["number","1"],["number","2"]]]`
- Test 2
   - input: LaTeX `-(1\times2)`, typeset $-(1\times2)$
   - output: JSON `["numbernegation",["multiplication",["number","1"],["number","2"]]]`
- Test 3
   - input: LaTeX `(N-1)!`, typeset $(N-1)!$
   - output: JSON `["factorial",["subtraction",["numbervariable","N"],["number","1"]]]`
- Test 4
   - input: LaTeX `{-x}^{2\cdot{-3}}`, typeset ${-x}^{2\cdot{-3}}$
   - output: JSON `["exponentiation",["numbernegation",["numbervariable","x"]],["multiplication",["number","2"],["numbernegation",["number","3"]]]]`
- Test 5
   - input: LaTeX `(-x)^(2\cdot(-3))`, typeset $(-x)^(2\cdot(-3))$
   - output: JSON `["exponentiation",["numbernegation",["numbervariable","x"]],["multiplication",["number","2"],["numbernegation",["number","3"]]]]`
- Test 6
   - input: LaTeX `(-x)^{2\cdot(-3)}`, typeset $(-x)^{2\cdot(-3)}$
   - output: JSON `["exponentiation",["numbernegation",["numbervariable","x"]],["multiplication",["number","2"],["numbernegation",["number","3"]]]]`
- Test 7
   - input: LaTeX `A^B+(C-D)`, typeset $A^B+(C-D)$
   - output: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["numbervariable","D"]]]`
- Test 8
   - input: LaTeX `k^{1-y}\cdot(2+k)`, typeset $k^{1-y}\cdot(2+k)$
   - output: JSON `["multiplication",["exponentiation",["numbervariable","k"],["subtraction",["number","1"],["numbervariable","y"]]],["addition",["number","2"],["numbervariable","k"]]]`


### can parse relations of numeric expressions to JSON

- Test 1
   - input: LaTeX `1>2`, typeset $1>2$
   - output: JSON `["greaterthan",["number","1"],["number","2"]]`
- Test 2
   - input: LaTeX `1\gt2`, typeset $1\gt2$
   - output: JSON `["greaterthan",["number","1"],["number","2"]]`
- Test 3
   - input: LaTeX `1-2<1+2`, typeset $1-2<1+2$
   - output: JSON `["lessthan",["subtraction",["number","1"],["number","2"]],["addition",["number","1"],["number","2"]]]`
- Test 4
   - input: LaTeX `1-2\lt1+2`, typeset $1-2\lt1+2$
   - output: JSON `["lessthan",["subtraction",["number","1"],["number","2"]],["addition",["number","1"],["number","2"]]]`
- Test 5
   - input: LaTeX `\neg 1=2`, typeset $\neg 1=2$
   - output: JSON `["logicnegation",["equality",["number","1"],["number","2"]]]`
- Test 6
   - input: LaTeX `2\ge1\wedge2\le3`, typeset $2\ge1\wedge2\le3$
   - output: JSON `["conjunction",["greaterthanoreq",["number","2"],["number","1"]],["lessthanoreq",["number","2"],["number","3"]]]`
- Test 7
   - input: LaTeX `2\geq1\wedge2\leq3`, typeset $2\geq1\wedge2\leq3$
   - output: JSON `["conjunction",["greaterthanoreq",["number","2"],["number","1"]],["lessthanoreq",["number","2"],["number","3"]]]`
- Test 8
   - input: LaTeX `7|14`, typeset $7|14$
   - output: JSON `["divides",["number","7"],["number","14"]]`
- Test 9
   - input: LaTeX `A(k) | n!`, typeset $A(k) | n!$
   - output: JSON `["divides",["numfuncapp",["funcvariable","A"],["numbervariable","k"]],["factorial",["numbervariable","n"]]]`
- Test 10
   - input: LaTeX `1-k \sim 1+k`, typeset $1-k \sim 1+k$
   - output: JSON `["genericrelation",["subtraction",["number","1"],["numbervariable","k"]],["addition",["number","1"],["numbervariable","k"]]]`


### converts inequality to its placeholder concept

- Test 1
   - input: LaTeX `1\ne2`, typeset $1\ne2$
   - output: JSON `["inequality",["number","1"],["number","2"]]`
- Test 2
   - input: LaTeX `1\neq2`, typeset $1\neq2$
   - output: JSON `["inequality",["number","1"],["number","2"]]`


### can parse propositional logic atomics to JSON

- Test 1
   - input: LaTeX `\top`, typeset $\top$
   - output: JSON `["logicaltrue"]`
- Test 2
   - input: LaTeX `\bot`, typeset $\bot$
   - output: JSON `["logicalfalse"]`
- Test 3
   - input: LaTeX `\rightarrow\leftarrow`, typeset $\rightarrow\leftarrow$
   - output: JSON `["contradiction"]`


### can parse propositional logic conjuncts to JSON

- Test 1
   - input: LaTeX `\top\wedge\bot`, typeset $\top\wedge\bot$
   - output: JSON `["conjunction",["logicaltrue"],["logicalfalse"]]`
- Test 2
   - input: LaTeX `\neg P\wedge\neg\top`, typeset $\neg P\wedge\neg\top$
   - output: JSON `["conjunction",["logicnegation",["logicvariable","P"]],["logicnegation",["logicaltrue"]]]`
- Test 3
   - input: LaTeX `a\wedge b\wedge c`, typeset $a\wedge b\wedge c$
   - output: JSON `["conjunction",["logicvariable","a"],["conjunction",["logicvariable","b"],["logicvariable","c"]]]`


### can parse propositional logic disjuncts to JSON

- Test 1
   - input: LaTeX `\top\vee \neg A`, typeset $\top\vee \neg A$
   - output: JSON `["disjunction",["logicaltrue"],["logicnegation",["logicvariable","A"]]]`
- Test 2
   - input: LaTeX `P\wedge Q\vee Q\wedge P`, typeset $P\wedge Q\vee Q\wedge P$
   - output: JSON `["disjunction",["conjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]]`


### can parse propositional logic conditionals to JSON

- Test 1
   - input: LaTeX `A\Rightarrow Q\wedge\neg P`, typeset $A\Rightarrow Q\wedge\neg P$
   - output: JSON `["implication",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
- Test 2
   - input: LaTeX `P\vee Q\Rightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Rightarrow Q\wedge P\Rightarrow T$
   - output: JSON `["implication",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["implication",["conjunction",["logicvariable","Q"],["logicvariable","P"]],["logicvariable","T"]]]`


### can parse propositional logic biconditionals to JSON

- Test 1
   - input: LaTeX `A\Leftrightarrow Q\wedge\neg P`, typeset $A\Leftrightarrow Q\wedge\neg P$
   - output: JSON `["iff",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
- Test 2
   - input: LaTeX `P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T$
   - output: JSON `["iff",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["implication",["conjunction",["logicvariable","Q"],["logicvariable","P"]],["logicvariable","T"]]]`


### can parse propositional expressions with groupers to JSON

- Test 1
   - input: LaTeX `P\lor {Q\Leftrightarrow Q}\land P`, typeset $P\lor {Q\Leftrightarrow Q}\land P$
   - output: JSON `["disjunction",["logicvariable","P"],["conjunction",["iff",["logicvariable","Q"],["logicvariable","Q"]],["logicvariable","P"]]]`
- Test 2
   - input: LaTeX `\lnot{\top\Leftrightarrow\bot}`, typeset $\lnot{\top\Leftrightarrow\bot}$
   - output: JSON `["logicnegation",["iff",["logicaltrue"],["logicalfalse"]]]`
- Test 3
   - input: LaTeX `\lnot(\top\Leftrightarrow\bot)`, typeset $\lnot(\top\Leftrightarrow\bot)$
   - output: JSON `["logicnegation",["iff",["logicaltrue"],["logicalfalse"]]]`


### can parse simple predicate logic expressions to JSON

- Test 1
   - input: LaTeX `\forall x, P`, typeset $\forall x, P$
   - output: JSON `["universal",["numbervariable","x"],["logicvariable","P"]]`
- Test 2
   - input: LaTeX `\exists t,\neg Q`, typeset $\exists t,\neg Q$
   - output: JSON `["existential",["numbervariable","t"],["logicnegation",["logicvariable","Q"]]]`
- Test 3
   - input: LaTeX `\exists! k,m\Rightarrow n`, typeset $\exists! k,m\Rightarrow n$
   - output: JSON `["existsunique",["numbervariable","k"],["implication",["logicvariable","m"],["logicvariable","n"]]]`


### can convert finite and empty sets to JSON

- Test 1
   - input: LaTeX `\emptyset`, typeset $\emptyset$
   - output: JSON `["emptyset"]`
- Test 2
   - input: LaTeX `\{\}`, typeset $\{\}$
   - output: JSON `["emptyset"]`
- Test 3
   - input: LaTeX `\{ \}`, typeset $\{ \}$
   - output: JSON `["emptyset"]`
- Test 4
   - input: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
   - output: JSON `["finiteset",["oneeltseq",["number","1"]]]`
- Test 5
   - input: LaTeX `\{1,2\}`, typeset $\{1,2\}$
   - output: JSON `["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]`
- Test 6
   - input: LaTeX `\{1, 2,   3 \}`, typeset $\{1, 2,   3 \}$
   - output: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["oneeltseq",["number","3"]]]]]`
- Test 7
   - input: LaTeX `\{\{\},\emptyset\}`, typeset $\{\{\},\emptyset\}$
   - output: JSON `["finiteset",["eltthenseq",["emptyset"],["oneeltseq",["emptyset"]]]]`
- Test 8
   - input: LaTeX `\{\{\emptyset\}\}`, typeset $\{\{\emptyset\}\}$
   - output: JSON `["finiteset",["oneeltseq",["finiteset",["oneeltseq",["emptyset"]]]]]`
- Test 9
   - input: LaTeX `\{ 3,x \}`, typeset $\{ 3,x \}$
   - output: JSON `["finiteset",["eltthenseq",["number","3"],["oneeltseq",["numbervariable","x"]]]]`
- Test 10
   - input: LaTeX `\{ A\cup B, A\cap B \}`, typeset $\{ A\cup B, A\cap B \}$
   - output: JSON `["finiteset",["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
- Test 11
   - input: LaTeX `\{ 1, 2, \emptyset, K, P \}`, typeset $\{ 1, 2, \emptyset, K, P \}$
   - output: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["eltthenseq",["emptyset"],["eltthenseq",["numbervariable","K"],["oneeltseq",["numbervariable","P"]]]]]]]`


### can convert tuples and vectors to JSON

- Test 1
   - input: LaTeX `(5,6)`, typeset $(5,6)$
   - output: JSON `["tuple",["eltthenseq",["number","5"],["oneeltseq",["number","6"]]]]`
- Test 2
   - input: LaTeX `(5,A\cup B,k)`, typeset $(5,A\cup B,k)$
   - output: JSON `["tuple",["eltthenseq",["number","5"],["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["numbervariable","k"]]]]]`
- Test 3
   - input: LaTeX `\langle5,6\rangle`, typeset $\langle5,6\rangle$
   - output: JSON `["vector",["numthenseq",["number","5"],["onenumseq",["number","6"]]]]`
- Test 4
   - input: LaTeX `\langle5,-7,k\rangle`, typeset $\langle5,-7,k\rangle$
   - output: JSON `["vector",["numthenseq",["number","5"],["numthenseq",["numbernegation",["number","7"]],["onenumseq",["numbervariable","k"]]]]]`
- Test 5
   - input: LaTeX `()`, typeset $()$
   - output: JSON `null`
- Test 6
   - input: LaTeX `(())`, typeset $(())$
   - output: JSON `null`
- Test 7
   - input: LaTeX `(3)`, typeset $(3)$
   - output: JSON `["number","3"]`
- Test 8
   - input: LaTeX `\langle\rangle`, typeset $\langle\rangle$
   - output: JSON `null`
- Test 9
   - input: LaTeX `\langle3\rangle`, typeset $\langle3\rangle$
   - output: JSON `null`
- Test 10
   - input: LaTeX `((1,2),6)`, typeset $((1,2),6)$
   - output: JSON `["tuple",["eltthenseq",["tuple",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]],["oneeltseq",["number","6"]]]]`
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
   - output: JSON `["nounisin",["numbervariable","b"],["setvariable","B"]]`
- Test 2
   - input: LaTeX `2\in\{1,2\}`, typeset $2\in\{1,2\}$
   - output: JSON `["nounisin",["number","2"],["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]]`
- Test 3
   - input: LaTeX `X\in a\cup b`, typeset $X\in a\cup b$
   - output: JSON `["nounisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
- Test 4
   - input: LaTeX `A\cup B\in X\cup Y`, typeset $A\cup B\in X\cup Y$
   - output: JSON `["nounisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
- Test 5
   - input: LaTeX `A\subset\bar B`, typeset $A\subset\bar B$
   - output: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
- Test 6
   - input: LaTeX `A\subset B'`, typeset $A\subset B'$
   - output: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
- Test 7
   - input: LaTeX `u\cap v\subseteq u\cup v`, typeset $u\cap v\subseteq u\cup v$
   - output: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
- Test 8
   - input: LaTeX `\{1\}\subseteq\{1\}\cup\{2\}`, typeset $\{1\}\subseteq\{1\}\cup\{2\}$
   - output: JSON `["subseteq",["finiteset",["oneeltseq",["number","1"]]],["union",["finiteset",["oneeltseq",["number","1"]]],["finiteset",["oneeltseq",["number","2"]]]]]`
- Test 9
   - input: LaTeX `p\in U\times V`, typeset $p\in U\times V$
   - output: JSON `["nounisin",["numbervariable","p"],["setproduct",["setvariable","U"],["setvariable","V"]]]`
- Test 10
   - input: LaTeX `q \in U'\cup V\times W`, typeset $q \in U'\cup V\times W$
   - output: JSON `["nounisin",["numbervariable","q"],["union",["complement",["setvariable","U"]],["setproduct",["setvariable","V"],["setvariable","W"]]]]`
- Test 11
   - input: LaTeX `(a,b)\in A\times B`, typeset $(a,b)\in A\times B$
   - output: JSON `["nounisin",["tuple",["eltthenseq",["numbervariable","a"],["oneeltseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`
- Test 12
   - input: LaTeX `\langle a,b\rangle\in A\times B`, typeset $\langle a,b\rangle\in A\times B$
   - output: JSON `["nounisin",["vector",["numthenseq",["numbervariable","a"],["onenumseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`


### converts "notin" notation to its placeholder concept

- Test 1
   - input: LaTeX `a\notin A`, typeset $a\notin A$
   - output: JSON `["nounisnotin",["numbervariable","a"],["setvariable","A"]]`
- Test 2
   - input: LaTeX `\emptyset\notin\emptyset`, typeset $\emptyset\notin\emptyset$
   - output: JSON `["nounisnotin",["emptyset"],["emptyset"]]`
- Test 3
   - input: LaTeX `3-5 \notin K\cap P`, typeset $3-5 \notin K\cap P$
   - output: JSON `["nounisnotin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]`


### can parse to JSON sentences built from various relations

- Test 1
   - input: LaTeX `P\vee b\in B`, typeset $P\vee b\in B$
   - output: JSON `["disjunction",["logicvariable","P"],["nounisin",["numbervariable","b"],["setvariable","B"]]]`
- Test 2
   - input: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
   - output: JSON `["propisin",["disjunction",["logicvariable","P"],["logicvariable","b"]],["setvariable","B"]]`
- Test 3
   - input: LaTeX `\forall x, x\in X`, typeset $\forall x, x\in X$
   - output: JSON `["universal",["numbervariable","x"],["nounisin",["numbervariable","x"],["setvariable","X"]]]`
- Test 4
   - input: LaTeX `A\subseteq B\wedge B\subseteq A`, typeset $A\subseteq B\wedge B\subseteq A$
   - output: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`
- Test 5
   - input: LaTeX `R = A\cup B`, typeset $R = A\cup B$
   - output: JSON `["equality",["numbervariable","R"],["union",["setvariable","A"],["setvariable","B"]]]`
- Test 6
   - input: LaTeX `\forall n, n|n!`, typeset $\forall n, n|n!$
   - output: JSON `["universal",["numbervariable","n"],["divides",["numbervariable","n"],["factorial",["numbervariable","n"]]]]`
- Test 7
   - input: LaTeX `a\sim b\Rightarrow b\sim a`, typeset $a\sim b\Rightarrow b\sim a$
   - output: JSON `["implication",["genericrelation",["numbervariable","a"],["numbervariable","b"]],["genericrelation",["numbervariable","b"],["numbervariable","a"]]]`


### can parse notation related to functions

- Test 1
   - input: LaTeX `f:A\to B`, typeset $f:A\to B$
   - output: JSON `["funcsignature",["funcvariable","f"],["setvariable","A"],["setvariable","B"]]`
- Test 2
   - input: LaTeX `f\colon A\to B`, typeset $f\colon A\to B$
   - output: JSON `["funcsignature",["funcvariable","f"],["setvariable","A"],["setvariable","B"]]`
- Test 3
   - input: LaTeX `\neg F:X\cup Y\rightarrow Z`, typeset $\neg F:X\cup Y\rightarrow Z$
   - output: JSON `["logicnegation",["funcsignature",["funcvariable","F"],["union",["setvariable","X"],["setvariable","Y"]],["setvariable","Z"]]]`
- Test 4
   - input: LaTeX `\neg F\colon X\cup Y\rightarrow Z`, typeset $\neg F\colon X\cup Y\rightarrow Z$
   - output: JSON `["logicnegation",["funcsignature",["funcvariable","F"],["union",["setvariable","X"],["setvariable","Y"]],["setvariable","Z"]]]`
- Test 5
   - input: LaTeX `f\circ g:A\to C`, typeset $f\circ g:A\to C$
   - output: JSON `["funcsignature",["funccomp",["funcvariable","f"],["funcvariable","g"]],["setvariable","A"],["setvariable","C"]]`
- Test 6
   - input: LaTeX `f(x)`, typeset $f(x)$
   - output: JSON `["numfuncapp",["funcvariable","f"],["numbervariable","x"]]`
- Test 7
   - input: LaTeX `f^{-1}(g^{-1}(10))`, typeset $f^{-1}(g^{-1}(10))$
   - output: JSON `["numfuncapp",["funcinverse",["funcvariable","f"]],["numfuncapp",["funcinverse",["funcvariable","g"]],["number","10"]]]`
- Test 8
   - input: LaTeX `E(L')`, typeset $E(L')$
   - output: JSON `["numfuncapp",["funcvariable","E"],["complement",["setvariable","L"]]]`
- Test 9
   - input: LaTeX `\emptyset\cap f(2)`, typeset $\emptyset\cap f(2)$
   - output: JSON `["intersection",["emptyset"],["setfuncapp",["funcvariable","f"],["number","2"]]]`
- Test 10
   - input: LaTeX `P(e)\wedge Q(3+b)`, typeset $P(e)\wedge Q(3+b)$
   - output: JSON `["conjunction",["propfuncapp",["funcvariable","P"],["eulersnumber"]],["propfuncapp",["funcvariable","Q"],["addition",["number","3"],["numbervariable","b"]]]]`
- Test 11
   - input: LaTeX `F=G\circ H^{-1}`, typeset $F=G\circ H^{-1}$
   - output: JSON `["funcequality",["funcvariable","F"],["funccomp",["funcvariable","G"],["funcinverse",["funcvariable","H"]]]]`


### can parse trigonometric functions correctly

- Test 1
   - input: LaTeX `\sin x`, typeset $\sin x$
   - output: JSON `["prefixfuncapp",["sinfunc"],["numbervariable","x"]]`
- Test 2
   - input: LaTeX `\cos\pi\cdot x`, typeset $\cos\pi\cdot x$
   - output: JSON `["prefixfuncapp",["cosfunc"],["multiplication",["pi"],["numbervariable","x"]]]`
- Test 3
   - input: LaTeX `\tan t`, typeset $\tan t$
   - output: JSON `["prefixfuncapp",["tanfunc"],["numbervariable","t"]]`
- Test 4
   - input: LaTeX `1\div\cot\pi`, typeset $1\div\cot\pi$
   - output: JSON `["division",["number","1"],["prefixfuncapp",["cotfunc"],["pi"]]]`
- Test 5
   - input: LaTeX `\sec y=\csc y`, typeset $\sec y=\csc y$
   - output: JSON `["equality",["prefixfuncapp",["secfunc"],["numbervariable","y"]],["prefixfuncapp",["cscfunc"],["numbervariable","y"]]]`


### can parse logarithms correctly

- Test 1
   - input: LaTeX `\log n`, typeset $\log n$
   - output: JSON `["prefixfuncapp",["logarithm"],["numbervariable","n"]]`
- Test 2
   - input: LaTeX `1+\ln{x}`, typeset $1+\ln{x}$
   - output: JSON `["addition",["number","1"],["prefixfuncapp",["naturallog"],["numbervariable","x"]]]`
- Test 3
   - input: LaTeX `\log_2 1024`, typeset $\log_2 1024$
   - output: JSON `["prefixfuncapp",["logwithbase",["number","2"]],["number","1024"]]`
- Test 4
   - input: LaTeX `\log_{2}{1024}`, typeset $\log_{2}{1024}$
   - output: JSON `["prefixfuncapp",["logwithbase",["number","2"]],["number","1024"]]`
- Test 5
   - input: LaTeX `\log n \div \log\log n`, typeset $\log n \div \log\log n$
   - output: JSON `["division",["prefixfuncapp",["logarithm"],["numbervariable","n"]],["prefixfuncapp",["logarithm"],["prefixfuncapp",["logarithm"],["numbervariable","n"]]]]`


## <a name="Rendering-JSON-into-LaTeX">Rendering JSON into LaTeX</a>

### can convert JSON numbers to LaTeX

- Test 1
   - input: JSON `["number","0"]`
   - output: LaTeX `0`, typeset $0$
- Test 2
   - input: JSON `["number","453789"]`
   - output: LaTeX `453789`, typeset $453789$
- Test 3
   - input: JSON `["number","99999999999999999999999999999999999999999"]`
   - output: LaTeX `99999999999999999999999999999999999999999`, typeset $99999999999999999999999999999999999999999$
- Test 4
   - input: JSON `["numbernegation",["number","453789"]]`
   - output: LaTeX `- 453789`, typeset $- 453789$
- Test 5
   - input: JSON `["numbernegation",["number","99999999999999999999999999999999999999999"]]`
   - output: LaTeX `- 99999999999999999999999999999999999999999`, typeset $- 99999999999999999999999999999999999999999$
- Test 6
   - input: JSON `["number","0.0"]`
   - output: LaTeX `0.0`, typeset $0.0$
- Test 7
   - input: JSON `["number","29835.6875940"]`
   - output: LaTeX `29835.6875940`, typeset $29835.6875940$
- Test 8
   - input: JSON `["number","653280458689."]`
   - output: LaTeX `653280458689.`, typeset $653280458689.$
- Test 9
   - input: JSON `["number",".000006327589"]`
   - output: LaTeX `.000006327589`, typeset $.000006327589$
- Test 10
   - input: JSON `["numbernegation",["number","29835.6875940"]]`
   - output: LaTeX `- 29835.6875940`, typeset $- 29835.6875940$
- Test 11
   - input: JSON `["numbernegation",["number","653280458689."]]`
   - output: LaTeX `- 653280458689.`, typeset $- 653280458689.$
- Test 12
   - input: JSON `["numbernegation",["number",".000006327589"]]`
   - output: LaTeX `- .000006327589`, typeset $- .000006327589$


### can convert any size variable name from JSON to LaTeX

- Test 1
   - input: JSON `["numbervariable","x"]`
   - output: LaTeX `x`, typeset $x$
- Test 2
   - input: JSON `["numbervariable","E"]`
   - output: LaTeX `E`, typeset $E$
- Test 3
   - input: JSON `["numbervariable","q"]`
   - output: LaTeX `q`, typeset $q$
- Test 4
   - input: JSON `["numbervariable","foo"]`
   - output: LaTeX `foo`, typeset $foo$
- Test 5
   - input: JSON `["numbervariable","bar"]`
   - output: LaTeX `bar`, typeset $bar$
- Test 6
   - input: JSON `["numbervariable","to"]`
   - output: LaTeX `to`, typeset $to$


### can convert numeric constants from JSON to LaTeX

- Test 1
   - input: JSON `["infinity"]`
   - output: LaTeX `\infty`, typeset $\infty$
- Test 2
   - input: JSON `["pi"]`
   - output: LaTeX `\pi`, typeset $\pi$
- Test 3
   - input: JSON `["eulersnumber"]`
   - output: LaTeX `e`, typeset $e$


### can convert exponentiation of atomics from JSON to LaTeX

- Test 1
   - input: JSON `["exponentiation",["number","1"],["number","2"]]`
   - output: LaTeX `1 ^ 2`, typeset $1 ^ 2$
- Test 2
   - input: JSON `["exponentiation",["numbervariable","e"],["numbervariable","x"]]`
   - output: LaTeX `e ^ x`, typeset $e ^ x$
- Test 3
   - input: JSON `["exponentiation",["number","1"],["infinity"]]`
   - output: LaTeX `1 ^ \infty`, typeset $1 ^ \infty$


### can convert atomic percentages and factorials from JSON to LaTeX

- Test 1
   - input: JSON `["percentage",["number","10"]]`
   - output: LaTeX `10 \%`, typeset $10 \\%$
- Test 2
   - input: JSON `["percentage",["numbervariable","t"]]`
   - output: LaTeX `t \%`, typeset $t \\%$
- Test 3
   - input: JSON `["factorial",["number","10"]]`
   - output: LaTeX `10 !`, typeset $10 !$
- Test 4
   - input: JSON `["factorial",["numbervariable","t"]]`
   - output: LaTeX `t !`, typeset $t !$


### can convert division of atomics or factors from JSON to LaTeX

- Test 1
   - input: JSON `["division",["number","1"],["number","2"]]`
   - output: LaTeX `1 \div 2`, typeset $1 \div 2$
- Test 2
   - input: JSON `["division",["numbervariable","x"],["numbervariable","y"]]`
   - output: LaTeX `x \div y`, typeset $x \div y$
- Test 3
   - input: JSON `["division",["number","0"],["infinity"]]`
   - output: LaTeX `0 \div \infty`, typeset $0 \div \infty$
- Test 4
   - input: JSON `["division",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
   - output: LaTeX `x ^ 2 \div 3`, typeset $x ^ 2 \div 3$
- Test 5
   - input: JSON `["division",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
   - output: LaTeX `1 \div e ^ x`, typeset $1 \div e ^ x$
- Test 6
   - input: JSON `["division",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`
   - output: LaTeX `10 \% \div 2 ^ 100`, typeset $10 \\% \div 2 ^ 100$


### can convert multiplication of atomics or factors from JSON to LaTeX

- Test 1
   - input: JSON `["multiplication",["number","1"],["number","2"]]`
   - output: LaTeX `1 \times 2`, typeset $1 \times 2$
- Test 2
   - input: JSON `["multiplication",["numbervariable","x"],["numbervariable","y"]]`
   - output: LaTeX `x \times y`, typeset $x \times y$
- Test 3
   - input: JSON `["multiplication",["number","0"],["infinity"]]`
   - output: LaTeX `0 \times \infty`, typeset $0 \times \infty$
- Test 4
   - input: JSON `["multiplication",["exponentiation",["numbervariable","x"],["number","2"]],["number","3"]]`
   - output: LaTeX `x ^ 2 \times 3`, typeset $x ^ 2 \times 3$
- Test 5
   - input: JSON `["multiplication",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
   - output: LaTeX `1 \times e ^ x`, typeset $1 \times e ^ x$
- Test 6
   - input: JSON `["multiplication",["percentage",["number","10"]],["exponentiation",["number","2"],["number","100"]]]`
   - output: LaTeX `10 \% \times 2 ^ 100`, typeset $10 \\% \times 2 ^ 100$


### can convert negations of atomics or factors from JSON to LaTeX

- Test 1
   - input: JSON `["multiplication",["numbernegation",["number","1"]],["number","2"]]`
   - output: LaTeX `- 1 \times 2`, typeset $- 1 \times 2$
- Test 2
   - input: JSON `["multiplication",["numbervariable","x"],["numbernegation",["numbervariable","y"]]]`
   - output: LaTeX `x \times - y`, typeset $x \times - y$
- Test 3
   - input: JSON `["multiplication",["numbernegation",["exponentiation",["numbervariable","x"],["number","2"]]],["numbernegation",["number","3"]]]`
   - output: LaTeX `- x ^ 2 \times - 3`, typeset $- x ^ 2 \times - 3$
- Test 4
   - input: JSON `["numbernegation",["numbernegation",["numbernegation",["numbernegation",["number","1000"]]]]]`
   - output: LaTeX `- - - - 1000`, typeset $- - - - 1000$


### can convert additions and subtractions from JSON to LaTeX

- Test 1
   - input: JSON `["addition",["numbervariable","x"],["numbervariable","y"]]`
   - output: LaTeX `x + y`, typeset $x + y$
- Test 2
   - input: JSON `["subtraction",["number","1"],["numbernegation",["number","3"]]]`
   - output: LaTeX `1 - - 3`, typeset $1 - - 3$
- Test 3
   - input: JSON `["subtraction",["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["numbervariable","C"]],["pi"]]`
   - output: LaTeX `A ^ B + C - \pi`, typeset $A ^ B + C - \pi$


### can convert number expressions with groupers from JSON to LaTeX

- Test 1
   - input: JSON `["numbernegation",["multiplication",["number","1"],["number","2"]]]`
   - output: LaTeX `- 1 \times 2`, typeset $- 1 \times 2$
- Test 2
   - input: JSON `["factorial",["addition",["number","1"],["number","2"]]]`
   - output: LaTeX `{1 + 2} !`, typeset ${1 + 2} !$
- Test 3
   - input: JSON `["exponentiation",["numbernegation",["numbervariable","x"]],["multiplication",["number","2"],["numbernegation",["number","3"]]]]`
   - output: LaTeX `{- x} ^ {2 \times - 3}`, typeset ${- x} ^ {2 \times - 3}$
- Test 4
   - input: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["numbervariable","D"]]]`
   - output: LaTeX `A ^ B + C - D`, typeset $A ^ B + C - D$
- Test 5
   - input: JSON `["multiplication",["exponentiation",["numbervariable","k"],["subtraction",["number","1"],["numbervariable","y"]]],["addition",["number","2"],["numbervariable","k"]]]`
   - output: LaTeX `k ^ {1 - y} \times {2 + k}`, typeset $k ^ {1 - y} \times {2 + k}$


### can parse relations of numeric expressions from JSON to LaTeX

- Test 1
   - input: JSON `["greaterthan",["number","1"],["number","2"]]`
   - output: LaTeX `1 > 2`, typeset $1 > 2$
- Test 2
   - input: JSON `["lessthan",["subtraction",["number","1"],["number","2"]],["addition",["number","1"],["number","2"]]]`
   - output: LaTeX `1 - 2 < 1 + 2`, typeset $1 - 2 < 1 + 2$
- Test 3
   - input: JSON `["conjunction",["greaterthanoreq",["number","2"],["number","1"]],["lessthanoreq",["number","2"],["number","3"]]]`
   - output: LaTeX `2 \ge 1 \wedge 2 \le 3`, typeset $2 \ge 1 \wedge 2 \le 3$
- Test 4
   - input: JSON `["divides",["number","7"],["number","14"]]`
   - output: LaTeX `7 | 14`, typeset $7 | 14$
- Test 5
   - input: JSON `["divides",["numfuncapp",["funcvariable","A"],["numbervariable","k"]],["factorial",["numbervariable","n"]]]`
   - output: LaTeX `A ( k ) | n !`, typeset $A ( k ) | n !$
- Test 6
   - input: JSON `["genericrelation",["subtraction",["number","1"],["numbervariable","k"]],["addition",["number","1"],["numbervariable","k"]]]`
   - output: LaTeX `1 - k \sim 1 + k`, typeset $1 - k \sim 1 + k$


### can represent inequality if JSON explicitly requests it

- Test 1
   - input: JSON `["inequality",["number","1"],["number","2"]]`
   - output: LaTeX `1 \ne 2`, typeset $1 \ne 2$
- Test 2
   - input: JSON `["logicnegation",["equality",["number","1"],["number","2"]]]`
   - output: LaTeX `\neg 1 = 2`, typeset $\neg 1 = 2$


### can convert propositional logic atomics from JSON to LaTeX

- Test 1
   - input: JSON `["logicaltrue"]`
   - output: LaTeX `\top`, typeset $\top$
- Test 2
   - input: JSON `["logicalfalse"]`
   - output: LaTeX `\bot`, typeset $\bot$
- Test 3
   - input: JSON `["contradiction"]`
   - output: LaTeX `\rightarrow \leftarrow`, typeset $\rightarrow \leftarrow$


### can convert propositional logic conjuncts from JSON to LaTeX

- Test 1
   - input: JSON `["conjunction",["logicaltrue"],["logicalfalse"]]`
   - output: LaTeX `\top \wedge \bot`, typeset $\top \wedge \bot$
- Test 2
   - input: JSON `["conjunction",["logicnegation",["logicvariable","P"]],["logicnegation",["logicaltrue"]]]`
   - output: LaTeX `\neg P \wedge \neg \top`, typeset $\neg P \wedge \neg \top$
- Test 3
   - input: JSON `["conjunction",["conjunction",["logicvariable","a"],["logicvariable","b"]],["logicvariable","c"]]`
   - output: LaTeX `a \wedge b \wedge c`, typeset $a \wedge b \wedge c$


### can convert propositional logic disjuncts from JSON to LaTeX

- Test 1
   - input: JSON `["disjunction",["logicaltrue"],["logicnegation",["logicvariable","A"]]]`
   - output: LaTeX `\top \vee \neg A`, typeset $\top \vee \neg A$
- Test 2
   - input: JSON `["disjunction",["conjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]]`
   - output: LaTeX `P \wedge Q \vee Q \wedge P`, typeset $P \wedge Q \vee Q \wedge P$


### can convert propositional logic conditionals from JSON to LaTeX

- Test 1
   - input: JSON `["implication",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
   - output: LaTeX `A \Rightarrow Q \wedge \neg P`, typeset $A \Rightarrow Q \wedge \neg P$
- Test 2
   - input: JSON `["implication",["implication",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]],["logicvariable","T"]]`
   - output: LaTeX `P \vee Q \Rightarrow Q \wedge P \Rightarrow T`, typeset $P \vee Q \Rightarrow Q \wedge P \Rightarrow T$


### can convert propositional logic biconditionals from JSON to LaTeX

- Test 1
   - input: JSON `["iff",["logicvariable","A"],["conjunction",["logicvariable","Q"],["logicnegation",["logicvariable","P"]]]]`
   - output: LaTeX `A \Leftrightarrow Q \wedge \neg P`, typeset $A \Leftrightarrow Q \wedge \neg P$
- Test 2
   - input: JSON `["implication",["iff",["disjunction",["logicvariable","P"],["logicvariable","Q"]],["conjunction",["logicvariable","Q"],["logicvariable","P"]]],["logicvariable","T"]]`
   - output: LaTeX `P \vee Q \Leftrightarrow Q \wedge P \Rightarrow T`, typeset $P \vee Q \Leftrightarrow Q \wedge P \Rightarrow T$


### can convert propositional expressions with groupers from JSON to LaTeX

- Test 1
   - input: JSON `["disjunction",["logicvariable","P"],["conjunction",["iff",["logicvariable","Q"],["logicvariable","Q"]],["logicvariable","P"]]]`
   - output: LaTeX `P \vee {Q \Leftrightarrow Q} \wedge P`, typeset $P \vee {Q \Leftrightarrow Q} \wedge P$
- Test 2
   - input: JSON `["logicnegation",["iff",["logicaltrue"],["logicalfalse"]]]`
   - output: LaTeX `\neg {\top \Leftrightarrow \bot}`, typeset $\neg {\top \Leftrightarrow \bot}$


### can convert simple predicate logic expressions from JSON to LaTeX

- Test 1
   - input: JSON `["universal",["numbervariable","x"],["logicvariable","P"]]`
   - output: LaTeX `\forall x , P`, typeset $\forall x , P$
- Test 2
   - input: JSON `["existential",["numbervariable","t"],["logicnegation",["logicvariable","Q"]]]`
   - output: LaTeX `\exists t , \neg Q`, typeset $\exists t , \neg Q$
- Test 3
   - input: JSON `["existsunique",["numbervariable","k"],["implication",["logicvariable","m"],["logicvariable","n"]]]`
   - output: LaTeX `\exists ! k , m \Rightarrow n`, typeset $\exists ! k , m \Rightarrow n$


### can convert finite and empty sets from JSON to LaTeX

- Test 1
   - input: JSON `["emptyset"]`
   - output: LaTeX `\emptyset`, typeset $\emptyset$
- Test 2
   - input: JSON `["finiteset",["oneeltseq",["number","1"]]]`
   - output: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
- Test 3
   - input: JSON `["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]`
   - output: LaTeX `\{ 1 , 2 \}`, typeset $\{ 1 , 2 \}$
- Test 4
   - input: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["oneeltseq",["number","3"]]]]]`
   - output: LaTeX `\{ 1 , 2 , 3 \}`, typeset $\{ 1 , 2 , 3 \}$
- Test 5
   - input: JSON `["finiteset",["eltthenseq",["emptyset"],["oneeltseq",["emptyset"]]]]`
   - output: LaTeX `\{ \emptyset , \emptyset \}`, typeset $\{ \emptyset , \emptyset \}$
- Test 6
   - input: JSON `["finiteset",["oneeltseq",["finiteset",["oneeltseq",["emptyset"]]]]]`
   - output: LaTeX `\{ \{ \emptyset \} \}`, typeset $\{ \{ \emptyset \} \}$
- Test 7
   - input: JSON `["finiteset",["eltthenseq",["number","3"],["oneeltseq",["numbervariable","x"]]]]`
   - output: LaTeX `\{ 3 , x \}`, typeset $\{ 3 , x \}$
- Test 8
   - input: JSON `["finiteset",["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
   - output: LaTeX `\{ A \cup B , A \cap B \}`, typeset $\{ A \cup B , A \cap B \}$
- Test 9
   - input: JSON `["finiteset",["eltthenseq",["number","1"],["eltthenseq",["number","2"],["eltthenseq",["emptyset"],["eltthenseq",["numbervariable","K"],["oneeltseq",["numbervariable","P"]]]]]]]`
   - output: LaTeX `\{ 1 , 2 , \emptyset , K , P \}`, typeset $\{ 1 , 2 , \emptyset , K , P \}$


### can convert tuples and vectors from JSON to LaTeX

- Test 1
   - input: JSON `["tuple",["eltthenseq",["number","5"],["oneeltseq",["number","6"]]]]`
   - output: LaTeX `( 5 , 6 )`, typeset $( 5 , 6 )$
- Test 2
   - input: JSON `["tuple",["eltthenseq",["number","5"],["eltthenseq",["union",["setvariable","A"],["setvariable","B"]],["oneeltseq",["numbervariable","k"]]]]]`
   - output: LaTeX `( 5 , A \cup B , k )`, typeset $( 5 , A \cup B , k )$
- Test 3
   - input: JSON `["vector",["numthenseq",["number","5"],["onenumseq",["number","6"]]]]`
   - output: LaTeX `\langle 5 , 6 \rangle`, typeset $\langle 5 , 6 \rangle$
- Test 4
   - input: JSON `["vector",["numthenseq",["number","5"],["numthenseq",["numbernegation",["number","7"]],["onenumseq",["numbervariable","k"]]]]]`
   - output: LaTeX `\langle 5 , - 7 , k \rangle`, typeset $\langle 5 , - 7 , k \rangle$
- Test 5
   - input: JSON `["tuple",["eltthenseq",["tuple",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]],["oneeltseq",["number","6"]]]]`
   - output: LaTeX `( ( 1 , 2 ) , 6 )`, typeset $( ( 1 , 2 ) , 6 )$


### can convert simple set memberships and subsets to LaTeX

- Test 1
   - input: JSON `["nounisin",["numbervariable","b"],["setvariable","B"]]`
   - output: LaTeX `b \in B`, typeset $b \in B$
- Test 2
   - input: JSON `["nounisin",["number","2"],["finiteset",["eltthenseq",["number","1"],["oneeltseq",["number","2"]]]]]`
   - output: LaTeX `2 \in \{ 1 , 2 \}`, typeset $2 \in \{ 1 , 2 \}$
- Test 3
   - input: JSON `["nounisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
   - output: LaTeX `X \in a \cup b`, typeset $X \in a \cup b$
- Test 4
   - input: JSON `["nounisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
   - output: LaTeX `A \cup B \in X \cup Y`, typeset $A \cup B \in X \cup Y$
- Test 5
   - input: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
   - output: LaTeX `A \subset \bar B`, typeset $A \subset \bar B$
- Test 6
   - input: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
   - output: LaTeX `u \cap v \subseteq u \cup v`, typeset $u \cap v \subseteq u \cup v$
- Test 7
   - input: JSON `["subseteq",["finiteset",["oneeltseq",["number","1"]]],["union",["finiteset",["oneeltseq",["number","1"]]],["finiteset",["oneeltseq",["number","2"]]]]]`
   - output: LaTeX `\{ 1 \} \subseteq \{ 1 \} \cup \{ 2 \}`, typeset $\{ 1 \} \subseteq \{ 1 \} \cup \{ 2 \}$
- Test 8
   - input: JSON `["nounisin",["numbervariable","p"],["setproduct",["setvariable","U"],["setvariable","V"]]]`
   - output: LaTeX `p \in U \times V`, typeset $p \in U \times V$
- Test 9
   - input: JSON `["nounisin",["numbervariable","q"],["union",["complement",["setvariable","U"]],["setproduct",["setvariable","V"],["setvariable","W"]]]]`
   - output: LaTeX `q \in \bar U \cup V \times W`, typeset $q \in \bar U \cup V \times W$
- Test 10
   - input: JSON `["nounisin",["tuple",["eltthenseq",["numbervariable","a"],["oneeltseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`
   - output: LaTeX `( a , b ) \in A \times B`, typeset $( a , b ) \in A \times B$
- Test 11
   - input: JSON `["nounisin",["vector",["numthenseq",["numbervariable","a"],["onenumseq",["numbervariable","b"]]]],["setproduct",["setvariable","A"],["setvariable","B"]]]`
   - output: LaTeX `\langle a , b \rangle \in A \times B`, typeset $\langle a , b \rangle \in A \times B$


### can represent "notin" notation if JSON explicitly requests it

- Test 1
   - input: JSON `["logicnegation",["nounisin",["numbervariable","a"],["setvariable","A"]]]`
   - output: LaTeX `\neg a \in A`, typeset $\neg a \in A$
- Test 2
   - input: JSON `["logicnegation",["nounisin",["emptyset"],["emptyset"]]]`
   - output: LaTeX `\neg \emptyset \in \emptyset`, typeset $\neg \emptyset \in \emptyset$
- Test 3
   - input: JSON `["logicnegation",["nounisin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]]`
   - output: LaTeX `\neg 3 - 5 \in K \cap P`, typeset $\neg 3 - 5 \in K \cap P$
- Test 4
   - input: JSON `["nounisnotin",["numbervariable","a"],["setvariable","A"]]`
   - output: LaTeX `a \notin A`, typeset $a \notin A$
- Test 5
   - input: JSON `["nounisnotin",["emptyset"],["emptyset"]]`
   - output: LaTeX `\emptyset \notin \emptyset`, typeset $\emptyset \notin \emptyset$
- Test 6
   - input: JSON `["nounisnotin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]`
   - output: LaTeX `3 - 5 \notin K \cap P`, typeset $3 - 5 \notin K \cap P$


### can convert to LaTeX sentences built from various relations

- Test 1
   - input: JSON `["disjunction",["logicvariable","P"],["nounisin",["numbervariable","b"],["setvariable","B"]]]`
   - output: LaTeX `P \vee b \in B`, typeset $P \vee b \in B$
- Test 2
   - input: JSON `["propisin",["disjunction",["logicvariable","P"],["logicvariable","b"]],["setvariable","B"]]`
   - output: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
- Test 3
   - input: JSON `["universal",["numbervariable","x"],["nounisin",["numbervariable","x"],["setvariable","X"]]]`
   - output: LaTeX `\forall x , x \in X`, typeset $\forall x , x \in X$
- Test 4
   - input: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`
   - output: LaTeX `A \subseteq B \wedge B \subseteq A`, typeset $A \subseteq B \wedge B \subseteq A$
- Test 5
   - input: JSON `["equality",["setvariable","R"],["setproduct",["setvariable","A"],["setvariable","B"]]]`
   - output: LaTeX `R = A \times B`, typeset $R = A \times B$
- Test 6
   - input: JSON `["universal",["numbervariable","n"],["divides",["numbervariable","n"],["factorial",["numbervariable","n"]]]]`
   - output: LaTeX `\forall n , n | n !`, typeset $\forall n , n | n !$
- Test 7
   - input: JSON `["implication",["genericrelation",["numbervariable","a"],["numbervariable","b"]],["genericrelation",["numbervariable","b"],["numbervariable","a"]]]`
   - output: LaTeX `a \sim b \Rightarrow b \sim a`, typeset $a \sim b \Rightarrow b \sim a$


### can create LaTeX notation related to functions

- Test 1
   - input: JSON `["funcsignature",["funcvariable","f"],["setvariable","A"],["setvariable","B"]]`
   - output: LaTeX `f : A \to B`, typeset $f : A \to B$
- Test 2
   - input: JSON `["logicnegation",["funcsignature",["funcvariable","F"],["union",["setvariable","X"],["setvariable","Y"]],["setvariable","Z"]]]`
   - output: LaTeX `\neg F : X \cup Y \to Z`, typeset $\neg F : X \cup Y \to Z$
- Test 3
   - input: JSON `["funcsignature",["funccomp",["funcvariable","f"],["funcvariable","g"]],["setvariable","A"],["setvariable","C"]]`
   - output: LaTeX `f \circ g : A \to C`, typeset $f \circ g : A \to C$
- Test 4
   - input: JSON `["numfuncapp",["funcvariable","f"],["numbervariable","x"]]`
   - output: LaTeX `f ( x )`, typeset $f ( x )$
- Test 5
   - input: JSON `["numfuncapp",["funcinverse",["funcvariable","f"]],["numfuncapp",["funcinverse",["funcvariable","g"]],["number","10"]]]`
   - output: LaTeX `f ^ { - 1 } ( g ^ { - 1 } ( 10 ) )`, typeset $f ^ { - 1 } ( g ^ { - 1 } ( 10 ) )$
- Test 6
   - input: JSON `["numfuncapp",["funcvariable","E"],["complement",["setvariable","L"]]]`
   - output: LaTeX `E ( \bar L )`, typeset $E ( \bar L )$
- Test 7
   - input: JSON `["intersection",["emptyset"],["setfuncapp",["funcvariable","f"],["number","2"]]]`
   - output: LaTeX `\emptyset \cap f ( 2 )`, typeset $\emptyset \cap f ( 2 )$
- Test 8
   - input: JSON `["conjunction",["propfuncapp",["funcvariable","P"],["numbervariable","e"]],["propfuncapp",["funcvariable","Q"],["addition",["number","3"],["numbervariable","b"]]]]`
   - output: LaTeX `P ( e ) \wedge Q ( 3 + b )`, typeset $P ( e ) \wedge Q ( 3 + b )$
- Test 9
   - input: JSON `["funcequality",["funcvariable","F"],["funccomp",["funcvariable","G"],["funcinverse",["funcvariable","H"]]]]`
   - output: LaTeX `F = G \circ H ^ { - 1 }`, typeset $F = G \circ H ^ { - 1 }$


### can represent trigonometric functions correctly

- Test 1
   - input: JSON `["prefixfuncapp",["sinfunc"],["numbervariable","x"]]`
   - output: LaTeX `\sin x`, typeset $\sin x$
- Test 2
   - input: JSON `["prefixfuncapp",["cosfunc"],["multiplication",["pi"],["numbervariable","x"]]]`
   - output: LaTeX `\cos \pi \times x`, typeset $\cos \pi \times x$
- Test 3
   - input: JSON `["prefixfuncapp",["tanfunc"],["numbervariable","t"]]`
   - output: LaTeX `\tan t`, typeset $\tan t$
- Test 4
   - input: JSON `["division",["number","1"],["prefixfuncapp",["cotfunc"],["pi"]]]`
   - output: LaTeX `1 \div \cot \pi`, typeset $1 \div \cot \pi$
- Test 5
   - input: JSON `["equality",["prefixfuncapp",["secfunc"],["numbervariable","y"]],["prefixfuncapp",["cscfunc"],["numbervariable","y"]]]`
   - output: LaTeX `\sec y = \csc y`, typeset $\sec y = \csc y$


### can express logarithms correctly

- Test 1
   - input: JSON `["prefixfuncapp",["logarithm"],["numbervariable","n"]]`
   - output: LaTeX `\log n`, typeset $\log n$
- Test 2
   - input: JSON `["addition",["number","1"],["prefixfuncapp",["naturallog"],["numbervariable","x"]]]`
   - output: LaTeX `1 + \ln x`, typeset $1 + \ln x$
- Test 3
   - input: JSON `["prefixfuncapp",["logwithbase",["number","2"]],["number","1024"]]`
   - output: LaTeX `\log_ 2 1024`, typeset $\log_ 2 1024$
- Test 4
   - input: JSON `["division",["prefixfuncapp",["logarithm"],["numbervariable","n"]],["prefixfuncapp",["logarithm"],["prefixfuncapp",["logarithm"],["numbervariable","n"]]]]`
   - output: LaTeX `\log n \div \log \log n`, typeset $\log n \div \log \log n$


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
   - output: LaTeX `- 9097285323`, typeset $- 9097285323$
- Test 4
   - input: putdown `0.0`
   - output: LaTeX `0.0`, typeset $0.0$
- Test 5
   - input: putdown `32897.5289`
   - output: LaTeX `32897.5289`, typeset $32897.5289$
- Test 6
   - input: putdown `(- 1.9097285323)`
   - output: LaTeX `- 1.9097285323`, typeset $- 1.9097285323$
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
   - output: LaTeX `1 ^ 2`, typeset $1 ^ 2$
- Test 2
   - input: putdown `(^ e x)`
   - output: LaTeX `e ^ x`, typeset $e ^ x$
- Test 3
   - input: putdown `(^ 1 infinity)`
   - output: LaTeX `1 ^ \infty`, typeset $1 ^ \infty$


### correctly converts atomic percentages and factorials

- Test 1
   - input: putdown `(% 10)`
   - output: LaTeX `10 \%`, typeset $10 \\%$
- Test 2
   - input: putdown `(% t)`
   - output: LaTeX `t \%`, typeset $t \\%$
- Test 3
   - input: putdown `(! 10)`
   - output: LaTeX `10 !`, typeset $10 !$
- Test 4
   - input: putdown `(! t)`
   - output: LaTeX `t !`, typeset $t !$


### correctly converts division of atomics or factors

- Test 1
   - input: putdown `(/ 1 2)`
   - output: LaTeX `1 \div 2`, typeset $1 \div 2$
- Test 2
   - input: putdown `(/ x y)`
   - output: LaTeX `x \div y`, typeset $x \div y$
- Test 3
   - input: putdown `(/ 0 infinity)`
   - output: LaTeX `0 \div \infty`, typeset $0 \div \infty$
- Test 4
   - input: putdown `(/ (^ x 2) 3)`
   - output: LaTeX `x ^ 2 \div 3`, typeset $x ^ 2 \div 3$
- Test 5
   - input: putdown `(/ 1 (^ e x))`
   - output: LaTeX `1 \div e ^ x`, typeset $1 \div e ^ x$
- Test 6
   - input: putdown `(/ (% 10) (^ 2 100))`
   - output: LaTeX `10 \% \div 2 ^ 100`, typeset $10 \\% \div 2 ^ 100$


### correctly converts multiplication of atomics or factors

- Test 1
   - input: putdown `(* 1 2)`
   - output: LaTeX `1 \times 2`, typeset $1 \times 2$
- Test 2
   - input: putdown `(* x y)`
   - output: LaTeX `x \times y`, typeset $x \times y$
- Test 3
   - input: putdown `(* 0 infinity)`
   - output: LaTeX `0 \times \infty`, typeset $0 \times \infty$
- Test 4
   - input: putdown `(* (^ x 2) 3)`
   - output: LaTeX `x ^ 2 \times 3`, typeset $x ^ 2 \times 3$
- Test 5
   - input: putdown `(* 1 (^ e x))`
   - output: LaTeX `1 \times e ^ x`, typeset $1 \times e ^ x$
- Test 6
   - input: putdown `(* (% 10) (^ 2 100))`
   - output: LaTeX `10 \% \times 2 ^ 100`, typeset $10 \\% \times 2 ^ 100$


### correctly converts negations of atomics or factors

- Test 1
   - input: putdown `(* (- 1) 2)`
   - output: LaTeX `- 1 \times 2`, typeset $- 1 \times 2$
- Test 2
   - input: putdown `(* x (- y))`
   - output: LaTeX `x \times - y`, typeset $x \times - y$
- Test 3
   - input: putdown `(* (- (^ x 2)) (- 3))`
   - output: LaTeX `- x ^ 2 \times - 3`, typeset $- x ^ 2 \times - 3$
- Test 4
   - input: putdown `(- (- (- (- 1000))))`
   - output: LaTeX `- - - - 1000`, typeset $- - - - 1000$


### correctly converts additions and subtractions

- Test 1
   - input: putdown `(+ x y)`
   - output: LaTeX `x + y`, typeset $x + y$
- Test 2
   - input: putdown `(- 1 (- 3))`
   - output: LaTeX `1 - - 3`, typeset $1 - - 3$
- Test 3
   - input: putdown `(+ (^ A B) (- C pi))`
   - output: LaTeX `A ^ B + C - \pi`, typeset $A ^ B + C - \pi$


### correctly converts number expressions with groupers

- Test 1
   - input: putdown `(- (* 1 2))`
   - output: LaTeX `- 1 \times 2`, typeset $- 1 \times 2$
- Test 2
   - input: putdown `(! (^ x 2))`
   - output: LaTeX `{x ^ 2} !`, typeset ${x ^ 2} !$
- Test 3
   - input: putdown `(^ (- x) (* 2 (- 3)))`
   - output: LaTeX `{- x} ^ {2 \times - 3}`, typeset ${- x} ^ {2 \times - 3}$
- Test 4
   - input: putdown `(^ (- 3) (+ 1 2))`
   - output: LaTeX `{- 3} ^ {1 + 2}`, typeset ${- 3} ^ {1 + 2}$


### can convert relations of numeric expressions

- Test 1
   - input: putdown `(> 1 2)`
   - output: LaTeX `1 > 2`, typeset $1 > 2$
- Test 2
   - input: putdown `(< (- 1 2) (+ 1 2))`
   - output: LaTeX `1 - 2 < 1 + 2`, typeset $1 - 2 < 1 + 2$
- Test 3
   - input: putdown `(not (= 1 2))`
   - output: LaTeX `\neg 1 = 2`, typeset $\neg 1 = 2$
- Test 4
   - input: putdown `(and (>= 2 1) (<= 2 3))`
   - output: LaTeX `2 \ge 1 \wedge 2 \le 3`, typeset $2 \ge 1 \wedge 2 \le 3$
- Test 5
   - input: putdown `(divides 7 14)`
   - output: LaTeX `7 | 14`, typeset $7 | 14$
- Test 6
   - input: putdown `(divides (apply A k) (! n))`
   - output: LaTeX `A ( k ) | n !`, typeset $A ( k ) | n !$
- Test 7
   - input: putdown `(~ (- 1 k) (+ 1 k))`
   - output: LaTeX `1 - k \sim 1 + k`, typeset $1 - k \sim 1 + k$


### does not undo the canonical form for inequality

- Test 1
   - input: putdown `(not (= x y))`
   - output: LaTeX `\neg x = y`, typeset $\neg x = y$


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
   - output: LaTeX `\top \wedge \bot`, typeset $\top \wedge \bot$
- Test 2
   - input: putdown `(and (not P) (not true))`
   - output: LaTeX `\neg P \wedge \neg \top`, typeset $\neg P \wedge \neg \top$
- Test 3
   - input: putdown `(and (and a b) c)`
   - output: LaTeX `a \wedge b \wedge c`, typeset $a \wedge b \wedge c$


### correctly converts propositional logic disjuncts

- Test 1
   - input: putdown `(or true (not A))`
   - output: LaTeX `\top \vee \neg A`, typeset $\top \vee \neg A$
- Test 2
   - input: putdown `(or (and P Q) (and Q P))`
   - output: LaTeX `P \wedge Q \vee Q \wedge P`, typeset $P \wedge Q \vee Q \wedge P$


### correctly converts propositional logic conditionals

- Test 1
   - input: putdown `(implies A (and Q (not P)))`
   - output: LaTeX `A \Rightarrow Q \wedge \neg P`, typeset $A \Rightarrow Q \wedge \neg P$
- Test 2
   - input: putdown `(implies (implies (or P Q) (and Q P)) T)`
   - output: LaTeX `P \vee Q \Rightarrow Q \wedge P \Rightarrow T`, typeset $P \vee Q \Rightarrow Q \wedge P \Rightarrow T$


### correctly converts propositional logic biconditionals

- Test 1
   - input: putdown `(iff A (and Q (not P)))`
   - output: LaTeX `A \Leftrightarrow Q \wedge \neg P`, typeset $A \Leftrightarrow Q \wedge \neg P$
- Test 2
   - input: putdown `(implies (iff (or P Q) (and Q P)) T)`
   - output: LaTeX `P \vee Q \Leftrightarrow Q \wedge P \Rightarrow T`, typeset $P \vee Q \Leftrightarrow Q \wedge P \Rightarrow T$


### correctly converts propositional expressions with groupers

- Test 1
   - input: putdown `(or P (and (iff Q Q) P))`
   - output: LaTeX `P \vee {Q \Leftrightarrow Q} \wedge P`, typeset $P \vee {Q \Leftrightarrow Q} \wedge P$
- Test 2
   - input: putdown `(not (iff true false))`
   - output: LaTeX `\neg {\top \Leftrightarrow \bot}`, typeset $\neg {\top \Leftrightarrow \bot}$


### correctly converts simple predicate logic expressions

- Test 1
   - input: putdown `(forall (x , P))`
   - output: LaTeX `\forall x , P`, typeset $\forall x , P$
- Test 2
   - input: putdown `(exists (t , (not Q)))`
   - output: LaTeX `\exists t , \neg Q`, typeset $\exists t , \neg Q$
- Test 3
   - input: putdown `(existsunique (k , (implies m n)))`
   - output: LaTeX `\exists ! k , m \Rightarrow n`, typeset $\exists ! k , m \Rightarrow n$


### can convert finite and empty sets

- Test 1
   - input: putdown `emptyset`
   - output: LaTeX `\emptyset`, typeset $\emptyset$
- Test 2
   - input: putdown `(finiteset (elts 1))`
   - output: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
- Test 3
   - input: putdown `(finiteset (elts 1 (elts 2)))`
   - output: LaTeX `\{ 1 , 2 \}`, typeset $\{ 1 , 2 \}$
- Test 4
   - input: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
   - output: LaTeX `\{ 1 , 2 , 3 \}`, typeset $\{ 1 , 2 , 3 \}$
- Test 5
   - input: putdown `(finiteset (elts emptyset (elts emptyset)))`
   - output: LaTeX `\{ \emptyset , \emptyset \}`, typeset $\{ \emptyset , \emptyset \}$
- Test 6
   - input: putdown `(finiteset (elts (finiteset (elts emptyset))))`
   - output: LaTeX `\{ \{ \emptyset \} \}`, typeset $\{ \{ \emptyset \} \}$
- Test 7
   - input: putdown `(finiteset (elts 3 (elts x)))`
   - output: LaTeX `\{ 3 , x \}`, typeset $\{ 3 , x \}$
- Test 8
   - input: putdown `(finiteset (elts (setuni A B) (elts (setint A B))))`
   - output: LaTeX `\{ A \cup B , A \cap B \}`, typeset $\{ A \cup B , A \cap B \}$
- Test 9
   - input: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`
   - output: LaTeX `\{ 1 , 2 , \emptyset , K , P \}`, typeset $\{ 1 , 2 , \emptyset , K , P \}$


### correctly converts tuples and vectors

- Test 1
   - input: putdown `(tuple (elts 5 (elts 6)))`
   - output: LaTeX `( 5 , 6 )`, typeset $( 5 , 6 )$
- Test 2
   - input: putdown `(tuple (elts 5 (elts (setuni A B) (elts k))))`
   - output: LaTeX `( 5 , A \cup B , k )`, typeset $( 5 , A \cup B , k )$
- Test 3
   - input: putdown `(vector (elts 5 (elts 6)))`
   - output: LaTeX `\langle 5 , 6 \rangle`, typeset $\langle 5 , 6 \rangle$
- Test 4
   - input: putdown `(vector (elts 5 (elts (- 7) (elts k))))`
   - output: LaTeX `\langle 5 , - 7 , k \rangle`, typeset $\langle 5 , - 7 , k \rangle$
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
   - output: LaTeX `( ( 1 , 2 ) , 6 )`, typeset $( ( 1 , 2 ) , 6 )$
- Test 12
   - input: putdown `(vector (elts (tuple (elts 1 (elts 2))) (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$
- Test 13
   - input: putdown `(vector (elts (vector (elts 1 (elts 2))) (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$
- Test 14
   - input: putdown `(vector (elts (setuni A B) (elts 6)))`
   - output: LaTeX `null`, typeset $undefined$


### can convert simple set memberships and subsets

- Test 1
   - input: putdown `(in b B)`
   - output: LaTeX `b \in B`, typeset $b \in B$
- Test 2
   - input: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
   - output: LaTeX `2 \in \{ 1 , 2 \}`, typeset $2 \in \{ 1 , 2 \}$
- Test 3
   - input: putdown `(in X (setuni a b))`
   - output: LaTeX `X \in a \cup b`, typeset $X \in a \cup b$
- Test 4
   - input: putdown `(in (setuni A B) (setuni X Y))`
   - output: LaTeX `A \cup B \in X \cup Y`, typeset $A \cup B \in X \cup Y$
- Test 5
   - input: putdown `(subset A (setcomp B))`
   - output: LaTeX `A \subset \bar B`, typeset $A \subset \bar B$
- Test 6
   - input: putdown `(subseteq (setint u v) (setuni u v))`
   - output: LaTeX `u \cap v \subseteq u \cup v`, typeset $u \cap v \subseteq u \cup v$
- Test 7
   - input: putdown `(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))`
   - output: LaTeX `\{ 1 \} \subseteq \{ 1 \} \cup \{ 2 \}`, typeset $\{ 1 \} \subseteq \{ 1 \} \cup \{ 2 \}$
- Test 8
   - input: putdown `(in p (setprod U V))`
   - output: LaTeX `p \in U \times V`, typeset $p \in U \times V$
- Test 9
   - input: putdown `(in q (setuni (setcomp U) (setprod V W)))`
   - output: LaTeX `q \in \bar U \cup V \times W`, typeset $q \in \bar U \cup V \times W$
- Test 10
   - input: putdown `(in (tuple (elts a (elts b))) (setprod A B))`
   - output: LaTeX `( a , b ) \in A \times B`, typeset $( a , b ) \in A \times B$
- Test 11
   - input: putdown `(in (vector (elts a (elts b))) (setprod A B))`
   - output: LaTeX `\langle a , b \rangle \in A \times B`, typeset $\langle a , b \rangle \in A \times B$


### does not undo the canonical form for "notin" notation

- Test 1
   - input: putdown `(not (in a A))`
   - output: LaTeX `\neg a \in A`, typeset $\neg a \in A$
- Test 2
   - input: putdown `(not (in emptyset emptyset))`
   - output: LaTeX `\neg \emptyset \in \emptyset`, typeset $\neg \emptyset \in \emptyset$
- Test 3
   - input: putdown `(not (in (- 3 5) (setint K P)))`
   - output: LaTeX `\neg 3 - 5 \in K \cap P`, typeset $\neg 3 - 5 \in K \cap P$


### can convert sentences built from set operators

- Test 1
   - input: putdown `(or P (in b B))`
   - output: LaTeX `P \vee b \in B`, typeset $P \vee b \in B$
- Test 2
   - input: putdown `(in (or P b) B)`
   - output: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
- Test 3
   - input: putdown `(forall (x , (in x X)))`
   - output: LaTeX `\forall x , x \in X`, typeset $\forall x , x \in X$
- Test 4
   - input: putdown `(and (subseteq A B) (subseteq B A))`
   - output: LaTeX `A \subseteq B \wedge B \subseteq A`, typeset $A \subseteq B \wedge B \subseteq A$
- Test 5
   - input: putdown `(= R (setprod A B))`
   - output: LaTeX `R = A \times B`, typeset $R = A \times B$
- Test 6
   - input: putdown `(forall (n , (divides n (! n))))`
   - output: LaTeX `\forall n , n | n !`, typeset $\forall n , n | n !$
- Test 7
   - input: putdown `(implies (~ a b) (~ b a))`
   - output: LaTeX `a \sim b \Rightarrow b \sim a`, typeset $a \sim b \Rightarrow b \sim a$


### can convert notation related to functions

- Test 1
   - input: putdown `(function f A B)`
   - output: LaTeX `f : A \to B`, typeset $f : A \to B$
- Test 2
   - input: putdown `(not (function F (setuni X Y) Z))`
   - output: LaTeX `\neg F : X \cup Y \to Z`, typeset $\neg F : X \cup Y \to Z$
- Test 3
   - input: putdown `(function (compose f g) A C)`
   - output: LaTeX `f \circ g : A \to C`, typeset $f \circ g : A \to C$
- Test 4
   - input: putdown `(apply f x)`
   - output: LaTeX `f ( x )`, typeset $f ( x )$
- Test 5
   - input: putdown `(apply (inverse f) (apply (inverse g) 10))`
   - output: LaTeX `f ^ { - 1 } ( g ^ { - 1 } ( 10 ) )`, typeset $f ^ { - 1 } ( g ^ { - 1 } ( 10 ) )$
- Test 6
   - input: putdown `(apply E (setcomp L))`
   - output: LaTeX `E ( \bar L )`, typeset $E ( \bar L )$
- Test 7
   - input: putdown `(setint emptyset (apply f 2))`
   - output: LaTeX `\emptyset \cap f ( 2 )`, typeset $\emptyset \cap f ( 2 )$
- Test 8
   - input: putdown `(and (apply P e) (apply Q (+ 3 b)))`
   - output: LaTeX `P ( e ) \wedge Q ( 3 + b )`, typeset $P ( e ) \wedge Q ( 3 + b )$
- Test 9
   - input: putdown `(= F (compose G (inverse H)))`
   - output: LaTeX `F = G \circ H ^ { - 1 }`, typeset $F = G \circ H ^ { - 1 }$


### can convert expressions with trigonometric functions

- Test 1
   - input: putdown `(apply sin x)`
   - output: LaTeX `\sin x`, typeset $\sin x$
- Test 2
   - input: putdown `(apply cos (* pi x))`
   - output: LaTeX `\cos \pi \times x`, typeset $\cos \pi \times x$
- Test 3
   - input: putdown `(apply tan t)`
   - output: LaTeX `\tan t`, typeset $\tan t$
- Test 4
   - input: putdown `(/ 1 (apply cot pi))`
   - output: LaTeX `1 \div \cot \pi`, typeset $1 \div \cot \pi$
- Test 5
   - input: putdown `(= (apply sec y) (apply csc y))`
   - output: LaTeX `\sec y = \csc y`, typeset $\sec y = \csc y$


### can convert expressions with logarithms

- Test 1
   - input: putdown `(apply log n)`
   - output: LaTeX `\log n`, typeset $\log n$
- Test 2
   - input: putdown `(+ 1 (apply ln x))`
   - output: LaTeX `1 + \ln x`, typeset $1 + \ln x$
- Test 3
   - input: putdown `(apply (logbase 2) 1024)`
   - output: LaTeX `\log_ 2 1024`, typeset $\log_ 2 1024$
- Test 4
   - input: putdown `(/ (apply log n) (apply log (apply log n)))`
   - output: LaTeX `\log n \div \log \log n`, typeset $\log n \div \log \log n$


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
- Test 3
   - input: LaTeX `e`, typeset $e$
   - output: putdown `e`


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
- Test 3
   - input: LaTeX `A ^ B + C - \pi`, typeset $A ^ B + C - \pi$
   - output: putdown `(+ (^ A B) (- C pi))`


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
   - input: LaTeX `3!\cdot4!`, typeset $3!\cdot4!$
   - output: putdown `(* (! 3) (! 4))`
- Test 5
   - input: LaTeX `{-x}^{2\cdot{-3}}`, typeset ${-x}^{2\cdot{-3}}$
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 6
   - input: LaTeX `(-x)^(2\cdot(-3))`, typeset $(-x)^(2\cdot(-3))$
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 7
   - input: LaTeX `(-x)^{2\cdot(-3)}`, typeset $(-x)^{2\cdot(-3)}$
   - output: putdown `(^ (- x) (* 2 (- 3)))`
- Test 8
   - input: LaTeX `{-3}^{1+2}`, typeset ${-3}^{1+2}$
   - output: putdown `(^ (- 3) (+ 1 2))`
- Test 9
   - input: LaTeX `k^{1-y}\cdot(2+k)`, typeset $k^{1-y}\cdot(2+k)$
   - output: putdown `(* (^ k (- 1 y)) (+ 2 k))`


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
   - output: putdown `(divides 7 14)`
- Test 9
   - input: LaTeX `A ( k ) | n !`, typeset $A ( k ) | n !$
   - output: putdown `(divides (apply A k) (! n))`
- Test 10
   - input: LaTeX `1 - k \sim 1 + k`, typeset $1 - k \sim 1 + k$
   - output: putdown `(~ (- 1 k) (+ 1 k))`


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
- Test 3
   - input: LaTeX `a\wedge b\wedge c`, typeset $a\wedge b\wedge c$
   - output: putdown `(and a (and b c))`


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
- Test 2
   - input: LaTeX `P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T`, typeset $P\vee Q\Leftrightarrow Q\wedge P\Rightarrow T$
   - output: putdown `(iff (or P Q) (implies (and Q P) T))`


### correctly converts propositional expressions with groupers

- Test 1
   - input: LaTeX `P\lor {Q\Leftrightarrow Q}\land P`, typeset $P\lor {Q\Leftrightarrow Q}\land P$
   - output: putdown `(or P (and (iff Q Q) P))`
- Test 2
   - input: LaTeX `\lnot{\top\Leftrightarrow\bot}`, typeset $\lnot{\top\Leftrightarrow\bot}$
   - output: putdown `(not (iff true false))`
- Test 3
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
   - output: putdown `(existsunique (k , (implies m n)))`


### can convert finite and empty sets

- Test 1
   - input: LaTeX `\emptyset`, typeset $\emptyset$
   - output: putdown `emptyset`
- Test 2
   - input: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
   - output: putdown `(finiteset (elts 1))`
- Test 3
   - input: LaTeX `\{ 1 , 2 \}`, typeset $\{ 1 , 2 \}$
   - output: putdown `(finiteset (elts 1 (elts 2)))`
- Test 4
   - input: LaTeX `\{ 1 , 2 , 3 \}`, typeset $\{ 1 , 2 , 3 \}$
   - output: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
- Test 5
   - input: LaTeX `\{ \emptyset , \emptyset \}`, typeset $\{ \emptyset , \emptyset \}$
   - output: putdown `(finiteset (elts emptyset (elts emptyset)))`
- Test 6
   - input: LaTeX `\{ \{ \emptyset \} \}`, typeset $\{ \{ \emptyset \} \}$
   - output: putdown `(finiteset (elts (finiteset (elts emptyset))))`
- Test 7
   - input: LaTeX `\{ 3 , x \}`, typeset $\{ 3 , x \}$
   - output: putdown `(finiteset (elts 3 (elts x)))`
- Test 8
   - input: LaTeX `\{ A \cup B , A \cap B \}`, typeset $\{ A \cup B , A \cap B \}$
   - output: putdown `(finiteset (elts (setuni A B) (elts (setint A B))))`
- Test 9
   - input: LaTeX `\{ 1 , 2 , \emptyset , K , P \}`, typeset $\{ 1 , 2 , \emptyset , K , P \}$
   - output: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`


### correctly converts tuples and vectors

- Test 1
   - input: LaTeX `( 5 , 6 )`, typeset $( 5 , 6 )$
   - output: putdown `(tuple (elts 5 (elts 6)))`
- Test 2
   - input: LaTeX `( 5 , A \cup B , k )`, typeset $( 5 , A \cup B , k )$
   - output: putdown `(tuple (elts 5 (elts (setuni A B) (elts k))))`
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
   - output: putdown `(in X (setuni a b))`
- Test 4
   - input: LaTeX `A \cup B \in X \cup Y`, typeset $A \cup B \in X \cup Y$
   - output: putdown `(in (setuni A B) (setuni X Y))`
- Test 5
   - input: LaTeX `A \subset \bar B`, typeset $A \subset \bar B$
   - output: putdown `(subset A (setcomp B))`
- Test 6
   - input: LaTeX `u \cap v \subseteq u \cup v`, typeset $u \cap v \subseteq u \cup v$
   - output: putdown `(subseteq (setint u v) (setuni u v))`
- Test 7
   - input: LaTeX `\{1\}\subseteq\{1\}\cup\{2\}`, typeset $\{1\}\subseteq\{1\}\cup\{2\}$
   - output: putdown `(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))`
- Test 8
   - input: LaTeX `p \in U \times V`, typeset $p \in U \times V$
   - output: putdown `(in p (setprod U V))`
- Test 9
   - input: LaTeX `q \in \bar U \cup V \times W`, typeset $q \in \bar U \cup V \times W$
   - output: putdown `(in q (setuni (setcomp U) (setprod V W)))`
- Test 10
   - input: LaTeX `( a , b ) \in A \times B`, typeset $( a , b ) \in A \times B$
   - output: putdown `(in (tuple (elts a (elts b))) (setprod A B))`
- Test 11
   - input: LaTeX `\langle a , b \rangle \in A \times B`, typeset $\langle a , b \rangle \in A \times B$
   - output: putdown `(in (vector (elts a (elts b))) (setprod A B))`


### expands "notin" notation into canonical form

- Test 1
   - input: LaTeX `a\notin A`, typeset $a\notin A$
   - output: putdown `(not (in a A))`
- Test 2
   - input: LaTeX `\emptyset \notin \emptyset`, typeset $\emptyset \notin \emptyset$
   - output: putdown `(not (in emptyset emptyset))`
- Test 3
   - input: LaTeX `3-5\notin K\cap P`, typeset $3-5\notin K\cap P$
   - output: putdown `(not (in (- 3 5) (setint K P)))`


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
   - output: putdown `(= R (setuni A B))`
- Test 7
   - input: LaTeX `\forall n , n | n !`, typeset $\forall n , n | n !$
   - output: putdown `(forall (n , (divides n (! n))))`
- Test 8
   - input: LaTeX `a \sim b \Rightarrow b \sim a`, typeset $a \sim b \Rightarrow b \sim a$
   - output: putdown `(implies (~ a b) (~ b a))`


### can convert notation related to functions

- Test 1
   - input: LaTeX `f:A\to B`, typeset $f:A\to B$
   - output: putdown `(function f A B)`
- Test 2
   - input: LaTeX `f\colon A\to B`, typeset $f\colon A\to B$
   - output: putdown `(function f A B)`
- Test 3
   - input: LaTeX `\neg F:X\cup Y\to Z`, typeset $\neg F:X\cup Y\to Z$
   - output: putdown `(not (function F (setuni X Y) Z))`
- Test 4
   - input: LaTeX `\neg F\colon X\cup Y\to Z`, typeset $\neg F\colon X\cup Y\to Z$
   - output: putdown `(not (function F (setuni X Y) Z))`
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
   - output: putdown `(apply E (setcomp L))`
- Test 9
   - input: LaTeX `\emptyset\cap f(2)`, typeset $\emptyset\cap f(2)$
   - output: putdown `(setint emptyset (apply f 2))`
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


