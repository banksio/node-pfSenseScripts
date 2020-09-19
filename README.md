# node-pfSenseScripts
![GitHub last commit](https://img.shields.io/github/last-commit/banksio/node-pfSenseScripts)
![Docker Build Status](https://img.shields.io/docker/build/banksio/pfsensescripts)
[![Docker Pulls](https://img.shields.io/docker/pulls/banksio/pfsensescripts)](https://hub.docker.com/r/banksio/pfsensescripts)

A node.js app to perform various actions on a pfSense web GUI.

Currently in alpha: There may still be some rough edges, but please feel free to test it and report any bugs found, or new features that may be beneficial!
## Features
* Change the gateway of a Firewall Rule.

## Usage
### Environment Variables
There are a selection of environment variables that are required to be set for this script to work. These are documented below.

You can use a `pfsensescripts.env` file with the docker-compose included in this repository, or just pass them into `docker run` manually.
Variable | Content
------------ | -------------
pfSense_IP | The IP address of the pfSense instance to perform the task on.
pfSense_user | The username to authenticate with the pfSense instance.
pfSense_pass | The password to authenticate with the pfSense instance.
pfSense_RuleID | The Firewall Rule ID to modify.
gatewayText | The text to match to the gateway to switch the Firewall Rule to.

*Further documentation coming soon.*
