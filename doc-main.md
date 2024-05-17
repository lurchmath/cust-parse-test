
## Customizable Parsing Test Repository

(This is marked as a "test" repository because it is not yet used in the online
app for which it is intended.  We are finishing testing it and then will
incorporate it thereafter.)

### Goal

This repository attempts to provide a very easy-to-use interface for defining
context-free languages, and an API for applying the Earley parsing algorithm to
expressions in those languages, to convert them into {@link abstract syntax
trees (ASTs)}.

We want users of {@link https://lurchmath.github.io the Lurch application} to be
able to define their own notation for whatever concepts they use, and thus we
want to provide them with an easy-to-understand UI for doing so.  Such a UI must
therefore be backed by a corresponding API that can convert its content into a
definition for a parser that accomplishes the user's intended goals.

When we say "an easy-to-understand UI," we mean that the user should not be
writing grammar rules in the usual computer science notation, such as
`sum -> summand "+" summand`, nor should they be burdened with defining regular
expressions for atomic tokens, nor sequencing the definition of their language
to ensure the correct precedence.  Furthermore, a user who defines multiple
languages for the same set of concepts should expect the system to be able to
translate between any two languages (and {@link ASTs}).  And finally, the user
should never have to specify how to write expressions in Lurch's internal
notation (called "putdown") but that benefit should come automatically and
invisibly by using this system.

### How it works

There is a set of built-in concepts that were selected because they commonly
appear in introduction-to-proof courses, which is the intended use of Lurch.
They are defined in the {@link module:BuiltInConcepts built-in concepts module}.
The most common LaTeX notation for each is defined in the
{@link module:LatexNotation LaTeX notation module}.  All of those definitions
are brought together into the {@link module:ExampleConverter example converter},
which is used in most of the unit tests in this repository.

A client who wants a different parser, converter, or language, can provide a
subset (or completely different version) of the JSON data defined in those
modules, which will result in a different converter for a different set of
concepts.  This leads to great flexibility.

### Assumptions and limitations

There are a few assumptions built into the technology in this repository.

 - Whitespace is not meaningful in any language.  For example, if you define
   `A+B` to be the notation for addition, `A + B` will also be accepted, as will
   input with any number of spaces before/after the `A`, `+`, and `B`.
 - If you ask for the meaning of a piece of text, and its meaning is ambiguous,
   then it is acceptable to return to you any one of the possible meanings.  In
   particular, the current implementation returns the one whose
   {@link AST#toString string representation} is first in alphabetical order.
 - Atomic concepts are written the same way in every language.  For example, if
   variables are one Roman letter in putdown, then they are also one Roman
   letter in LaTeX, and anywhere else.  Similarly, if integers are a sequence of
   Arabic numerals, then that's what they are in all languages.

The current version has the following limitations.

 - Not all common mathematical concepts are yet added to
   {@link module:BuiltInConcepts the built-in concepts module}.  In particular,
   we do not yet support the following.
    - Intervals on the real line, such as `(1,2)`, `[1,2]`, `[1,2)`, or `(1,2]`
    - Absolute values, which are often written `|...|` or in LaTeX using
      `\vert...\vert` (which is what MathLive uses, sometimes with
      `\left\vert...\right\vert`)
    - Norms/distances, which are often written `||...||` or in LaTeX using
      `\Vert...\Vert` (which is what MathLive uses, sometimes with
      `\left\Vert...\right\Vert`)
    - Greek or Hebrew letters, neither upper nor lower case, nor variants
    - Inverse trig functions are supported only by taking a trig function and
      adding an inverse marker, as in `\sin^{-1}` in LaTeX.  There are no atomic
      symbols like `asin` or `arcsin` at present, since it did not seem needed
      for testing, and would clutter things up with a dozen or so extra symbols.
 - LaTeX is a complex language that breaks arguments sometimes at the level of
   individual characters, so that `\frac12` means `\frac{1}{2}`.  The tokenizer
   in this repository always treats `12` as twelve, never as two parts, so it
   cannot handle input such as `\frac12`, which can be created by other tools we
   may want to use, such as MathLive.
 - If this parser is used to process output from MathLive, then the default
   on-screen keyboard should be reduced to prevent the user from entering
   symbols that are not currently understood.  See the `plan.md` file in the
   repository for details on which MathLive symbols are not supported.

### For more information

To see the built-in concepts and default LaTeX notation for them, refer to the
three modules linked to in the previous section.

To learn a few other foundational concepts for how this repository views the
type hierarchy of its concepts, see the documentation for
{@link Converter the Converter class}.

To learn more of how these tools function under the hood, dive into the
implementations of {@link AST abstract syntax trees} and {@link Language
languages}.

To see a readable summary of the (huge) set of tests that are currently
implemented in the test suite of this repository, so that you can browse the
behavior of {@link module:ExampleConverter the example converter}, see
the {@tutorial Test Results} page.

### Extending unit tests

If you work on this repository and add a new concept to the set of built-in
concepts, you should also add corresponding unit tests.  I suggest the following
workflow when doing so.

 1. Edit the `built-in-concepts.js` file and add a new entry for your concept.
 2. Edit `test-parsing-putdown.js` and add a new test case (a new call to
    `it()`) to verify that the putdown form you specified in the concept's
    definition can be parsed.
     - Definitely include a simple case, such as `(+ 1 2)` for addition.
     - Optionally include a complex case, such as nesting your expression inside
       another, or nesting others inside yours.
 3. Edit `test-creating-putdown.js` and add a new test case (a new call to
    `it()`) to verify that the putdown form you specified in the concept's
    definition can be rendered.  The easiest way to do this is to take whatever
    new tests you just added in step 2, above, and reverse the order of their
    arguments.  I.e., calls to `check(putdown,json)` become calls to
    `check(json,putdown)`.
 4. Edit the `latex-notation.js` file and add at least one new entry for the
    concept you just added (and just tested in its putdown form).  Some concepts
    can be expressed using multiple LaTeX notations, and you may therefore need
    to add multiple new entries to that file, one for each such notation.
 5. Edit `test-parsing-latex.js` and add a new test case (a new call to `it()`)
    to verify each of the LaTeX notation(s) you just introduced can be parsed.
    As when testing putdown form, you should test simple cases and complex cases
    as well for each valid LaTeX notation you defined.  Because LaTeX is a more
    complex parsing situation than putdown, be sure to place your new notation
    near various other operators so that their relative precedence gets tested.
 6. Edit `test-creating-latex.js` and add a new test case (a new call to
    `it()`) to verify that the LaTeX notation you specified in the concept's
    definition can be rendered.  You cannot just take all the new tests you
    added in step 5, above, and reverse them, like you did in step 3 for
    putdown.  The reason is that the first LaTeX notation you provide for a new
    concept will be the default one for rendering, and none of the others will
    ever be used.
 7. Edit `test-putdown-to-latex.js` and add a new test case (a new call to
    `it()`) that composes the tests you created in steps 2 and 6, above,
    ensuring that you can go from putdown to LaTeX in one step.  Again, the
    first LaTeX notation for any given concept is the one the converter will use
    for rendering.
 8. Edit `test-latex-to-putdown.js` and add a new test case (a new call to
    `it()`) that composes the tests you created in steps 5 and 3, above, in that
    order, ensuring that you can go from LaTeX to putdown in one step.  In this
    case, you should test that all LaTeX notations are accepted and get
    converted to the same putdown output.
