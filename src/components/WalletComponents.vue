<template>
  <div class="relative-position">
    <q-list>
      <q-item tag="label">
        <q-item-section avatar top>
          <q-icon color="yellow-9" name="o_account_balance_wallet" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <template v-if="loading">
              <q-skeleton type="QBadge" />
            </template>
            <template v-else>
              {{ getData.balance }}
            </template>
          </q-item-label>
          <q-item-label lines="2" caption class="font11">
            {{ $t("Digital Wallet Balance") }}
          </q-item-label>
          <q-item-label caption v-if="message">
            <div class="q-pa-sm bg-grey-2 radius10 text-dark text-weight-thin">
              {{ message }}
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-checkbox
            v-model="use_wallet"
            val="1"
            color="yellow-9"
            :disable="!canUseWallet"
            @update:model-value="applyDigitalWallet"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-inner-loading :showing="loading" color="warning" size="md" />
  </div>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useCartStore } from "stores/Cart";
import { useTransactionStore } from "stores/Transaction";

export default {
  name: "WalletComponents",
  props: ["cart_loaded", "cart_updated"],
  data() {
    return {
      use_wallet: false,
      data: [],
      loading: false,
      message: "",
    };
  },
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    const cartStore = useCartStore();
    const transactionStore = useTransactionStore();
    return { DataStorePersisted, cartStore, transactionStore };
  },
  watch: {
    cart_loaded(newval, oldval) {
      if (newval == false) {
        this.getCartWallet();
      }
    },
    cart_updated(newval, oldval) {
      if (newval == false) {
        this.getCartWallet();
      }
    },
  },
  computed: {
    canUseWallet() {
      if (Object.keys(this.data).length > 0) {
        if (this.data.balance_raw > 0) {
          return true;
        }
      }
      return false;
    },
    getData() {
      return this.data;
    },
  },
  methods: {
    getCartWallet() {
      this.loading = true;
      let amount_to_pay = !APIinterface.empty(this.cartStore.cart_total)
        ? this.cartStore.cart_total.raw
        : null;
      APIinterface.fetchDataByTokenPost(
        "getCartWallet",
        "cart_uuid=" +
          APIinterface.getStorage("cart_uuid") +
          "&currency_code=" +
          this.DataStorePersisted.getUseCurrency() +
          "&amount_to_pay=" +
          amount_to_pay
      )
        .then((data) => {
          this.data = data.details;
          this.use_wallet = data.details.use_wallet;
          if (this.use_wallet) {
            this.$emit("afterApplywallet", data.details.apply_wallet_data);
            if (data.details.apply_wallet_data.amount_due_raw > 0) {
              this.message = data.details.apply_wallet_data.message;
            }
          }
        })
        .catch((error) => {
          this.data = [];
          this.use_wallet = false;
        })
        .then((data) => {
          this.loading = false;
        });
    },
    applyDigitalWallet(data) {
      this.loading = true;
      let use_wallet = data ? 1 : 0;
      let amount_to_pay = !APIinterface.empty(this.cartStore.cart_total)
        ? this.cartStore.cart_total.raw
        : null;
      APIinterface.fetchDataByTokenPost(
        "applyDigitalWallet",
        "cart_uuid=" +
          APIinterface.getStorage("cart_uuid") +
          "&currency_code=" +
          this.DataStorePersisted.getUseCurrency() +
          "&use_wallet=" +
          use_wallet +
          "&amount_to_pay=" +
          amount_to_pay
      )
        .then((data) => {
          if (use_wallet) {
            this.message = data.msg;
          } else {
            this.message = "";
          }
          this.$emit("afterApplywallet", data.details);
        })
        .catch((error) => {
          this.use_wallet = false;
          this.message = "";
          APIinterface.notify("dark", error, "error", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    //
  },
};
</script>
