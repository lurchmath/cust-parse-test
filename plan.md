
To verify that this project can be presented simply to users, make it so that a
converter can be created from a single JSON notation definition, as follows:
 - Add a new static function to the Language class called `fromJSON()`, which
   lets you build a new Language from a name, a Converter instance, and a JSON
   definition formatted just like the one in `latex-notation.js`.  Call that
   function from `example-converter.js`, using the JSON in `latex-notation.js`,
   so that `latex-notation.js` can now be a file that only defines one JSON
   object.
 - Upgrade the `Language.fromJSON()` function so that it computes a list of all
   the concepts used in its JSON definition and first asks the Converter to add
   all of them using `addBuiltInConcepts()` (but make it so that you can disable
   this with an optional parameter, for anyone rolling their own concept
   hierarchy).  Ensure that this works by NOT calling `addBuiltInConcepts()`
   before calling `Language.fromJSON()` in `example-converer.js`.
 - This should mean that `example-converter.js` is now just one line of code
   that reads everything it needs from JSON data structures, thereby proving
   that this repository lets you define a new language just from simple
   information.

To verify that this project is also viable for parsing Lurch notation:
 - Use the scraper tool in the lurchmath repo's grading tools folder to get a
   list of all unique Lurch notation expressions used in Math299 in Spring 2024.
 - Use the new JSON API described above to define a new language of Lurch
   notation and verify that all (or almost all) of the expressions scraped from
   Math299 can be parsed correctly by the converter defined in that way.

Bug fix:
 - Associativity right now works well in that it will produce ASTs that are
   flattened, but it fails in that those ASTs will then be unable to convert to
   putdown because they have the wrong number of arguments for the putdown form
   as originally defined.  This needs a redesign, probably like so:
    - Create a `Template` class that will take a string and a variables list and
      (at construction time) split the string to also store a template array
      internally, like the code at about `ast.js:500` does.
    - Add a `Template.fillIn(...args)` method that does what it says on the tin,
      by re-using the code from the very end of `AST.toLanguage()`.  Now replace
      the last approx.30 lines of code in `AST.toLanguage()` with a construction
      of a `Template` instance and then use of it thereafter.
    - See if there are any other places you might want to use the new `Template`
      class.
    - When you flatten, give the resulting AST an attribute that says it was
      flattened, so that this is recorded.
    - When you check for the correct arity in `AST.toLanguage()`, if the AST is
      a flattened one and the concept permits some types of associative
      flattening, then do not throw the error.
    - Enhance `Template.fillIn(...args)` so that if it receives too many
      arguments, it does something sensible by repeating the last two (and the
      text between them) as many times as necessary to handle the extras.

