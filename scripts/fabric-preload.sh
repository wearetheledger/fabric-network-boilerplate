#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

export VERSION=${1:-1.1.0}
export ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
#Set MARCH variable i.e ppc64le,s390x,x86_64,i386
MARCH=`uname -m`

dockerFabricPull() {
  local FABRIC_TAG=$1
  for IMAGES in peer orderer couchdb ccenv javaenv kafka zookeeper tools; do
      echo "==> FABRIC IMAGE: $IMAGES"
      echo
      docker pull hyperledger/fabric-$IMAGES:$FABRIC_TAG
      docker tag hyperledger/fabric-$IMAGES:$FABRIC_TAG hyperledger/fabric-$IMAGES
  done
}

dockerCaPull() {
      local CA_TAG=$1
      echo "==> FABRIC CA IMAGE"
      echo
      docker pull hyperledger/fabric-ca:$CA_TAG
      docker tag hyperledger/fabric-ca:$CA_TAG hyperledger/fabric-ca
}

: ${CA_TAG:="$MARCH-$VERSION"}
: ${FABRIC_TAG:="$MARCH-$VERSION"}

: ${COUCH_TAG:="$MARCH-1.0.6"}

echo "===> We pull couchdb images manually because their version is off"
docker pull hyperledger/fabric-couchdb:$COUCH_TAG
docker tag hyperledger/fabric-couchdb:$COUCH_TAG hyperledger/fabric-couchdb


echo "===> Pulling fabric Images"
dockerFabricPull ${FABRIC_TAG}

echo "===> Pulling fabric ca Image"
dockerCaPull ${CA_TAG}
echo
echo "===> List out hyperledger docker images"
docker images | grep hyperledger*

