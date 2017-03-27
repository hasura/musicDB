#!/bin/bash

#Make sure PGPASSWORD environment variable is set

if [ -z "$1" ]
then
    echo "Usage: ./populate.sh <absolute_path_of_dump_dir>"
    exit 1
fi

echo "Loading dumps from directory: $1"

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hasuradb
DB_USER=admin

cd $1

for t in *; do
  echo "Loading table -> $t"
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\copy $t from $t"
done