Polishing:
 - Add the capability of asking for all possible parsings, rather than just
   getting the first one.
    - Run tests on this, especially anywhere the test suite mentioned
      "alphabetical order."
    - Rewrite one-result parsing functions so that they call this one and then
      index/filter the result.
    - Did not bother adding "arcsin" and "asin" and so on for all trig functions
      because doing so does not add any functionality and just clutters things
      up, given that we already have `^{-1}` notation for all functions.
      Could be done if needed.
 - Add a feature where you can specify, for any given operator, whether it
   associates right or left, and if you do, then we will filter out of the list
   of valid parsings any result that contains a nesting different than what you
   specified.
 - Make overview documentation for the main docs index page.  It should include
   all the assumptions baked into this implementation, such as:
    - whitespace is not meaningful
    - alphabetically least JSON parsing leads to right association in most cases
      (which is good for conditional, f.ex., and irrelevant for associative
      stuff)
 - Also add to the overview documentation the procedure for adding new concepts
   and tests to the example converter, which is:
    1. Add a new `addConcept()` call to the `example-converter.js` file, with
       the appropriate putdown notation included.
    2. Add an `it()` call to `test-parsing-putdown.js` to ensure that the new
       concept can be parsed from putdown notation.
        - Possibly also add a test to an `it()` whose purpose is to test nesting
          of expressions in one another, using the new type you just introduced.
    3. Add an `it()` call to `test-creating-putdown.js` to ensure that the new
       concept can be rendered to putdown notation.  (You can probably copy and
       paste the test you created in item 2., but rename the function call and
       swap the two arguments' order.)
        - Possibly also add a test to an `it()` whose purpose is to test nesting
          of expressions in one another, using the new type you just introduced.
    4. Add a new `addNotation()` call to the `example-converter.js` file, with
       one or more LaTeX notations for the new concept.
    5. Add an `it()` call to `test-parsing-latex.js` to ensure that the new
       concept can be parsed from latex notation.
        - Possibly also add a test to an `it()` whose purpose is to test
          precedence of your new operator (if indeed it is one) compared to
          pre-existing ones.
    6. Add an `it()` call to `test-creating-latex.js` to ensure that the new
       concept can be rendered to latex notation.  (You can probably copy and
       paste the test you created in item 5., but rename the function call and
       swap the two arguments' order.)
        - Possibly also add a test to an `it()` whose purpose is to test that
          rendering puts groupers where needed to respect relative precedence.
    7. Add an `it()` call to `test-putdown-to-latex.js` to compose two of the
       tests run above.
    8. Add an `it()` call to `test-latex-to-putdown.js` to compose two of the
       tests run above.
 - Automate the creation of a nice diagram of the syntactic types hierarchy and
   add to the docs build process the regeneration of that diagram and the
   integration of it into the docs themselves.
 - Right now the spacing in the LaTeX notation in the example converter is
   inconsistent.  Some things are like `x ^ { - 1 }`, to permit whatever spacing
   the user wants, and some things are like `[x,y]`, which do not.  Two fixes:
    - First, be consistent and allow flexible user spacing everywhere.
    - Second, can we write two notations, a top-priority one `x^{-1}` and a
      lower-priority one `x ^ { - 1 }`, so that the latter gives flexibility and
      the former is the default one used for output?
   This may relate to the need to define the LaTeX notation for EFAs as
   `\\mathcal{A} (B)` (space important!) because if we do not, then the token
   `}(` is created, and prioritized more highly than `{`, which makes it
   impossible to then parse `f^{-1}(x)`.  Creating the lower-priority parsing of
   `x^{-1}` might allow LaTeX notation authors to write `\\mathcal{A}(B)`, but
   I have not yet tested it.

Notation we might eventually want one day as part of the default set of concepts
that come built into this parser
 - Intervals `(1,2)`, `[1,2]`, `[1,2)`, `(1,2]`
 - Absolute values, using `|...|` or `\vert...\vert` (opt.w/`\left/\right`)
 - Norms/distances, using `||...||` or `\Vert...\Vert` (opt.w/`\left/\right`)
 - All upper and lower case Greek letters, with variants

List of symbols that can be entered with MathLive but for which the current
example converter has no concepts:
```
\pm as in v\pm w
\imaginaryI
\sqrt (including both \sqrt{...} and things like \sqrt5)
\exp which is just a math-Roman operator, I think
\exponentialE
\therefore
\cong (because we use \equiv for equivalence mod a number)
\lim
\sum (which is used in Math299 but I haven't added it here yet)
\differentialD and \int/\iint/\iiint
\nexists
\ni (horizontally flipped version of \in, and the negated version of it
   in MathLive is \not\owns)

\differentialD x
dQ // unexpected!  should be \differentialD Q?
\frac{d}{dx}                    \frac{d}{\differentialD x}
                                // Also lets you type just the d by itself: \mathrm{d}
                                // Also supports \partial
\int x^2 \cdot dx               \int x^2\cdot\differentialD x
                                // or if we write it the usual way:
                                \int x^2dx // !! (bug to report to MathLive?)
\int (\frac x k - 10)\cdot dk   \int\left(\frac{x}{k}-10\right)\cdot dk
                                \int\left(\frac{x}{k}-10\right)dk // or this
\int_0^2 (s+t)\cdot dt          \int_0^2\!\left(s+t\right)\,\mathrm{dt} // !!
                                // Note: the above happens by use of the keyboard template
                                // But if you delete and retype the dt, you get:
                                \int_0^2\!\left(s+t\right)\,dt // Bug to report
\int^b_a |x-1|\cdot dx          \int_{a}^{b}\left\vert x-1\right\vert\differentialD x\!
                                // Note I edited an earlier integral,
                                // which moved the space to the end, unseen!

\overrightarrow{...}, \overleftarrow{...}, \overline{...}, \underline{...}
X^{\prime}, X^{\doubleprime}
{\displaylines x\\ y} is like a fraction with no bar
```

Plus one LaTeX form that MathLive creates but that this parser cannot handle:
```
\frac12   because the 12 tokenizes as a single integer (solution is probably
          to preprocess anything coming out of MathLive and add curlies to
          clarify the parameters of the fraction command)
```

Tests used in the Earley testing library that we can use here:
(Note that these are written here in LaTeX notation, but they can be used to
test any language, not just LaTeX.)
```
// LaTeX
// basics:
6 + k
1.9 - T
0.2 \cdot 0.3
v \div w
v \pm w
2^k
5.0 - K + e
5.0 \times K \div e
(a^b)^c
5.0 - K\cdot e
5.0\times K+e
u^v\times w^x
-7                          
A+-B                        
-A+B
-A^B
i

// respects parens:
6+k+5 // == (6+k)+5         
6+(k+5)
(5.0-K)\cdot e
5.0\times(K+e)
-(K+e)
-(A^B)

// fractions
\frac{1}{2}
\frac{p}{q}                 
\frac{1+t}{3}
\frac{a+b}{a-b}
\frac{1+2\times v}{-w}

// radicals:
\sqrt 2
\sqrt{10-k+9.6}                 
\sqrt[p]{2}
\sqrt[50]{10-k+9.6}
\frac{6}{\sqrt{\frac{1}{2}}}
\sqrt{1+\sqrt{5}}+1
\sqrt[2+t]{1\div\infty}         

// logs:
\ln x
\log 1000
\log e^x\times y
\log_{31}65                     
\log_{-t}{k+5}

// sentences:
2<3
-6>k
t+u=t+v
t+u\neq t+v
\frac{a}{7+b}\approx 0.75
t^2\leq 10
1+2+3\geq 6
k\cong 1
\therefore 1<2
\neg A+B=C^D
\neg\neg x=x

// intervals:
(1,2]
(t,k)
[I,J]
[30,52.9)
(5\times(t+u),2^9]
(3-[1,2])\times 4
[(2,3],(j,j+1])

// absolute values:
|a|
|-962|
|\frac{a^b}{10}|
|9-8+7-6|
|6+r|-|6-r|
|\frac{|x|}{x}|
||1|+|1||

// trig:
\sin x
\tan\pi
\sec^{-1}0
\cos x + 1
\cot(a-9.9)
|\csc^{-1}(1+g)|^2

// factorials:
10!
W\times R!
(W+R)!

// limits:
\lim_{x\to t_0}\sin x
3\times\lim_{a\to1}\frac a 1 +9

// sums:
\sum_{x=1}^5 x^2
\sum^{n+1}_{m=0}m-1 // where the -1 is outside the sum

// differential and integral calculus:
dx
dQ
\frac{d}{dx}
\int x^2 \cdot dx
\int (\frac x k - 10)\cdot dk
\int_0^2 (s+t)\cdot dt
\int^b_a |x-1|\cdot dx

// arithmetic around limit-like things
\int A\cdot B // == \int (A\cdot B)
B\cdot\int A
\int A\div B // == \int (A\div B)
B\div\int A
\int A+B // == (\int A)+B
B+\int A
\int A-B // == (\int A)-B
B-\int A
\lim_{x\to t}A\cdot B // == \lim_{x\to t}(A\cdot B)
B\cdot\lim_{x\to t}A
\lim_{x\to t}A\div B // == \lim_{x\to t}(A\div B)
B\div\lim_{x\to t}A
\lim_{x\to t}A+B // == (\lim_{x\to t}A)+B
B+\lim_{x\to t}A
\lim_{x\to t}A-B // == (\lim_{x\to t}A)-B
B-\lim_{x\to t}A

// difficult pitfalls:
\lim_{x\to\infty}\tan^{-1}x // == \lim_{x\to\intfy}(\arctan x)
```

Latest version of the things that Lurch notation parses (as of Mar 26, 2024),
so that you can try to build a Lurch notation parser eventually:

(note that all of the Lurch notation features are documented on the following
page, which will also let you update your Lurch docs in the lurchmath.github.io repo.)
https://proveitmath.org/lurch/lde/src/experimental/parsers/lurch-parser-docs.html

Logic

```
P and Q
P∧Q
P or Q
P∨Q
not P
¬P
P implies Q
P⇒Q
P iff Q
P⇔Q
contradiction
→←
```

Quantifiers and bindings

```
forall x.x leq x+1
for all x.x leq x+1
∀x.x leq x+1
exists x.x=2 cdot x
∃x.x=2⋅x
exists unique x.x=2*x
∃!x.x=2⋅x
x.x+2
x↦x+2
```

Algebraic expressions

```
(x)
x+y
2+x+y
-x
1-x
x*y
x cdot y
x⋅y
2*x*y
2 cdot x cdot y
2⋅x⋅y
2*3*x
2 cdot 3 cdot x
2⋅3⋅x
1/x
2*1/x*y
(2*1)/(x*y)
x^2
x factorial
x!
(n+1) choose (k-1)
sum k=0 to n of k^2
sum k from 0 to n of k^2
sum k to n of k^2
sum of k^2 as k goes from 0 to n
sum k^2 as k goes from 0 to n
sum k^2 as k from 0 to n
sum k^2 for k from 0 to n
sum k^2 for k to n
sum of k^2 as k to n
sum of k^2 for k to n
sum( k^2 , k , 0 , n )
sum(k^2,k,0,n)
sum(k^2,k,n)
Fib_(n+2)
```

Set Theory

```
x in A
x∈A
x notin A
x∉A
{a,b,c}
set(a,b,c)
{ p:p is prime}
set(p:p is prime)
A subset B
A subseteq B
A⊆B
A cup B
A union B
A∪B
A cap B
A intersect B
A∩B
A setminus B
A∖B
A'
A complement
A°
powerset(A)
𝒫(A)
f:A to B
f:A→B
f(x)
f_(x)
f_(0)(x)_(n+1)
g circ f
g comp f
g∘f
A times B
A cross B
A×B
pair(x,y)
tuple(x,y)
⟨x,y⟩
triple(x,y,z)
tuple(x,y,z)
⟨x,y,z⟩
tuple(w,x,y,z)
⟨w,x,y,z⟩
```

Relations

```
x lt 0
x &lt; 0
x leq 0
x ≤ 0
x neq 0
x ne 0
x≠0
m | n
m divides n
a cong b mod m
a cong mod m to b
x~y
x~y~z
x=y
x=y=z
X loves Y
X is Y
X is an Y
X is a Y
X are Y
P is a partition of A
'~' is an equivalence relation
[a]
[a,~]
'~' is a strict partial order
'~' is a partial order
'~' is a total order
```

Assumptions and Declarations (case insensitive, phrase is echoed)

```
Assume P
Given P
Suppose P
If P
:P
Let x
Let x in A
Let x be such that x in RR
Let x such that x in RR
f(c)=0 for some c
f(c)=0 for some c in A
Declare is, 0, +, cos
```

Miscellaneous

```
x^-
x⁻
@P(k)
λP(k)
undefined
```

Information we may need later:
 - infinity      = '\u221e' = ∞
 - longMinus     = '\u2212' = −
 - divide        = '\u00f7' = ÷
 - times         = '\u00d7' = ×
 - cdot          = '\u00b7' = ·
 - another minus = '\u2212'
 - plusminus     = '\u00b1'
 - root          = '\u221a'
 - set1          = '\u223c' // alternate form of ~
 - neq           = '\u2260'
 - approx        = '\u2248'
 - le            = '\u2264'
 - ge            = '\u2265'
 - modulo        = '\u2243'
 - not           = '\u00ac'
 - degrees       = '\u2218'
 - integral      = '\u222b'
