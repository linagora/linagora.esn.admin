#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ] || [ "$TRAVIS_PULL_REQUEST" == "true" ]
then
  exit 0
fi

body='{
"request": {
  "branch":"master"
}}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Travis-API-Version: 3" \
  -H "Authorization: token $TRAVIS_TOKEN" \
  -d "$body" \
  https://api.travis-ci.org/repo/$TARGET_USER%2F$TARGET_REPO/requests

exit 0
