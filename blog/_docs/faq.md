---
layout: post
title:  "faq"
categories: [docs, common]
root: "../"
pin: true
permalink: /faq/
---

## Motivation

Why wouldn't you just extend clang since it also provides some experimental features (modules for instance)?

Clang is a compiler while this project is a transpiler, that transforms code to standardized c++ code without the need to modify llvm/assembly.

Because the tool's output is C++ code, you can compile transpiled code using emscripten, use static code analyzers, run code inside cling etc.
