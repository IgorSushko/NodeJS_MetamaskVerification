### FIRST LOAD

cd codefolder

npm install

@todo - no need of npm on target machine - only use container one

docker build -t metamaskverign .

### START CONTAINER 

docker-compose stop && docker-compose down && docker-compose up -d
