#! /bin/sh
set -e

pwd

ls -artl 

ls -artl blog

ls -artl blog/_site

(rm -rf _deploy || true)
mkdir -p _deploy
pushd _deploy

GIT_USERNAME=$(git config --get user.name) || true

# defaults if not set
if [ -z "$GIT_USERNAME" ]; then 
    git config --global user.name "CI_Build_Bot" \
    ; 
fi

GIT_USERMAIL=$(git config --get user.email) || true

# defaults if not set
if [ -z "$GIT_USERMAIL" ]; then 
    git config --global user.email "cibuildbot@cibuildbot.com" \
    ; 
fi

# NOTE: clone only gh-pages branch
git clone --single-branch --branch gh-pages https://${GITHUB_TOKEN}@${GITHUB_REPO} .
# Remove all files and dirs except some from a directory
# NOTE: we push new files into gh-pages branch deleting all old data
find $PWD \
    -mindepth 1 \
    -maxdepth 1 \
    -not -name '.git' \
    -not -name '.nojekyll' \
    -exec echo rm -rf '{}' \;
# must contain filtered folders after `rm -rf` above
ls -artl 
# copy or replace new data
yes | cp -rf ../blog/_site/* .
# push all files including `_site/` folder
# NOTE: place in `_site/` folder only needed files
(rm .gitignore || true)
# don't ever push `node_modules`
# NOTE: don't forget to remove any files with secrets, too
(rm -rf node_modules || true)
(rm -rf package-lock* || true)
(rm -rf *.log || true)
# You can add an empty .nojekyll file at the root of your repository. 
# This will instruct github pages to publish your files without processing them with jekyll.
(touch .nojekyll || true)
git add .
git status
git commit -m "UPD: gh-pages"
git push origin gh-pages --force
popd
rm -rf _deploy
