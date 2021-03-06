#!/usr/bin/env bash
set -Eeuo pipefail

VERSION=$(jq -r .version package.json)
ALL_VERSIONS=$(aws codeartifact list-package-versions --package milkman-api-js-client --namespace milkman --domain milkmantechnologies --repository milkman --format npm --query 'versions[*].[version]' --output text)
PRESENT=$(echo "$ALL_VERSIONS" | sed -n "/$VERSION/p") 

if [[ -n "$PRESENT" ]]; then
  echo
  echo "ERROR: Version $VERSION already deployed on CodeArtifact! Please update the version of your package"
  echo
  exit 1
fi

echo "Version $VERSION is valid to be deployed on CodeArtifact"
exit 0
