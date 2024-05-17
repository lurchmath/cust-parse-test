
# Prove this project is viable

Can it handle Lurch notation?
 - Use the scraper tool in the lurchmath repo's grading tools folder to get a
   list of all unique Lurch notation expressions used in Math299 in Spring 2024.
 - Use the new JSON API described above to define a new language of Lurch
   notation and verify that all (or almost all) of the expressions scraped from
   Math299 can be parsed correctly by the converter defined in that way.

# Polish the project's features

Make it easier for language designers to use whatever spacing they want.
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
 - If this works, add support for a new option in the final argument to
   `addNotation()` that shows where spaces are permitted in the notation, as in
   `addNotation( 'inverse', 'f^{-1}', { spaces:'f ^ { - 1 }' } )`.  In that
   case, the system will add both notations for you, in the correct priority
   order, so that the desired behavior happens automatically.

# MathLive symbols and/or notation we don't currently support:

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

# Lurch notation reference

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

# Information we may need later:

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
