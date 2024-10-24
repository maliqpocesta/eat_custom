<template>
  <q-dialog
    v-model="show_modal"
    persistent
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
    :full-width="this.$q.screen.gt.sm ? false : true"
  >
    <q-card class="q-pa-md" style="width: 500px; min-height: 20vw">
      <q-card-section class="row items-center q-pb-nonex no-margin no-padding">
        <div class="text-h5 text-weight-bold">{{ title }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>
      <q-space class="q-pa-sm"></q-space>
      <template v-if="enabled_search">
        <SearchLocation
          ref="search_location"
          :detect_location="false"
          :label_id="2"
          class_name=""
          @after-selectaddress="afterSelectaddress"
        />
      </template>

      <q-card-section style="max-height: 50vh" class="scroll">
        <AddressQuickList
          @fill-address="fillAddress"
          @after-deleteaddress="afterDeleteaddress"
          @after-setplaceid="afterSetplaceid"
          :enabled_search="enabled_search"
        />
      </q-card-section>

      <q-card-actions v-if="!enabled_search">
        <q-btn flat color="warning" class="fit" size="17px" no-caps @click="newAddress">
          {{ $t("Add new address") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "LocationModal",
  props: ["enabled_search", "title"],
  components: {
    SearchLocation: defineAsyncComponent(() => import("components/SearchLocation")),
    AddressQuickList: defineAsyncComponent(() => import("components/AddressQuickList")),
  },
  data() {
    return {
      show_modal: false,
    };
  },
  methods: {
    afterSelectaddress(data) {
      this.$emit("afterSelectaddress", data);
    },
    fillAddress(data) {
      this.$emit("afterSelectaddress", data);
    },
    afterDeleteaddress() {
      //
    },
    afterSetplaceid(data) {
      this.$emit("afterSetplaceid", data);
      this.show_modal = false;
    },
    newAddress() {
      this.show_modal = false;
      this.$router.push("/location");
    },
  },
};
</script>
