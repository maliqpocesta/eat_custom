<template>
  <q-dialog
    persistent
    v-model="dialog"
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
    @before-show="getAllergens"
  >
    <q-card :class="{ 'card-medium-width': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("More product information") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-inner-loading :showing="loading" color="warning"></q-inner-loading>
        <div class="text-h5 text-weight-bold">
          {{ $t("Allergens") }}
        </div>

        <template v-if="hasData">
          <q-list dense>
            <template v-for="items in allergen" :key="items">
              <q-item v-if="allergen_data[items]">
                <q-item-section>
                  <q-item-label>
                    {{ allergen_data[items] }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "AllergensDetails",
  props: ["merchant_id", "allergens_item_id"],
  data() {
    return {
      dialog: false,
      loading: false,
      allergen: [],
      allergen_data: [],
    };
  },
  computed: {
    hasData() {
      if (Object.keys(this.allergen).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    clearData() {
      this.allergen = [];
      this.allergen_data = [];
    },
    getAllergens() {
      this.clearData();
      this.loading = true;
      APIinterface.fetchDataPost(
        "getAllergenInfo",
        "item_id=" + this.allergens_item_id + "&merchant_id=" + this.merchant_id
      )
        .then((data) => {
          this.allergen = data.details.allergen;
          this.allergen_data = data.details.allergen_data;
        })
        .catch((error) => {})
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
