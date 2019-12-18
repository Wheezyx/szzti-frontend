#!/bin/sh
if [ ! -f template-es5.js ];then
    main_es5=$(find /usr/share/nginx/html -iname 'main-es5*')
    echo $main_es5
    cat ${main_es5} > template-es5.js 

fi
if [ ! -f template-es2015.js ];then
    main_es2015=$(find /usr/share/nginx/html -iname 'main-es2015*')
    echo $main_es2015
    cat ${main_es2015} > template-es2015.js

fi

envsubst "`printf '${%s} ' $(sh -c "env|cut -d'=' -f1")`" < template-es5.js  > ${main_es5}
envsubst "`printf '${%s} ' $(sh -c "env|cut -d'=' -f1")`" < template-es2015.js  > ${main_es2015}

nginx -g 'daemon off;'