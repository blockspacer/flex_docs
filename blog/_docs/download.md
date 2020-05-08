---
layout: post
title:  "download"
categories: [docs, common]
root: "../"
pin: true
permalink: /download/
---


## Cloning and setup

```bash
git clone https://github.com/blockspacer/flextool.git
```

If you got errors after `git clone` - try to update submodules

```bash
git submodule sync --recursive
# or
git fetch --recurse-submodules
# or
git submodule update --init --recursive --depth 100 --progress
# or
git submodule update --force --recursive --init --remote
```

## Install C++ compiler: gcc

Example of installation steps, tested on ubuntu 18.04:

```bash
apt install -y build-essential
```

## Install C++ compiler: clang

Example of installation steps, tested on ubuntu 18.04:

```bash
apt install -y clang-6.0 libstdc++6
```

## Install CMake

You can find latest version on https://cmake.org/

Example of installation steps, tested on ubuntu 18.04:

```bash
# NOTE: github may be down, so prefer cmake.org/files
# see https://anglehit.com/how-to-install-the-latest-version-of-cmake-via-command-line/
version=3.15
build=3
mkdir ~/temp || true
cd ~/temp
wget --no-check-certificate https://cmake.org/files/v$version/cmake-$version.$build.tar.gz
tar -xzvf cmake-$version.$build.tar.gz
cd cmake-$version.$build/
./bootstrap
make -j4
make install

cmake --version
```

## Install conan - a crossplatform dependency manager for C++

```bash
pip install --index-url=https://pypi.python.org/simple/ --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org wheel \
  && \
  pip install --index-url=https://pypi.python.org/simple/ --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org virtualenv \
  && \
  pip install --index-url=https://pypi.python.org/simple/ --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org conan \
  && \
  pip install --index-url=https://pypi.python.org/simple/ --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org conan_package_tools

# optional - create default profile
conan profile new default --detect

# validate `conan remote list`
conan remote list

# validate `conan search`
conan search *boost* -r all
```

Configure Proxies & cacert_path in `~/.conan/conan.conf`, see https://docs.conan.io/en/latest/reference/config_files/conan.conf.html#proxies

Configure conan clang profile `~/.conan/profiles/clang` to then use --profile clang:

```bash
/usr/bin/clang-6.0 -v
/usr/bin/clang++-6.0 -v

# nano is text editor
nano ~/.conan/profiles/clang

[settings]
# We are building in Ubuntu Linux
os_build=Linux
os=Linux
arch_build=x86_64
arch=x86_64

compiler=clang
compiler.version=6.0
compiler.libcxx=libstdc++11

[env]
CC=/usr/bin/clang-6.0
CXX=/usr/bin/clang++-6.0
```

Configure conan clang profile `~/.conan/profiles/gcc` to then use --profile gcc:

```bash
/usr/bin/gcc -v
/usr/bin/g++ -v

# nano is text editor
nano ~/.conan/profiles/gcc

[settings]
# We are building in Ubuntu Linux
os_build=Linux
os=Linux
arch_build=x86_64
arch=x86_64

compiler=gcc
compiler.version=7
compiler.libcxx=libstdc++11

[env]
CC=/usr/bin/gcc
CXX=/usr/bin/g++
```

## Add conan remotes

To be able to add the list of dependency remotes please type the following command:

```bash
cmake -E time conan config install conan/remotes/
# OR:
# cmake -E time conan config install conan/remotes_disabled_ssl/
```

## (optional) If you want to disable ssl (under proxy, etc.)

```bash
# see https://docs.conan.io/en/latest/reference/commands/misc/remote.html#conan-remote
conan remote update conan-center https://conan.bintray.com False
conan search boost* -r=conan-center

conan remote add bincrafters https://api.bintray.com/conan/bincrafters/public-conan
conan remote update bincrafters https://api.bintray.com/conan/bincrafters/public-conan False
conan search boost* -r=bincrafters
```

If you want to set corp. cacert:

```bash
CONAN_CACERT_PATH=/path/to/ca-bundle.crt
file $CONAN_CACERT_PATH
```

Useful links:

- https://ncona.com/2019/04/dependency-management-in-cpp-with-conan/
- https://blog.conan.io/2018/06/11/Transparent-CMake-Integration.html
- Conan https://blog.conan.io/2018/06/11/Transparent-CMake-Integration.html https://blog.conan.io/2018/12/03/Using-Facebook-Folly-with-Conan.html
- CONAN_PKG::cppzmq https://github.com/chaplin89/prontocpp/blob/master/CMakeLists.txt#L42
- https://github.com/conan-io/examples

## Build dependencies

We use `tools/buildConanThirdparty.cmake` script. It just downloads dependencies and runs `conan create`with provided conan options

```bash
# NOTE: don't forget to re-run `conan install` after command below
# NOTE: change `build_type=Debug` to `build_type=Release` in production
cmake -DEXTRA_CONAN_OPTS="--profile;clang;-s;build_type=Debug;--build;missing" -P tools/buildConanThirdparty.cmake
```

NOTE: dependencies include big codebases like cling and LLVM. Build from source can take a lot of processor time.

For contributors: conan allows to provide pre-built packages. Please open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if no pre-built packages are available for your platform.

## Build extra dependencies

Some dependencies are not provided by `tools/buildConanThirdparty.cmake` script.

- type_safe

```bash
conan remote add Manu343726 https://api.bintray.com/conan/manu343726/conan-packages False

git clone http://github.com/foonathan/type_safe.git -b v0.2.1

cd type_safe

# NOTE: change `build_type=Debug` to `build_type=Release` in production
CONAN_REVISIONS_ENABLED=1 \
    CONAN_VERBOSE_TRACEBACK=1 \
    CONAN_PRINT_RUN_COMMANDS=1 \
    CONAN_LOGGING_LEVEL=10 \
    GIT_SSL_NO_VERIFY=true \
    conan create . conan/stable -s build_type=Debug --profile clang --build missing
```

- corrade

```bash
# NOTE: change `build_type=Debug` to `build_type=Release` in production
git clone http://github.com/mosra/corrade.git && cd corrade
CONAN_REVISIONS_ENABLED=1 \
    CONAN_VERBOSE_TRACEBACK=1 \
    CONAN_PRINT_RUN_COMMANDS=1 \
    CONAN_LOGGING_LEVEL=10 \
    GIT_SSL_NO_VERIFY=true \
    conan create . magnum/stable -s build_type=Debug --profile clang --build missing -tf package/conan/test_package
```

## Build flextool

Run `conan create` as stated in (latest instructions on github.com) https://github.com/blockspacer/flextool#installation

```bash
export CXX=clang++-6.0
export CC=clang-6.0

# NOTE: change `build_type=Debug` to `build_type=Release` in production
# NOTE: use --build=missing if you got error `ERROR: Missing prebuilt package`
CONAN_REVISIONS_ENABLED=1 \
CONAN_VERBOSE_TRACEBACK=1 \
CONAN_PRINT_RUN_COMMANDS=1 \
CONAN_LOGGING_LEVEL=10 \
GIT_SSL_NO_VERIFY=true \
    cmake -E time \
      conan create . conan/stable \
      -s build_type=Debug -s cling_conan:build_type=Release \
      --profile clang \
          -o flextool:enable_clang_from_conan=False \
          -e flextool:enable_tests=True
```

## Verifying the installation

that page in development

## Updating

that page in development

## Uninstalling

that page in development

## For contibutors

Fell free to open [GitHub Issue](https://github.com/blockspacer/flextool/issues) if you know how to improve that page
