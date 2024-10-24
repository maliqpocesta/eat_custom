<template>
  <q-dialog
    v-model="show_modal"
    persistent
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
    @before-show="beforeShow"
  >
    <q-card class="q-pa-md" style="width: 500px; min-height: 20vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("Choose prefered time") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-inner-loading :showing="loading" color="warning"></q-inner-loading>
        <template v-if="!loading">
          <q-btn-toggle
            v-model="transaction_type"
            toggle-color="warning"
            no-caps
            unelevated
            class="rounded-group"
            :options="SettingsStore.services_list"
          />

          <q-option-group
            v-model="whento_deliver"
            :options="SettingsStore.delivery_option"
            color="warning"
            @update:model-value="chooseWhen"
          />

          <!-- =>{{ DataStorePersisted.transaction_type }} =>{{
            DataStorePersisted.whento_deliver
          }}
          <pre>{{ this.DataStorePersisted.delivery_date }}</pre>
          <pre>{{ this.DataStorePersisted.delivery_time }}</pre> -->

          <div class="q-mt-md relative-position" v-if="whento_deliver === 'schedule'">
            <q-inner-loading
              :showing="SettingsStore.loading_gettimes"
              color="warning"
            ></q-inner-loading>
            <q-select
              outlined
              dense
              v-model="delivery_date"
              color="warning"
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              :options="SettingsStore.delivery_date_list"
              emit-value
              map-options
              @update:model-value="chooseDate"
            />

            <q-select
              outlined
              dense
              v-model="delivery_time"
              color="warning"
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              :options="
                SettingsStore.delivery_time_list[delivery_date]
                  ? SettingsStore.delivery_time_list[delivery_date]
                  : []
              "
              map-options
            />
          </div>
        </template>
      </q-card-section>

      <q-card-actions class="" v-if="!loading">
        <q-btn
          unelevated
          rounded
          color="warning"
          text-color="black"
          no-caps
          class="full-width q-mb-md"
          :label="$t('Save')"
          size="17px"
          @click="saveTransactionInfo"
          :loading="loading"
        >
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { useSettingsStore } from "stores/SettingsStore";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useTransactionStore } from "stores/Transaction";

export default {
  name: "DeliverySched",
  setup() {
    const SettingsStore = useSettingsStore();
    const DataStorePersisted = userDataStorePersisted();
    const TransactionStore = useTransactionStore();
    return { SettingsStore, DataStorePersisted, TransactionStore };
  },
  data() {
    return {
      show_modal: false,
      loading: false,
      transaction_type: "",
      whento_deliver: "now",
      delivery_date: "",
      delivery_time: "",
    };
  },
  methods: {
    beforeShow() {
      this.loading = true;
      if (Object.keys(this.SettingsStore.settings_data).length > 0) {
        this.getSettings();
      } else {
        this.$watch(
          () => this.SettingsStore.$state.settings_data,
          (newData, oldData) => {
            this.getSettings();
          }
        );
      }
    },
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      console.log("resp", resp);
      if (Object.keys(resp).length > 0) {
        this.loading = false;

        if (!APIinterface.empty(this.DataStorePersisted.transaction_type)) {
          this.transaction_type = this.DataStorePersisted.transaction_type;
        } else {
          this.transaction_type = resp.default_services;
        }

        if (!APIinterface.empty(this.DataStorePersisted.whento_deliver)) {
          this.whento_deliver = this.DataStorePersisted.whento_deliver;
          this.chooseWhen(this.whento_deliver);
        }
      }
    },
    showSched(data) {
      this.show_modal = data;
    },
    async chooseWhen(data) {
      if (data === "schedule") {
        const resp = await this.SettingsStore.getDeliveryTimes();
        if (!APIinterface.empty(this.DataStorePersisted.delivery_date)) {
          this.delivery_date = this.DataStorePersisted.delivery_date;
        } else {
          this.delivery_date = resp ? resp : null;
        }
        if (!APIinterface.empty(this.DataStorePersisted.delivery_time)) {
          this.delivery_time = this.DataStorePersisted.delivery_time
            ? this.DataStorePersisted.delivery_time
            : "";
        }
      } else {
        this.delivery_date = "";
        this.delivery_time = "";
      }
    },
    chooseDate(data) {
      this.delivery_time = "";
    },
    saveTransactionInfo() {
      if (APIinterface.empty(this.transaction_type)) {
        APIinterface.notify(
          "negative",
          this.$t("Please select transaction type"),
          "error_outline",
          this.$q
        );
        return false;
      }
      if (APIinterface.empty(this.whento_deliver)) {
        APIinterface.notify(
          "negative",
          this.$t("Please select when now or schedule for later"),
          "error_outline",
          this.$q
        );
        return false;
      }

      if (this.whento_deliver === "schedule") {
        if (APIinterface.empty(this.delivery_date)) {
          APIinterface.notify(
            "negative",
            this.$t("Please select prefered date"),
            "error_outline",
            this.$q
          );
          return false;
        }
        if (APIinterface.empty(this.delivery_time)) {
          APIinterface.notify(
            "negative",
            this.$t("Please select prefered time"),
            "error_outline",
            this.$q
          );
          return false;
        }
      }
      this.DataStorePersisted.transaction_type = this.transaction_type;
      this.DataStorePersisted.whento_deliver = this.whento_deliver;
      this.DataStorePersisted.delivery_date = this.delivery_date;
      if (!APIinterface.empty(this.delivery_time.value)) {
        this.DataStorePersisted.delivery_time = this.delivery_time.value;
        this.DataStorePersisted.delivery_time_data = this.delivery_time;
      }
      this.show_modal = false;
      this.TransactionStore.formatTransaction();
      this.$emit("afterSavetrans");
    },
  },
};
</script>
