<template>
  <template
    v-if="
      !SettingsStore.loading_settings &&
      Object.keys(SettingsStore.language_list).length > 0
    "
  >
    <q-btn style="padding: 4px 3px">
      <q-avatar size="sm" v-if="SettingsStore.language_list.flag_list">
        <template v-if="SettingsStore.language_list.flag_list[$i18n.locale]">
          <q-img :src="SettingsStore.language_list.flag_list[$i18n.locale]" fit="cover" />
        </template>
      </q-avatar>
      <q-menu
        transition-show="jump-down"
        transition-hide="jump-up"
        active="red"
        max-width="300px"
      >
        <q-list>
          <template v-for="langitem in SettingsStore.language_list.list" :key="langitem">
            <q-item clickable v-close-popup @click="setLanguage(langitem.code)">
              <q-item-section avatar>
                <q-avatar size="sm">
                  <q-img :src="langitem.flag_url" fit="cover" />
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ langitem.title }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
  </template>
</template>

<script>
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "LanguageSelection",
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  created() {},
  methods: {
    setLanguage(code) {
      this.$emit("afterSelectlanguage", code);
    },
  },
};
</script>
