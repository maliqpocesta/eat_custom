<template>
  <q-dialog
    v-model="show_modal"
    persistent
    @before-show="cancelOrderStatus"
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <h5
          class="text-weight-bold no-margin"
          v-if="cancel_response.refund_status === 'full_refund'"
        >
          {{ $t("Are you sure") }}?
        </h5>
        <h5 class="text-weight-bold no-margin" v-else>
          {{ $t("How would you like to proceed") }}?
        </h5>

        <div class="q-mt-md">
          <p class="font12 text-weight-light">{{ cancel_msg }}</p>
        </div>

        <div class="q-mt-md q-mb-sm" v-if="cancel_response.refund_msg">
          <p class="font12 text-weight-light">{{ cancel_response.refund_msg }}</p>
        </div>
      </q-card-section>

      <q-card-actions class="q-mb-md">
        <div class="row full-width q-col-gutter-md items-center">
          <div class="col">
            <q-btn
              unelevated
              rounded
              color="negative"
              text-color="white"
              no-caps
              class="full-width"
              v-close-popup
              size="17px"
            >
              {{ $t("Don't Cancel") }}
            </q-btn>
          </div>
          <div class="col">
            <q-btn
              unelevated
              rounded
              color="warning"
              text-color="black"
              no-caps
              class="full-width"
              :disable="!cancel_status"
              :loading="loading"
              @click="applyCancelOrder"
              size="17px"
            >
              {{ $t("Cancel order") }}
            </q-btn>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "CancelOrder",
  data() {
    return {
      loading: false,
      show_modal: false,
      order_uuid: "",
      cancel_status: false,
      cancel_msg: "",
      cancel_response: [],
    };
  },
  methods: {
    showModal(orderUuid) {
      this.order_uuid = orderUuid;
      this.show_modal = true;
    },
    cancelOrderStatus() {
      this.loading = true;
      APIinterface.cancelOrderStatus(this.order_uuid)
        .then((data) => {
          this.cancel_status = data.details.cancel_status;
          this.cancel_msg = data.details.cancel_msg;
          this.cancel_response = data.details;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    applyCancelOrder() {
      this.loading = true;
      APIinterface.applyCancelOrder(this.order_uuid)
        .then((data) => {
          this.show_modal = false;
          APIinterface.notify("positive", data.msg, "check_circle", this.$q);
          this.$emit("afterCancelorder");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "warning", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
