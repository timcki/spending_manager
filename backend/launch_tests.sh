#! /bin/bash

function rand-str {
    local DEFAULT_LENGTH=64
    local LENGTH=${1:-$DEFAULT_LENGTH}

    tr -dc A-Za-z0-9 </dev/urandom | head -c $LENGTH
}

export MONGO_RANDOM=$(rand-str 10)

echo "####### LAUNCHING TESTS #######"
echo ''
echo "DB is $MONGO_RANDOM"
echo ''

for f in $(ls tests | grep test_)
do
    UNITTEST=$MONGO_RANDOM python3 -m unittest tests/$f
done