<template>
  <div class="rounded-borders border-grey q-pa-sm">
    <div class="row justify-start items-center">
      <div class="col-7">
        <div
          v-if="show_address"
          class="text-caption col-12 font11 text-grey line-normal ellipsis-2-lines"
        >
          {{ DataStorePersisted.getAddress.address1 }}
          {{ DataStorePersisted.getAddress.formatted_address }}
        </div>
        <div class="text-h6 col-12 line-height-normal text-weight-bolder">
          <template v-if="TransactionStore.loading">
            <q-circular-progress indeterminate rounded size="22px" color="warning" />
          </template>
          <template v-else>
            {{ TransactionStore.getTransactionData.transaction }}
            ( {{ TransactionStore.getTransactionData.date }}
            <span v-if="TransactionStore.getTransactionData.time">
              ,
              {{ TransactionStore.getTransactionData.time }}
            </span>
            )
          </template>
        </div>
      </div>
      <div class="col">
        <q-btn
          flat
          color="warning"
          no-caps
          class="full-width"
          @click="$emit('changeTransaction')"
        >
          <div class="ellipsis">{{ $t("Change") }}</div>
        </q-btn>
      </div>
    </div>
  </div>
  <!-- rounded -->
</template>

<script>
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useSettingsStore } from "stores/SettingsStore";
import { useTransactionStore } from "stores/Transaction";

export default {
  name: "TransactionInfo",
  props: ["show_address"],
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    const SettingsStore = useSettingsStore();
    const TransactionStore = useTransactionStore();
    return { DataStorePersisted, SettingsStore, TransactionStore };
  },
  data() {
    return {};
  },
  mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.TransactionStore.formatTransaction();
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.TransactionStore.formatTransaction();
        }
      );
    }
  },
};
</script>
