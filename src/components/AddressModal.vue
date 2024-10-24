<template>
  <q-dialog
    v-model="show_modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
    @before-show="beforeShow"
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <NewAddress
        ref="new_address"
        :show_cancel="false"
        @after-confirmlocation="afterConfirmlocation"
        @after-selectaddress="afterSelectaddress"
      />
    </q-card>
  </q-dialog>

  <AddressDetails
    ref="address_details"
    :locationdata="location_data"
    :maps_config="maps_config"
    @after-saveaddress="afterSaveaddress"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "AddressModal",
  components: {
    NewAddress: defineAsyncComponent(() => import("components/NewAddress")),
    AddressDetails: defineAsyncComponent(() => import("components/AddressDetails")),
  },
  data() {
    return {
      show_modal: false,
      maps_config: [],
      location_data: [],
    };
  },
  methods: {
    afterConfirmlocation(data, config) {
      if (Object.keys(data).length > 0) {
        this.location_data = data;
        this.maps_config = config;
        this.$refs.address_details.show_modal = true;
        this.show_modal = false;
      } else {
        APIinterface.notify(
          "negative",
          this.$t("Please enter your address"),
          "error_outline",
          this.$q
        );
      }
    },
    afterSaveaddress() {
      this.$emit("afterSaveaddress");
    },
  },
};
</script>
