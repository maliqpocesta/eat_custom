<template>
  <q-dialog
    v-model="show_modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
    :full-width="this.$q.screen.gt.sm ? false : true"
  >
    <q-card class="q-pa-md" style="width: 500px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none no-margin no-padding">
        <div class="text-h5 text-weight-bold">{{ title }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <template v-if="loading_get">
          <q-inner-loading :showing="true" color="warning"></q-inner-loading>
        </template>
        <template v-else>
          <template v-if="hasData">
            <div class="row q-gutter-none addon-carousel q-col-gutter-sm">
              <div
                v-for="items in getData"
                :key="items"
                class="col-lg-3 col-md-3 col-sm-6 col-xs-4 text-center"
              >
                <q-radio v-model="payment_id" :val="items.id" label="">
                  <q-avatar size="50px" square class="col self-center">
                    <q-img
                      fit="contain"
                      :src="items.url_image"
                      class="no-margin"
                      height="50px"
                      loading="lazy"
                      placeholder-src="placeholder.png"
                      spinner-color="secondary"
                      spinner-size="sm"
                    />
                  </q-avatar>
                </q-radio>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-center">
              <p class="text-grey">{{ $t("No available data") }}</p>
            </div>
          </template>
        </template>
      </q-card-section>

      <q-separator spaced />
      <q-card-actions>
        <q-btn
          unelevated
          roundedx
          color="warning"
          text-color="black"
          no-caps
          class="full-width q-mb-md"
          :label="label.submit"
          size="17px"
          :loading="loading"
          :disable="hasSelected"
          @click="onSubmit()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "PaydeliveryComponents",
  props: ["title", "label", "payment_code", "payment_credentials"],
  data() {
    return {
      show_modal: false,
      data: [],
      loading: false,
      payment_id: "",
      loading_get: true,
    };
  },
  computed: {
    getData() {
      return this.data;
    },
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    hasSelected() {
      if (this.payment_id > 0) {
        return false;
      }
      return true;
    },
  },
  methods: {
    showPaymentForm() {
      this.show_modal = true;
      this.getPaydelivery();
    },
    close() {
      this.show_modal = false;
    },
    onSubmit() {
      this.loading = true;
      let merchant_id = this.payment_credentials[this.payment_code]
        ? this.payment_credentials[this.payment_code].merchant_id
        : "";

      APIinterface.fetchDataByTokenPost(
        "savedPaydelivery",
        "payment_id=" + this.payment_id + "&payment_code=" + this.payment_code +"&merchant_id="+merchant_id
      )
        .then((data) => {
          this.close();
          this.$emit("afterAddpayment");
        })
        .catch((error) => {
          APIinterface.notify("dark", error, "error", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    getPaydelivery() {
      this.loading_get = true;
      APIinterface.fetchDataPost("getPaydelivery")
        .then((data) => {
          this.data = data.details.data;
        })
        .catch((error) => {})
        .then((data) => {
          this.loading_get = false;
        });
    },
  },
};
</script>
