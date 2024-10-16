#!/bin/bash

# https://github.com/annegentle/create-demo

set -x

apt-get update
apt-get -y install git rsync python3-sphinx

git config --global --add safe.directory /__w/tiny-games/tiny-games

pwd ls -lah
export SOURCE_DATE_EPOCH=$(git log -1 --pretty=%ct)


make clean
make html


git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
 
docroot=`mktemp -d`
rsync -av "docs/out/html/" "${docroot}/"
 
pushd "${docroot}"

git init
git remote add deploy "https://token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git checkout -b gh-pages
 
# Adds .nojekyll file to the root to signal to GitHub that  
# directories that start with an underscore (_) can remain
touch .nojekyll

 
# Copy the resulting html pages built from Sphinx to the gh-pages branch 
git add .
 
# Make a commit with changes and any new files
msg="Updating Docs (${GITHUB_SHA})"
git commit -am "${msg}"
 
# overwrite the contents of the gh-pages branch on our github.com repo
git push deploy gh-pages --force
 
popd # return to main repo sandbox root

cd docs
ls

# exit cleanly
exit 0