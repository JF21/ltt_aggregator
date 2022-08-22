HOME_DIR=/home/pi/ltt_aggregator
LOG_DIR=$HOME_DIR/logs

node $HOME_DIR/app.js &> $LOG_DIR/application.log &

/home/pi/ngrok http 3000  -log="$LOG_DIR/ngrok.log" &
