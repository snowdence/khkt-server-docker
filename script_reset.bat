git fetch --all
git reset --hard origin/main
docker-compose down --rmi=all
docker-compose -f docker-compose.prod.yml up --build
