#!/bin/bash

#git clone https://github.com/semantic-machines/veda.git
COMMIT_ID=dca213422181b3c0224e32b256e0e93111d9f19b
wget https://github.com/semantic-machines/veda/archive/$COMMIT_ID.zip
unzip $COMMIT_ID.zip
cp -r veda-$COMMIT_ID/* $PWD 
#ln -s $PWD/ontology ./veda/ontology/module-net-complex-route
#ln -s $PWD/qa ./veda/qa/module-net-complex-route
#ln -s $PWD/qa/*.js ./veda/qa
cd veda
./control-install.sh