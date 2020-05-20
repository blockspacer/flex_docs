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

Default plugin https://github.com/blockspacer/flex_reflect_plugin allows to execute custom logic based on data stored in C++ annotations. flex_reflect_plugin can be disabled (as any plugin) or completely replaced with custom plugin(s). Tutorial below assumes that you use flex_reflect_plugin.

Suppose you want to create custom C++ annotation (like `[[make_reflect]]`) and perform some actions with annotated code.

Any plugin can add custom rules for source code transformation or generation during `Events::RegisterAnnotationMethods`

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

`make_reflect` (from `sourceTransformRules["make_reflect"]`) can be used as part of annotation attribute:

```cpp
// make_reflect can be used with some other rules, for example: make_interface;make_removefuncbody
__attribute__((annotate("{gen};{funccall};make_reflect;make_interface;make_removefuncbody")))
```

Code below allows to bind C++ function `&AnnotationPipeline::make_reflect` with string `make_reflect`:

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

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page
