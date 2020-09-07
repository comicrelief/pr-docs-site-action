#!/bin/bash

# Setup Environment
export ROOT_DIR="/action"
export STACK_HASH=$(echo $GITHUB_REPOSITORY-$GITHUB_REF | md5sum | awk '{print $1}')
export STACK_NAME="$GITHUB_ACTOR-$STACK_HASH"
export PULUMI_DIR="src/pulumi"

cd $ROOT_DIR
echo "Using Stack: $STACK_NAME"

# Prepare the Pulumi folder
yarn build

# Change workdir to Pulumi root
cd $PULUMI_DIR


# Login, select stack and update
pulumi login s3://pr-docs-website-generator-state-comic-relief
pulumi stack select $STACK_NAME || pulumi stack init $STACK_NAME
pulumi up --yes --color always
