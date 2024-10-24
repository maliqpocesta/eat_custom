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
              <q-inner-loading :showing="loading2" color="warning"></q-inner-loading>
              <AddressesSkeleton v-if="loading" />

              <template v-else>
                <q-item>
                  <q-item-section>
                    <h5 class="text-weight-bold">{{ $t("Payments") }}</h5>
                    <p v-if="hasData" class="no-margin font12 text-weight-thin">
                      {{ $t("You can add your payment info here") }}
                    </p>
                    <p v-else class="no-margin font12 text-weight-thin">
                      {{ $t("No payment added, lets change that") }}!
                    </p>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-space class="q-mt-lg" />
                <q-list v-if="hasData">
                  <q-item v-for="items in data" :key="items.payment_uuid">
                    <q-item-section avatar top>
                      <template v-if="items.logo_type === 'image'">
                        <q-avatar>
                          <q-img
                            :src="items.logo_image"
                            spinner-color="white"
                            fit="contain"
                          />
                        </q-avatar>
                      </template>
                      <template v-else>
                        <q-icon name="credit_card" color="warning" size="34px" />
                      </template>
                    </q-item-section>
                    <q-item-section top>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">{{ items.payment_name }}</span>
                        <q-icon
                          v-if="items.payment_uuid === default_payment_uuid"
                          name="check"
                          size="sm"
                          color="warning"
                          class="q-ml-md"
                        />
                      </q-item-label>
                      <q-item-label caption lines="1">
                        {{ items.attr2 }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <!-- <q-btn
                          v-if="items.payment_uuid === default_payment_uuid"
                          color="dark"
                          dense
                          class="radius10 q-pl-sm q-pr-sm"
                          no-caps
                          unelevated
                        >
                          {{ $t("Default") }}
                        </q-btn> -->
                        <q-btn
                          @click="confirmDelete(items.payment_uuid)"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          icon="delete"
                        />

                        <q-btn
                          class="gt-xs"
                          size="12px"
                          flatx
                          dense
                          round
                          icon="done"
                          unelevated
                          @click.stop="setDefault(items.payment_uuid)"
                        />

                        <!-- <q-fab
                          color="grey-5"
                          icon="more_horiz"
                          unelevated
                          direction="left"
                          padding="2px"
                          :disable="
                            items.payment_uuid == default_payment_uuid ? true : false
                          "
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
                        </q-fab> -->
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced />
                </q-list>

                <div v-else>
                  <div class="q-pa-md text-center">
                    <p class="text-grey">{{ $t("You don't have any payment yet") }}</p>
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
                    :label="$t('Add new payment')"
                    size="17px"
                    :dense="$q.screen.lt.sm"
                    :loading="loading2"
                    to="/account/payments/new"
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
  </q-page>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { defineAsyncComponent } from "vue";

export default {
  name: "Payments",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    AddressesSkeleton: defineAsyncComponent(() => import("components/AddressesSkeleton")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      data: [],
      loading: false,
      loading2: false,
      default_payment_uuid: "",
      payment_data: [],
    };
  },
  mounted() {
    this.MyPayments();
  },
  computed: {
    hasData() {
      if (this.data.length > 0) {
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
  methods: {
    MyPayments() {
      this.loading = true;
      /* eslint-disable */
      APIinterface.MyPayments()
        .then((data) => {
          this.default_payment_uuid = data.details.default_payment_uuid;
          this.data = data.details.data;
        })
        .catch((error) => {
          this.data = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
    confirmDelete(paymentUiid) {
      this.$q
        .dialog({
          title: this.$t("Confirm Deletion"),
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
          this.deletePayment(paymentUiid);
        });
    },
    deletePayment(paymentUiid) {
      this.loading2 = true;
      APIinterface.deletePayment(paymentUiid)
        .then((data) => {
          this.MyPayments();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading2 = false;
        });
    },
    setDefault(paymentUuid) {
      this.loading2 = true;
      APIinterface.setDefaultPayment(paymentUuid)
        .then((data) => {
          this.default_payment_uuid = paymentUuid;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading2 = false;
        });
    },
  },
};
</script>

<style lang="sass"></style>
