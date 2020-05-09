
# sudo -E docker build --no-cache -t jekyll_gulp -f $PWD/blog/Dockerfile .

ARG UBUNTU_VERSION=18.04
FROM        ubuntu:${UBUNTU_VERSION} as jekyll_gulp

ARG APT="apt-get -qq --no-install-recommends"
ARG GIT="git"
ARG NPM="npm"
ARG NPX="npx"
ARG NODE="node"
ARG NODE_GYP="node-gyp"
ARG NPM_INSTALL="npm install --loglevel verbose"
ARG NPM_INSTALL_UNSAFE="npm install --unsafe-perm binding --loglevel verbose"
ARG LS_VERBOSE="ls -artl"

# docker build --build-arg NO_SSL="False" APT="apt-get -qq --no-install-recommends" .
ARG NO_SSL="True"

ENV LC_ALL=C.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    #TERM=screen \
    PATH=/usr/bin/:/usr/local/bin/:/gems:/gems/bin:$HOME/gems:$HOME/gems/bin:/go/bin:/usr/local/go/bin:/usr/local/include/:/usr/local/lib/:/usr/lib/clang/6.0/include:/usr/lib/llvm-6.0/include/:$PATH \
    LD_LIBRARY_PATH=/usr/local/lib/:/usr/lib/:$LD_LIBRARY_PATH \
    OS_ARCH=x64 \
    NODE_V=v10.18.1 \
    GEM_HOME=/gems \
    GEM_PATH=/gems \
    BUNDLE_PATH=/gems \
    BUNDLE_PATH=/gems

# https://askubuntu.com/a/1013396
# https://github.com/phusion/baseimage-docker/issues/319
# RUN export DEBIAN_FRONTEND=noninteractive
# Set it via ARG as this only is available during build:
RUN set -ex \
    && \
    echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections \
    && \
    if [ "$NO_SSL" = "True" ]; then \
        echo 'WARNING: SSL CHECKS DISABLED! SEE NO_SSL FLAG IN DOCKERFILE' \
        && \
        export NODE_TLS_REJECT_UNAUTHORIZED=0 \
        && \
        echo 'NODE_TLS_REJECT_UNAUTHORIZED=0' >> ~/.bashrc \
        && \
        echo "strict-ssl=false" >> ~/.npmrc \
        && \
        echo "registry=http://registry.npmjs.org/" > ~/.npmrc \
        && \
        echo ':ssl_verify_mode: 0' >> ~/.gemrc \
        && \
        echo "sslverify=false" >> /etc/yum.conf \
        && \
        echo "sslverify=false" >> ~/.yum.conf \
        && \
        echo "APT{Ignore {\"gpg-pubkey\"; }};" >> /etc/apt.conf \
        && \
        echo "Acquire::http::Verify-Peer \"false\";" >> /etc/apt.conf \
        && \
        echo "Acquire::https::Verify-Peer \"false\";" >> /etc/apt.conf \
        && \
        echo "APT{Ignore {\"gpg-pubkey\"; }};" >> ~/.apt.conf \
        && \
        echo "Acquire::http::Verify-Peer \"false\";" >> ~/.apt.conf \
        && \
        echo "Acquire::https::Verify-Peer \"false\";" >> ~/.apt.conf \
        && \
        echo "Acquire::http::Verify-Peer \"false\";" >> /etc/apt/apt.conf.d/00proxy \
        && \
        echo "Acquire::https::Verify-Peer \"false\";" >> /etc/apt/apt.conf.d/00proxy \
        && \
        echo "check-certificate = off" >> /etc/.wgetrc \
        && \
        echo "check-certificate = off" >> ~/.wgetrc \
        && \
        echo "insecure" >> /etc/.curlrc \
        && \
        echo "insecure" >> ~/.curlrc \
        ; \
    fi \
    && \
    $APT update \
    && \
    $APT install -y apt-utils wget tar \
    && \
    $APT install -y ruby ruby-dev ruby-full \
    && \
    $APT install -y build-essential \
    && \
    $APT install -y zlib1g-dev \
    && \
    mkdir -p /tmp \
    && \
    cd /tmp \
    # install node with npx
    && \
    # Uninstall the default version provided by Ubuntu package manager, so we can install custom one
    ($APT remove -y node || true) \
    && \
    # Uninstall the default version provided by Ubuntu package manager, so we can install custom one
    ($APT remove -y nodejs || true) \
    # Uninstall the default version provided by Ubuntu package manager, so we can install custom one
    && \
    ($APT remove -y npm || true) \
    # Uninstall the default version provided by Ubuntu package manager, so we can install custom one
    && \
    ($APT remove -y npx || true) \
    && \
    wget https://nodejs.org/dist/$NODE_V/node-$NODE_V-linux-$OS_ARCH.tar.gz \
    && \
    tar -xvf node-$NODE_V-linux-$OS_ARCH.tar.gz \
    && \
    cp -R node-$NODE_V-linux-$OS_ARCH/* /usr/local/ \
    && \
    # return from /tmp
    cd - \
    && \
    $APT install -y gcc \
                    git \
    && \
    # libcurl4 required by `bundle exec jekyll --version` (/gems/ruby/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb)
    $APT install -y libcurl4 \
                    libcurl4-openssl-dev \
    && \
    $APT install -y rsync \
                    make \
    && \
    $APT install -y libxslt-dev \
    && \
    $APT install -y libxml2-dev \
                    libxml2 \
    && \
    $LS_VERBOSE \
    && \
    $NODE -v \
    && \
    $NPM -v \
    && \
    $NPX -v \
    && \
    # NOTE: run `npm config` in project directory
    if [ "$NO_SSL" = "True" ]; then \
        echo 'WARNING: SSL CHECKS DISABLED! SEE NO_SSL FLAG IN DOCKERFILE' \
        && \
        $NPM config set strict-ssl false \
        && \
        # NOTE: `http://`, not `https://`
        $NPM config set registry http://registry.npmjs.org/ --global \
        ; \
    fi \
    && \
    # remove old node_modules
    rm -rf node_modules package-lock.json \
    && \
    # remove generated files
    rm -rf build .generated *generated* \
    && \
    $NPM cache clean --force \
    && \
    # to install devDependencies
    $NPM config set -g production false \
    && \
    ldconfig \
    && \
    gem update --system \
    && \
    gem install bundler:2.1.4 jekyll:3.8 nokogiri \
    && \
    # see https://stackoverflow.com/a/45505787
    npm -g config set user root \
    && \
    npm install -g gulp-cli gulp gulpfile-install \
    && \
    gem install jekyll-typogrify jekyll-archives jekyll-feed html-proofer jekyll-manager \
    && \
    gem install jekyll-graphviz jekyll-typogrify jekyll-picture-tag jekyll-archives jekyll-gist \
    && \
    (ln -s /usr/bin/nodejs /usr/bin/node || true) \
    #&& \
    #source ~/.bashrc \
    && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*