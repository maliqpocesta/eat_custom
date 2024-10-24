<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-toolbar>
        <q-toolbar-title
          ><span class="text-weight-bold"
            >{{ $t("what_your_address") }}?</span
          ></q-toolbar-title
        >
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <p>{{ $t("well_check_area") }}</p>

        <div class="text-right">
          <q-btn
            unelevated
            rounded
            color="warning"
            text-color="black"
            no-caps
            size="17px"
            to="/location"
          >
            {{ $t("Add an address") }}
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "AddressNeededModal",
  data() {
    return {
      modal: false,
    };
  },
};
</script>
