# About

Static site uses Jekyll

## How to build

See https://github.com/blockspacer/Jekyll-Travis-docker

## How to publish using Travis CI

See https://github.com/blockspacer/Jekyll-Travis-docker#travis

## How to publish by hand

```bash
bash scripts/ci/build.sh

# blog/_site must exist
ls -artl blog/_site

bash scripts/ci/deploy.sh
export GITHUB_TOKEN=.....
export GITHUB_REPO=github.com/blockspacer/Jekyll-Travis-docker.git
```
