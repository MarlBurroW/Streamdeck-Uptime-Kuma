# Streamdeck Uptime Kuma

Unofficial Uptime Kuma plugin for Elgato Streamdeck.

![Screenshot](https://i.imgur.com/hwNjDdi.png)

## Features

* Allow to add a monitor button displaying:
  * The current state of the monitor (Green/Red/Unknown background)
  * The average ping in microseconds
  * The uptime during last 24 hours
  * The uptime during last 30 days
* Info displayed can be changed by pressing the button (switch between average ping, uptime 24h, uptime 30d)
* The plugin use the Uptime Kuma SocketIO API so monitor's states are instantly synced with the server.

## Feedbacks required

The plugin has not been submitted to the Elgato plugin store because I need Feedbacks before.
I also need approval from Uptime Kuma development team.

Don't hesitate to create some issues if you have any problems or have any suggestions to improve this plugin.

Contributions are welcome

## Installation

### Build from source
You can build the plugin from source (Only on windows because the Elgato DistributionTool is needed):

1. Clone the repository

`git clone https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma`

2. Install node dependencies

`yarn`

3. Run the build.bat file

`.\build.bat`

The bat will build the js/css with webpack (vue-cli), then Package the plugin with the DistributionTool, then execute the plugin.

### Download the release directly

