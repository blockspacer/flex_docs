---
layout: post
title:  "tutorial"
categories: [docs, common]
root: "../"
pin: true
permalink: /tutorial/
---

## TODO

that page in development

## For contibutors

Fell free to open GitHub Issue if you know how to improve that page

## First things first

Make sure you have downloaded and installed flextool (the exact approach for doing this will depend your operating system: Linux, Windows, or Mac).

## Verifying flextool

that page in development

## Running flextool by hand

that page in development

## Running flextool using conan and CMake

that page in development

## Using existing plugin to add custom C++ metaclasses

that page in development

## Writing custom plugin to generate C++ files

that page in development

## Generating not-C++ files

that page in development

## Optimizing speed

that page in development

## Optimizing memory

that page in development

## Using threads

that page in development

## Using cling interpreter

that page in development

## Integrating with more build systems

that page in development

## Detecting flextool in Preprocessor

that page in development

## Examples

that page in development

## Code of unit tests

that page in development

## Troubleshooting

that page in development

## About `cxxctp_callback`

Function signature for code transformation must be compatible with `cxxctp_callback`:

```cpp
typedef std::function<const char*(
    const cxxctp::parsed_func& func_with_args,
    const clang::ast_matchers::MatchFinder::MatchResult& matchResult,
    clang::Rewriter& rewriter,
    const clang::Decl* decl,
    const std::vector<cxxctp::parsed_func>& all_funcs_with_args)> cxxctp_callback;
```

Detailed function signature:

- return value (const char\*) - used to replace original code, if needed.
- func_with_args - currently executed function from list `all_funcs_with_args` (see below)
- clang::ast_matchers::MatchFinder::MatchResult - see https://xinhuang.github.io/posts/2015-02-08-clang-tutorial-the-ast-matcher.html
- clang::Rewriter - see https://devblogs.microsoft.com/cppblog/exploring-clang-tooling-part-3-rewriting-code-with-clang-tidy/
- clang::Decl - found by MatchFinder, see https://devblogs.microsoft.com/cppblog/exploring-clang-tooling-part-2-examining-the-clang-ast-with-clang-query/
- std::vector<parsed_func> - all arguments extracted from attribute. Example: \$apply(interface, foo_with_args(1, "2")) becomes two `parsed_func` - `interface` and `foo_with_args`.

Think about function name as one of `__VA_ARGS__` from

```cpp
#define $apply(...) \
  __attribute__((annotate("{gen};{funccall};" #__VA_ARGS__)))
```

Example where `make_interface` and `make_removefuncbody` - two function names:

```cpp
$apply(make_interface;
  make_removefuncbody)
```