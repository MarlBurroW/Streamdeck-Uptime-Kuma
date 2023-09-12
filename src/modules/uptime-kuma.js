import {io} from "socket.io-client";
import {EventEmitter} from "events";

class UptimeKuma extends EventEmitter {
  url;
  username;
  password;
  socket;
  token;
  token2fa;

  constructor(url, token) {
    super();
    this.url = url;
    this.token = token;

  }

  setSettings({url, token}) {
    this.url = url;
    this.token = token;
  }

  connect() {
    if (this.isConnected()) {
      this.disconnect();
    }

    this.socket = io(this.url, {
      reconnection: true,
    });

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
