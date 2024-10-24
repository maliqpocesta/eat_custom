<template>
  <q-dialog
    v-model="show_modal"
    persistent
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
    :full-width="this.$q.screen.gt.sm ? false : true"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("Enter Promo Code") }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onApplyPromocode">
          <div class="row q-mt-sm q-col-gutter-md">
            <div class="col-8">
              <q-input
                dense
                bg-color="mygrey"
                color="warning"
                outlined
                v-model="promo_code"
                :rules="[
                  (val) => (val && val.length > 0) || $t('Please enter promo code'),
                ]"
              />
            </div>
            <div class="col-4">
              <q-btn
                type="submit"
                unelevated
                dense
                rounded
                color="warning"
                text-color="black"
                no-caps
                class="full-width"
                :label="$t('Apply')"
                size="17px"
                :loading="loading_apply"
              >
              </q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-list v-for="items in data" :key="items.promo_id" class="q-mb-sm" bordered>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ items.title }}</q-item-label>
              <q-item-label caption>
                {{ items.sub_title }}
              </q-item-label>
              <q-item-label caption>
                {{ items.valid_to }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <template v-if="promo_selected.promo_id === items.promo_id">
                <q-btn
                  flat
                  @click="removePromo(items)"
                  :loading="loading"
                  color="negative"
                  no-caps
                  >{{ $t("Remove") }}</q-btn
                >
              </template>
              <template v-else>
                <q-btn
                  flat
                  @click="usePromo(items)"
                  :loading="loading"
                  color="warning"
                  no-caps
                  >{{ $t("Use now") }}</q-btn
                >
              </template>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useDeliveryschedStore } from "stores/DeliverySched";

export default {
  name: "PromotionsModal",
  props: ["cart_loaded", "cart_updated"],
  data() {
    return {
      show_modal: false,
      data: [],
      promo_selected: [],
      loading: false,
      loading_apply: false,
      promo_code: "",
    };
  },
  setup(props) {
    const DataStorePersisted = userDataStorePersisted();
    const DeliveryschedStore = useDeliveryschedStore();
    return { DataStorePersisted, DeliveryschedStore };
  },
  watch: {
    cart_loaded(newval, oldval) {
      if (newval == false) {
        this.loadPromo(false);
      }
    },
    cart_updated(newval, oldval) {
      if (newval == false) {
        this.loadPromo(true);
      }
    },
  },
  methods: {
    loadPromo(isRefresh) {
      this.$emit("beforeLoadpromo");
      APIinterface.fetchDataPost(
        "loadPromo",
        "cart_uuid=" +
          APIinterface.getStorage("cart_uuid") +
          "&currency_code=" +
          this.DataStorePersisted.getUseCurrency()
      )
        .then((data) => {
          this.data = data.details.data;
          this.promo_selected = data.details.promo_selected;
          this.$emit("aftergetPromo", {
            count: data.details.count,
            promo_selected: data.details.promo_selected,
          });
        })
        .catch((error) => {
          this.$emit("clearPromo");
        })
        .then((data) => {
          this.$emit("afterLoadpromo");
        });
    },
    usePromo(data) {
      this.loading = true;
      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        promo_id: data.promo_id,
        promo_type: data.promo_type,
        currency_code: this.DataStorePersisted.getUseCurrency(),
        transaction_type: this.DeliveryschedStore.transaction_type,
      };
      APIinterface.applyPromo($params)
        .then((data) => {
          this.show_modal = false;
          this.loadPromo();
          this.$emit("afterApplypromo");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    removePromo(data) {
      this.loading = true;
      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        promo_id: data.promo_id,
        promo_type: data.promo_type,
        transaction_type: this.DeliveryschedStore.transaction_type,
      };
      APIinterface.removePromo($params)
        .then((data) => {
          this.show_modal = false;
          this.promo_selected = [];
          this.loadPromo();
          this.$emit("afterRemovepromo");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    onApplyPromocode() {
      this.loading_apply = true;
      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        promo_code: this.promo_code,
        currency_code: this.DataStorePersisted.getUseCurrency(),
        transaction_type: this.DeliveryschedStore.transaction_type,
      };
      APIinterface.applyPromoCode($params)
        .then((data) => {
          this.show_modal = false;
          this.promo_code = "";
          this.loadPromo();
          this.$emit("afterApplypromo");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_apply = false;
        });
    },
  },
};
</script>
