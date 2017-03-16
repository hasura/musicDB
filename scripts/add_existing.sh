#!/bin/bash

echo "Loading list of tables from: $1"

tables=$(cat $1)

admin_token='Bearer hfz9zj02j7k9n1i98ml8e2evwzqyxhgc'
url='https://data.carve65.hasura-app.io/v1/query'

for f in $tables; do
    echo "adding $f"
    curl -X POST -d "{\"type\":\"add_existing_table_or_view\",\"args\":{\"name\":\"$f\"}}" -H "Authorization: $admin_token" -H "Content-Type: application/json" $url
done

