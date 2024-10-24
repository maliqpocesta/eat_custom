<template>
  <q-page :padding="!this.$q.screen.lt.md ? true : false">
    <DeliverySched ref="delivery_sched" @after-savetrans="afterSavetrans" />

    <div class="row justify-center q-pa-md">
      <div class="col-md-7 col-12">
        <NewAddress
          ref="new_address"
          :show_cancel="false"
          :label_id="1"
          @after-confirmlocation="afterConfirmlocation"
          :loading="loading"
        />
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <AddressDetails
      ref="address_details"
      :locationdata="location_data"
      :maps_config="maps_config"
      @after-saveaddress="afterSaveaddress"
      @before-delete="confirmdeleteAddress"
    />
  </q-page>
</template>

<script>
import { defineAsyncComponent, ref } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useSettingsStore } from "stores/SettingsStore";
import jwtDecode from "jwt-decode";

export default {
  name: "Location",
  components: {
    NewAddress: defineAsyncComponent(() => import("components/NewAddress")),
    DeliverySched: defineAsyncComponent(() => import("components/DeliverySched")),
    AddressDetails: defineAsyncComponent(() => import("components/AddressDetails")),
  },
  data() {
    return {
      loading: false,
      data: [],
      maps_config: [],
      location_data: [],
    };
  },
  setup(props) {
    const DataStorePersisted = userDataStorePersisted();
    const SettingsStore = useSettingsStore();
    return { DataStorePersisted, SettingsStore };
  },
  mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.getMapsconfig();
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.getMapsconfig();
        }
      );
    }
  },
  methods: {
    async getMapsconfig() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (Object.keys(resp).length > 0) {
        try {
          this.maps_config = jwtDecode(resp.maps_config);
        } catch (error) {
          console.log(error);
        }
      }
    },
    afterConfirmlocation(data) {
      if (APIinterface.empty(data.place_id)) {
        APIinterface.notify(
          "negative",
          this.$t("Enter your location or select on the map"),
          "warning",
          this.$q
        );
        return;
      }

      this.DataStorePersisted.local_id = data.place_id;
      this.location_data = data;

      console.log("data", data.place_id);
      this.SettingsStore.SavePlaceByID(data.place_id);

      if (auth.authenticated()) {
        this.$refs.address_details.show_modal = true;
      } else {
        this.DataStorePersisted.location_data = data;
        this.afterSaveaddress();
      }
    },
    afterSaveaddress() {
      if (this.DataStorePersisted.delivery_sched == true) {
        this.$router.push({ name: "menu", params: { addcart: true } });
      } else {
        this.$refs.delivery_sched.showSched(true);
      }
    },
    afterSavetrans() {
      console.log("afterSavetrans");
      this.$router.push({ name: "menu", params: { addcart: true } });
    },
  },
};
</script>
