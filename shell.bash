#!/bin/bash
appname="saga-discord-bot"
host="kevin@127.0.0.1"
imageid="$(ssh $host docker images --filter=reference=$appname --format "{{.ID}}")"

echo $1 $2

run() {
    echo "docker run \
    		--log-opt max-size=50m	\
		    --log-opt max-file=5	\
        -e TZ=America/Sao_Paulo \
        $env \
        $cond \
        --name=$appname \
        -p 335:335 \
        -d \
        --restart=unless-stopped $appname"
}

clearImage() {
    echo "docker rmi $imageid"
}

if [ $1 == "local" ]
  then

    env="-e ENV_PROD=0"
    cond="--net='host'"

    if [ $2 == "deploy" ]
      then
        docker build -t $appname .
        docker stop $appname
        docker rm $appname
        eval $(run)
    fi

    if [ $2 == "logs" ]
      then
        docker logs -f $appname
    fi
fi

if [ $1 == "remote" ]
  then

    env="-e ENV_PROD=1"
    cond="--net='host'"

    if [ $2 == "deploy" ]
      then
        ssh -tt $host "mkdir -p $appname && cd $appname && sudo chmod 777 * -R"
        rsync --progress --exclude-from '.deployignore' -avz -e "ssh" . $host:$appname
        ssh -tt $host "cd $appname && docker build -t $appname ."
        ssh -tt $host "cd $appname && docker stop $appname"
        ssh -tt $host "cd $appname && docker rm $appname"
        ssh -tt $host "cd $appname && $(run)"
        ssh -tt $host "docker rmi $(echo $imageid)"
    fi

    if [ $2 == "logs" ]
      then
        ssh -tt $host "docker logs -f $appname"
    fi
fi
