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

## Running flextool using conan and CMake

See for detailed usage instructions [{{ site.data.global.building_projects.url | relative_url }}]({{ site.data.global.building_projects.url | relative_url }})

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

## Using existing plugin to add custom C++ typeclasses (using Type Erasure)

that page in development

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

## Using existing plugin to add custom C++ metaclasses

that page in development

You can learn more about metaclasses at

- https://youtu.be/80BZxujhY38

## Integration with template engines

that page in development

## Writing custom plugin to generate C++ files

that page in development

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

## About `SourceTransformCallback`

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