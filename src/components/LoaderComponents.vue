<template>
  <q-ajax-bar ref="bar" position="top" color="blue" size="3px" skip-hijack />
</template>

<script>
import { usestoreAvailable } from "stores/storeAvailable";
import { api } from "src/boot/axios";
import APIinterface from "src/api/APIinterface";

export default {
  name: "LoaderComponents",
  data() {
    return {};
  },
  setup() {
    const ifstoreAvailable = usestoreAvailable();
    return { ifstoreAvailable };
  },
  watch: {
    ifstoreAvailable: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.ajax_bar_loading) {
          if (!APIinterface.empty(this.$refs.bar)) {
            this.$refs.bar.start();
          }
        }
        if (!newValue.ajax_bar_loading) {
          setTimeout(() => {
            if (!APIinterface.empty(this.$refs.bar)) {
              this.$refs.bar.stop();
            }
          }, 500);
        }
      },
    },
  },
};
</script>
