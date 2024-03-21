
To dos for ASTs:
 - Create test suite for AST class, including all the functions you moved
   into it from the Converter class.

General to dos:
 - Document the fact that addConcept(x,y,regexp) makes that regexp the default
   for all languages.
 - Fix mistake in documentation: notationStringToArray() does not actually lift
   variable names out of the insides of words.  So put spaces in things like
   "AxB" if you mean "A x B".
 - expand set of tests for many new mathematical expressions in many languages,
   including expressions that bind variables
(note that all of the Math299 language features are documented on the following
page, so that you can try to replicate that feature set, and so that you can
update your Lurch docs in the lurchmath.github.io repo as well.)
https://proveitmath.org/lurch/lde/src/experimental/parsers/lurch-parser-docs.html
    - sum, difference (as sum of negation), associative lists of these
    - product, quotient (as product of reciprocal), fraction, associative lists
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
 - add support for features like associativity (in all conversion directions)
 - test whether all MathLive output can be parsed by this LaTeX parser
 - Eventually make a nice diagram of the syntactic types hierarchy and add it to
   the documentation for the syntactic-types module.

Information we may need later:
 - infinity  = '\u221e' = ∞
 - longMinus = '\u2212' = −
 - divide    = '\u00f7' = ÷
 - times     = '\u00d7' = ×
 - cdot      = '\u00b7' = ·
