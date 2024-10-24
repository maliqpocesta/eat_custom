<template>
  <q-card flat class="fit">
    <SearchLocation
      ref="search_location"
      :detect_location="true"
      :label_id="label_id"
      class_name="w-75"
      @after-selectaddress="afterSelectaddress"
      @after-geocode="afterGeocode"
      @after-geocodedone="afterGeocodedone"
    />

    <div class="q-mt-md relative-position">
      <Maps
        ref="maps"
        :lat="maps_config.default_lat"
        :lng="maps_config.default_lng"
        :zoom="maps_config.zoom"
        :keys="maps_config.key"
        class_map="maps"
        :provider="maps_config.provider"
        :drag_marker="true"
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

    <div class="q-pa-md">
      <q-btn
        unelevated
        rounded
        color="warning"
        text-color="black"
        no-caps
        class="full-width q-mb-md"
        :label="$t('Confirm Location')"
        size="17px"
        :loading="loading"
        @click="confirmLocation"
      >
      </q-btn>
    </div>
  </q-card>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import jwtDecode from "jwt-decode";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "NewAddress",
  props: ["label_id"],
  components: {
    SearchLocation: defineAsyncComponent(() => import("components/SearchLocation")),
    Maps: defineAsyncComponent(() => import("components/Maps")),
  },
  data() {
    return {
      // lat: '',
      // lng: '',
      address_data: [],
      maps_config: [],
      marker: [],
      loading: false,
    };
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  async mounted() {
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
  methods: {
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (Object.keys(resp).length > 0) {
        try {
          this.maps_config = jwtDecode(resp.maps_config);
          this.marker = [
            {
              id: 0,
              draggable: true,
              icon: this.maps_config.icon,
              lat: this.maps_config.default_lat,
              lng: this.maps_config.default_lng,
            },
          ];
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      }
    },
    afterSelectaddress(data) {
      this.$emit("afterSelectaddress", data);
      this.address_data = data;
      this.marker = [
        {
          id: 0,
          draggable: true,
          icon: this.maps_config.icon,
          lat: data.latitude,
          lng: data.longitude,
        },
      ];
    },
    afterSelectmap(lat, lng) {
      this.$refs.search_location.error_message = "";
      this.loading = true;
      this.$refs.search_location.reverseGeocoding(lat, lng, false);
    },
    afterGeocodedone() {
      this.loading = false;
    },
    confirmLocation() {
      this.$emit("afterConfirmlocation", this.address_data, this.maps_config);
    },
    afterGeocode(data) {
      this.address_data = data;
    },
  },
};
</script>
