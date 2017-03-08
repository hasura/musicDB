docker stop musicdb
docker rm musicdb
docker rmi musicdb_img
docker build -t musicdb_img .
docker run -d --name musicdb -p 80:80 musicdb_img
