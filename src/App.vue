<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { useSettingsStore } from "stores/SettingsStore";
import APIinterface from "./api/APIinterface";
import { api } from "boot/axios";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    const SettingsStore = useSettingsStore();
    $q.dark.set(false);
    return { SettingsStore };
  },
  created() {
    let savedLangcode = APIinterface.getStorage("language_code");
    if (!APIinterface.empty(savedLangcode)) {
      this.$i18n.locale = savedLangcode;
    }
    api.defaults.params = {};
    api.defaults.params["language"] = this.$i18n.locale;
    //this.ifstoreAvailable.getSettings();
    this.SettingsStore.getSettings();
  },
});
</script>
