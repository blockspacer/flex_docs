---
layout: post
title:  "About"
categories: [docs, common]
root: "../"
pin: true
permalink: /about/
---

flextool is a transpiler that extends C++ for new introspection, reflection and compile-time execution.

flextool doesn't aim to create a predefined set of source code transformations. Users can share C++ scripts (or plugins) for source code transformation.

Goal of flextool is to ease usage of community provided scripts (or plugins) while keeping power of Clang LibTooling.

flextool also provides extra libraries for plugin developers with functionality not provided by Clang LibTooling:

For example:

- integration with C++ code interpreter (Cling) allows to write source code transormation rules in original source code file (may be used to execute arbitrary C++ code without need to write and compile plugins).
- integration with template engines simplifies usage of Clang LibTooling for purposes of code generation.

and many more

## For impatient

You can find usage examples on [tutorial page]({{ site.data.global.tutorial.url | relative_url }})

## flextool is build dependency

Note that depending on flextool won't make users of your application depend on it as well, as it is a pure build dependency, not runtime.

## Metaprogramming

Metaprogramming is an art of writing programs to treat other programs as their data. This means that a program could generate, read, analyse, and transform code or even itself to achieve a certain solution.

## Dependency manager for flextool plugins

We recommend conan - a crossplatform dependency manager for C++.

It can be used to install both flextool and all plugins required by flextool into build folder.

conan also allows to provide important information in each `conan package`:

- path where flextool executable can be found. You don't need to install anything system-wide. Just run `conan install` and you will be able to use `flextool`!
- path to cling and clang header files. That is very usefull cause conan allows to automatically set `-I` arguments required by clang LibTooling.
- path to LLVM_ROOT

Note: It is also possible to install `flextool` system-wide and provide command-line argumets like `--extra-arg=-I$PWD/include --extra-arg=-I$PWD/include/foo --extra-arg=-DMY_DEFINITION=1 --extra-arg=-DONE_MORE_DEFINITION=1` by hand.

## flextool toolchain

The main tool is the flextool.

flextool uses Clang LibTooling and LLVM to parse source code.

Information parsed from source code file will be sent to plugins.

Usually plugin is shared library (.so or .dll file). But it is possible to link plugin statically (.a or .lib file) for better optimization. It is also possible to execute arbitrary C++ code at runtime using Cling and use Cling to imitate plugins.

## Features

Plugin can do arbitrary logic with information provided by flextool. For example, you can:

