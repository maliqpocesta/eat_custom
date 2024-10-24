<template>
  <template v-if="label_id === 1">
    <q-item class="text-center">
      <q-item-section>
        <h5 class="text-weight-bold">{{ $t("Enter Location") }}</h5>
        <p class="font12 text-weight-light">
          {{
            $t("Enter your delivery address to see if we delivered to your locations")
          }}.
        </p>
      </q-item-section>
    </q-item>
  </template>
  <template v-else>
    <!-- <h5 class="text-weight-bold">{{ $t("Change address") }}</h5> -->
  </template>

  <div class="m-auto relative-position" :class="class_name">
    <q-select
      v-model="address"
      ref="address"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      @update:model-value="selectAddress"
      @input-value="setModel"
      rounded
      outlined
      hide-dropdown-icon
      :loading="loading_search"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon name="o_place" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.description }}</q-item-label>
            <!-- <q-item-label caption>{{ scope.opt.addressLine2 }}</q-item-label> -->
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:no-option>
        <q-item v-if="!loading_search">
          <q-item-section class="text-grey"> {{ $t("No results") }} </q-item-section>
        </q-item>
      </template>

      <template v-slot:prepend>
        <q-icon name="o_place" />
      </template>
      <template v-slot:append>
        <q-icon name="my_location" @click="locateLocation" class="cursor-pointer" />
      </template>
    </q-select>

    <div v-if="hasError" class="bg-red-2 q-pa-sm radius8 text-dark q-mt-sm">
      {{ error_message }}
    </div>

    <q-inner-loading :showing="loading" />
  </div>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import axios from "axios";
import { api } from "src/boot/axios";

export default {
  name: "SearchLocation",
  props: ["detect_location", "label_id", "class_name"],
  data() {
    return {
      address: "",
      address_data: [],
      options: [],
      data: [],
      loading: false,
      error_message: "",
      loading_search: false,
      old_search: "",
    };
  },
  mounted() {
    this.error_message = "";
    if (this.detect_location === true) {
      this.locateLocation();
    }
    setTimeout(() => {
      this.$refs.address.focus();
    }, 100);
  },
  computed: {
    hasError() {
      if (!APIinterface.empty(this.error_message)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    filterFn(val, update, abort) {
      if (val.length < 2) {
        if (!APIinterface.empty(this.address)) {
          update(() => {});
          return;
        }
        this.old_search = "";
        this.loading_search = false;
        abort();
        return;
      }

      if (this.old_search == val) {
        update(() => {});
      }

      this.error_message = "";
      this.loading_search = true;
      setTimeout(() => {
        update(() => {
          this.options = [];
          APIinterface.getlocationAutocomplete(val)
            .then((data) => {
              this.options = data.details.data;
              this.old_search = val;
            })
            .catch((error) => {
              abort();
            })
            .then((data) => {
              this.loading_search = false;
            });
        });
      }, 300);
    },
    setModel(val) {
      this.address = val;
    },
    selectAddress(val) {
      this.address_data = val;
      this.address = val.description;
      APIinterface.getLocationDetails(val.id)
        .then((data) => {
          const results = data.details.data;
          if (!APIinterface.empty(results.latitude)) {
            this.$emit("afterSelectaddress", results);
          }
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
    locateLocation() {
      this.loading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.reverseGeocoding(
              position.coords.latitude,
              position.coords.longitude,
              true
            );
          },
          (error) => {
            this.loading = false;
            if (error.code === error.PERMISSION_DENIED) {
              this.error_message = this.$t("geolocation_permission");
            }
          }
        );
      } else {
        this.loading = false;
        APIinterface.notify(
          "negative",
          this,
          $t("browser_support"),
          "error_outline",
          this.$q
        );
      }
    },
    reverseGeocoding(lat, lng, isEmit) {
      APIinterface.reverseGeocoding(lat, lng)
        .then((data) => {
          this.data = data.details;
          if (data.details.data.address) {
            this.afterGeocoding(this.data);
            if (isEmit) {
              this.$emit("afterSelectaddress", data.details.data);
            }
          }
        })
        .catch((error) => {
          console.debug(error);
        })
        .then((data) => {
          this.loading = false;
          this.$emit("afterGeocodedone");
        });
    },
    afterGeocoding(result) {
      const data = result.data;
      this.address = data.address.formatted_address;
      this.address_data = {
        id: data.place_id,
        provider: result.provider,
        addressLine1: data.address.address1,
        addressLine2: data.address.address2,
        place_type: result.place_type,
        description: data.address.formatted_address,
      };
      this.$emit("afterGeocode", data);
    },
  },
};
</script>
