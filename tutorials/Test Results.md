
The following page lists all tests run using the example converter in this
repository, which was build to verify that the language-building and conversion
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
   - output: JSON `["numbervariable","x"]`
- Test 2
   - input: putdown `E`
   - output: JSON `["numbervariable","E"]`
- Test 3
   - input: putdown `q`
   - output: JSON `["numbervariable","q"]`
- Test 4
   - input: putdown `foo`
   - output: JSON `null`
- Test 5
   - input: putdown `bar`
   - output: JSON `null`
- Test 6
   - input: putdown `to`
   - output: JSON `null`


### can convert infinity from putdown to JSON

- Test 1
   - input: putdown `infinity`
   - output: JSON `["infinity"]`


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
   - input: putdown `(+ (^ A B) (- C D))`
   - output: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["numbervariable","D"]]]`


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
   - output: JSON `["finiteset",["onenumseq",["number","1"]]]`
- Test 3
   - input: putdown `(finiteset (elts 1 (elts 2)))`
   - output: JSON `["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]`
- Test 4
   - input: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
   - output: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["onenumseq",["number","3"]]]]]`
- Test 5
   - input: putdown `(finiteset (elts emptyset (elts emptyset)))`
   - output: JSON `["finiteset",["setthenseq",["emptyset"],["onesetseq",["emptyset"]]]]`
- Test 6
   - input: putdown `(finiteset (elts (finiteset (elts emptyset))))`
   - output: JSON `["finiteset",["onesetseq",["finiteset",["onesetseq",["emptyset"]]]]]`
- Test 7
   - input: putdown `(finiteset (elts 3 (elts x)))`
   - output: JSON `["finiteset",["numthenseq",["number","3"],["onenumseq",["numbervariable","x"]]]]`
- Test 8
   - input: putdown `(finiteset (elts (setuni A B) (elts (setint A B))))`
   - output: JSON `["finiteset",["setthenseq",["union",["setvariable","A"],["setvariable","B"]],["onesetseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
- Test 9
   - input: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`
   - output: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["setthenseq",["emptyset"],["numthenseq",["numbervariable","K"],["onenumseq",["numbervariable","P"]]]]]]]`


### can convert simple set memberships and subsets to JSON

- Test 1
   - input: putdown `(in b B)`
   - output: JSON `["numberisin",["numbervariable","b"],["setvariable","B"]]`
- Test 2
   - input: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
   - output: JSON `["numberisin",["number","2"],["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]]`
- Test 3
   - input: putdown `(in X (setuni a b))`
   - output: JSON `["numberisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
- Test 4
   - input: putdown `(in (setuni A B) (setuni X Y))`
   - output: JSON `["setisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
- Test 5
   - input: putdown `(subset A (setcomp B))`
   - output: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
- Test 6
   - input: putdown `(subseteq (setint u v) (setuni u v))`
   - output: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
- Test 7
   - input: putdown `(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))`
   - output: JSON `["subseteq",["finiteset",["onenumseq",["number","1"]]],["union",["finiteset",["onenumseq",["number","1"]]],["finiteset",["onenumseq",["number","2"]]]]]`


### does not undo the canonical form for "notin" notation

- Test 1
   - input: putdown `(not (in a A))`
   - output: JSON `["logicnegation",["numberisin",["numbervariable","a"],["setvariable","A"]]]`
- Test 2
   - input: putdown `(not (in emptyset emptyset))`
   - output: JSON `["logicnegation",["setisin",["emptyset"],["emptyset"]]]`
- Test 3
   - input: putdown `(not (in (- 3 5) (setint K P)))`
   - output: JSON `["logicnegation",["numberisin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]]`


### can parse to JSON sentences built from set operators

- Test 1
   - input: putdown `(or P (in b B))`
   - output: JSON `["disjunction",["logicvariable","P"],["numberisin",["numbervariable","b"],["setvariable","B"]]]`
- Test 2
   - input: putdown `(forall (x , (in x X)))`
   - output: JSON `["universal",["numbervariable","x"],["numberisin",["numbervariable","x"],["setvariable","X"]]]`
- Test 3
   - input: putdown `(and (subseteq A B) (subseteq B A))`
   - output: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`


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


### can convert infinity from JSON to putdown

- Test 1
   - input: JSON `["infinity"]`
   - output: putdown `infinity`


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
   - input: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["numbervariable","D"]]]`
   - output: putdown `(+ (^ A B) (- C D))`


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
   - input: JSON `["finiteset",["onenumseq",["number","1"]]]`
   - output: putdown `(finiteset (elts 1))`
- Test 3
   - input: JSON `["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2)))`
- Test 4
   - input: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["onenumseq",["number","3"]]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2 (elts 3))))`
- Test 5
   - input: JSON `["finiteset",["setthenseq",["emptyset"],["onesetseq",["emptyset"]]]]`
   - output: putdown `(finiteset (elts emptyset (elts emptyset)))`
- Test 6
   - input: JSON `["finiteset",["onesetseq",["finiteset",["onesetseq",["emptyset"]]]]]`
   - output: putdown `(finiteset (elts (finiteset (elts emptyset))))`
- Test 7
   - input: JSON `["finiteset",["numthenseq",["number","3"],["onenumseq",["numbervariable","x"]]]]`
   - output: putdown `(finiteset (elts 3 (elts x)))`
- Test 8
   - input: JSON `["finiteset",["setthenseq",["union",["setvariable","A"],["setvariable","B"]],["onesetseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
   - output: putdown `(finiteset (elts (setuni A B) (elts (setint A B))))`
- Test 9
   - input: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["setthenseq",["emptyset"],["numthenseq",["numbervariable","K"],["onenumseq",["numbervariable","P"]]]]]]]`
   - output: putdown `(finiteset (elts 1 (elts 2 (elts emptyset (elts K (elts P))))))`


### can convert simple set memberships and subsets to putdown

- Test 1
   - input: JSON `["numberisin",["numbervariable","b"],["setvariable","B"]]`
   - output: putdown `(in b B)`
- Test 2
   - input: JSON `["numberisin",["number","2"],["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]]`
   - output: putdown `(in 2 (finiteset (elts 1 (elts 2))))`
- Test 3
   - input: JSON `["numberisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
   - output: putdown `(in X (setuni a b))`
- Test 4
   - input: JSON `["setisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
   - output: putdown `(in (setuni A B) (setuni X Y))`
- Test 5
   - input: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
   - output: putdown `(subset A (setcomp B))`
- Test 6
   - input: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
   - output: putdown `(subseteq (setint u v) (setuni u v))`
- Test 7
   - input: JSON `["subseteq",["finiteset",["onenumseq",["number","1"]]],["union",["finiteset",["onenumseq",["number","1"]]],["finiteset",["onenumseq",["number","2"]]]]]`
   - output: putdown `(subseteq (finiteset (elts 1)) (setuni (finiteset (elts 1)) (finiteset (elts 2))))`


### creates the canonical form for "notin" notation

- Test 1
   - input: JSON `["numberisnotin",["numbervariable","a"],["setvariable","A"]]`
   - output: putdown `(not (in a A))`
- Test 2
   - input: JSON `["logicnegation",["setisin",["emptyset"],["emptyset"]]]`
   - output: putdown `(not (in emptyset emptyset))`
- Test 3
   - input: JSON `["numberisnotin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]`
   - output: putdown `(not (in (- 3 5) (setint K P)))`


### can convert to putdown sentences built from set operators

- Test 1
   - input: JSON `["disjunction",["logicvariable","P"],["numberisin",["numbervariable","b"],["setvariable","B"]]]`
   - output: putdown `(or P (in b B))`
- Test 2
   - input: JSON `["universal",["numbervariable","x"],["numberisin",["numbervariable","x"],["setvariable","X"]]]`
   - output: putdown `(forall (x , (in x X)))`
- Test 3
   - input: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`
   - output: putdown `(and (subseteq A B) (subseteq B A))`


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
   - output: JSON `["numbervariable","x"]`
- Test 2
   - input: LaTeX `E`, typeset $E$
   - output: JSON `["numbervariable","E"]`
- Test 3
   - input: LaTeX `q`, typeset $q$
   - output: JSON `["numbervariable","q"]`
- Test 4
   - input: LaTeX `foo`, typeset $foo$
   - output: JSON `null`
- Test 5
   - input: LaTeX `bar`, typeset $bar$
   - output: JSON `null`
- Test 6
   - input: LaTeX `to`, typeset $to$
   - output: JSON `null`


### can parse LaTeX infinity to JSON

- Test 1
   - input: LaTeX `\infty`, typeset $\infty$
   - output: JSON `["infinity"]`


### can parse exponentiation of atomics to JSON

- Test 1
   - input: LaTeX `1^2`, typeset $1^2$
   - output: JSON `["exponentiation",["number","1"],["number","2"]]`
- Test 2
   - input: LaTeX `e^x`, typeset $e^x$
   - output: JSON `["exponentiation",["numbervariable","e"],["numbervariable","x"]]`
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
   - output: JSON `["division",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
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
   - output: JSON `["multiplication",["number","1"],["exponentiation",["numbervariable","e"],["numbervariable","x"]]]`
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
   - input: LaTeX `A^B+C-D`, typeset $A^B+C-D$
   - output: JSON `["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["subtraction",["numbervariable","C"],["numbervariable","D"]]]`


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
   - output: JSON `["finiteset",["onenumseq",["number","1"]]]`
- Test 5
   - input: LaTeX `\{1,2\}`, typeset $\{1,2\}$
   - output: JSON `["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]`
- Test 6
   - input: LaTeX `\{1, 2,   3 \}`, typeset $\{1, 2,   3 \}$
   - output: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["onenumseq",["number","3"]]]]]`
- Test 7
   - input: LaTeX `\{\{\},\emptyset\}`, typeset $\{\{\},\emptyset\}$
   - output: JSON `["finiteset",["setthenseq",["emptyset"],["onesetseq",["emptyset"]]]]`
- Test 8
   - input: LaTeX `\{\{\emptyset\}\}`, typeset $\{\{\emptyset\}\}$
   - output: JSON `["finiteset",["onesetseq",["finiteset",["onesetseq",["emptyset"]]]]]`
- Test 9
   - input: LaTeX `\{ 3,x \}`, typeset $\{ 3,x \}$
   - output: JSON `["finiteset",["numthenseq",["number","3"],["onenumseq",["numbervariable","x"]]]]`
- Test 10
   - input: LaTeX `\{ A\cup B, A\cap B \}`, typeset $\{ A\cup B, A\cap B \}$
   - output: JSON `["finiteset",["setthenseq",["union",["setvariable","A"],["setvariable","B"]],["onesetseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
- Test 11
   - input: LaTeX `\{ 1, 2, \emptyset, K, P \}`, typeset $\{ 1, 2, \emptyset, K, P \}$
   - output: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["setthenseq",["emptyset"],["numthenseq",["numbervariable","K"],["onenumseq",["numbervariable","P"]]]]]]]`


### can convert simple set memberships and subsets to JSON

- Test 1
   - input: LaTeX `b\in B`, typeset $b\in B$
   - output: JSON `["numberisin",["numbervariable","b"],["setvariable","B"]]`
- Test 2
   - input: LaTeX `2\in\{1,2\}`, typeset $2\in\{1,2\}$
   - output: JSON `["numberisin",["number","2"],["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]]`
- Test 3
   - input: LaTeX `X\in a\cup b`, typeset $X\in a\cup b$
   - output: JSON `["numberisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
- Test 4
   - input: LaTeX `A\cup B\in X\cup Y`, typeset $A\cup B\in X\cup Y$
   - output: JSON `["setisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
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
   - output: JSON `["subseteq",["finiteset",["onenumseq",["number","1"]]],["union",["finiteset",["onenumseq",["number","1"]]],["finiteset",["onenumseq",["number","2"]]]]]`


### converts "notin" notation to its placeholder concept

- Test 1
   - input: LaTeX `a\notin A`, typeset $a\notin A$
   - output: JSON `["numberisnotin",["numbervariable","a"],["setvariable","A"]]`
- Test 2
   - input: LaTeX `\emptyset\notin\emptyset`, typeset $\emptyset\notin\emptyset$
   - output: JSON `["setisnotin",["emptyset"],["emptyset"]]`
- Test 3
   - input: LaTeX `3-5 \notin K\cap P`, typeset $3-5 \notin K\cap P$
   - output: JSON `["numberisnotin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]`


### can parse to JSON sentences built from set operators

- Test 1
   - input: LaTeX `P\vee b\in B`, typeset $P\vee b\in B$
   - output: JSON `["disjunction",["logicvariable","P"],["numberisin",["numbervariable","b"],["setvariable","B"]]]`
- Test 2
   - input: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
   - output: JSON `["propisin",["disjunction",["logicvariable","P"],["logicvariable","b"]],["setvariable","B"]]`
- Test 3
   - input: LaTeX `\forall x, x\in X`, typeset $\forall x, x\in X$
   - output: JSON `["universal",["numbervariable","x"],["numberisin",["numbervariable","x"],["setvariable","X"]]]`
- Test 4
   - input: LaTeX `A\subseteq B\wedge B\subseteq A`, typeset $A\subseteq B\wedge B\subseteq A$
   - output: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`


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


### can convert infinity from JSON to LaTeX

- Test 1
   - input: JSON `["infinity"]`
   - output: LaTeX `\infty`, typeset $\infty$


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
   - input: JSON `["subtraction",["addition",["exponentiation",["numbervariable","A"],["numbervariable","B"]],["numbervariable","C"]],["numbervariable","D"]]`
   - output: LaTeX `A ^ B + C - D`, typeset $A ^ B + C - D$


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
   - input: JSON `["finiteset",["onenumseq",["number","1"]]]`
   - output: LaTeX `\{ 1 \}`, typeset $\{ 1 \}$
- Test 3
   - input: JSON `["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]`
   - output: LaTeX `\{ 1 , 2 \}`, typeset $\{ 1 , 2 \}$
- Test 4
   - input: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["onenumseq",["number","3"]]]]]`
   - output: LaTeX `\{ 1 , 2 , 3 \}`, typeset $\{ 1 , 2 , 3 \}$
- Test 5
   - input: JSON `["finiteset",["setthenseq",["emptyset"],["onesetseq",["emptyset"]]]]`
   - output: LaTeX `\{ \emptyset , \emptyset \}`, typeset $\{ \emptyset , \emptyset \}$
- Test 6
   - input: JSON `["finiteset",["onesetseq",["finiteset",["onesetseq",["emptyset"]]]]]`
   - output: LaTeX `\{ \{ \emptyset \} \}`, typeset $\{ \{ \emptyset \} \}$
- Test 7
   - input: JSON `["finiteset",["numthenseq",["number","3"],["onenumseq",["numbervariable","x"]]]]`
   - output: LaTeX `\{ 3 , x \}`, typeset $\{ 3 , x \}$
- Test 8
   - input: JSON `["finiteset",["setthenseq",["union",["setvariable","A"],["setvariable","B"]],["onesetseq",["intersection",["setvariable","A"],["setvariable","B"]]]]]`
   - output: LaTeX `\{ A \cup B , A \cap B \}`, typeset $\{ A \cup B , A \cap B \}$
- Test 9
   - input: JSON `["finiteset",["numthenseq",["number","1"],["numthenseq",["number","2"],["setthenseq",["emptyset"],["numthenseq",["numbervariable","K"],["onenumseq",["numbervariable","P"]]]]]]]`
   - output: LaTeX `\{ 1 , 2 , \emptyset , K , P \}`, typeset $\{ 1 , 2 , \emptyset , K , P \}$


### can convert simple set memberships and subsets to LaTeX

- Test 1
   - input: JSON `["numberisin",["numbervariable","b"],["setvariable","B"]]`
   - output: LaTeX `b \in B`, typeset $b \in B$
- Test 2
   - input: JSON `["numberisin",["number","2"],["finiteset",["numthenseq",["number","1"],["onenumseq",["number","2"]]]]]`
   - output: LaTeX `2 \in \{ 1 , 2 \}`, typeset $2 \in \{ 1 , 2 \}$
- Test 3
   - input: JSON `["numberisin",["numbervariable","X"],["union",["setvariable","a"],["setvariable","b"]]]`
   - output: LaTeX `X \in a \cup b`, typeset $X \in a \cup b$
- Test 4
   - input: JSON `["setisin",["union",["setvariable","A"],["setvariable","B"]],["union",["setvariable","X"],["setvariable","Y"]]]`
   - output: LaTeX `A \cup B \in X \cup Y`, typeset $A \cup B \in X \cup Y$
- Test 5
   - input: JSON `["subset",["setvariable","A"],["complement",["setvariable","B"]]]`
   - output: LaTeX `A \subset \bar B`, typeset $A \subset \bar B$
- Test 6
   - input: JSON `["subseteq",["intersection",["setvariable","u"],["setvariable","v"]],["union",["setvariable","u"],["setvariable","v"]]]`
   - output: LaTeX `u \cap v \subseteq u \cup v`, typeset $u \cap v \subseteq u \cup v$
- Test 7
   - input: JSON `["subseteq",["finiteset",["onenumseq",["number","1"]]],["union",["finiteset",["onenumseq",["number","1"]]],["finiteset",["onenumseq",["number","2"]]]]]`
   - output: LaTeX `\{ 1 \} \subseteq \{ 1 \} \cup \{ 2 \}`, typeset $\{ 1 \} \subseteq \{ 1 \} \cup \{ 2 \}$


### can represent "notin" notation if JSON explicitly requests it

- Test 1
   - input: JSON `["logicnegation",["numberisin",["numbervariable","a"],["setvariable","A"]]]`
   - output: LaTeX `\neg a \in A`, typeset $\neg a \in A$
- Test 2
   - input: JSON `["logicnegation",["setisin",["emptyset"],["emptyset"]]]`
   - output: LaTeX `\neg \emptyset \in \emptyset`, typeset $\neg \emptyset \in \emptyset$
- Test 3
   - input: JSON `["logicnegation",["numberisin",["subtraction",["number","3"],["number","5"]],["intersection",["setvariable","K"],["setvariable","P"]]]]`
   - output: LaTeX `\neg 3 - 5 \in K \cap P`, typeset $\neg 3 - 5 \in K \cap P$


### can convert to LaTeX sentences built from set operators

- Test 1
   - input: JSON `["disjunction",["logicvariable","P"],["numberisin",["numbervariable","b"],["setvariable","B"]]]`
   - output: LaTeX `P \vee b \in B`, typeset $P \vee b \in B$
- Test 2
   - input: JSON `["propisin",["disjunction",["logicvariable","P"],["logicvariable","b"]],["setvariable","B"]]`
   - output: LaTeX `{P \vee b} \in B`, typeset ${P \vee b} \in B$
- Test 3
   - input: JSON `["universal",["numbervariable","x"],["numberisin",["numbervariable","x"],["setvariable","X"]]]`
   - output: LaTeX `\forall x , x \in X`, typeset $\forall x , x \in X$
- Test 4
   - input: JSON `["conjunction",["subseteq",["setvariable","A"],["setvariable","B"]],["subseteq",["setvariable","B"],["setvariable","A"]]]`
   - output: LaTeX `A \subseteq B \wedge B \subseteq A`, typeset $A \subseteq B \wedge B \subseteq A$


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


### correctly converts the infinity symbol

- Test 1
   - input: putdown `infinity`
   - output: LaTeX `\infty`, typeset $\infty$


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
   - input: putdown `(+ (^ A B) (- C D))`
   - output: LaTeX `A ^ B + C - D`, typeset $A ^ B + C - D$


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


### correctly converts the infinity symbol

- Test 1
   - input: LaTeX `\infty`, typeset $\infty$
   - output: putdown `infinity`


### correctly converts exponentiation of atomics

- Test 1
   - input: LaTeX `1^2`, typeset $1^2$
   - output: putdown `(^ 1 2)`
- Test 2
   - input: LaTeX `e^x`, typeset $e^x$
   - output: putdown `(^ e x)`
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
   - output: putdown `(/ 1 (^ e x))`
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
   - output: putdown `(* 1 (^ e x))`
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
   - input: LaTeX `A ^ B + C - D`, typeset $A ^ B + C - D$
   - output: putdown `(+ (^ A B) (- C D))`


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


