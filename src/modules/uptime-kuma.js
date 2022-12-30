import { io } from "socket.io-client";
import { EventEmitter } from "events";

class UptimeKuma extends EventEmitter {
  url;
  username;
  password;
  socket;
  token;

  constructor(url, username, password) {
    super();
    this.url = url;
    this.username = username;
    this.password = password;
  }

  setSettings({ url, username, password }) {
    this.url = url;
    this.username = username;
    this.password = password;
  }

  connect() {
    this.disconnect();

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

      this.socket.onAny((eventName) => {
        console.log(eventName);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  authenticate() {
    this.socket.emit(
      "login",
      {
        username: this.username,
        password: this.password,
      },
      (response) => {
        if (response.ok) {
          this.token = response.token;

          this.emit("authenticated", this.token);
        } else {
          this.emit("error", "authentication failed");
        }
      }
    );
  }
}

export default UptimeKuma;
