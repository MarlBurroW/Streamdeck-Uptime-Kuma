<template>
  <div class="sdpi-wrapper">
    <details :open="!savedGlobalSettings">
      <summary>> Global settings</summary>
      <div class="sdpi-heading">Global settings</div>

      <div v-if="error" class="alert error">
        {{ error }} <span @click="error = null">X</span>
      </div>
      <div v-if="success" class="alert success">
        {{ success }} <span @click="success = null">X</span>
      </div>

      <div class="sdpi-item">
        <div class="sdpi-item-label">Kuma URL</div>
        <input
          :disabled="loading"
          placeholder="https://uptime.example.com"
          class="sdpi-item-value"
          type="text"
          v-model="url"
          @input="testOk = false"
        />
      </div>

      <div class="sdpi-item">
        <div class="sdpi-item-label">Username</div>
        <input
          :disabled="loading"
          placeholder="Username"
          class="sdpi-item-value"
          type="text"
          v-model="username"
          @input="testOk = false"
        />
      </div>

      <div class="sdpi-item">
        <div class="sdpi-item-label">Password</div>
        <input
          :disabled="loading"
          placeholder="Password"
          class="sdpi-item-value"
          type="password"
          v-model="password"
          @input="testOk = false"
        />
      </div>

      <div class="sdpi-item">
        <button
          :disabled="loading || !isConnectionFormValid"
          class="sdpi-item-value"
          @click="testConnection"
        >
          Test*
        </button>
        <button
          :disabled="loading || !isConnectionFormValid || !testOk"
          class="sdpi-item-value"
          @click="saveGlobalSettings"
        >
          Save
        </button>
      </div>
    </details>

    <div class="sdpi-heading">Monitor settings</div>
    <div v-if="monitorError" class="alert error">
      {{ monitorError }} <span @click="monitorError = null">X</span>
    </div>
    <div v-if="monitorSuccess" class="alert success">
      {{ monitorSuccess }} <span @click="monitorSuccess = null">X</span>
    </div>

    <div class="sdpi-item">
      <div class="sdpi-item-label">Monitor</div>
      <select
        :disabled="monitorLoading"
        v-model="monitorId"
        class="sdpi-item-value select"
        @change="saveSettings"
      >
        <option :value="null">Select a monitor</option>
        <option v-for="m in monitors" :key="m.id" :value="m.id">
          {{ m.name }}
        </option>
      </select>
      <button
        :disabled="monitorLoading"
        class="sdpi-item-value"
        @click="fetchMonitors"
        title="Refresh"
        style="max-width: 50px"
      >
        ↻
      </button>
    </div>

    <div class="sdpi-item">
      <div class="sdpi-item-label">Text</div>
      <select
        :disabled="monitorLoading"
        v-model="info"
        class="sdpi-item-value select"
        @change="saveSettings"
      >
        <option v-for="info in infos" :key="info.val" :value="info.val">
          {{ info.name }}
        </option>
      </select>
    </div>

    <!-- END OF SDPI-WRAPPER -->
  </div>
</template>

<script>
import UptimeKuma from "../modules/uptime-kuma";

export default {
  props: {
    sd: {
      type: ELGSDPropertyInspector,
      required: true,
    },
    pi: {
      type: ELGSDStreamDeck,
      required: true,
    },
  },
  mounted() {
    this.getSettings();
    this.getGlobalSettings();

    this.sd.on(
      `${this.pi.actionInfo.action}.didReceiveSettings`,
      (settings) => {
        if (settings.payload.settings.monitorId) {
          this.monitorId = settings.payload.settings.monitorId;
        }
        if (settings.payload.settings.info) {
          this.info = settings.payload.settings.info;
        }
      }
    );

    this.sd.on("didReceiveGlobalSettings", (settings) => {
      if (settings.payload.settings) {
        this.initialGlobalSettings = settings.payload.settings;
      }

      if (settings.payload.settings.url) {
        this.url = settings.payload.settings.url;
      }
      if (settings.payload.settings.username) {
        this.username = settings.payload.settings.username;
      }
      if (settings.payload.settings.password) {
        this.password = settings.payload.settings.password;
      }

      this.fetchMonitors();
    });
  },
  computed: {
    savedGlobalSettings() {
      return (
        this.initialGlobalSettings?.url &&
        this.initialGlobalSettings?.username &&
        this.initialGlobalSettings?.password
      );
    },

    isConnectionFormValid() {
      return this.url && this.username && this.password;
    },
    isMonitorFormValid() {
      return this.monitorId;
    },
  },
  methods: {
    fetchMonitors() {
      const kuma = new UptimeKuma(this.url, this.username, this.password);
      kuma.connect();
      this.monitorLoading = true;

      kuma.on("connected", () => {
        kuma.authenticate();
      });

      kuma.on("monitorList", (monitors) => {
        this.monitors = monitors;
        kuma.disconnect();
        this.monitorLoading = false;
      });

      kuma.on("error", (err) => {
        this.monitorLoading = false;
      });
    },

    testConnection() {
      this.error = null;
      this.success = null;
      this.loading = true;

      const kuma = new UptimeKuma(this.url, this.username, this.password);
      kuma.connect();

      kuma.on("connected", () => {
        kuma.authenticate();
      });

      kuma.on("authenticated", (token) => {
        this.success = "Test successful";
        this.loading = false;
        this.testOk = true;
        kuma.disconnect();
      });

      kuma.on("error", (err) => {
        this.error = `Test failed: ${err}`;
        this.loading = false;
        kuma.disconnect();
      });
    },
    getSettings() {
      this.pi.getSettings();
    },
    saveSettings() {
      this.pi.setSettings({
        monitorId: this.monitorId,
        info: this.info,
      });
    },
    getGlobalSettings(settings) {
      this.pi.getGlobalSettings();
    },
    saveGlobalSettings() {
      this.pi.setGlobalSettings({
        url: this.url,
        username: this.username,
        password: this.password,
      });

      this.success = "Connection settings saved";

      this.fetchMonitors();
    },
  },
  data() {
    return {
      initialGlobalSettings: null,
      url: null,
      username: null,
      password: null,
      monitorId: null,
      info: "avgPing",
      error: null,
      success: null,
      loading: false,
      monitorError: null,
      monitorSuccess: null,
      monitorLoading: false,
      monitors: [],
      testOk: false,
      infos: [
        {
          val: "avgPing",
          name: "Average ping",
        },
        {
          val: "uptime24h",
          name: "Uptime on 24 hours",
        },
        {
          val: "uptime30d",
          name: "Uptime on 30 days",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.alert {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  border-radius: 3px;
  span {
    cursor: pointer;
  }
  &.success {
    background-color: rgb(165, 245, 165);
    color: rgb(5, 138, 0);
    font-weight: bold;
    border: rgb(5, 138, 0);
  }

  &.error {
    background-color: rgb(255, 135, 135);
    color: rgb(131, 1, 1);
    font-weight: bold;
    border: solid 2px rgb(131, 1, 1);
  }
}
</style>
