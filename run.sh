docker build --tag pr-docs-site-action .

docker run -it \
  -e AWS_REGION=$AWS_REGION \
  -e PROJECT_NAME=$PROJECT_NAME \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -e GITHUB_ACTOR="comicrelief" \
  -e GITHUB_REPOSITORY="comicrelief/pr-docs-site-action" \
  -e GITHUB_REF=$(git symbolic-ref HEAD) \
  -e PULUMI_CONFIG_PASSPHRASE="PULUMI_${AWS_SECRET_ACCESS_KEY}" \
  -e PULUMI_LOCATION=$PULUMI_LOCATION \
  pr-docs-site-action:latest
