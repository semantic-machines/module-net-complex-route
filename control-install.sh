#!/bin/bash

git clone https://github.com/semantic-machines/veda.git
ln -s $PWD/ontology ./veda/ontology/module-net-complex-route
./veda/control-install.sh