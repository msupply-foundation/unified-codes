#rm ./web.tar.gz 
#rm ./dist/apps/web/*
cp .dist.env .env
mv .local.env .local.env.backup

nx build web --prod --optimization
# tar -czvf web.tar.gz ./dist/apps/web
rm .env

scp ./dist/apps/web/* root@codes.msupply.foundation:/var/www/unified-codes/web/
mv .local.env.backup .local.env

ssh root@codes.msupply.foundation
# systemctl restart nginx
# exit


#nx build data-service --prod --optimize
#scp ./dist/apps/data-service/* root@codes.msupply.foundation:/var/www/unified-codes/data-service/
#ssh root@codes.msupply.foundation
