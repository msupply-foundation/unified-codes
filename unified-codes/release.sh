### unified codes release steps                     ###
### before using, add your public key to the server ###
### to allow scp & ssh                              ###

readonly ssh_user="root"
readonly server_url="codes.msupply.foundation"
readonly path_web="/var/www/unified-codes/web/"
readonly path_data_service="/var/www/unified-codes/data-service/"

if [ ${#@} -ne 0 ] && [ "${@#"--help"}" = "" ]; then
  printf -- 'Build and release unified codes\n';
  printf -- 'Usage:\n';
  printf -- '\t./release.sh web\t\t: to build and release web only\n';
  printf -- '\t./release.sh data-service\t: to build and release data-service only\n';
  printf -- ' \t./release.sh all \t\t: to build and release both\n';
  exit 0;
fi;

if [ $# -eq 0 ]
  then
    printf -- '\033[31mNo arguments supplied!\033[0m\n';
    printf -- 'Please specify either web or data-service or all\n\n';
    exit 0;
fi

################ web ################
if [ $1 = "web" ] || [ $1 = "all" ]; then
  printf -- '\033[97m building web **\033[0m\n';
  cp .dist.env .env
  mv .local.env .local.env.backup

  nx build web --prod --optimization && rm .env

  printf -- '\033[97m** copying web **\033[0m\n';
  scp ./dist/apps/web/* $ssh_user@$server_url:$path_web
  mv .local.env.backup .local.env

  printf -- '\033[97m Now run the following: \033[0m\n';
  printf -- '\033[97m   systemctl restart nginx \033[0m\n';
  printf -- '\033[97m   exit \033[0m\n';
fi;



################ data-service ###############
if [ $1 = "data-service" ] ||  [ $1 = "all" ]; then
  printf -- '\033[97m** building data-service **\033[0m\n';
  nx build data-service --prod --optimize

  printf -- '\033[97m** copying data-service **\033[0m\n';
  scp ./dist/apps/data-service/* $ssh_user@$server_url:$path_data_service
  
  printf -- '\033[97m Now run the following: \033[0m\n';
  printf -- '\033[97m   pm2 restart data-service \033[0m\n';
  printf -- '\033[97m   exit \033[0m\n';
fi;

ssh $ssh_user@$server_url