#! /bin/sh
set -e

docker run --rm -it --volume="$PWD/blog:/srv/jekyll" jekyll/jekyll:3.8 /bin/bash -c "chmod a+wx . -R && JEKYLL_ENV=production bundle install && JEKYLL_ENV=production bundle exec jekyll build --destination _site"
