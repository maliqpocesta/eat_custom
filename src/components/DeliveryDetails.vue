<template>
  <q-dialog
    v-model="show_modal"
    persistent
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
    @before-show="beforeShow"
  >
    <q-card class="q-pa-md" :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("Order details") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-list>
        <q-item>
          <q-item-section class="col-1" avatar top>
            <q-icon name="o_place" color="black" size="20px" />
          </q-item-section>
          <q-item-section top>
            <template v-if="DataStorePersisted.getAddress">
              <q-item-label lines="1">
                {{ DataStorePersisted.getAddress.address1 }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ DataStorePersisted.getAddress.formatted_address }}
              </q-item-label>
            </template>
            <template v-else>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ $t("New address") }}</span>
              </q-item-label>
              <q-item-label caption lines="1">
                {{ $t("Select your address") }}
              </q-item-label>
            </template>
          </q-item-section>
          <q-item-section top side>
            <template v-if="!is_guest">
              <q-btn
                :label="$t('Change')"
                flat
                color="warning"
                class="text-weight-bold"
                :dense="$q.screen.lt.sm"
                v-close-popup
                @click.stop="showLocationmodal"
              />
            </template>
            <template v-else>
              <q-btn
                :label="$t('Change')"
                flat
                color="warning"
                class="text-weight-bold"
                :dense="$q.screen.lt.sm"
                v-close-popup
                @click="changeAddress"
              />
            </template>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-1" avatar top>
            <q-icon name="schedule" color="black" size="20px" />
          </q-item-section>
          <q-item-section top>
            <template v-if="TransactionStore.getTransactionData">
              <q-item-label lines="1">
                {{ TransactionStore.getTransactionData.transaction }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ TransactionStore.getTransactionData.date }}
                <span v-if="TransactionStore.getTransactionData.time">
                  ,
                  {{ TransactionStore.getTransactionData.time }}
                </span>
              </q-item-label>
            </template>
          </q-item-section>
          <q-item-section top side>
            <q-btn
              :label="$t('Change')"
              flat
              color="warning"
              class="text-weight-bold"
              :dense="$q.screen.lt.sm"
              @click="$emit('showDeliverysched')"
            >
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-mt-lg"></div>

      <q-card-actions class="">
        <q-btn
          unelevated
          rounded
          color="warning"
          text-color="black"
          no-caps
          class="full-width q-mb-xs"
          :label="$t('Done')"
          size="17px"
          v-close-popup
        >
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <template v-if="!is_guest">
    <LocationModal
      ref="location_modal"
      :title="$t('Change address')"
      :enabled_search="false"
      @after-selectaddress="afterSelectaddress"
      @after-setplaceid="afterSetplaceid"
    />
  </template>
</template>

<script>
import { useTransactionStore } from "stores/Transaction";
import APIinterface from "src/api/APIinterface";
import { useSettingsStore } from "stores/SettingsStore";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import auth from "src/api/auth";
import { defineAsyncComponent } from "vue";

export default {
  name: "DeliveryDetails",
  props: ["transaction_data", "delivery_option", "services_list"],
  components: {
    LocationModal: defineAsyncComponent(() => import("components/LocationModal")),
  },
  setup() {
    const TransactionStore = useTransactionStore();
    const SettingsStore = useSettingsStore();
    const DataStorePersisted = userDataStorePersisted();
    return { TransactionStore, SettingsStore, DataStorePersisted };
  },
  data() {
    return {
      show_modal: false,
      is_guest: false,
    };
  },
  methods: {
    beforeShow() {
      this.is_guest = true;
      if (auth.authenticated()) {
        this.is_guest = false;
      }
    },
    showLocationmodal() {
      this.show_modal = false;
      this.$refs.location_modal.show_modal = true;
    },
    afterSelectaddress(data) {
      console.log("afterSelectaddress", data);
    },
    afterSetplaceid(data) {
      console.log("afterSetplaceidx", data);
      this.$emit("afterChooseaddress");
    },
    changeAddress() {
      this.show_modal = false;
      this.$router.push("/location");
    },
  },
};
</script>
