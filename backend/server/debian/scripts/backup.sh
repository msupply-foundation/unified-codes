#!/bin/bash
# NOTE: Sadly this script needs to be run as root to access the dgraph export data
# Print start date
date

HC_URL=https://healthchecks.msupply.org/ping/92702925-31fd-4c02-915c-2a65636e03a6
LOCKFILE="/tmp/codes-backup.lock"

# Check the script isn't already running
if [ -e "${LOCKFILE}" ] && kill -0 `cat "${LOCKFILE}"`; then
    echo "Already running."
    exit 1
fi

# make sure the lockfile is removed when we exit and when we receive a signal
trap "rm -f ${LOCKFILE}; exit" INT TERM EXIT
echo $$ > "${LOCKFILE}"


error_handler () {
  echo "ERROR Backing up"
  # Notify Healthchecks OF THE ERROR
  curl -m 10 --retry 5 ${HC_URL}/fail
  exit -1
}

echo "Started backup"
curl -s $HC_URL/start

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

# remove the lockfile so next back up runs successfully
rm -f "${LOCKFILE}"

# notify the healthchecks server that the backup is completed
curl -s -m 10 --retry 5 $HC_URL
echo "Completed"