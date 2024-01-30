#!/bin/bash
set -e

if [[ -z "${GIT_BRANCH}" ]]; then
  GIT_BRANCH="develop"
fi

# Remove this line to disable bugsnag
export BUGSNAG_API_KEY='c4a1664466116b8fbc9ecacaef1f148d'

echo "*************************************"
date

echo "Checking out $GIT_BRANCH"
git fetch
git reset origin/$GIT_BRANCH
git reset --hard
git pull

if [[ -z "${APP_BUILD_VERSION}" ]]; then
    PKG_VERSION=$(cat ./frontend/package.json | grep 'version":' | sed 's/[^0-9.]//g')
    COMMITDATE=$(git log -1 --format=%cd --date=format:%m%d%H%M)
    export APP_BUILD_VERSION=$PKG_VERSION.$COMMITDATE
fi

if [[ -z "${DEB_BUILD_VERSION}" ]]; then
    export DEB_BUILD_VERSION=$APP_BUILD_VERSION
fi

echo "Version $APP_BUILD_VERSION"

echo "Build Frontend"
cd frontend
yarn install
yarn build-frontend:prod

echo "Build Backend"
cd ../backend
cargo build --release
cargo deb -p server --deb-version $DEB_BUILD_VERSION

echo "Updating Schema"
yarn update-dgraph-schema

echo "Finished building at"
date