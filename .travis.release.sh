#!/usr/bin/env bash

set -ex

if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "master" ] then
    git config --global user.name TravisCI
    git config --global user.email travis@travis-ci.org
    git config credential.helper "store --file=.git/credentials"
    echo "https://$GH_TOKEN:@github.com" > .git/credentials
    npm run release:ci
fi