# ltt_aggregator
Pulls spotify track links in a slack channel and adds them to a spotify playlist. eat beans.

## Overview

Starts a server with [ngrok](https://ngrok.com/) which accepts event requests from slack. The app filters events to messages in a specific channel, containing the spotify track url pattern. When this event is matched, the app adds the track to the spotify playlist.

## Files

`.env` - Configurations such as spotify/slack credentials. Spotify/Slack resource ids (channel, playlist)
`app.js` - Main application
`authInit.js` - Script to do initial auth with spotify
`start_server.sh` - Starts the main node app, and the ngrok server
`kill_server.sh` - Kills node and ngrok processes
