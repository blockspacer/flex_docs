---
layout: post
title:  "adding_plugins"
categories: [docs, common]
root: "../"
pin: true
permalink: /adding_plugins/
---

## About

That page provides information about plugin development for flextool.

## Example project: flex_meta_plugin

Github repository: [https://github.com/blockspacer/flex_meta_plugin](https://github.com/blockspacer/flex_meta_plugin)

Uses conanfile and CMakeLists.txt to integrate with flextool

## Example project: flex_meta_demo

Github repository: [https://github.com/blockspacer/flex_meta_demo](https://github.com/blockspacer/flex_meta_demo)

Plugin provides rules for source code transformation and generation.

## Example project: flex_typeclass_plugin

Github repository: [https://github.com/blockspacer/flex_typeclass_plugin](https://github.com/blockspacer/flex_typeclass_plugin)

Uses conanfile and CMakeLists.txt to integrate with flextool. Plugin provides support for typeclasses (or Rust-like traits or "TEPS" - "Type Erasure Parent Style" or virtual concepts).

## How to create new plugins for flextool

Tutorial below shows how to build example plugin that can print information about class fields if code uses custom C++ annotation (like `[[make_reflect]]`).

Clone [https://github.com/blockspacer/flextool_plugin_generator](https://github.com/blockspacer/flextool_plugin_generator) and generate new plugin for flextool based on [README.md](https://github.com/blockspacer/flextool_plugin_generator/blob/master/README.md).

Open `cmake/ProjectFiles.cmake` and configure list of plugin source files.

Open `.cc` files in `src/` folder.

We will use default plugin https://github.com/blockspacer/flex_reflect_plugin that allows to execute custom logic based on data stored in C++ annotations. flex_reflect_plugin can be disabled (as any plugin) or completely replaced with custom plugin(s). Tutorial below assumes that you use flex_reflect_plugin.

Lets create custom C++ annotation (like `[[make_reflect]]`) and perform some actions with annotated code.

Any plugin can add custom rules for source code transformation or generation during `Events::RegisterAnnotationMethods`. Search in source files for method with name `RegisterAnnotationMethods` and modify it. 

Example:

```cpp
    ::clang_utils::SourceTransformPipeline& sourceTransformPipeline
      = *event.sourceTransformPipeline;

    // `SourceTransformRules` allow to combine multiple annotations, example:
    // __attribute__((annotate("{gen};{funccall};make_reflect;make_interface;make_removefuncbody")))
    ::clang_utils::SourceTransformRules& sourceTransformRules
      = sourceTransformPipeline.sourceTransformRules;

    sourceTransformRules["make_reflect"] =
      base::BindRepeating(
        &AnnotationPipeline::make_reflect,
        base::Unretained(this));

    // `AnnotationMethods` unable to combine multiple annotations, example:
    // __attribute__((annotate("{gen};{make_reflect};" __VA_ARGS__)))
    ::flexlib::AnnotationMethods& annotationMethods
      = *event.annotationMethods;

    // Or you can use `annotationMethods` like so:
    // annotationMethods["{make_reflect};"] =
    //   base::BindRepeating(
    //     &AnnotationPipeline::make_reflect,
    //     base::Unretained(this));
```

`make_reflect` (from `sourceTransformRules["make_reflect"]`) can be used as part of annotation attribute:

```cpp
// make_reflect can be used with some other rules, for example: make_interface;make_removefuncbody
__attribute__((annotate("{gen};{funccall};make_reflect;make_interface;make_removefuncbody")))
```

Code below allows to bind C++ function `&AnnotationPipeline::make_reflect` to string `make_reflect`:

```cpp
    sourceTransformRules["make_reflect"] =
      base::BindRepeating(
        &AnnotationPipeline::make_reflect,
        base::Unretained(this));
```

Where C++ function `&AnnotationPipeline::make_reflect` can use clang LibTooling to parse or modify source code. You can save information about parsed code in files, transfer parsed information over network, etc.

We created custom C++ annotation. But how to get information about annotated code? - `&AnnotationPipeline::make_reflect` must recieve information about used annotation attribute in `const clang_utils::SourceTransformOptions&`.

```cpp
    // must point to record associated with annotation attribute
    // __attribute__((annotate("{gen};{funccall};make_reflect;...")))
    clang::CXXRecordDecl const *record =
        sourceTransformOptions.matchResult.Nodes
        .getNodeAs<clang::CXXRecordDecl>("bind_gen");
```

For example, we can print record name:

```cpp
    if (record) {
      LOG(INFO)
        << "record name is "
        << record->getNameAsString().c_str();
    }
```

Usage example below prints `SomeStructName` as record name (using `record->getNameAsString()`):

{% highlight cpp %}

#include <string>
#include <vector>

struct
  $apply(
    make_reflect
  )
SomeStructName {
 public:
  SomeStructName() {
    // ...
  }

 private:
  __attribute__((annotate("{gen};{attr};reflectable;")))
  std::vector<std::string> m_VecStr2;
};
{% endhighlight %}

We can iterate all fields in `SomeStructName` and print them (example below prints `std::vector<std::string> m_VecStr2`):

```cpp
for (clang::Decl *decl : record->decls()) {
    if (clang::FieldDecl *field = llvm::dyn_cast<clang::FieldDecl>(decl)) {
        LOG(INFO)
            << "field type is"
            << field->getType().getUnqualifiedType().getAsString().c_str()
            << " and field name is "
            << field->getNameAsString().c_str();
    }
}
```

Note that we used `clang::FieldDecl *field = llvm::dyn_cast<clang::FieldDecl>(decl)`. That code used clang LibTooling. You can find a lot of information about LibTooling over the internet, example video `Building a C++ Reflection System: Using LLVM and Clang`: [https://www.youtube.com/watch?v=DUiUBt-fqEY](https://www.youtube.com/watch?v=DUiUBt-fqEY)

What if we don't want to print information about some fields?

We can add custom annotation near some fields similar to `__attribute__((annotate("{gen};{attr};reflectable;")))`. That annotation can be used to filter fields using some data, in our case it is `{attr};reflectable`. Example below can parse `annotate->getAnnotation()` to perform custom actions.

```cpp
if ( auto annotate = decl->getAttr<clang::AnnotateAttr>() )
{
    std::string annotationCode =
      annotate->getAnnotation().str();
    LOG(INFO)
        << "annotation code: "
        << annotationCode;
    // ... parse |std::string annotationCode| and return true if it is valid ...
}
```

Can we add information about fields of `SomeStructName` at the end of `SomeStructName`?

Suppose we want to add new field with reflection data at the end of the `SomeStructName` and store that data in `static std::map<std::string, std::string> fields`.

We can iterate all fields and generate C++ code:

```cpp
      for(const auto& [key, value] : fields) {
        output.append(indent
                        + indent + "{ ");
        output.append("\"" + key + "\"");
        output.append(", ");
        output.append("\"" + value + "\"");
        output.append(" }");
        output.append("\n");
      }
```

For simplisity we did not use template engine. You can integrate with any template engine to avoid code like `output.append("\n");`. You may want to use template engine provided by [https://github.com/blockspacer/flex_squarets_plugin](https://github.com/blockspacer/flex_squarets_plugin).

We can save generated code (stored in variable `output`) at the end of `SomeStructName`:

```cpp
      auto locEnd = record->getLocEnd();

      // add new field with reflection data at the end of the C++ record
      sourceTransformOptions.rewriter.InsertText(locEnd, output,
        /*InsertAfter=*/true, /*IndentNewLines*/ false);
```

flextool will save file with all source code transformations applied, including `rewriter.InsertText`. flextool will save file with `.generated` extention, but user can provide custom path for each generated file.

You can find full code of demo project at [https://github.com/blockspacer/flex_meta_plugin/](https://github.com/blockspacer/flex_meta_plugin/)

## About `SourceTransformCallback`

Any plugin can add custom rules for source code transformation using `SourceTransformRules` and `SourceTransformCallback`:

```cpp
typedef
  base::flat_map<
    std::string
    , SourceTransformCallback
  > SourceTransformRules;
```

Example:

```cpp
    ::clang_utils::SourceTransformPipeline& sourceTransformPipeline
      = *event.sourceTransformPipeline;

    ::clang_utils::SourceTransformRules& sourceTransformRules
      = sourceTransformPipeline.sourceTransformRules;

    sourceTransformRules["make_reflect"] =
      base::BindRepeating(
        &AnnotationPipeline::make_reflect,
        base::Unretained(this));
```

Function signature for code transformation must be compatible with `SourceTransformCallback`:

```cpp
struct SourceTransformResult {
  ///\brief may be used to replace orginal code.
  /// To keep orginal code set it as nullptr.
  const char* replacer = nullptr;
};

/**
  * \brief callback that will be called then parser
  *        found custom attribute.
**/
struct SourceTransformOptions {
  /**
    * currently executed function
    * (function name parsed from annotation)
  **/
  const flexlib::parsed_func& func_with_args;

  /**
    * see https://xinhuang.github.io/posts/2015-02-08-clang-tutorial-the-ast-matcher.html
  **/
  const clang::ast_matchers::MatchFinder::MatchResult& matchResult;

  /**
    * see https://devblogs.microsoft.com/cppblog/exploring-clang-tooling-part-3-rewriting-code-with-clang-tidy/
  **/
  clang::Rewriter& rewriter;

  /**
    * found by MatchFinder
    * see https://devblogs.microsoft.com/cppblog/exploring-clang-tooling-part-2-examining-the-clang-ast-with-clang-query/
  **/
  const clang::Decl* decl = nullptr;

  /**
    * All arguments extracted from attribute.
    * Example:
    * $apply(interface, foo_with_args(1, "2"))
    * becomes two `parsed_func` - `interface` and `foo_with_args`.
  **/
  const std::vector<flexlib::parsed_func>& all_func_with_args;
};

typedef
  base::RepeatingCallback<
    SourceTransformResult(const SourceTransformOptions& callback_args)
  >
  SourceTransformCallback;
```

Think about `function name` as one of `__VA_ARGS__` from

```cpp
#define $apply(...) \
  __attribute__((annotate("{gen};{funccall};" #__VA_ARGS__)))
```

Example where `make_interface` and `make_removefuncbody` - two function names:

```cpp
$apply(make_interface;
  make_removefuncbody)
```

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page
