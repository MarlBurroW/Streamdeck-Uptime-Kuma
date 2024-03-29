# Streamdeck Uptime Kuma

Unofficial [Uptime Kuma](https://github.com/louislam/uptime-kuma) plugin for Elgato Streamdeck.

![Xnapper-2022-12-31-10 05 27](https://user-images.githubusercontent.com/3024430/210131410-6e23f1eb-adc8-44be-94a7-494435a519f9.png)
![IMG_0332](https://user-images.githubusercontent.com/3024430/210131465-d45265e8-5095-466c-bbfe-cef4931330a3.jpeg)
![CleanShot 2024-02-04 at 17 28 57](https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/assets/3024430/b79910b2-4c84-4116-8ea0-aaf54516b0f2)


## Features

* Allow to add a monitor button displaying:
  * The current state of the monitor (Background color):
    * 🟩 Green -> Up
    * 🟥 Red -> Down
    * 🟧 Orange -> Paused
    * ⬛ Grey -> Unkown status (waiting for the first status).
  * And any of this information:
    * The current ping in ms (ping of the last heartbeat).
    * The average ping in ms (on last 24 hours)
    * The uptime (%) during last 24 hours.
    * The uptime (%) during last 30 days.
* Info displayed can be changed by pressing the button (switch between current ping, average ping 24h, uptime 24h, uptime 30d).
* Buttons can also be configured to Pause/Resume the monitor on tap.
* The plugin use the Uptime Kuma SocketIO interface (like the official frontend) so monitor's states are instantly synced with the server.
* Streamdeck+ support (Thanks to [@totoluto](https://github.com/totoluto))

## Roadmap

* Add long press action binding. https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/issues/4
* Connect the socket only if actions are displayed on the current screen https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/issues/3
* Add a group of monitors action button. https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/issues/5
* Allow to add multiple Kuma instance. https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/issues/6

## Installation

### Install from the Elgato Streamdeck Store

https://apps.elgato.com/plugins/com.marlburrow.uptime-kuma

### Or download the latest release directly from this repo

Download the [latest release](https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/releases/latest), and run the `com.marlburrow.uptime-kuma.streamDeckPlugin` file.

### Or build from source
You can build the plugin from source (Only on windows because the Elgato DistributionTool is needed):

1. Clone the repository

`git clone https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma`

2. Install node dependencies

`yarn`

3. Run the build.bat file

`.\build.bat`

The bat will build the js/css with webpack (vue-cli), then Package the plugin with the DistributionTool, then execute the plugin.


## Troubleshooting

* CORS error resulting to `xhr poll error` message. [#1](https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/issues/1) TLDR: Update your  Streamdeck software

Or create an issue here https://github.com/MarlBurroW/Streamdeck-Uptime-Kuma/issues


