<template>
  <div v-if="is_loading">
    <q-skeleton type="QInput" height="30px" class="w-50" />
  </div>
  <div v-else class="relative-position">
    <q-btn-toggle
      v-model="tips"
      toggle-color="dark"
      color="grey-11"
      text-color="dark"
      no-caps
      rounded
      unelevated
      class="rounded-group2 small text-weight-bold line-1 q-pa-none"
      :options="tips_data"
      @update:model-value="updateTips"
      :dense="$q.screen.lt.sm"
    >
    </q-btn-toggle>
    <q-inner-loading
      :showing="inner_loading"
      label=""
      label-class="text-dark"
      color="warning"
      label-style="font-size: 1.1em"
    />
  </div>

  <q-form @submit="onApplyTips" v-if="tips === 'fixed'">
    <div class="row inline q-mt-md q-col-gutter-sm">
      <div class="">
        <q-input
          dense
          bg-color="mygrey"
          color="warning"
          outlined
          v-model="manual_tip"
          style="max-width: 100px"
        />
      </div>
      <div class="">
        <q-btn
          type="submit"
          unelevated
          dense
          rounded
          color="warning"
          text-color="black"
          no-caps
          class="q-pl-md q-pr-md"
          :label="$t('Add tip')"
          size="17px"
          :loading="loading"
        >
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useTransactionStore } from "stores/Transaction";

export default {
  name: "Tips",
  props: ["cart_loaded", "cart_updated"],
  data() {
    return {
      tips: "",
      tips_data: [],
      manual_tip: 0,
      is_loading: true,
      loading: false,
      inner_loading: false,
    };
  },
  setup(props) {
    const DataStorePersisted = userDataStorePersisted();
    const transactionStore = useTransactionStore();
    return { DataStorePersisted, transactionStore };
  },
  watch: {
    cart_loaded(newval, oldval) {
      if (newval == false) {
        this.loadTips();
      }
    },
    cart_updated(newval, oldval) {
      if (newval == false) {
        this.loadTips();
      }
    },
  },
  methods: {
    loadTips(isRefresh) {
      if (!isRefresh) {
        this.is_loading = true;
      }
      APIinterface.fetchDataPost(
        "loadTips",
        "currency_code=" +
          this.DataStorePersisted.getUseCurrency() +
          "&cart_uuid=" +
          APIinterface.getStorage("cart_uuid")
      )
        .then((data) => {
          this.tips = data.details.tips;
          this.tips_data = data.details.data;
          this.setOther();
        })
        .catch((error) => {
          //
        })
        .then((data) => {
          this.is_loading = false;
        });
    },
    updateTips(val) {
      if (val === "fixed") {
        //
      } else {
        this.checkoutAddTips(val, 2);
      }
    },
    onApplyTips() {
      this.checkoutAddTips(this.manual_tip, 1);
    },
    checkoutAddTips(tip, loaderType) {
      if (loaderType === 1) {
        this.loading = true;
      } else this.inner_loading = true;

      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        value: tip,
        is_manual: loaderType == 1 ? true : false,
      };
      APIinterface.checkoutAddTips($params)
        .then((data) => {
          this.$emit("afterApplytips");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          if (loaderType === 1) {
            this.loading = false;
          } else this.inner_loading = false;
        });
    },
    setOther() {
      if (this.tips > 0) {
        let $found = false;
        this.tips_data.forEach((item, index) => {
          if (this.tips === item.value) {
            $found = true;
          }
        });
        if (!$found) {
          this.manual_tip = this.tips;
          this.tips = "fixed";
        }
      }
    },
  },
};
</script>
