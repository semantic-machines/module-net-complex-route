#!/bin/bash

VEDA_VERSION=5.1.3
PROJECT_NAME=module-net-complex-route

wget https://github.com/semantic-machines/veda/archive/$VEDA_VERSION.zip
unzip $VEDA_VERSION.zip
cp -r veda-$VEDA_VERSION/* $PWD 
mkdir $PWD/ontology/$PROJECT_NAME
cp -r $PWD/qa/data/* $PWD/ontology/$PROJECT_NAME
cp -r $PWD/onto/* $PWD/ontology/$PROJECT_NAME
./control-install.sh