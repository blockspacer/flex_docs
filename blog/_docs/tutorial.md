---
layout: post
title:  "tutorial"
categories: [docs, common]
root: "../"
pin: true
permalink: /tutorial/
---

## First things first

Make sure you have downloaded and installed flextool (the exact approach for doing this will depend your operating system: Linux, Windows, or Mac).

See for detailed installation instructions [{{ site.data.global.download.url | relative_url }}]({{ site.data.global.download.url | relative_url }})

## Introduction

There are some boilerplate code in many projects:

- Enum to string conversion (and vice versa)
- Editor integration (UE4, Unity, Godot)
- Serialization/deserialization
- Object RPC and proxy/stubs
- ORM
- GUI controls binding and models
- <your own case>

How flextool works:

- It takes a piece of handwritten regular C++ code
- It parses this code with the Clang LibTooling
- It analyses the parsing result and produces another piece of code (or performs custom actions defined by plugins)

## How to integrate with flextool

See for detailed usage instructions [{{ site.data.global.building_projects.url | relative_url }}]({{ site.data.global.building_projects.url | relative_url }})

## Custom C++ metaclasses

You can learn more about metaclasses at

- https://youtu.be/80BZxujhY38

flextool can be used to create custom C++ annotations to perform some actions with annotated code (similar to metaclasses).

When to prefer flextool over C++ metaclasses:
- Use flextool when you want to perform arbitrary logic (like retrieving some data from network or filesystem) during compilation step. C++ metaclasses are able to modify source code only, while flextool plugin can perform arbitrary logic (not only code generation and modification).
- Use flextool when you know how to use Clang LibTooling and do not want to learn custom language to use C++ metaclasses.

Example that uses `$apply(ordered)` to generate `bool operator<`, `bool operator<=` etc. below:

```cpp
$apply(ordered) Point
{
  int x;
  int y;
};
```

```cpp
class Point
{
  int x = 0;
  int y = 0;
public:
  Point() = default;
  friend bool operator==(const Point& a, const Point& b)
   { return a.x == b.x && a.y == b.y; }
  friend bool operator< (const Point& a, const Point& b)
   { return a.x < b.x || (a.x == b.x && a.y < b.y); }
  friend bool operator!=(const Point& a, const Point& b) { return !(a == b); }
  friend bool operator> (const Point& a, const Point& b) { return b < a; }
  friend bool operator>=(const Point& a, const Point& b) { return !(a < b); }
  friend bool operator<=(const Point& a, const Point& b) { return !(b < a); }
};
```

`operator ==` and `operator <` must iterate all variables and `return false` if any variables does not match (i.e. a.x != b.x ).

