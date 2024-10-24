<template>
  <q-page-sticky expand position="top">
    <q-toolbar class="bg-white location-nav">
      <div class="row justify-center items-center full-width">
        <div class="col-xl-g col-lg-4 col-md-6 col-sm-12 text-center">
          <div class="flex justify-center items-center">
            <template v-if="TransactionStore.loading">
              <q-skeleton type="rect" class="fit" />
            </template>
            <template v-else>
              <div class="q-ma-none ellipsis transaction-width text-body2 q-mr-sm">
                {{ TransactionStore.getTransactionData.transaction }}
                ( {{ TransactionStore.getTransactionData.date }}
                <span v-if="TransactionStore.getTransactionData.time"
                  >,{{ TransactionStore.getTransactionData.time }} </span
                >)
              </div>
              <q-btn
                flat
                color="dark"
                class="btn-location"
                icon-right="keyboard_arrow_down"
                no-caps
                @click="changeTransaction"
                :dense="!this.$q.screen.lt.md"
              >
                <span class="ellipsis address-width">
                  <template v-if="DataStorePersisted.getAddress">
                    {{ DataStorePersisted.getAddress.address1 }}
                    {{ DataStorePersisted.getAddress.formatted_address }}
                  </template>
                  <template v-else>
                    {{ $t("Select your address") }}
                  </template>
                </span>
              </q-btn>
            </template>
          </div>
        </div>
      </div>
    </q-toolbar>
  </q-page-sticky>
  <div
    :class="{
      'q-pa-md': !this.$q.screen.lt.md,
      'q-pa-lg': this.$q.screen.lt.md,
    }"
  ></div>

  <DeliveryDetails ref="delivery_details" @show-deliverysched="showDeliverysched" />
  <DeliverySched ref="delivery_sched" @after-savetrans="afterSavetrans" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { useTransactionStore } from "stores/Transaction";
import { useSettingsStore } from "stores/SettingsStore";
import { userDataStorePersisted } from "stores/DataStorePersisted";

export default {
  name: "LocationNav",
  components: {
    DeliveryDetails: defineAsyncComponent(() => import("components/DeliveryDetails")),
    DeliverySched: defineAsyncComponent(() => import("components/DeliverySched")),
  },
  setup() {
    const TransactionStore = useTransactionStore();
    const SettingsStore = useSettingsStore();
    const DataStorePersisted = userDataStorePersisted();
    return { TransactionStore, SettingsStore, DataStorePersisted };
  },
  data() {
    return {};
  },
  methods: {
    changeTransaction() {
      console.log("changeTransaction");
      if (this.DataStorePersisted.getAddress) {
        this.$refs.delivery_details.show_modal = true;
      } else {
        this.$router.push("/location");
      }
    },
    showDeliverysched() {
      this.$refs.delivery_details.show_modal = false;
      this.$refs.delivery_sched.show_modal = true;
    },
  },
};
</script>

<style lang="scss">
.address-width {
  max-width: 300px;
}
.transaction-width {
  max-width: 200px;
}
</style>
