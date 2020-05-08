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

## Integration with template engines

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

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page