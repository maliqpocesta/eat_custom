<template>
  <template v-if="loading">
    <q-list v-for="items in 2" :key="items">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>
        <q-item-section top>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row q-col-gutter-sm">
            <div class="col"><q-skeleton type="QRadio" /></div>
            <div class="col"><q-skeleton type="QRadio" /></div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </template>

  <template v-else>
    <template v-if="!hasData">
      <div class="text-grey text-center">
        {{ $t("You haven't saved any addresses yet") }}.
      </div>
    </template>
    <template v-else>
      <q-list>
        <template v-for="items in data" :key="items.address_uuid">
          <q-item clickable v-ripple @click.stop="setPlaceID(items)">
            <q-item-section avatar>
              <q-icon name="o_place" color="yellow-9" size="24px" />
            </q-item-section>
            <q-item-section top>
              <q-item-label v-if="items.address.address1">{{
                items.address.address1
              }}</q-item-label>
              <q-item-label v-else>{{ items.address.address2 }}</q-item-label>
              <q-item-label caption>{{ items.address.formatted_address }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="enabled_search">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  @click.stop="$emit('fillAddress', items)"
                  class="gt-xs"
                  size="12px"
                  flat
                  dense
                  round
                  icon="edit"
                  color="warning"
                />

                <q-btn
                  @click.stop="deleteAddress(items.address_uuid)"
                  class="gt-xs"
                  size="12px"
                  :disable="place_id == items.place_id ? true : false"
                  flat
                  dense
                  round
                  icon="clear"
                  color="red"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-separator />
        </template>
      </q-list>
    </template>
  </template>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";

export default {
  name: "AddressQuickList",
  props: ["enabled_search"],
  data() {
    return {
      data: [],
      loading: false,
      place_id: APIinterface.getStorage("local_id"),
    };
  },
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    return { DataStorePersisted };
  },
  mounted() {
    this.data = [];
    this.clientAddresses();
  },
  computed: {
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    clientAddresses() {
      this.loading = true;
      APIinterface.clientAddresses()
        .then((data) => {
          this.data = data.details.addresses;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    deleteAddress(addressUuid) {
      APIinterface.deleteAddress(addressUuid)
        .then((data) => {
          this.clientAddresses();
          this.$emit("afterDeleteaddress");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
    setPlaceID(data) {
      console.log("setPlaceID", data);
      this.DataStorePersisted.local_id = data.place_id;
      this.DataStorePersisted.location_data = data;
      this.$emit("afterSetplaceid", data);
    },
  },
};
</script>
