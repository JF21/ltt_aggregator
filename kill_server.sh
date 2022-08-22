echo "Pre kill command:"
sudo pkill ngrok && sudo pkill node

echo "Post kill command:"
ps aux | grep ngrok
ps aux | grep node
