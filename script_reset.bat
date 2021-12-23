git fetch --all
git reset --hard origin/main
rm -rf mongodb/mongodb
mkdir mongodb/mongodb
docker-compose down --rmi=all
docker-compose -f docker-compose.yml up --build
