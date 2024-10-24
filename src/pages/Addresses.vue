<template>
  <q-page padding>
    <StickyBack url="/account/menu" label="Back" v-if="isMobile" />
    <LocationNav v-else />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row">
          <!-- left -->
          <div v-if="!isMobile" class="col-md-4 col-sm-4 col-xs-12">
            <AccountNav></AccountNav>
          </div>
          <!-- left -->

          <!-- right -->
          <div class="col-md-8 col-sm-8 col-xs-12">
            <q-card flat class="fit">
              <q-inner-loading
                :showing="loading_delete"
                color="warning"
              ></q-inner-loading>

              <AddressesSkeleton v-if="loading" />

              <template v-else>
                <q-item>
                  <q-item-section>
                    <h5 class="text-weight-bold q-mb-none">{{ $t("Addresses") }}</h5>
                    <p v-if="hasData" class="no-margin font12 text-weight-thin">
                      {{ $t("Wow, man of many places :)") }}
                    </p>
                    <p v-else class="no-margin font12 text-weight-thin">
                      {{ $t("No address, lets change that") }}!
                    </p>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-space class="q-mt-lg" />

                <q-list v-if="hasData">
                  <q-item
                    v-for="(items, index) in data"
                    :key="items.address_uuid"
                    class="border-bottom"
                    :clickable="isMobile"
                    @click="editAdddress(items)"
                  >
                    <q-item-section top>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">{{
                          items.attributes.address_label
                        }}</span>
                      </q-item-label>
                      <q-item-label caption lines="1">
                        {{ items.address.address1 }}
                      </q-item-label>
                      <q-item-label caption lines="1">
                        {{ items.address.formatted_address }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn
                          @click="confirmdeleteAddress(items, index)"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          icon="delete"
                        />
                        <q-btn
                          @click="editAdddress(items)"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          icon="mode_edit"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-else>
                  <div class="q-pa-md text-center">
                    <p class="text-grey">{{ $t("You don't have any address yet") }}</p>
                  </div>
                </div>

                <div class="q-pa-md">
                  <q-btn
                    unelevated
                    rounded
                    color="warning"
                    text-color="black"
                    no-caps
                    class="full-width"
                    :label="$t('Add new address')"
                    size="17px"
                    :dense="$q.screen.lt.sm"
                    :loading="loading"
                    @click="this.$refs.address_modal.show_modal = true"
                  >
                  </q-btn>
                </div>
              </template>
              <!-- end loading -->
            </q-card>
          </div>
          <!-- right -->
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <AddressModal ref="address_modal" @after-saveaddress="afterSaveaddress" />

    <AddressDetails
      ref="address_details"
      :locationdata="location_data"
      :maps_config="maps_config"
      :is_mobile="isMobile"
      @after-saveaddress="afterSaveaddress"
      @before-delete="confirmdeleteAddress"
    />
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import jwtDecode from "jwt-decode";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "Addresses",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    AddressModal: defineAsyncComponent(() => import("components/AddressModal")),
    AddressDetails: defineAsyncComponent(() => import("components/AddressDetails")),
    AddressesSkeleton: defineAsyncComponent(() => import("components/AddressesSkeleton")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
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

    this.getAddresses();
  },
  computed: {
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    isMobile() {
      if (this.$q.screen.lt.md) {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      data: [],
      loading: true,
      inner_loading: false,
      maps_config: [],
      location_data: [],
      loading_delete: false,
    };
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
    getAddresses() {
      this.loading = true;
      APIinterface.getAddresses()
        .then((data) => {
          this.data = data.details.data;
        })
        .catch((error) => {
          this.data = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
    confirmdeleteAddress(items, index) {
      this.$q
        .dialog({
          title: this.$t("Confirm"),
          message: this.$t("Are you sure you want to continue?"),
          stackButtons: false,
          ok: {
            unelevated: true,
            rounded: true,
            color: "warning",
            "text-color": "black",
            size: "md",
            label: this.$t("Yes"),
            "no-caps": true,
          },
          cancel: {
            unelevated: true,
            rounded: true,
            color: "grey-3",
            "text-color": "black",
            size: "md",
            label: this.$t("Cancel"),
            "no-caps": true,
          },
        })
        .onOk((data) => {
          this.$refs.address_details.show_modal = false;
          this.deleteAddress(items, index);
        });
    },
    deleteAddress(items, index) {
      this.loading_delete = true;
      APIinterface.deleteAddress(items.address_uuid)
        .then((data) => {
          this.data.splice(index, 1);
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_delete = false;
        });
    },
    editAdddress(data) {
      this.location_data = data;
      this.$refs.address_details.show_modal = true;
    },
    afterSaveaddress() {
      this.getAddresses();
    },
  },
};
</script>

<style lang="sass"></style>
