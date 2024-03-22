
General to dos:
 - expand set of tests for many new mathematical expressions in many languages,
   including expressions that bind variables.  Use the grammar here as an
   inspiration: https://github.com/lurchmath/earley-parser/blob/master/earley-tests.js#L225
(note that all of the Math299 language features are documented on the following
page, so that you can try to replicate that feature set, and so that you can
update your Lurch docs in the lurchmath.github.io repo as well.)
https://proveitmath.org/lurch/lde/src/experimental/parsers/lurch-parser-docs.html
    - sum, difference (as sum of negation)
    - product, quotient (as product of reciprocal), fraction
    - exponents, factorial
    - set membership and its negation
    - subseteq, union, intersection, complement
    - cartesian product of sets, ordered pair of elements
    - function from A to B, function application, composition, and inverses
    - `<`, `>`, `<=`, `>=`, `=`, `neq`
    - `|`, congruence mod m, generic relation `~`, equivalence class (for a
      relation)
    - `X is a[n] Y`, `X is a[n] Y of Z`, for a specific finite set of Ys
    - assumptions and declarations (but no need for Declare--we can do that
      in each doc just by listing concept.putdown for each concept)
    - EFAs
    - naked binding?
 - expand all languages to support many new mathematical features, tests for each
   (note that set theory notation will need analogs to sum, product, ...)
 - define new language of Lurch notation and verify all (or almost all) of its
   features can be supported
 - test whether all MathLive output can be parsed by this LaTeX parser
 - Eventually make a nice diagram of the syntactic types hierarchy and add it to
   the documentation for the syntactic-types module.
 - add support for features like associativity (in all conversion directions) if,
   indeed, we need associativity in any of the libraries we're planning on?

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

Tests used in the Earley testing library that we can use here:
(Note that these are written here in LaTeX notation, but they can be used to
test any language, not just LaTeX.)
```
// LaTeX                    What MathLive produces (iff different)
// basics:
6 + k                           6+k
1.9 - T                         1.9-T
0.2 \cdot 0.3                   0.2\cdot0.3
v \div w                        v\div w
v \pm w                         v\pm w
2^k                             2^{k}
5.0 - K + e                     5.0-K+e
5.0 \times K \div e             5.0\times K\div e
(a^b)^c                         \left(a^{b}\right)^{c}
5.0 - K\cdot e                  5.0-K\cdot e
5.0\times K+e
u^v\times w^x                   u^{v}\times w^{x}
-7                          
A+-B                        
-A+B
-A^B                            -A^{B}
i                               \imaginaryI

// respects parens:
6+k+5 // == (6+k)+5         
6+(k+5)                         6+\left(k+5\right)
(5.0-K)\cdot e                  \left(5.0-K\right)\cdot e
5.0\times(K+e)                  5.0\times\left(K+e\right)
-(K+e)                          -\left(K+e\right)
-(A^B)                          -\left(A^{B}\right)

// fractions
\frac{1}{2}                     \frac12
\frac{p}{q}                 
\frac{1+t}{3}
\frac{a+b}{a-b}
\frac{1+2\times v}{-w}

// radicals:
\sqrt 2                         \sqrt2
\sqrt{10-k+9.6}                 
\sqrt[p]{2}
\sqrt[50]{10-k+9.6}
\frac{6}{\sqrt{\frac{1}{2}}}    \frac{6}{\sqrt{\frac12}}
\sqrt{1+\sqrt{5}}+1             \sqrt{1+\sqrt5}+1
\sqrt[2+t]{1\div\infty}         

// logs:
\ln x
\log 1000                       \log1000
\log e^x\times y                \log e^{x}\times y
                                \log\exp\left(x\right)\times y
                                \log\exponentialE^{x}\times y
\log_{31}65                     
\log_{-t}{k+5}                  \log_{-t}\left(k+5\right)

// sentences:
2<3
-6>k
t+u=t+v
t+u\neq t+v                     t+u\ne t+v
\frac{a}{7+b}\approx 0.75       \frac{a}{7+b}\approx0.75
t^2\leq 10                      t^2\le10
1+2+3\geq 6                     1+2+3\ge6
k\cong 1                        k\cong1
\therefore 1<2                  \therefore1<2
\neg A+B=C^D                    \neg A+B=C^{D}
\neg\neg x=x                    \lnot\lnot x=x

// intervals:
(1,2]                           \left(1,2\right\rbrack
(t,k)                           \left(t,k\right)
[I,J]                           \left\lbrack I,J\right\rbrack
[30,52.9)                       \left\lbrack30,52.9\right)
(5\times(t+u),2^9]              \left(5\times\left(t+u\right),2^9\right\rbrack
(3-[1,2])\times 4 // assuming you can multiply any two nouns???
                                \left(3-\left\lbrack1,2\right\rbrack\right)\times4
[(2,3],(j,j+1]) // assuming you can put any two nouns into an interval???
                                \left\lbrack\left(2,3\right\rbrack,\left(j,j+1\right\rbrack\right)

// absolute values:
|a|                             \left\vert a\right\vert // will use this form below
                                \left|a\right|
                                \mathrm{abs}\left(a\right)
                                // for double-bars, uses \left\Vert...
|-962|                          \left\vert-962\right\vert
|\frac{a^b}{10}|                \left\vert\frac{a^{b}}{10}\right\vert
|9-8+7-6|                       \left\vert9-8+7-6\right\vert
|6+r|-|6-r|                     \left\vert6+r\right\vert-\left\vert6-r\right\vert
|\frac{|x|}{x}|                 \left\vert\frac{\left\vert x\right\vert}{x}\right\vert
||1|+|1||                       \left\vert\left\vert1\right\vert+\left\vert1\right\vert\right\vert

// trig:
\sin x
\tan\pi
\sec^{-1}0
\cos x + 1                      \cos x+1
\cot(a-9.9)                     \cot\left(a-9.9\right)
|\csc^{-1}(1+g)|^2              \left\vert\csc^{-1}\left(1+g\right)\right\vert^2

// factorials:
10!
W\times R!
(W+R)!                          \left(W+R\right)!

// limits:
\lim_{x\to t_0}\sin x
3\times\lim_{a\to1}\frac a 1 +9
                                3\times\lim_{a\to1}\frac{a}{1}+9

// sums:
\sum_{x=1}^5 x^2                \sum_{x=1}^5x^2
\sum^{n+1}_{m=0}m-1 // where the -1 is outside the sum

// differential and integral calculus:
dx                              \differentialD x
dQ                              dQ // !!
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
// Note that it also supports \iint for double integrals, and \iiint

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

// Other misc MathLive symbols:
\rarr for \to, similarly \larr, \leftrightarrow, \rArr, \lArr, \lrArr
\colon is a colon, \Colon is a double colon
\ast is an asterisk
\nexists
\in for sets, plus \ni for the flipped version, and \notin,
    and then the negated \ni is actually \not\owns
X^{\complement} for sets
Standard \cup, \cap, \subset, \subseteq
\overrightarrow{...}, \overleftarrow{...}, \overline{...}, \underline{...}
X^{\prime}, X^{\doubleprime}
All upper- and lower-case Greek letters, with variants
{\displaylines x\\ y} is like a fraction with no bar
```