# About

Static site uses Jekyll

By using Travis CI we will build the site pages on our own and then publish the static site to GitHub Pages.

## Usage

If you need to create a new site on `GitHub Pages`, start [here](https://help.github.com/en/articles/getting-started-with-github-pages).

## Creating the initial jekyll source files with Docker

See https://jlintusaari.github.io/2018/06/github-hosted-jekyll-blog-custom-theme/

## How to build

- Create github token

- Create branch `gh-pages` in github repo. It must story only `_site` folder (result of build command)

- Create branch `pages-releases` in github repo. Push to it when you want to update website (run travis job)

Quote from `.travis.yml`: `/pages-(.*)/ # test every branch which starts with "pages-"`

- `npm run build` does not run on CI, so use it to build theme locally and don't forget to commit *.min.css files!

Run commands below to build website theme and minify images:

```bash
sudo -E docker build --no-cache -t jekyll_gulp -f $PWD/blog/Dockerfile .
docker run --volume="$PWD/blog:/srv/jekyll" -w /srv/jekyll -p 4000:4000 -p 3000:3000 -p 3001:3001 --name DEV_jekyll_gulp -it jekyll_gulp \
bash -c "export GEM_HOME=/gems && export GEM_PATH=/gems && export BUNDLE_PATH=/gems && export BUNDLE_PATH=/gems && PATH=/usr/bin/:/usr/local/bin/:/gems:/gems/bin:$HOME/gems:$HOME/gems/bin:$PATH && cd /srv/jekyll && bundler --version && bundle exec jekyll --version && rm -rf package-lock.json node_modules && bundle config set git.allow_insecure true && npm install && bundle install && bundle exec gulp build && bundle exec jekyll build --verbose --trace && npm run build"
docker rm DEV_jekyll_gulp
```

- Validate locally that theme is built into `_site`

```bash
cd blog/_site && python3 -m http.server 8000 --bind 127.0.0.1
open http://localhost:8000/
# Ctrl+C to stop
cd - # return back to /blog
```

- Integrate github repo with travis. See https://github.com/settings/installations/

- Open in travis repo settings. Set `Environment Variables`, see https://docs.travis-ci.com/user/environment-variables/

`GITHUB_REPO` (like `https://github.com/user/repo.git`) and `GITHUB_TOKEN` containing ENCODED by `travis encrypt` personal access token

```bash
sudo apt install travis
# token from github Developer Settings - Personal access tokens - Generate new token
# must have permissions `admin:public_key, admin:repo_hook, repo`
travis encrypt GITHUB_TOKEN=eae....
```

- `git push` to branch `pages-releases`. It will trigger Travis build

- Open website, it must be `username.github.io` or `username.github.io/repo_name`, see https://pages.github.com/

To add `Custom domain` open repo settings, section `GitHub Pages`

## How to publish by hand

```bash
bash scripts/ci/build.sh

# blog/_site must exist
ls -artl blog/_site

bash scripts/ci/deploy.sh
export GITHUB_TOKEN=.....
export GITHUB_REPO=.....
```

## Build

```bash
docker run --volume="$PWD/blog:/srv/jekyll" -p 4000:4000 -p 3000:3000 -p 3001:3001 -it jekyll/jekyll:3.8 \
  bash -c "bundle config set git.allow_insecure true && bundle install && bundle exec jekyll build"
```

## Interactive shell to the container

```bash
docker run --rm --volume="$PWD/blog:/srv/jekyll" -p 4000:4000 -p 3000:3000 -p 3001:3001 -it jekyll/jekyll:3.8 \
  bash
```

## Running the server locally with Docker

```bash
docker run --rm --volume="$PWD/blog:/srv/jekyll" -p 4000:4000 -p 3000:3000 -p 3001:3001 -it jekyll/jekyll:3.8 \
  bash -c "bundle config set git.allow_insecure true && bundle install && bundle exec jekyll serve -H 0.0.0.0 --watch"
```

Open localhost:4000

## Usage under proxy with `ca-certificates`

open interactive shell:

```bash
# if certificates are in /usr/local/share/ca-certificates
docker run --rm --volume="$PWD/blog:/srv/jekyll" --volume="/usr/local/share/ca-certificates:/srv/ca-certificates" -p 4000:4000 -p 3000:3000 -p 3001:3001 -it jekyll/jekyll:3.8 \
  bash
```

change `http_proxy` and `GIT_CA_INFO` below:

```bash
export http_proxy=http://user:password@host:port
export HTTP_PROXY=$http_proxy
export HTTPS_PROXY=$http_proxy
export NO_PROXY=localhost,127.0.0.1,127.0.0.*,192.168.*
export GIT_CA_INFO=/srv/ca-certificates/CA.crt
# see https://guides.rubygems.org/ssl-certificate-update/
export SSL_CERT_FILE=$GIT_CA_INFO
# file must exist
file $GIT_CA_INFO
# file must exist
file $SSL_CERT_FILE

dont forget to change `http_proxy` and `GIT_CA_INFO`!

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
echo "check-certificate = off" >> /etc/.wgetrc \
&& \
echo "check-certificate = off" >> ~/.wgetrc \
&& \
echo "insecure" >> /etc/.curlrc \
&& \
echo "insecure" >> ~/.curlrc

# optional
# create the ~/.gemrc file. To set the http proxy for RubyGems put the following in ~/.gemrc
# and dont forget to change `http_proxy` below:
# ---
# http_proxy: PROXY_URL

# optional
#bundle config --global ssl_ca_cert $GIT_CA_INFO

# now configure git
git config --global http.sslVerify false
git config --global https.sslVerify false
git config --global http.postBuffer 1048576000
# solves 'Connection time out' on server in company domain.
git config --global url."https://github.com".insteadOf git://github.com
git config --global url."https://github.com/".insteadOf git@github.com:
git config --global url."https://github.com/".insteadOf git://github.com/
# Bundler is using the git protocol which does no use the proxy configuration.
git config --global url."https://".insteadOf git://
export GIT_SSL_NO_VERIFY=true
export GIT_CURL_VERBOSE=1
git config --global http.sslCAInfo $GIT_CA_INFO
git config --global http.sslCAPath $GIT_CA_INFO
git config --system http.sslcainfo $GIT_CA_INFO
# you can also set http.proxyAuthMethod
git config --global http.proxyAuthMethod 'basic'
git config --global http.proxy $http_proxy
git config --global https.proxy $http_proxy

cp -r /srv/ca-certificates/* /usr/local/share/ca-certificates
update-ca-certificates --fresh

# Verify your certificates
#ruby -rnet/http -e "Net::HTTP.get URI('https://gem.fury.io')"

gem update --system --source http://rubygems.org/
gem install bundler

#gem sources --remove http://rubygems.org
#gem sources --remove https://rubygems.org
#gem sources --remove http://insecure.rails-assets.org
#gem sources --remove https://rails-assets.org
#gem sources --add http://insecure.rails-assets.org
#gem sources --add http://rubygems.org

# list gem sources
gem sources --list

#bundle config mirror.https://rubygems.org http://insecure.rails-assets.org
#bundle config mirror.https://rubygems.org http://rubygems.org
#bundle config git.http.proxy $http_proxy
#bundle config git.https.proxy $http_proxy

# list bundle config
bundle config

# OPTIONAL: test git clone
#git clone 'git://github.com/blockspacer/jekyll-plantuml-url-interactive.git' ~/jekyll-plantuml-url-interactive.git
```

run `bundle install`:

```bash
cd /srv/jekyll/
bundle config set git.allow_insecure true
DEBUG=true bundle install
jekyll build
export RACK_ENV=production
DEBUG=true bundle exec jekyll serve -H 0.0.0.0 --watch
```

you can also edit ~/.gemrc, see

## Travis (alternative approach with environment variable in .travis.yml)

```bash
sudo apt install ruby ruby-dev
sudo gem install travis

# create token at https://github.com/settings/tokens
travis encrypt GITHUB_TOKEN=1234abcxyz.... —add

# in .travis.yml
secure: "abunchofrandomgibberish...."

# now we can use GITHUB_TOKEN environment variable in travis
```

See
https://medium.com/@preslavrachev/using-travis-for-secure-building-and-deployment-to-github-5a97afcac113
https://medium.com/ahmadaassaf/enabling-continuous-deployment-for-jekyll-fb978644b9b7
https://elfgzp.cn/2018/10/02/travis-jekyll-docker.html

## How to modify theme (css, js, etc.)

```bash
# supports proxy
export NODE_TLS_REJECT_UNAUTHORIZED=0
npm config set strict-ssl false
# NOTE: `http://`, not `https://`
npm config set registry http://registry.npmjs.org/ --global
# see https://stackoverflow.com/a/45505787/10904212
npm -g config set user root
# https://medium.com/@mallim/how-to-use-node-sass-in-a-closed-environment-859880720f2a
# OR sudo npm config set sass-binary-site=https://npm.taobao.org/mirrors/node-sass --global
npm install --save-dev node-sass --sass-binary-site=https://npm.taobao.org/mirrors/node-sass

npm install -g gulp-cli
npm install --save-dev babel
npm install --save-dev gulp babel-core babel-preset-es2015

npm install
# runs `gulp build`
npm run build
```

To enable hot-reload (`jekyll serve --watch`):

```bash
npm run start
```