First of all, install plugins for flextool using conan, see [Easy install with common plugins](https://github.com/blockspacer/flextool#easy-install-with-common-plugins)

First, as example, we will run flextool without `CMake`.

Create C++ file `Point.cpp`:

```cpp

// exec is similar to executeCodeAndReplace,
// but returns empty source code modification
#define _executeCode(...) \
  /* generate definition required to use __attribute__ */ \
  __attribute__((annotate( \
        "{gen};{executeCodeAndReplace};" \
        #__VA_ARGS__ \
    )))

class
  _executeCode([]
    (
        const clang::ast_matchers::MatchFinder::MatchResult& clangMatchResult
        , clang::Rewriter& clangRewriter
        , const clang::Decl* clangDecl
    )
    {
        clang::SourceManager &SM
            = clangRewriter.getSourceMgr();
        const clang::CXXRecordDecl* record =
            clangMatchResult.Nodes
                .getNodeAs<clang::CXXRecordDecl>("bind_gen");
        if (!record) {
            CHECK(false);
            return new llvm::Optional<std::string>{};
        }
        LOG(INFO)
            << "parsing record with name = "
            << record->getNameAsString().c_str();
        const clang::LangOptions& langOptions
            = clangRewriter.getLangOpts();
        clang::SourceLocation nodeStartLoc
            = clangDecl->getLocStart();
        // Note Stmt::getLocEnd() returns the source location prior to the
        // token at the end of the line.  For instance, for:
        // var = 123;
        //      ^---- getLocEnd() points here.
        clang::SourceLocation nodeEndLoc
            = clangDecl->getLocEnd();
        DCHECK(nodeStartLoc != nodeEndLoc);
        clang_utils::expandLocations(
            nodeStartLoc, nodeEndLoc, clangRewriter);
        clang::CharSourceRange charSourceRange(
            clang::SourceRange{nodeStartLoc, nodeEndLoc},
            true // IsTokenRange
        );
        // MeasureTokenLength gets us past the last token,
        // and adding 1 gets us past the ';'
        int offset = clang::Lexer::MeasureTokenLength(
            nodeEndLoc,
            SM,
            langOptions) - 1;
        clang::SourceLocation realEnd
            = nodeEndLoc.getLocWithOffset(offset);
        std::string codeToInsert = "public:\n";
        reflection::AstReflector reflector(
            clangMatchResult.Context);
        reflection::NamespacesTree namespaces;
        const reflection::ClassInfoPtr structInfo
          = reflector.ReflectClass(
              record
              , &namespaces
              , false // recursive
            );
        for(const auto& it : structInfo->members) {
            const clang::DeclaratorDecl* decl = it->decl;
            LOG(INFO)
                << "found member with name = "
                << decl->getNameAsString();
            // Generates:
            // friend bool operator==(const Point& a, const Point& b)
            // { return a.x == b.x; }
            {
              codeToInsert += "friend bool operator==(const ";
              codeToInsert += record->getNameAsString();
              codeToInsert += "& a, const ";
              codeToInsert += record->getNameAsString();
              codeToInsert += "& b)\n";
              codeToInsert += "{\n";
              codeToInsert += "  return ";
              codeToInsert += "a.";
              codeToInsert += decl->getNameAsString();
              codeToInsert += " == b.";
              codeToInsert += decl->getNameAsString();
              codeToInsert += ";\n";
              codeToInsert += "}\n";
            }
        }
        clangRewriter.InsertText(realEnd, codeToInsert,
            /*InsertAfter=*/true, /*IndentNewLines*/ false);
        return new llvm::Optional<std::string>{};
    }(clangMatchResult, clangRewriter, clangDecl);
  )
Point
{
  int x;
  int y;
};
```

We added `_executeCode` annotation after `class`. Access to `clang::CXXRecordDecl` and `clang::Rewriter` allowed us to parse and modify source code.

Now run command below (tested under linux):

```bash
export flextool_cmd=$(find ~/.conan/data/flextool/master/conan/stable/package/ -path "*bin/flextool" | head -n 1)
echo flextool_cmd=$flextool_cmd

# Requires to install https://github.com/blockspacer/flex_reflect_plugin/
export flex_reflect_plugin_so=$(find ~/.conan/data/flex_reflect_plugin/master/conan/stable/package/ -path "*lib/flex_reflect_plugin.so" | head -n 1)
echo flex_reflect_plugin_so=$flex_reflect_plugin_so

# Requires to install https://github.com/blockspacer/flex_meta_plugin/
export flex_meta_plugin_so=$(find ~/.conan/data/flex_meta_plugin/master/conan/stable/package/ -path "*lib/flex_meta_plugin.so" | head -n 1)
echo flex_meta_plugin_so=$flex_meta_plugin_so

# Requires to install https://github.com/blockspacer/flex_squarets_plugin/
export flex_squarets_plugin_so=$(find ~/.conan/data/flex_squarets_plugin/master/conan/stable/package/ -path "*lib/flex_squarets_plugin.so" | head -n 1)
echo flex_squarets_plugin_so=$flex_squarets_plugin_so

# Requires to install https://github.com/blockspacer/cling_conan/
export cling_include_dir_clang=$(find ~/.conan/data/cling_conan/master/conan/stable/package/ -path "*include/clang" | head -n 1)
echo cling_include_dir_clang=$cling_include_dir_clang

export cling_include_dir=$(dirname "$cling_include_dir_clang")
echo cling_include_dir=$cling_include_dir

export clang_include_dir=$(dirname "$cling_include_dir")/lib/clang/5.0.0/include
echo clang_include_dir=$clang_include_dir

export chromium_base_include_dir=$(find ~/.conan/data/chromium_base/master/conan/stable/package/ -path "*include" | head -n 1)
echo chromium_base_include_dir=$chromium_base_include_dir

export chromium_build_util_include_dir=$(find ~/.conan/data/chromium_build_util/master/conan/stable/package/ -path "*include" | head -n 1)
echo chromium_build_util_include_dir=$chromium_build_util_include_dir

export basis_include_dir=$(find ~/.conan/data/basis/master/conan/stable/package/ -path "*include" | head -n 1)
echo basis_include_dir=$basis_include_dir

export flexlib_include_dir=$(find ~/.conan/data/flexlib/master/conan/stable/package/ -path "*include" | head -n 1)
echo flexlib_include_dir=$flexlib_include_dir

export flex_support_header=$(find ~/.conan/data/flex_support_headers/master/conan/stable/package/ -path "*cling_preloader.inc" | head -n 1)
echo flex_support_header=$flex_support_header

export flextool_input_files=$PWD/Point.cpp

$flextool_cmd \
  --vmodule=*=200 --enable-logging=stderr --log-level=100 \
  --extra-arg=-DCLING_IS_ON=1 \
  --indir=$PWD \
  --outdir=$PWD \
  --load_plugin $flex_reflect_plugin_so \
  --load_plugin $flex_meta_plugin_so \
  --load_plugin $flex_squarets_plugin_so \
  --extra-arg=-I$cling_include_dir \
  --extra-arg=-I$clang_include_dir \
  --extra-arg=-I$chromium_base_include_dir \
  --extra-arg=-I$chromium_build_util_include_dir \
  --extra-arg=-I$chromium_build_util_include_dir/chromium \
  --extra-arg=-I$basis_include_dir \
  --extra-arg=-I$flexlib_include_dir \
  --extra-arg=-I$PWD \
  --extra-arg=-Wno-undefined-inline \
  $flextool_input_files \
  --cling_scripts=$flex_support_header
```

At the end of the generated file `Point.cpp.generated.cpp` must be:

```cpp
Point
{
  int x;
  int y;
public:
friend bool operator==(const Point& a, const Point& b)
{
return a.x == b.x;
}
friend bool operator==(const Point& a, const Point& b)
{
return a.y == b.y;
}
};
```

We used flextool without `CMake`, but had to run `find` in `~/.conan/` directory.

You can create custom plugin that will make easier development process and allow to create custom annotation `$apply(ordered)` without `_executeCode`.

See [how to add new plugins]({{ site.data.global.adding_plugins.url | relative_url }})

## Writing custom plugin to generate C++ files

Clone [https://github.com/blockspacer/flextool_plugin_generator](https://github.com/blockspacer/flextool_plugin_generator) and generate new plugin for flextool based on [README.md](https://github.com/blockspacer/flextool_plugin_generator/blob/master/README.md).

See [how to add new plugins]({{ site.data.global.adding_plugins.url | relative_url }})

## Using `flex_typeclass_plugin` to add custom C++ typeclasses (using Type Erasure)

Type Erasure - Combination of static and dynamic polymorphism which gets the best of both sides with minimal overhead.

Definition by Dave Abrahams and Aleksey Curtovoy in, C++ Template Metaprogramming:

> In its fullest expression, type erasure is the process of turning a wide variety of types with a common interface into one type with that same interface

Quotes from [
https://dragly.org/2018/04/21/rust-like-traits-in-cpp/](
https://dragly.org/2018/04/21/rust-like-traits-in-cpp/)

> With inheritance in C++, it is easy to introduce new types,
> but hard to extend with new functionality
> (all existing types will need to implement any new functions).
>
> Further, it is hard to add functionality after-the-fact.
> If a library has defined length() as a function of Vector3,
> but you need lengthSquared() for performance reasons,
> there is no easy way to add this to the Vector3 class.
>
> You will typically have to make lengthSquared(Vector3 v)
> a free function, which makes it awkward,
> because you are now calling v.length() for the length,
> but lengthSquared(v) for the length squared.

Quote from [https://quuxplusone.github.io/blog/2019/03/18/what-is-type-erasure/#i-mean-ad-hoc-dynamic-polymorphism](https://quuxplusone.github.io/blog/2019/03/18/what-is-type-erasure/#i-mean-ad-hoc-dynamic-polymorphism)

> When I say “type erasure” in C++, I mean more than just a base class with a classical polymorphic interface.
>
> I mean a non-virtual interface which encapsulates and hides the polymorphism from the end-user, and allows them to use “duck typing” without bothering to inherit from any library class. (This can allow several libraries to interoperate seamlessly, even if they don’t know about each other’s code.)

You can find more information about `Type Erasure` as design pattern at [https://caiorss.github.io/C-Cpp-Notes/cpp-design-patterns.html#orgdda5854](https://caiorss.github.io/C-Cpp-Notes/cpp-design-patterns.html#orgdda5854)

You can find more information about implementation details of `Type Erasure` at [https://www.modernescpp.com/index.php/c-core-guidelines-type-erasure-with-templates](https://www.modernescpp.com/index.php/c-core-guidelines-type-erasure-with-templates) and [http://www.goldsborough.me/cpp/2018/05/22/00-32-43-type_erasure_for_unopinionated_interfaces_in_c++/](http://www.goldsborough.me/cpp/2018/05/22/00-32-43-type_erasure_for_unopinionated_interfaces_in_c++/) and [https://mropert.github.io/2017/11/30/polymorphic_ducks/](https://mropert.github.io/2017/11/30/polymorphic_ducks/)

You can also find interesting section about type erasure from the book `Hands-On Design Patterns with C++`

In C++ Rust-like-traits are usually called as typeclasses (similar to Haskell [https://functionalcpp.wordpress.com/2013/08/16/type-classes/](https://functionalcpp.wordpress.com/2013/08/16/type-classes/)). You can find example code that uses typeclasses at [https://github.com/TartanLlama/typeclasses]( https://github.com/TartanLlama/typeclasses)

Also typeclasses may be called as `virtual concepts`, see for details [https://github.com/andyprowl/virtual-concepts/blob/master/draft/Dynamic%20Generic%20Programming%20with%20Virtual%20Concepts.pdf](https://github.com/andyprowl/virtual-concepts/blob/master/draft/Dynamic%20Generic%20Programming%20with%20Virtual%20Concepts.pdf) and [https://cdn2-ecros.pl/event/codedive/files/presentations/2017/code%20dive%202017%20-%20Michal%20Dominiak%20-%20Customization%20points%20that%20suck%20less.pdf](https://cdn2-ecros.pl/event/codedive/files/presentations/2017/code%20dive%202017%20-%20Michal%20Dominiak%20-%20Customization%20points%20that%20suck%20less.pdf)

```cpp
class(typeclass) printable {
    void print();
};

struct foo {
    void print() { std::cout << "foo"; }
};

struct bar {
    void print() { std::cout << "bar"; }
};

std::vector<printable> v;
v.push_back(foo{});
v.push_back(bar{});
v[0].print();
v[1].print();

printable a = foo{};
a.print();
a = bar{};
a.print();
```

You can learn more about typeclasses at

- http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1900r0.html#type-erasure

To quote some lines:

- There are no polymorphic types, only a polymorphic use of similar types

- By using inheritance to capture polymorphic use, we shift the burden of use to the type implementation, tightly coupling components

- Inheritance implies variable size, which implies heap allocation

- Heap allocation forces a further burden to manage the object lifetime

- Indirection, heap allocation, virtualization impacts performance

Our implementation of typeclasses inspired by [https://github.com/seanbaxter/circle/blob/master/erasure/type_erasure.md](https://github.com/seanbaxter/circle/blob/master/erasure/type_erasure.md)

Usage notes:

- Typeclasses prefer composition over inheritance, so instead of saying a Rectangle is-a Drawable object, you might say it has-a thing which is Drawable

See for details [https://github.com/blockspacer/flex_typeclass_plugin](https://github.com/blockspacer/flex_typeclass_plugin)

See `README` file from [https://github.com/blockspacer/flex_typeclass_plugin](https://github.com/blockspacer/flex_typeclass_plugin) for usage examples.

## Fast pimpl or type-safe Pimpl implementation without overhead

You can read about Fast pimpl at [https://www.cleeus.de/w/blog/2017/03/10/static_pimpl_idiom.html](https://www.cleeus.de/w/blog/2017/03/10/static_pimpl_idiom.html) and [https://github.com/sqjk/pimpl_ptr](https://github.com/sqjk/pimpl_ptr)

Classic pimpl uses heap to store impl (leads to slow construction time) and pointer (leads to slow access time due to cache miss on each function call through pointer to heap).

Fast pimpl allows to increase performance in cost of maintainability.

```cpp
// Size and Alignment used by pimpl
// must be specified by developer manually
std::aligned_storage_t<Size, Alignment> storage_;
```

It is possible to minimize maintainability efforts using code generation.

We can use clang libtooling to get `Size` and `Alignment` automatically based on provided data type.

[https://github.com/blockspacer/flex_reflect_plugin/](https://github.com/blockspacer/flex_reflect_plugin/) allows to execute libtooling (or any valid C++ code) during compilation step.

The basic idea is:

1. Execute C++ code (before application build step) to store `Size` and `Alignment` of some data type.
2. Store `Size` and `Alignment` in some cache (in our case, it is `std::map`)
3. Get `Size` and `Alignment` from cache and paste them into source code (into `std::aligned_storage_t<Size, Alignment> storage_` used by fast pimpl).

We will use Fast pimpl implementation via `#include <basis/core/pimpl.hpp>` from [https://github.com/blockspacer/basis/blob/c54ed26250ac3acc0ea5e31cd9424f08204cb450/basis/core/pimpl.hpp](https://github.com/blockspacer/basis/blob/c54ed26250ac3acc0ea5e31cd9424f08204cb450/basis/core/pimpl.hpp)

`flex_reflect_plugin` allows to execute C++ code at runtime (we need to execute C++ code during compilation step).

```cpp
// exec is similar to executeCodeAndReplace,
// but returns empty source code modification
#define _executeCode(...) \
  /* generate definition required to use __attribute__ */ \
  __attribute__((annotate( \
        "{gen};{executeCodeAndReplace};" \
        #__VA_ARGS__ \
    )))
```

See `README` from [https://github.com/blockspacer/flex_reflect_plugin/](https://github.com/blockspacer/flex_reflect_plugin/) for details.

Now we can annotatate any C++ class with `_executeCode` to extract reflection information from that class (using clang LibTooling).

```cpp
class
_executeCode(
  []
  (
    const clang::ast_matchers::MatchFinder::MatchResult& clangMatchResult
    , clang::Rewriter& clangRewriter
    , const clang::Decl* clangDecl
  )
  {
    clang::SourceManager &SM = clangRewriter.getSourceMgr();

    clang::CXXRecordDecl const *record =
      clangMatchResult.Nodes
        .getNodeAs<clang::CXXRecordDecl>("bind_gen");

    if (!record) {
      CHECK(false);
      return new llvm::Optional<std::string>{};
    }

    if (!record->isCompleteDefinition()) {
      CHECK(false);
      return new llvm::Optional<std::string>{};
    }

    LOG(INFO)
      << "record name is "
      << record->getNameAsString().c_str();

    const clang::ASTRecordLayout& layout
      = clangMatchResult.Context->getASTRecordLayout(record);

    uint64_t typeSize =  layout.getSize().getQuantity();
    // assume it could be a subclass.
    unsigned fieldAlign = layout.getNonVirtualAlignment().getQuantity();

    // If the class is final, then we know that the pointer points to an
    // object of that type and can use the full alignment.
    if (record->hasAttr<clang::FinalAttr>()) {
      fieldAlign = layout.getAlignment().getQuantity();
    }

    const std::string typeToMapKey
      = "Foo::FooImpl";

    global_storage["global_typeSize_for_" + typeToMapKey]
      = typeSize;
    global_storage["global_fieldAlign_for_" + typeToMapKey]
      = fieldAlign;

    LOG(INFO)
      << record->getNameAsString()
      << " Size: " << typeSize
      << " Alignment: " << fieldAlign << '\n';

    return new llvm::Optional<std::string>{};
  }(clangMatchResult, clangRewriter, clangDecl);
)
Foo::FooImpl
{
 public:
  FooImpl();

  ~FooImpl();

  int foo();

  std::string baz();

 private:
  std::string data_{"somedata"};
};
```

`Foo::FooImpl` is class that stores implementation (as usual in pimpl pattern). It was annotated by custom annotation attrubute (`_executeCode` is macro that trasforms provided arguments into string via `#__VA_ARGS__` and creates annotation attrubute)

`global_storage` is cache that can store arbitrary data, it is defined in [https://github.com/blockspacer/flex_support_headers/blob/ed723f79cf08b14a8ab1e225289a2ad858def154/flex/cling_preloader.inc](https://github.com/blockspacer/flex_support_headers/blob/ed723f79cf08b14a8ab1e225289a2ad858def154/flex/cling_preloader.inc) as below:

```cpp
std::map<
    std::string
    , std::any
  > global_storage;
```

Path to that file (in our case `cling_preloader.inc`) must be passed to flextool via `--cling_scripts=` argument (flextool can load arbitrary file with C++ code using Cling interpreter). Note that `cling_preloader.inc` also included all required C++ header files.

We executed C++ code stored in annotation attribute (code was converted into string, see `_executeCode` above).

Executed C++ code used `clangMatchResult.Context->getASTRecordLayout(record);` to store `Size` and `Alignment` in `global_storage`

Now we must get `Size` and `Alignment` from cache and paste them into source code (into `std::aligned_storage_t<Size, Alignment> storage_` used by fast pimpl).

```cpp
class Foo {
public:
  Foo();

  ~Foo();

  int foo();

  std::string baz();

private:
  class FooImpl;

#if !defined(FOO_HPP_NO_CODEGEN)
  class
  _executeCode(
    []
    (
      const clang::ast_matchers::MatchFinder::MatchResult& clangMatchResult
      , clang::Rewriter& clangRewriter
      , const clang::Decl* clangDecl
    )
    {
      const std::string typeToMapKey
        = "Foo::FooImpl";

      uint64_t typeSize
        = std::any_cast<uint64_t>(
            global_storage["global_typeSize_for_" + typeToMapKey]);

      unsigned fieldAlign
        = std::any_cast<unsigned>(
            global_storage["global_fieldAlign_for_" + typeToMapKey]);

      std::string fastPimplCode
        = "pimpl::FastPimpl<";

      fastPimplCode += "FooImpl";

      // sizeof(Foo::FooImpl)
      fastPimplCode += ", /*Size*/";
      fastPimplCode += std::to_string(typeSize);

      // alignof(Foo::FooImpl)
      fastPimplCode += ", /*Alignment*/";
      fastPimplCode += std::to_string(fieldAlign);

      fastPimplCode += "> impl_;";

      /**
       * generates code similar to:
       *  pimpl::FastPimpl<FooImpl, Size, Alignment> impl_;
       **/
      return new llvm::Optional<std::string>{std::move(fastPimplCode)};
    }(clangMatchResult, clangRewriter, clangDecl);
  ) {}
#endif // !defined(FOO_HPP_NO_CODEGEN)
};
```

We used `_executeCode` again and returned `llvm::Optional<std::string>`, that string will store generated code similar to `pimpl::FastPimpl<FooImpl, /*Size*/ 64, /*Alignment*/ 12> impl_;`

Remaining problems:

Problem 1: We used Cling C++ interpreter. Resulting code is ugly and (maybe) not fast.

Solution: We can create plugin for flextool (plugin is shared library). Comparing to approach that uses Cling C++ interpreter - plugin must be fast and allows to create custom C++ annotations (custom and beautiful C++ annotations).

Problem 2: `Size` differs from compiler to compiler (and even used `std` version affects `Size`)

Solution: add to retrieved `Size` approximately 8 bytes (minimal overhead, depends on use-case) and test that code compiles on all desired compilers. Note that if `Size` is invalid - code will not compile, so it is safe to use Fast Pimpl in production. Make sure that you use `SizePolicy::AtLeast`, see `#include <basis/core/pimpl.hpp>` for details.

Problem 3: We must parse impl before generation of `pimpl::FastPimpl<FooImpl, /*Size*/ 64, /*Alignment*/ 12> impl_;` cause it requires `Size` and `Alignment` (file order matters).

Solution: Make sure that you store impl in separate file from `pimpl::FastPimpl` and their code generation do not affect each other.

We passed `FooImpl.hpp` to flextool before `Foo.cc` because `Foo.cc` requires `Size` and `Alignment` from `FooImpl.hpp`.

We do not want to run gode generation based on included header `Foo.hpp` while parsing `FooImpl.hpp` (`FooImpl.hpp` includes `Foo.hpp`), thats why we used `#if !defined(FOO_HPP_NO_CODEGEN)` and included `Foo.hpp` from `FooImpl.hpp` like so:

```cpp
#if defined(CODEGEN_RUNNING)
#define FOO_HPP_NO_CODEGEN 1
#include "Foo.hpp"
#else
#include "Foo.hpp.generated.hpp"
#endif
```

Also we passed `extra-args=-DCODEGEN_RUNNING=1` as argument to flextool.

Switching from approach that uses Cling C++ interpreter to flextool plugin (plugin is shared library) can solve a lot of problems listed above. For example, we can inject `Foo::Impl` code into `Foo` based on arbitrary data type (to avoid `FOO_HPP_NO_CODEGEN` and `CODEGEN_RUNNING`). We can also create custom data structure to cache reflected data in plugin, to avoid `global_storage`.

Problem 4: Source file with public class implementation contains a lot of boilerplate code.

Solution: We can generate C++ code that calls the corresponding method of the 'private' class and passes arguments to it (proxy method calls to implementation).

Prefer not to create you own solution but use existing one:

You can use [https://github.com/blockspacer/flex_pimpl_plugin](https://github.com/blockspacer/flex_pimpl_plugin)

See `README` file for usage examples: [https://github.com/blockspacer/flex_pimpl_plugin](https://github.com/blockspacer/flex_pimpl_plugin)

## Integration with template engines

You can use [https://github.com/blockspacer/flex_squarets_plugin](https://github.com/blockspacer/flex_squarets_plugin)

For example, `flex_squarets_plugin` allows to use syntax similar `javascript template literals` in C++:

```js
// javascript template literals
const myVariable = 'test'
const mystring = `something ${myVariable}` //something test
```

Default template engine syntax (CXTPL) allows to rewrite code above as:

```cpp
// custom C++ template syntax using flex_squarets_plugin
// After code generation `mystring` will store text `something test`.
const std::string myVariable = "test";
_squaretsString(
  R"raw(
    something [[+ myVariable +]]
  )raw"
)
std::string mystring;
```

## Use case: enum to string and string to enum

```cpp
const char* SomeEnumToString(SomeEnum e)
{
   switch (e)
   {
   case Item1:
       return "Item1";
   case Item2:
       return "Item2";
   case Item3:
       return "Item3";
   }

   return "Unknown Item";
}

SomeEnum StringToSomeEnum(const char* itemName)
{
   static std::pair<const char*, SomeEnum> items[] = {
       {"Item1", Item1},
       {"Item2", Item2},
       {"Item3", Item3},
   };
   auto p = std::lower_bound(begin(items), end(items), itemName,
                             [](auto&& i, auto&& v) {return strcmp(i.first, v) < 0;});
   if (p == end(items) || strcmp(p->first, itemName) != 0)
       throw std::bad_cast();

   return p->second;
}
```

Code generator should do:

- Find all enum declarations in the input file
- Extract items from the particular enum declaration and convert them to the string form
- Generate ‘enum to string’ conversion function with the ‘switch’ statement (be careful with scoped enums!)
- Sort enum items (in string representation)
- Generate ‘string to enum’ conversion function with array and std::lower_bound

`MatchFinder` allows to find enum declaration (`clang::EnumDecl`):

```cpp
class EnumHandler : public MatchFinder::MatchCallback
{
public:
   void run(const MatchFinder::MatchResult& result) override
   {
       // Access to the named matching results
       if (const clang::EnumDecl* decl = result.Nodes.getNodeAs<clang::EnumDecl>("enum"))
       {
           // do something useful with the found enum declaration
       }
   }
};
```

Code generation:

```cpp
// generates C++ code for enum to string conversion
void WriteEnumToStringConversion(std::ostream& os, const EnumDescriptor& enumDescr)
{
   auto& enumName = enumDescr.enumName;
   os << "inline const char* " << enumName << "ToString(" << enumName << " e)\n{\n";
   os << "    switch (e)\n";
   os << "    {\n";
   auto scopePrefix = enumDescr.isScoped ? enumName + "::" : std::string();
   for (auto& i : enumDescr.enumItems)
   {
       os << "    case " << scopePrefix << i << ":\n";
       os << "        return \"" << i << "\";\n";
   }
   os << "    }\n";
   os << "    return \"Unknown Item\";\n";
   os << "}\n\n";
}

// generates C++ code for string to enum conversion
void WriteEnumFromStringConversion(std::ostream& os, const EnumDescriptor& enumDescr)
{
   auto& enumName = enumDescr.enumName;
   auto scopePrefix = enumDescr.isScoped ? enumName + "::" : std::string();
   os << "inline " << enumName << " StringTo" << enumName << "(const char* itemName)\n{\n";
   os << "    static std::pair<const char*, " << enumName << "> items[] = {\n";
   for (auto& i : enumDescr.enumItems)
       os << "        {\"" << i << "\", " << scopePrefix << i << "},\n";
   os <<R"(    };
   auto p = std::lower_bound(begin(items), end(items), itemName,
                     [](auto&& i, auto&& v) {return strcmp(i.first, v) < 0;});
   if (p == end(items) || strcmp(p->first, itemName) != 0)
       throw std::bad_cast();
   return p->second;
})";
}
```

## Using cling interpreter

[https://github.com/blockspacer/flex_reflect_plugin](https://github.com/blockspacer/flex_reflect_plugin) allows to execute arbitrary C++ code stored in annotation attributes.

## Detecting flextool in Preprocessor

flextool defines for clang:

```bash
-DCLANG_ENABLED=1
-DCLANG_IS_ON=1
```

flextool defines for cling:

```bash
-DCLING_ENABLED=1
-DCLING_IS_ON=1
```

You can pass `extra-args=-DCODEGEN_RUNNING=1` as argument to flextool and use it as usual C++ define:

```cpp
#if defined(CODEGEN_RUNNING)
// ... code here ...
#endif
```

## Generating not-C++ files

that page in development

## Optimizing speed

that page in development

## Optimizing memory

that page in development

## Using threads

that page in development

## Integrating with more build systems

that page in development

## Example: Avoid Repetitive Code

that page in development

C++ is a great language but it sometimes gets too verbose for things you have to do in your code for common tasks. These do very often bring no real value to the business side of your programs – and this is where flextool is here to make your life happier and yourself more productive.

The way it works is by plugging into your build process and autogenerating C++ as per a number of project annotations you introduce in your code.

Including plugin in your builds is very straight forward. Add plugin into `conanfile.py` and run `conan install`. Then tell flextool about files or projects that it must process.

Encapsulating object properties via public getter and setter methods is such a common practice in the C++ world: a class with get/set methods for “properties”.

This is so common that most IDE's support autogenerating code for these patterns (and more). This code however needs to live in your sources and also be maintained when, say, a new property is added or a field renamed.

Let's consider this class as an example:

```cpp
class User {

    private:
        int id;

        std::string firstName;

        std::string lastName;

        int age;

    public:
        User() {
        }

        User(const std::string& firstName, const std::string& lastName, int age) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.age = age;
        }

    // getters and setters: ~30 extra lines of code
}
```

This is a rather simple class, but still consider if we added the extra code for getters and setters we'd end up with a definition where we would have more boilerplate zero-value code than the relevant business information: “a User has first and last names, and age.”

Let us now flextool-ize this class:

```cpp
class User {

    private:
        $apply(getter;setter)
        int id;

        $apply(getter)
        std::string firstName;

        $apply(
            setter
        )
        std::string lastName;

        $apply(
            getter;
            setter
        )
        int age;

    public:
        User() {
        }

        User(const std::string& firstName, const std::string& lastName, int age) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.age = age;
        }
}
```

By adding the `$apply(getter;setter)` annotations we told flextool to, well, generate these for all the fields of the class.

Note this is the whole class code, I am not omitting anything as opposed to the version above with the `// getters and setters` comment. This is a significant saving in code!

What if you wanted to refine the visibility of some properties? For example, I like to keep my entities' id field modifiers package or protected visible. Just use a finer grained setter for this particular field:

```cpp
        $apply(getter;setter(PROTECTED))
        int id;
```

You can find complete code of that example on Github.

## Example: codestyle validation of interface

Interface must have only pure virtual methods, and a virtual destructor, and no data, and no private members, this pattern duplicated over and over in your code every time you create an interface.

This leads to the risks of code duplication, for example forgetting the virtual destructor once in a while for example.

Reflection allows to access some data about the class, such as: are all the methods public?

And compile time programming makes checks at compile time, like: is there any private member, or is there any data member, which is not supposed to be the case in an interface. And after performing those compile time checks, compile time programming allows to emit custom compile errors messages such as “an interface cannot have private data”.

TODO: example:writing prototype with the help of cling interpreter

TODO: example: translating code that uses cling interpreter to plugin (shared library) for better performance

You can find complete code of that example on Github.

## Example: codestyle validation of private class members

Quote from `Google C++ Style Guide`, section `Class Data Members` https://google.github.io/styleguide/cppguide.html

```cpp
Data members of classes, both static and non-static, are named like ordinary nonmember variables, but with a trailing underscore.

class TableInfo {
  ...
 private:
  std::string table_name_;  // OK - underscore at end.
  static Pool<TableInfo>* pool_;  // OK.
};
```

We can add custom annotation near class declaration to validate that within that class all `data members are named with a trailing underscore.`

```cpp
class
$apply(
  styleguide(data_members = googleStyleGuide)
)
TableInfo {
  ...
 private:
  std::string table_name_;  // OK - underscore at end.
  static Pool<TableInfo>* pool_;  // OK.
};
```

You can find complete code of that example on Github.

## Example: serialization (networking) and deserialization

TODO

## Example: using as REST API router (networking)

TODO

## Example: Pattern-matching expressions

TODO

## Example: Spaceship operator

TODO

## Example: format library

Embeds the arguments themselves into the format specifier string. It's like Python f-strings, but for C++.

TODO

## Example: using as user input validator (networking)

TODO

## Example: editor integration

TODO

## Example: serialization (to file) and deserialization

TODO

## Example: include copyright and license information from LICENSE file and copyright template (date may change)

TODO

## Code of unit tests

that page in development

## Troubleshooting

that page in development

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page