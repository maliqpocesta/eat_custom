<template>
  <q-card flat>
    <div class="bg-grey-1 relative-position" :class="class_map" style="overflow: hidden">
      <Maps
        ref="maps"
        :lat="maps_config.default_lat"
        :lng="maps_config.default_lng"
        :keys="maps_config.key"
        :zoom="15"
        :class_map="class_map"
        :provider="maps_config.provider"
        :detect_location="false"
        :marker="marker"
        @after-selectmap="afterSelectmap"
        @drag-marker="dragMarker"
        @show-loader="showLoader"
      />
      <q-inner-loading
        :showing="loading_map"
        :label="$t('Please wait...')"
        label-class="text-dark"
        label-style="font-size: 11px"
      >
      </q-inner-loading>
    </div>

    <!-- FORM -->
    <q-card-section class="q-pa-none q-pt-md">
      <div class="row full-width">
        <div class="col">
          <div class="text-h6 line-normal">{{ formatted_address }}</div>
          <div class="text-caption">{{ address1 }}</div>
        </div>
        <div class="col-4 text-right">
          <q-btn
            color="warning"
            flat
            unelevated
            :label="$t('Edit')"
            no-caps
            @click="dialog = !dialog"
          />
        </div>
      </div>

      <q-space class="q-pa-sm"></q-space>

      <q-input
        v-model="address1"
        autogrow
        outlined
        class="q-mb-md full-width"
        color="warning"
        :label="$t('Street name')"
        dense
      />

      <q-input
        v-model="formatted_address"
        autogrow
        outlined
        class="q-mb-md full-width"
        color="warning"
        :label="$t('Street number')"
        dense
      />

      <q-input
        v-model="location_name"
        autogrow
        outlined
        class="q-mb-md full-width"
        color="warning"
        :label="$t('Aparment, suite or floor')"
        dense
      />

      <h6 class="text-weight-bold no-margin q-pl-md q-pb-sm">
        {{ $t("Delivery options") }}
      </h6>
      <q-select
        outlined
        dense
        v-model="delivery_options"
        :options="delivery_options_data"
        color="warning"
        class="q-mb-md"
        transition-show="scale"
        transition-hide="scale"
        emit-value
      />

      <h6 class="text-weight-bold no-margin q-pl-md q-pb-sm">
        {{ $t("Add delivery instructions") }}
      </h6>
      <q-input
        v-model="delivery_instructions"
        autogrow
        outlined
        class="q-mb-md full-width"
        color="warning"
        :label="
          $t(
            'eg. ring the bell after dropoff, leave next to the porch, call upon arrival, etc'
          )
        "
      />

      <h6 class="text-weight-bold no-margin q-pl-md q-pb-sm">
        {{ $t("Address label") }}
      </h6>

      <div class="scroll bg-grey-2">
        <q-btn-toggle
          class="q-mb-md q-ml-sm rounded-group no-margin"
          v-model="address_label"
          toggle-color="warning"
          no-caps
          unelevated
          :options="address_label_data"
          emit-value
          size="md"
        />
      </div>
    </q-card-section>

    <q-card-actions class="q-pl-none q-pr-none q-mt-sm">
      <q-btn
        unelevated
        color="warning"
        text-color="black"
        no-caps
        class="full-width q-mb-md"
        :label="$t('Save')"
        size="17px"
        @click="submit"
        :loading="loading"
      />
    </q-card-actions>
  </q-card>

  <q-dialog
    v-model="dialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">
          {{ $t("What's your exact location?") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-space class="q-pa-sm"></q-space>

      <NewAddress
        ref="new_address"
        :show_cancel="false"
        :label_id="2"
        @after-confirmlocation="afterConfirmlocation"
        @after-selectaddress="afterSelectaddress"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "AddressInline",
  props: ["locationdata", "maps_config"],
  components: {
    Maps: defineAsyncComponent(() => import("components/Maps")),
    NewAddress: defineAsyncComponent(() => import("components/NewAddress")),
  },
  data() {
    return {
      loading: false,
      dialog: false,
      location_data: this.locationdata,
      formatted_address: "",
      address1: "",
      location_name: "",
      delivery_options: "Leave it at my door",
      delivery_instructions: "",
      address_label: "Home",
      attributes: [],
      formatted_address: "",
      class_map: "maps small",
      marker: [],
      validat_coord: false,
      new_lat: "",
      new_lng: "",
      latitude: "",
      longitude: "",
      place_id: "",
      delivery_options_data: [],
      address_label_data: [],
    };
  },
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    const SettingsStore = useSettingsStore();
    return { DataStorePersisted, SettingsStore };
  },
  mounted() {
    this.beforeShow();
    if (Object.keys(this.locationdata).length > 0) {
      this.formatted_address = this.locationdata.address.formatted_address;
      this.address1 = this.locationdata.address.address1;
      this.latitude = this.locationdata.latitude;
      this.longitude = this.locationdata.longitude;
      this.place_id = this.locationdata.place_id;
    }

    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      console.log("here");
      this.getSettings();
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          console.log("newData", newData);
          this.getSettings();
        }
      );
    }
  },
  watch: {
    locationdata(newval, oldval) {
      this.location_data = this.locationdata;
    },
    location_data(newVal, oldVal) {
      this.formatted_address = newVal.address.formatted_address;
      this.address1 = newVal.address.address1;
      this.latitude = newVal.latitude;
      this.longitude = newVal.longitude;
      this.place_id = newVal.place_id;

      if (!APIinterface.empty(newVal.attributes)) {
        this.location_name = newVal.attributes.location_name;
        this.delivery_options = newVal.attributes.delivery_options;
        this.delivery_instructions = newVal.attributes.delivery_instructions;
        this.address_label = newVal.attributes.address_label;
      }
    },
    adjust_pin(newval, oldval) {
      if (newval) {
        this.class_map = "maps";
        this.marker = [
          {
            id: 1,
            draggable: true,
            icon: this.maps_config.icon,
            lat: this.location_data.latitude,
            lng: this.location_data.longitude,
          },
        ];
      } else {
        this.$refs.maps.mapBoxResize();
        this.class_map = "maps small";
        this.marker = [
          {
            id: 1,
            draggable: false,
            icon: this.maps_config.icon,
            lat: this.location_data.latitude,
            lng: this.location_data.longitude,
          },
        ];
      }
    },
  },
  methods: {
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (Object.keys(resp).length > 0) {
        this.delivery_options_data = resp.addresss_delivery_option;
        this.address_label_data = resp.address_label;
      }
    },
    beforeShow() {
      this.marker = [
        {
          id: 1,
          draggable: false,
          icon: this.maps_config.icon,
          lat: this.locationdata.latitude,
          lng: this.locationdata.longitude,
        },
      ];
    },
    clearData() {
      this.location_name = "";
      this.delivery_options = "";
      this.delivery_instructions = "";
    },
    afterConfirmlocation(data) {
      this.location_data = data;
      this.dialog = false;
    },
    submit() {
      this.loading = true;
      let params = "formatted_address=" + this.formatted_address;
      params += "&address1=" + this.address1;
      params += "&location_name=" + this.location_name;
      params += "&delivery_options=" + this.delivery_options;
      params += "&delivery_instructions=" + this.delivery_instructions;
      params += "&address_label=" + this.address_label;
      params += "&latitude=" + this.latitude;
      params += "&longitude=" + this.longitude;
      params += "&place_id=" + this.place_id;

      APIinterface.fetchDataByTokenPost("saveClientAddress", params)
        .then((data) => {
          this.DataStorePersisted.local_id = data.details.place_id;
          this.DataStorePersisted.location_data = {
            address: {
              address1: this.address1,
              formatted_address: this.formatted_address,
            },
            latitude: this.latitude,
            longitude: this.longitude,
            place_id: this.place_id,
            attributes: {
              location_name: this.location_name,
              delivery_options: this.delivery_options,
              delivery_instructions: this.delivery_instructions,
              address_label: this.address_label,
            },
          };
          this.$emit("afterSaveaddress");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    afterSelectmap(lat, lng) {
      this.new_lat = lat;
      this.new_lng = lng;
      this.validat_coord = true;
    },
    validateCoordinates() {
      const $params = {
        lat: this.latitude,
        lng: this.longitude,
        new_lat: this.new_lat,
        new_lng: this.new_lng,
      };
      APIinterface.validateCoordinates($params)
        .then((data) => {
          this.adjust_pin = false;
          this.latitude = this.new_lat;
          this.longitude = this.longitude;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
  },
};
</script>
