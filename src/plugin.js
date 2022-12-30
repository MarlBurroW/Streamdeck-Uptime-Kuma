import UptimeKuma from "./modules/uptime-kuma";
import {
  serviceDownImage,
  serviceUpImage,
  serviceUnknownImage,
} from "./modules/images";

let kuma = null;
let globalSettings = null;
let monitors = {};
let actions = {};

$SD.on("connected", (payload) => {
  $SD.getGlobalSettings();
});

$SD.on("com.marlburrow.uptime-kuma.monitor.didReceiveSettings", (payload) => {
  actions[payload.context] = {
    action: payload.action,
    context: payload.context,
    device: payload.device,
    payload: payload.payload,
  };

  updateActionDisplay(payload.context);
});

$SD.on("com.marlburrow.uptime-kuma.monitor.willAppear", (payload) => {
  actions[payload.context] = {
    action: payload.action,
    context: payload.context,
    device: payload.device,
    payload: payload.payload,
  };
});

$SD.on("com.marlburrow.uptime-kuma.monitor.keyDown", (payload) => {
  const action = actions[payload.context];

  if (action) {
    const settings = action.payload?.settings;

    if (settings) {
      switch (settings.info) {
        case "avgPing":
          settings.info = "uptime24h";
          break;
        case "uptime24h":
          settings.info = "uptime30d";
          break;
        case "uptime30d":
          settings.info = "avgPing";
          break;
        default:
          settings.info = "avgPing";
      }
    }

    $SD.setSettings(action.context, settings);
    $SD.getSettings(action.context);
  }
});

$SD.on("com.marlburrow.uptime-kuma.monitor.willDisappear", (payload) => {
  delete actions[payload.context];
});

$SD.on("didReceiveGlobalSettings", (settings) => {
  globalSettings = settings.payload.settings;

  if (kuma) {
    kuma.disconnect();
  }

  kuma = new UptimeKuma(
    globalSettings.url,
    globalSettings.username,
    globalSettings.password
  );

  kuma.connect();

  kuma.on("connected", () => {
    showOkOnAllActions();

    kuma.authenticate();
  });

  kuma.on("error", () => {
    showAlertOnAllActions();
  });

  kuma.on("disconnect", () => {
    showAlertOnAllActions();
  });

  kuma.on("authenticated", () => {
    console.log("Authentified on Kuma WS");
  });

  kuma.on("monitorList", (monitorList) => {
    for (let monitorId in monitorList) {
      const monitor = monitorList[monitorId];

      if (!monitors[monitor.id]) {
        monitors[monitor.id] = {
          id: monitor.id,
          name: monitor.name,
        };
      } else {
        monitors[monitor.id].name = monitor.name;
        monitors[monitor.id].id = monitor.id;
      }
    }

    updateAllActionsDisplay();
  });

  kuma.on("heartbeat", (payload) => {
    if (monitors[payload.monitorID]) {
      monitors[payload.monitorID].heartbeat = payload;
    }

    updateActionsDisplayUsingMonitor(payload.monitorID);
  });

  kuma.on("avgPing", (payload) => {
    if (monitors[payload.monitorID]) {
      monitors[payload.monitorID].avgPing = payload.avgPing;
    }

    updateActionsDisplayUsingMonitor(payload.monitorID);
  });

  kuma.on("uptime", (payload) => {
    if (monitors[payload.monitorID]) {
      if (payload.period === 24) {
        monitors[payload.monitorID].uptime24h = payload.percent;
      }
      if (payload.period === 720) {
        monitors[payload.monitorID].uptime30d = payload.percent;
      }
    }

    updateActionsDisplayUsingMonitor(payload.monitorID);
  });

  kuma.on("heartbeatList", (payload) => {
    const monitor = monitors[payload.monitorID];

    if (monitor) {
      monitor.heartbeatList = payload.heartbeatList;
      if (payload.heartbeatList.length > 0) {
        monitor.heartbeat = payload.heartbeatList.at(-1);
      }
    }

    updateActionsDisplayUsingMonitor(payload.monitorID);
  });
});

function showAlertOnAllActions() {
  for (let context in actions) {
    const action = actions[context];
    $SD.showAlert(action.context);
  }
}

function showOkOnAllActions() {
  for (let context in actions) {
    const action = actions[context];
    $SD.showOk(action.context);
  }
}

function updateAllActionsDisplay() {
  for (let context in actions) {
    const action = actions[context];
    updateActionDisplay(action.context);
  }
}

function formatPercent(percent) {
  percent = parseFloat(percent) * 100;
  return percent.toLocaleString(
    undefined, // leave undefined to use the visitor's browser
    // locale or a string like 'en-US' to override it.
    { maximumFractionDigits: 1 }
  );
}

function updateActionDisplay(context) {
  const action = actions[context];

  if (action?.payload?.settings?.monitorId) {
    const monitor = monitors[action.payload.settings.monitorId];

    if (monitor) {
      if (monitor.heartbeat) {
        if (monitor.heartbeat.status) {
          let text = "";
          let fontSize = 22;
          switch (action?.payload?.settings?.info) {
            case "avgPing":
              text = (monitor.avgPing ? monitor.avgPing : "--") + "ms";
              break;
            case "uptime24h":
              text =
                (monitor.uptime24h ? formatPercent(monitor.uptime24h) : "--") +
                "% (24h)";
              fontSize = 14;
              break;
            case "uptime30d":
              text =
                (monitor.uptime30d ? formatPercent(monitor.uptime30d) : "--") +
                "% (30d)";
              fontSize = 14;
              break;
            default:
              text = (monitor.avgPing ? monitor.avgPing : "--") + "ms";
              break;
          }

          $SD.setImage(action.context, serviceUpImage(text, fontSize));
        } else {
          $SD.setImage(action.context, serviceDownImage("DOWN"));
        }
      } else {
        $SD.setImage(action.context, serviceUnknownImage("No state", 16));
      }
    }
  }
}

function updateActionsDisplayUsingMonitor(monitorID) {
  if (monitors[monitorID]) {
    for (let context in actions) {
      const action = actions[context];
      const settings = action.payload.settings;

      if (settings.monitorId == monitorID) {
        updateActionDisplay(action.context);
      }
    }
  }
}