- modify source files (implement metaclasses, transpile from C++X to C++Y etc.)
- create new files (separate generated class to .hpp and .cpp, etc.)
- check source files (implement style checks, validate design patterns, etc.)
- compile scripts (rules for code transformations) for maximum performance, not only interpret them in Cling.
- use C++ as compile-time scripting language (uses https://github.com/derofim/cling-cmake)
- use template engine with full C++ power (transpiles template to valid C++ code, supports Cling, etc.). uses https://github.com/blockspacer/CXTPL

and many more

## About flex_reflect_plugin

Default plugin https://github.com/blockspacer/flex_reflect_plugin allows to execute custom logic based on data stored in C++ annotations.

flex_reflect_plugin can be disabled (as any plugin) or completely replaced with custom plugin(s).

For example, annotation starting with "{funccall};" may be used to call C++ logic by some name.

```cpp
__attribute__((annotate("{gen};{funccall};make_interface;make_removefuncbody")))
```

`{gen};` - keyword used in every annotation.

`{funccall};` - keyword used to tell what it must call C++ logic (usually one function) by name.

We call functions that can map data stored in annotation to some logic as `annotation methods`.

`funccall` is `annotation method`.

`make_interface;make_removefuncbody` - two rules what will be executed. We call them `source transformation rules`.

`make_interface` and `make_removefuncbody` - source transformation rules. Rules will be executed from left (`make_interface`) to right (`make_removefuncbody`).

Usually you don't need to write long C++ annotations, just use C++ `#define` (or include built-in header with common defines):

{% highlight cpp %}
// define shortcut
#define $apply(...) \
  __attribute__((annotate("{gen};{funccall};" #__VA_ARGS__)))

// usage example
enum class
$apply(
  reflect_enum
)
ReflShapeKind0 : uint32_t {
  Box = 3,
  Sphere = 6,
};
{% endhighlight %}

Suppose we want to morph class into interface:

```cpp
// Source
class SomeInterfaceName {
  int foo1() {
    // ...
  };
  int foo();
  virtual void foobar(int& arg1) = 0;
  virtual void zoobar(int& arg2);
  virtual ~SomeInterfaceName() = 0;
};

// <== will be changed into ==>

// Result
class SomeInterfaceName {
  virtual int foo1() = 0;
  virtual int foo() = 0;
  virtual void foobar(int& arg1) = 0;
  virtual void zoobar(int& arg2) = 0;
  virtual ~SomeInterfaceName() = 0;
};
```

We can use `funccall` action to run C++ scripts for source code transformation. They can be named `make_interface` and `make_removefuncbody` (name as you want).

Using a similar approach you can apply multiple source code transformation steps to the same `class` / `struct` / etc (just list required rules in same annotation like `make_interface;make_removefuncbody`) .

## Code repository

We prefer to keep main code repository small ( https://github.com/blockspacer/flextool ) and divide project into smaller libraries. Most used library is https://github.com/blockspacer/flexlib

## About libtooling

flextool uses LibTooling to parse and modify C++.

LibTooling is a library to support writing standalone tools based on Clang.

Useful links:

- https://clang.llvm.org/extra/clang-rename.html
- Clang Tooling I (add override keyword) https://medium.com/@chichunchen844/clang-tooling-i-add-override-keyword-ddfdf6113b24
- llvm-clang-samples https://github.com/eliben/llvm-clang-samples/blob/master/src_clang/tooling_sample.cpp
- https://chromium.googlesource.com/chromium/src/+/master/tools/clang/rewrite_to_chrome_style/RewriteToChromeStyle.cpp
- http://www.dreamlandcoder.com/system-security/how-i-learned/clang-libtool/
- https://jonasdevlieghere.com/understanding-the-clang-ast/
- http://swtv.kaist.ac.kr/courses/cs453-fall13/Clang%20tutorial%20v4.pdf
- https://meetingcpp.com/mcpp/slides/2019/Teaching%20Old%20Compilers%20New%20Tricks_%20Transpiling%20C++17%20to%20C++11.pdf
- https://gist.github.com/riyadparvez/a2c157b24579c6552466
- https://devblogs.microsoft.com/cppblog/exploring-clang-tooling-part-3-rewriting-code-with-clang-tidy/
- http://blog.audio-tk.com/2018/03/20/writing-custom-checks-for-clang-tidy/
- https://meetingcpp.com/mcpp/slides/2018/Reflection2.pdf
- https://s3.amazonaws.com/connect.linaro.org/yvr18/presentations/yvr18-223.pdf
- https://kevinaboos.wordpress.com/2013/07/30/clang-tips-and-tricks/
- https://eli.thegreenplace.net/tag/llvm-clang
- http://www.goldsborough.me/c++/clang/llvm/tools/2017/02/24/00-00-06-emitting_diagnostics_and_fixithints_in_clang_tools/
- https://www.amazon.com/Getting-Started-LLVM-Core-Libraries/dp/1782166920
- https://variousburglarious.com/tag/clang/

## About cling

flextool uses cling to execute C++ at compile-time.

You can use cling for hot code reload / REPL / Fast C++ prototyping / Scripting engine / JIT / etc.

Useful links:

- (how to add Cling into CMake project) https://github.com/derofim/cling-cmake
- https://github.com/root-project/cling/tree/master/www/docs/talks
- https://github.com/caiorss/C-Cpp-Notes/blob/master/Root-cern-repl.org

## Standing on the Shoulders of Giants

That project possible because of [flexferrum's `autoprogrammer`](https://github.com/flexferrum/autoprogrammer).

Articles about flexferrum's `autoprogrammer` in media:

- [RUS] https://habr.com/ru/article/448466/
- [RUS] https://assets.ctfassets.net/oxjq45e8ilak/55bGdX2PnYzmrpM8rwCjcE/791e7eee3236c2023e86e169faca8a0e/Sergei_Sadovnikov_Metaclasses_in_C___dream_Reality.pdf

## License

Note: This project is provided as it is, without any warranty (see License).

## LICENSE for open source components

All the open source components are used under their associated open source licences.

Used open source components:
* icu
* ced
* boost
* harfbuzz
* boost.outcome
* chromium (base)
* libevent
* modp_b64
* tcmalloc
* xdg_mime
* xdg_user_dirs
* dynamic_annotations
* (Facebook) Folly
* (Microsoft) GSL

See LICENSE files


# 📋 Similar projects

- https://github.com/cppreflect/metapp
- https://github.com/flexferrum/autoprogrammer/blob/8c9867d357450b99202dac81730851ffc8faa891/src/generators/pimpl_generator.cpp
- Clava https://github.com/specs-feup/clava
- Compile-time EXecution of C++ code https://github.com/MaliusArth/cex/blob/6f6e700a253b06c7ae6801e1a3c1f3d842931d77/tool/src/MatchCallbacks/AnnotatedFunctionCallback.cpp
- circle https://github.com/seanbaxter/circle/blob/master/examples/README.md
- SugarCpp https://github.com/curimit/SugarCpp
- ExtendedCpp https://github.com/reneeichhorn/extended-cpp
- https://github.com/dobkeratops/compiler
- transpiling_cpp17_to_cpp11 https://github.com/neobrain/cftf
- https://github.com/llvm-mirror/clang-tools-extra/blob/388528d/clang-tidy/add_new_check.py
- https://github.com/aantron/better-enums
- https://github.com/Neargye/magic_enum
- https://github.com/foonathan/standardese
- https://github.com/Leandros/metareflect/blob/0208fdd4fc0ea1081ae2ff4c3bfce161305a7423/README.md#run-the-metareflect-tool
- https://github.com/qtinuum/QtnProperty#overview
- https://github.com/p-ranav/pprint
- https://github.com/google/draco/blob/master/CMakeLists.txt#L715
- https://github.com/goto40/rpp/blob/ec8a4c4a3ac32dccee8c4e8ba97be8c2ba1c8f88/src/parser/common_parser.cpp#L21
- More https://gist.github.com/blockspacer/6f03933de4f9a6c920649713b056ba4a
