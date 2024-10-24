import { defineStore } from 'pinia'
import APIinterface from 'src/api/APIinterface';

export const useCartStore = defineStore('cart', {
  state: () => ({
    counter: 0,
    cart_total : [],
    cart_loading : true,
    cart_reloading : false,
  }),
  actions: {
    setCartcount (data) {
      this.counter = data
    },
  }
})
