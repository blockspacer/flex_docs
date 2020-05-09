#! /bin/sh
set -e

pwd

ls -artl 

ls -artl blog

ls -artl blog/_site

mkdir -p _deploy
pushd _deploy
git clone --single-branch --branch gh-pages https://${GITHUB_TOKEN}@${GITHUB_REPO} .
yes | cp -rf ../blog/_site/* .
git push origin gh-pages
popd
rm -rf _deploy
