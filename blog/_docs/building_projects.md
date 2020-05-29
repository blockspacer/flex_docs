---
layout: post
title:  "building_projects"
categories: [docs, common]
root: "../"
pin: true
permalink: /building_projects/
---

## About

That page provides information about flextool integration with C++ projects.

## Example project: flex_meta_demo

Github repository: [https://github.com/blockspacer/flex_meta_demo](https://github.com/blockspacer/flex_meta_demo)

Uses conanfile and CMakeLists.txt to integrate with flextool

## Adding flextool to conanfile and CMakeLists.txt

Make sure you installed `flextool` using `conan`. You can find installation instructions in `README.md` at [https://github.com/blockspacer/flextool](https://github.com/blockspacer/flextool)

If you built flextool using `conan create`, than `flextool` must be in output of command `conan search flextool`

Make sure that your project uses `conanfile.py`. See [https://docs.conan.io/en/latest/mastering/conanfile_py.html](https://docs.conan.io/en/latest/mastering/conanfile_py.html) for details

Add in `conanfile.py`:

```python
      self.requires("flextool/master@conan/stable")
```

Run `conan install`. See [https://docs.conan.io/en/latest/using_packages/conanfile_txt.html](https://docs.conan.io/en/latest/using_packages/conanfile_txt.html) for details

Now you can use `flextool` in `CMakeLists.txt` of your project

Add in `CMakeLists.txt`:

```cmake
list(APPEND CMAKE_PROGRAM_PATH ${CONAN_BIN_DIRS})

find_package(flextool MODULE REQUIRED)

find_program(flextool flextool NO_SYSTEM_ENVIRONMENT_PATH NO_CMAKE_SYSTEM_PATH)
message(STATUS "find_program for flextool ${flextool}")

if(${flextool} STREQUAL "")
    message(FATAL_ERROR "flextool not found ${flextool}")
endif()
```

Run configure step for your cmake based project. See [https://cmake.org/cmake/help/latest/guide/tutorial/index.html](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) for details

Make sure that added `message` prints valid path to `flextool` installed using `conan` package manager.

Now you can use `execute_process` to run `${flextool}` using `cmake` with desired arguments.

Example that prints version of flextool:

```cmake
# NOTE: You may want to generate files only if some source files were changed, so prefer `add_custom_command` with `DEPENDS` to `execute_process`
execute_process(
  COMMAND ${flextool}
          --version
  RESULT_VARIABLE retcode
  ERROR_VARIABLE _ERROR_VARIABLE)
if(NOT "${retcode}" STREQUAL "0")
  message(FATAL_ERROR "Bad exit status ${retcode} ${_ERROR_VARIABLE}")
endif()
message(STATUS "flextool output: ${retcode} ${_ERROR_VARIABLE}")
```

You can find full code of example project at [https://github.com/blockspacer/flex_meta_demo/blob/master/CMakeLists.txt](https://github.com/blockspacer/flex_meta_demo/blob/master/CMakeLists.txt)

## Adding existing plugins to conanfile and CMakeLists.txt

flextool uses plugins to execute custom logic while parsing code using clang LibTooling.

Make sure that your project uses `conanfile.py`. See [https://docs.conan.io/en/latest/mastering/conanfile_py.html](https://docs.conan.io/en/latest/mastering/conanfile_py.html) for details

Add in `conanfile.py`:

```python
      self.requires("flex_reflect_plugin/master@conan/stable")

      self.requires("flex_meta_plugin/master@conan/stable")

      self.requires("flex_support_headers/master@conan/stable")
```

Where `flex_meta_plugin` is plugin example that can be found at [https://github.com/blockspacer/flex_meta_plugin](https://github.com/blockspacer/flex_meta_plugin)

Where `flex_reflect_plugin` is plugin example that can be found at [https://github.com/blockspacer/flex_reflect_plugin](https://github.com/blockspacer/flex_reflect_plugin)

Where `flex_support_headers` is header-only library that can simplify usage of `Cling C++ interpreter` with flextool. `flex_support_headers` can be found at [https://github.com/blockspacer/flex_support_headers](https://github.com/blockspacer/flex_support_headers)

Make sure you installed `flex_reflect_plugin`, `flex_meta_plugin` and `flex_support_headers` using `conan`. You can find installation instructions in `README.md` at [https://github.com/blockspacer/flex_meta_plugin](https://github.com/blockspacer/flex_meta_plugin), [https://github.com/blockspacer/flex_support_headers](https://github.com/blockspacer/flex_support_headers) and  [https://github.com/blockspacer/flex_support_headers](https://github.com/blockspacer/flex_support_headers)

Note that plugins can depend on each other, so order of `conan create` may be important (or you will get build errors).

If you built flextool using `conan create`, than `flextool` must be in output of command `conan search flextool`. Same must apply for plugins, example: `conan search flex_meta_plugin`

Run `conan install`. See [https://docs.conan.io/en/latest/using_packages/conanfile_txt.html](https://docs.conan.io/en/latest/using_packages/conanfile_txt.html) for details

Now `cmake` must be able to find path for installed plugins

Add in `CMakeLists.txt`:

```cmake
set(flex_reflect_plugin
  ${CONAN_FLEX_REFLECT_PLUGIN_ROOT}/lib/flex_reflect_plugin${CMAKE_SHARED_LIBRARY_SUFFIX}
)
message(STATUS "flex_reflect_plugin=${flex_reflect_plugin}")
```

Run configure step for your cmake based project. See [https://cmake.org/cmake/help/latest/guide/tutorial/index.html](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) for details

Make sure that added `message` prints valid path to `flex_reflect_plugin` installed using `conan` package manager.

You can pass command-line argument `--load_plugin` to flextool that must conatain path to plugin file. We use `${CMAKE_SHARED_LIBRARY_SUFFIX}` that is suffix to use for the end of a shared library filename, `.dll` on Windows, `.so` on Linux.

Usage example:

```cmake
# NOTE: You may want to generate files only if some source files were changed, so prefer `add_custom_command` with `DEPENDS` to `execute_process`
execute_process(
  COMMAND ${flextool}
          --indir=${CMAKE_CURRENT_SOURCE_DIR}
          --outdir=${flextool_outdir}
          --load_plugin ${flex_reflect_plugin}
          --load_plugin ${flex_meta_plugin}
          --extra-arg=-I${cling_includes}
          --extra-arg=-I${clang_includes}
          --extra-arg=-I${chromium_base_headers}
          --extra-arg=-I${chromium_build_util_headers}
          --extra-arg=-I${basis_headers}
          --extra-arg=-I${flexlib_headers}
          --extra-arg=-I${flextool_outdir}
          --extra-arg=-Wno-undefined-inline
          ${flextool_extra_args}
          ${flextool_input_files}
          --cling_scripts=${flex_support_headers}
          #TIMEOUT 7200 # sec
  RESULT_VARIABLE retcode
  ERROR_VARIABLE _ERROR_VARIABLE)
if(NOT "${retcode}" STREQUAL "0")
  message(FATAL_ERROR "Bad exit status ${retcode} ${_ERROR_VARIABLE}")
endif()
message(STATUS "flextool output: ${retcode} ${_ERROR_VARIABLE}")

# Set GENERATED properties of your generated source file.
# So cmake won't complain about missing source file.
set_source_files_properties(
  ${generated_files}
  PROPERTIES GENERATED 1)
```

Make sure you changed `${flextool_outdir}` to directory path where generated files must be stored.

You may want to generate files only if some source files were changed, so prefer `add_custom_command` with `DEPENDS` to `execute_process`:

```cmake
# you can link with library via --extra-arg=-l
# example: --extra-arg=-l${flexlib_file}
add_custom_command(
    OUTPUT ${generated_typeclasses}
    # code generator COMMAND will only be launched
    # if some of DEPENDS files were changed.
    DEPENDS
      ${flextool_input_files}
    COMMAND
      ${CMAKE_COMMAND} -E echo " Removing ${generated_typeclasses}."
    COMMAND
      ${CMAKE_COMMAND} -E remove ${generated_typeclasses}
    COMMAND
      ${flextool}
        --vmodule=*=200 --enable-logging=stderr --log-level=100
        --indir=${CMAKE_SOURCE_DIR}
        --outdir=${flextool_outdir}
        --load_plugin=${flex_squarets_plugin}
        #--load_plugin=${flex_meta_plugin}
        --load_plugin=${flex_reflect_plugin}
        --load_plugin=${${LIB_NAME}_file}
        --extra-arg=-I${cling_includes}
        --extra-arg=-I${clang_includes}
        --extra-arg=-I${corrade_includes}
        --extra-arg=-I${entt_includes}
        # NOTE: Cling does not support compile_commands.json
        # so we must add headers used by `flex_support_headers` package
        # place into `flex_support_headers` includes that can be used by Cling
        --extra-arg=-I${chromium_base_headers}
        --extra-arg=-I${chromium_build_util_headers}
        --extra-arg=-I${basis_headers}
        --extra-arg=-I${flexlib_headers}
        --extra-arg=-I${flextool_outdir}
        --extra-arg=-DCLING_IS_ON=1
        # path to tests/example_datatypes.hpp
        --extra-arg=-I${CMAKE_CURRENT_SOURCE_DIR}
        --extra-arg=-Wno-undefined-inline
        ${flextool_extra_args}
        ${flextool_input_files}
        # cling_scripts must be ending argument
        --cling_scripts=${flex_support_headers}
        --cling_scripts=${flex_typeclass_plugin_settings}
    DEPENDS ${LIB_NAME} ${ROOT_PROJECT_LIB} ${${LIB_NAME}_file}
    COMMENT "running ${flextool}"
    VERBATIM # to support \t for example
)
```

You can find full code of example project at [https://github.com/blockspacer/flex_meta_demo/blob/master/CMakeLists.txt](https://github.com/blockspacer/flex_meta_demo/blob/master/CMakeLists.txt)

You can also find useful `CMakeLists.txt` from `flex_typeclass_plugin` at [https://github.com/blockspacer/flex_typeclass_plugin/blob/master/CMakeLists.txt](https://github.com/blockspacer/flex_typeclass_plugin/blob/master/CMakeLists.txt)

## Running flextool from conanfile

Usually you want to execute `flextool` as part of `build` or `configure` step using `CMakeLists.txt`

But if you want to test plugin created for `flextool`, than you can run `flextool` as part of `test_package/conanfile.py`

You can find full code at [https://github.com/blockspacer/flex_meta_plugin/blob/master/test_package/conanfile.py](https://github.com/blockspacer/flex_meta_plugin/blob/master/test_package/conanfile.py)

```python
    def test(self):
        if not tools.cross_building(self.settings):
            self.output.info('self.source_folder = %s' % (self.source_folder))
            ext = ".so" if os_info.is_linux else ".dll"
            #
            flex_reflect_plugin_ROOT = self.deps_cpp_info["flex_reflect_plugin"].rootpath
            flex_reflect_plugin_file = flex_reflect_plugin_ROOT
            flex_reflect_plugin_file = os.path.join(flex_reflect_plugin_file, "lib")
            flex_reflect_plugin_file = os.path.join(flex_reflect_plugin_file, "flex_reflect_plugin" + ext)
            self.output.info('flex_reflect_plugin_file = %s' % (flex_reflect_plugin_file))
            #
            flex_meta_plugin_ROOT = self.deps_cpp_info["flex_meta_plugin"].rootpath
            flex_meta_plugin_file = flex_meta_plugin_ROOT
            flex_meta_plugin_file = os.path.join(flex_meta_plugin_file, "lib")
            flex_meta_plugin_file = os.path.join(flex_meta_plugin_file, "flex_meta_plugin" + ext)
            self.output.info('flex_meta_plugin_file = %s' % (flex_meta_plugin_file))
            #
            # cling_includes must point to cling/Interpreter/RuntimeUniverse.h
            cling_conan_ROOT = self.deps_cpp_info["cling_conan"].rootpath
            cling_includes = cling_conan_ROOT
            cling_includes = os.path.join(cling_includes, "include")
            self.output.info('cling_includes = %s' % (cling_includes))
            #
            # clang_includes must point to stddef.h from lib/clang/5.0.0/include
            clang_includes = cling_conan_ROOT
            clang_includes = os.path.join(clang_includes, "lib")
            clang_includes = os.path.join(clang_includes, "clang")
            clang_includes = os.path.join(clang_includes, "5.0.0")
            clang_includes = os.path.join(clang_includes, "include")
            self.output.info('clang_includes = %s' % (clang_includes))
            #
            flextool_cmd = "flextool" \
              " --outdir ." \
              " --indir ." \
              " --load_plugin {}" \
              " --load_plugin {}" \
              " --extra-arg=-I{}" \
              " --extra-arg=-I{}" \
              " {}/main.cpp".format(
              flex_reflect_plugin_file, flex_meta_plugin_file, cling_includes, clang_includes, self.source_folder)
            self.output.info('flextool_cmd = %s' % (flextool_cmd))
            self.run(flextool_cmd, run_environment=True)
```

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page
