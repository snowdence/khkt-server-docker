#!/bin/bash
docker build -t snowdence/khkt-web-farmsharing .
docker push snowdence/khkt-web-farmsharing

ssh root@$DEPLOY_SERVER << EOF
docker pull snowdence/khkt-web-farmsharing
docker stop api-boilerplate || true
docker rm api-boilerplate || true
docker rmi snowdence/khkt-web-farmsharing:current || true
docker tag snowdence/khkt-web-farmsharing:latest snowdence/khkt-web-farmsharing:current
docker run -d --restart always --name api-boilerplate -p 3000:3000 snowdence/khkt-web-farmsharing:current
EOF
