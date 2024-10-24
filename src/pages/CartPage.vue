<template>
  <q-page padding>

     <StickyBack
     url="/menu"
     label="Back"
    />

    <q-card flat>
     <q-card-section>
      <TransactionInfo
      class="q-mb-md"
      ref="transaction_info"
      @after-getinfo="afterGetinfo"
      @change-transaction="changeTransaction"
      />
      <CartDetails
      ref="cart_details"
      :sticky_checkout="true"
      :page="page"
      :payload="['items', 'subtotal', 'distance_local', 'items_count','merchant_info']"
      @set-cartcount="setCartcount"
      @set-merchantinfo="setMerchantinfo"
      />
      </q-card-section>
      <div class="q-pb-xl"></div>
    </q-card>
  </q-page>

   <DeliveryDetails
  ref="delivery_details"
  @show-deliverysched="showDeliverysched"
  :transaction_data="transaction_data"
  :delivery_option="delivery_option"
  :services_list="services_list"
  />

  <DeliverySched
  ref="delivery_sched"
  @after-savetrans="afterSavetrans"
  />

</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'CartPage',
  components: {
    TransactionInfo: defineAsyncComponent(() => import('components/TransactionInfo')),
    CartDetails: defineAsyncComponent(() => import('components/CartDetails')),
    DeliveryDetails: defineAsyncComponent(() => import('components/DeliveryDetails')),
    DeliverySched: defineAsyncComponent(() => import('components/DeliverySched')),
    StickyBack: defineAsyncComponent(() => import('components/StickyBack'))
  },
  data () {
    return {
      transaction_data: [],
      delivery_option: [],
      services_list: [],
      merchant_info: []
    }
  },
  updated () {
    //
  },
  watch: {
    merchant_info (newdata, oldata) {
      //
    }
  },
  methods: {
    changeTransaction () {
      this.$refs.delivery_details.show_modal = true
    },
    showDeliverysched () {
      this.$refs.delivery_details.show_modal = false
      this.$refs.delivery_sched.show_modal = true
    },
    afterSavetrans () {
      this.$refs.transaction_info.TransactionInfo()
    },
    refreshCart () {
      this.$refs.cart_details.getCart(true)
      this.$refs.transaction_info.TransactionInfo()
    },
    setCartcount (data) {
      this.$emit('setCartcount', data)
    },
    afterGetinfo (data) {
      this.transaction_data = data.transaction_data
      this.delivery_option = data.delivery_option
      this.services_list = data.services_list
    },
    setMerchantinfo (data) {
      this.merchant_info = data
    },
    storeAvailable () {
      APIinterface.storeAvailable(this.merchant_info.merchant_uuid)
        .then(data => {
          //
        })
        .catch(error => {
          this.$refs.cart_details.error.push(error)
        })
        .then(data => {

        })
    }
  }
}
</script>
