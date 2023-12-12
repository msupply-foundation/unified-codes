# Print start date
date

# Read the environment file
. /home/ubuntu/.backup-env


error_handler () {
  echo "ERROR Backing up"
  # Notify CRONITOR OF THE ERROR
  if [[ -z "${CRONITOR_URL}" ]]; then
	  curl -s $MONITOR_URL?state=fail
  fi
  exit -1
}

if [[ -z "${RESTIC_PASSWORD}" ]]; then
   echo "PLEASE SET ENVIRONMENT VARIABLES IN .backup-env";
   exit;
fi

echo "started backup"
curl -s $CRONITOR_URL?state=run

echo "sqlite snapshot"
rm /opt/notify/backup.sqlite
/usr/bin/sqlite3 /opt/notify/notify-database.sqlite "VACUUM INTO '/opt/notify/backup.sqlite'"

echo "backing up..."
/usr/bin/restic -q backup /opt/notify
if [ $? -ne 0 ]
then
  echo "Unable to complete backup"
  error_handler
fi

echo "clean up snapshots"
/usr/bin/restic -q forget --keep-within 7d --keep-last 20 --keep-daily 7 --keep-monthly 12
if [ $? -ne 0 ]
then
  echo "Unable to complete backup"
  error_handler
fi

#Right now we're not pruning by default as we have a lot of space via Backblaze turn this on to save storage (could take a while to run!)
#echo "pruning"
#/usr/bin/restic -q prune

curl -s $CRONITOR_URL?state=complete
echo "Completed"
