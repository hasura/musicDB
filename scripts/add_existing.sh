#!/bin/bash

if [ -z "$1" ]
then
    echo "Usage: ./add_existing.sh <absolute_path_of_dump_dir>"
    exit 1
fi

echo "Loading list of tables from: $1"

tables=$(cat $1)

admin_token='Bearer <insert_admin_token>'
url='https://data.carve65.hasura-app.io/v1/query'

for f in $tables; do
    echo "adding $f"
    curl -X POST -d "{\"type\":\"add_existing_table_or_view\",\"args\":{\"name\":\"$f\"}}" -H "Authorization: $admin_token" -H "Content-Type: application/json" $url
done

