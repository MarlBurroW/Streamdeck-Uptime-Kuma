import {io} from "socket.io-client";
import {EventEmitter} from "events";

class UptimeKuma extends EventEmitter {
  url;
  username;
  password;
  socket;
  token;
  token2fa;
  transport;

  /**
   * @param {string} url
   * @param {string} [token]
   * @param {string} [transport] "auto" (HTTP long-polling, upgraded to WebSocket)
   *   or "websocket" (WebSocket only, no HTTP long-polling)
   */
  constructor(url, token, transport = "auto") {
    super();
    this.url = url;
    this.token = token;
    this.transport = transport;
  }

  setSettings({url, token, transport = "auto"}) {
    this.url = url;
    this.token = token;
    this.transport = transport;
  }

  connect() {
    if (this.isConnected()) {
      this.disconnect();
    }

    const options = {
      reconnection: true,
    };

    // Hosts that enforce CORS on the property inspector / plugin page (e.g. OpenDeck)
    // block socket.io's initial HTTP long-polling requests ("xhr poll error"),
    // because Uptime Kuma does not send CORS headers in production.
    // WebSocket connections are not subject to CORS, so allow skipping polling.
    if (this.transport === "websocket") {
      options.transports = ["websocket"];
    }

    this.socket = io(this.url, options);

    this.socket.on("disconnect", (reason) => {
      this.emit("disconnect", `Disconnected: ${reason}`);
    });

    this.socket.on("connect_error", (err) => {
      this.emit("error", `Connection error: ${err.message}`);
    });

    this.socket.on("connect", () => {
      this.emit("connected");

      this.socket.on("heartbeat", (heartbeat) => {
        this.emit("heartbeat", heartbeat);
      });

      this.socket.on("monitorList", (monitors) => {
        this.emit("monitorList", monitors);
      });

      this.socket.on("uptime", (monitorID, period, percent) => {
        this.emit("uptime", {
          monitorID,
          period,
          percent,
        });
      });

      this.socket.on("avgPing", (monitorID, avgPing) => {
        this.emit("avgPing", {
          monitorID,
          avgPing,
        });
      });

      this.socket.on("heartbeatList", (monitorID, heartbeatList) => {
        this.emit("heartbeatList", {
          monitorID,
          heartbeatList,
        });
      });

      // this.socket.onAny((eventName) => {
      //   console.log(eventName);
      // });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return !!this.socket?.connected;
  }

  hasConnectionParameters() {
    return this.url && this.token;
  }

  authenticate() {

    this.socket.emit(
        "loginByToken",
        this.token,
        (response) => {
          if (response.ok) {
            this.emit("authenticated");
          } else {
            if (response.msg) {
              this.emit("error", response.msg);
            } else {
              this.emit("error", "Authentication failed");
            }
          }
        });
  }

  getToken(username, password, token2fa) {


    this.socket.emit(
        "login",
        {
          username: username,
          password: password,
          token: token2fa,
        },
        (response) => {
          if (response.ok) {
            this.token = response.token;
            this.emit("token", this.token);
          } else {
            if (response.tokenRequired) {
              this.emit("2faRequired")
            } else if (response.msg) {
              this.emit("error", response.msg);
            } else {
              this.emit("error", "Authentication failed");
            }
          }
        }
    );
  }

  pauseMonitor(monitorID, CB = () => {
  }) {
    this.socket.emit("pauseMonitor", parseInt(monitorID), CB);
  }

  resumeMonitor(monitorID, CB = () => {
  }) {
    this.socket.emit("resumeMonitor", parseInt(monitorID), CB);
  }
}

export default UptimeKuma;
