# This script needs to be run as root to access the dgraph export data
# Print start date
date

# Read the environment file
. /root/.backup-env

error_handler () {
  echo "ERROR Backing up"
  # universal_codes CRONITOR OF THE ERROR
  if [[ -z "${CRONITOR_URL}" ]]; then
	  curl -s $CRONITOR_URL?state=fail
  fi
  exit -1
}


echo "started backup"
curl -s $CRONITOR_URL?state=run

echo "sqlite snapshot"
rm /root/backup/universal_codes.sqlite
/usr/bin/sqlite3 /opt/universal_codes/universalcodes.sqlite "VACUUM INTO '/root/backup/universal_codes.sqlite'"

echo "export dgraph"
mkdir -p /tmp/dgraph_backup/
chown -R dgraph:dgraph /tmp/dgraph_backup
rm -rf /tmp/dgraph_backup/*
curl -X POST localhost:8080/admin -H 'Content-Type: application/json' -d '{ "query": "mutation { export(input: {format: \"rdf\" destination: \"/tmp/dgraph_backup/\"}) { response { message code } } }" }'
if [ $? -ne 0 ]
then
  echo "Unable to complete backup"
  error_handler
fi
cp -r /tmp/dgraph_backup/dgraph*/*.gz /root/backup/

echo "backing up..."
kopia snapshot create /root/backup/
if [ $? -ne 0 ]
then
  echo "Unable to complete backup"
  error_handler
fi

curl -s $CRONITOR_URL?state=complete
echo "Completed