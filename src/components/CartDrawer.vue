<template>
  <section class="cart">
    <!-- components transaction info -->
    <TransactionInfo
      class="q-mb-md"
      ref="transaction_info"
      :show_address="true"
      @change-transaction="changeTransaction"
    />

    <CartDetails
      ref="cart_details"
      :sticky_checkout="true"
      :page="page"
      :payload="['items', 'subtotal', 'distance_local', 'items_count', 'merchant_info']"
      @set-cartcount="setCartcount"
      @set-merchantinfo="setMerchantinfo"
    />

    <!-- components transaction info -->
  </section>

  <DeliveryDetails
    ref="delivery_details"
    @show-deliverysched="showDeliverysched"
    @after-chooseaddress="afterChooseaddress"
  />

  <DeliverySched ref="delivery_sched" @after-savetrans="afterSavetrans" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { useDeliveryschedStore } from "stores/DeliverySched";
import { usestoreAvailable } from "stores/storeAvailable";

export default {
  name: "CartDrawer",
  props: ["page"],
  components: {
    TransactionInfo: defineAsyncComponent(() => import("components/TransactionInfo")),
    DeliveryDetails: defineAsyncComponent(() => import("components/DeliveryDetails")),
    DeliverySched: defineAsyncComponent(() => import("components/DeliverySched")),
    CartDetails: defineAsyncComponent(() => import("components/CartDetails")),
  },
  setup() {
    const deliveryschedStore = useDeliveryschedStore();
    const ifstoreAvailable = usestoreAvailable();
    return { deliveryschedStore, ifstoreAvailable };
  },
  data() {
    return {
      merchant_info: [],
    };
  },
  watch: {
    ifstoreAvailable: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.after_addtocart) {
          this.$refs.cart_details.getCart(false);
          this.ifstoreAvailable.after_addtocart = false;
        }
      },
    },
  },
  methods: {
    changeTransaction() {
      this.$refs.delivery_details.show_modal = true;
    },
    showDeliverysched() {
      this.$refs.delivery_details.show_modal = false;
      this.$refs.delivery_sched.show_modal = true;
    },
    afterSavetrans() {
      this.refreshCart();
      this.ifstoreAvailable.checkStoreOpen();
    },
    refreshCart() {
      this.$refs.cart_details.getCart(true);
    },
    setCartcount(data) {
      this.$emit("setCartcount", data);
    },
    setMerchantinfo(data) {
      this.merchant_info = data;
    },
    afterChooseaddress() {
      console.log("afterChooseaddress");
      this.$refs.cart_details.getCart(true);
      this.ifstoreAvailable.checkStoreOpen();
    },
  },
};
</script>
