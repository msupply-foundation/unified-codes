### unified codes release steps                     ###
### before using, add your public key to the server ###
### to allow scp & ssh                              ###

################ web ################
 cp .dist.env .env
 mv .local.env .local.env.backup

 nx build web --prod --optimization
 rm .env

 scp ./dist/apps/web/* root@codes.msupply.foundation:/var/www/unified-codes/web/
 mv .local.env.backup .local.env

 ssh root@codes.msupply.foundation

### and then run the following commands ###
# systemctl restart nginx
# exit



################ data-service ###############
# nx build data-service --prod --optimize
# scp ./dist/apps/data-service/* root@codes.msupply.foundation:/var/www/unified-codes/data-service/
# ssh root@codes.msupply.foundation

### and then run the following commands ###
# pm2 restart data-service
# exit