#!/bin/bash

echo "Loading dumps from directory: $1"

DB_HOST=localhost
DB_PORT=5433
DB_NAME=hasuradb
DB_USER=admin
DB_PASS=deviate-infallible-sprint

export PGPASSWORD=$DB_PASS

cd $1

for t in *; do
  echo "Loading table -> $t"
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\copy $t from $t"
done
