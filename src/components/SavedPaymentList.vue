<template>
  <q-list v-if="loading">
    <q-item v-for="i in 3" :key="i">
      <q-item-section avatar><q-skeleton type="QRadio" size="25px" /></q-item-section>
      <q-item-section><q-skeleton type="text"></q-skeleton></q-item-section>
      <q-item-section side><q-skeleton type="QRadio" size="25px" /></q-item-section>
    </q-item>
  </q-list>

  <template v-else>
    <div class="relative-position">
      <q-inner-loading :showing="loading_delete" color="warning"></q-inner-loading>

      <template v-if="!hasData && !loading">
        <div
          class="bg-myyellow text-dark q-pa-sm rounded-borders text-weight-thin font12 text-center"
        >
          {{ $t("You don't have payment saved yet") }}.
        </div>
      </template>

      <template v-if="hasData && !isWalletFullPayment">
        <q-list>
          <template v-for="(items, index) in data" :key="items.payment_code">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <template v-if="items.logo_type === 'icon'">
                  <q-icon color="warning" name="credit_card" />
                </template>
                <template v-else>
                  <q-img
                    :src="items.logo_image"
                    fit="contain"
                    style="height: 30px; max-width: 30px"
                  />
                </template>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <template v-if="items.attr1">
                    <p class="no-margin">{{ items.attr1 }}</p>
                    <p class="no-margin font11 text-grey">{{ items.attr2 }}</p>
                  </template>
                  <template v-else>
                    {{ items.payment_name }}
                  </template>
                </q-item-label>
                <q-item-label
                  v-if="usePartialPayment && items.payment_uuid === default_payment_uuid"
                  caption
                >
                  {{ getPayRemaining }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row inline items-center">
                  <q-icon
                    v-if="items.payment_uuid === default_payment_uuid"
                    name="check"
                    size="sm"
                    color="warning"
                    class="q-mr-md"
                  />
                  <q-fab
                    color="grey-5"
                    icon="more_horiz"
                    unelevated
                    direction="left"
                    padding="2px"
                  >
                    <q-fab-action
                      v-if="items.payment_uuid != default_payment_uuid"
                      color="warning"
                      class="font12"
                      text-color="black"
                      icon="done"
                      :label="$t('Set default')"
                      @click="setDefault(items.payment_uuid)"
                      padding="4px"
                    />
                    <q-fab-action
                      color="negative"
                      class="font12"
                      text-color="white"
                      icon="clear"
                      :label="$t('Delete')"
                      padding="4px"
                      @click="deletePayment(items, index)"
                    />
                  </q-fab>
                </div>
              </q-item-section>
            </q-item>
            <q-separator spaced inset />
          </template>
        </q-list>
      </template>
    </div>
  </template>

  <div>
    <template v-for="items_payment in data" :key="items_payment">
      <template v-if="items_payment.payment_uuid == default_payment_uuid">
        <template v-if="items_payment.attr_required == 1">
          <h5>{{ $t("Change for how much") }}</h5>
          <q-input
            type="number"
            bg-color="mygrey"
            color="warning"
            outlined
            v-model="payment_change"
            :label="$t('Enter amount')"
            :rules="[(val) => (val && val.length > 0) || $t('This field is required')]"
          />
          <p v-if="!validatePaymentChange" class="text-red">
            {{ $t("Change is required") }}
          </p>
          <template v-else>
            <!-- <p v-if="!validatePaymentChangeValue" class="text-danger mt-1">
              Change must not lower than total amount
            </p> -->
          </template>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "SavedPaymentList",
  props: ["wallet_data"],
  data() {
    return {
      loading: true,
      data: [],
      credentials: [],
      default_payment_uuid: "",
      payment_change: 0,
      loading_delete: false,
    };
  },
  mounted() {
    this.SavedPaymentList();
  },
  watch: {
    default_payment_uuid(newval, oldval) {
      this.$emit("setPaymentuuid", newval);
    },
  },
  computed: {
    validatePaymentChange() {
      let $payment_change = parseFloat(this.payment_change);
      if ($payment_change > 0) {
        return true;
      }
      return false;
    },
    validatePaymentChangeValue() {
      //
    },
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    isWalletFullPayment() {
      if (Object.keys(this.wallet_data).length > 0) {
        if (this.wallet_data.use_wallet && this.wallet_data.amount_due_raw <= 0) {
          return true;
        }
      }
      return false;
    },
    usePartialPayment() {
      if (Object.keys(this.wallet_data).length > 0) {
        if (this.wallet_data.use_wallet && this.wallet_data.amount_due_raw > 0) {
          return true;
        }
      }
      return false;
    },
    getPayRemaining() {
      if (Object.keys(this.wallet_data).length > 0) {
        if (this.wallet_data.use_wallet) {
          return this.wallet_data.pay_remaining;
        }
      }
      return false;
    },
  },
  methods: {
    SavedPaymentList() {
      this.loading = true;
      APIinterface.SavedPaymentList(APIinterface.getStorage("cart_uuid"))
        .then((data) => {
          this.data = data.details.data;
          this.credentials = data.details.credentials;
          this.default_payment_uuid = data.details.default_payment_uuid;
          this.$emit("afterLoadpaymentlist", true);
          this.$emit("afterGetpaymentcredentials", this.credentials);
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.data = [];
          this.credentials = [];
          this.default_payment_uuid = "";
          this.$emit("afterLoadpaymentlist", false);
          this.$emit("afterGetpaymentcredentials", []);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    setDefault(paymentUuid) {
      APIinterface.setDefaultPayment(paymentUuid)
        .then((data) => {
          this.default_payment_uuid = paymentUuid;
          this.SavedPaymentList();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
    deletePayment(data, index) {
      this.loading_delete = true;
      const $data = {
        payment_code: data.payment_code,
        payment_uuid: data.payment_uuid,
      };
      APIinterface.deleteSavedPaymentMethod($data)
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
  },
};
</script>
