import { createApp } from "vue";
import PropertyInspector from "./components/PropertyInspector.vue";

$SD.on("connected", () => {
  createApp(PropertyInspector, { pi: $PI, sd: $SD }).mount("#pi");
});
