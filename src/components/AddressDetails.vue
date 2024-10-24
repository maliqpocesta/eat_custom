<template>
  <!-- edit address -->
  <q-dialog
    v-model="show_modal"
    persistent
    @before-show="beforeShow"
    @before-hide="beforeHide"
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("Address details") }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <div
        class="bg-grey-1 relative-position"
        :class="class_map"
        style="overflow: hidden"
      >
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

      <!-- ADJUST PIN -->
      <template v-if="adjust_pin">
        <q-separator spaced />
        <q-card-actions>
          <div class="row full-width q-col-gutter-sm">
            <div class="col">
              <q-btn
                unelevated
                roundedx
                outline
                text-color="black"
                no-caps
                class="full-width"
                :label="$t('Cancel')"
                size="17px"
                v-close-popup
                @click="adjust_pin = !adjust_pin"
              >
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                unelevated
                roundedx
                color="warning"
                text-color="black"
                no-caps
                class="full-width q-mb-md"
                :label="$t('Save')"
                size="17px"
                :disabled="!validat_coord"
                @click="validateCoordinates"
              >
              </q-btn>
            </div>
          </div>
        </q-card-actions>
      </template>

      <!-- FORM -->
      <template v-else>
        <q-card-section class="scroll default-height1">
          <div class="row full-width q-mt-md">
            <div class="col">
              <div class="text-h6 line-normal">{{ formatted_address }}</div>
              <div class="text-caption">{{ address1 }}</div>
            </div>
            <div class="col-3 text-right">
              <q-btn
                @click="adjust_pin = !adjust_pin"
                color="dark"
                unelevated
                :label="$t('Adjust pin')"
                no-caps
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

        <q-separator spaced />
        <q-card-actions>
          <div class="row full-width q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-6">
              <q-btn
                v-if="this.$q.screen.lt.md"
                unelevated
                color="negative"
                text-color="white"
                no-caps
                class="full-width"
                :label="$t('Delete')"
                size="17px"
                @click="$emit('before-delete', locationdata.address_uuid)"
              />

              <q-btn
                v-else
                unelevated
                outline
                text-color="black"
                no-caps
                class="full-width"
                :label="$t('Cancel')"
                size="17px"
                v-close-popup
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6">
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
            </div>
          </div>
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
  <!-- edit address -->
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";

export default {
  name: "AddressDetails",
  props: ["locationdata", "maps_config"],
  components: {
    Maps: defineAsyncComponent(() => import("components/Maps")),
  },
  data() {
    return {
      show_modal: this.show,
      loading: false,
      location_data: this.locationdata,
      formatted_address: "",
      address1: "",
      location_name: "",
      delivery_options: this.$t("Leave it at my door"),
      delivery_instructions: "",
      address_label: "Home",
      attributes: [],
      delivery_options_data: [],
      address_label_data: [],
      formatted_address: "",
      adjust_pin: false,
      class_map: "maps small",
      marker: [],
      validat_coord: false,
      new_lat: "",
      new_lng: "",
      latitude: "",
      longitude: "",
      place_id: "",
    };
  },
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    return { DataStorePersisted };
  },
  mounted() {
    this.addressAtttibues();
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
    beforeHide() {
      this.adjust_pin = false;
      this.clearData();
    },
    clearData() {
      this.location_name = "";
      this.delivery_options = "";
      this.delivery_instructions = "";
    },
    addressAtttibues() {
      APIinterface.addressAtttibues()
        .then((data) => {
          this.attributes = data.details;

          if (Object.keys(data.details.delivery_option).length > 0) {
            Object.entries(data.details.delivery_option).forEach(([key, items]) => {
              this.delivery_options_data.push({ label: items, value: key });
            });
          }

          if (Object.keys(data.details.address_label).length > 0) {
            Object.entries(data.details.address_label).forEach(([key, items]) => {
              this.address_label_data.push({ label: items, value: key });
            });
          }
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
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
          this.show_modal = false;
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
        // lat: this.location_data.latitude,
        // lng: this.location_data.longitude,
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
          // this.location_data.latitude = this.new_lat;
          // this.location_data.longitude = this.new_lng;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
  },
};
</script>
