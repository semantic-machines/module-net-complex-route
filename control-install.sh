#!/bin/bash

git clone https://github.com/semantic-machines/veda.git
ln -s $PWD/ontology ./veda/ontology/module-net-complex-route
#ln -s $PWD/qa ./veda/qa/module-net-complex-route
ln -s $PWD/qa/*.js ./veda/qa
cd veda
./control-install.sh