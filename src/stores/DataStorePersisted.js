import { defineStore } from 'pinia';
import APIinterface from 'src/api/APIinterface';
import { useSettingsStore } from "stores/SettingsStore";

export const userDataStorePersisted = defineStore('DataStorePersisted', {
  state: () => ({
    rtl : false,
    use_currency_code: "",
    booking_status_list:[],
    loading : false,
    currency_data :[],
    local_id : '',
    location_data : [],
    delivery_sched : false,
    transaction_type :'',
    whento_deliver :'',
    delivery_date :'',
    delivery_time :'',
    delivery_time_data :'',
    menu_type : 'column'
  }),

  persist: true,

  getters: {
    currencyList (state) {
      return state.currency_data.data;
    },
    getAddress(state){
      if (Object.keys(state.location_data).length > 0) {
        return state.location_data.address;
      }
      return false;
    },
    // getDeliverytime(state){
    //   if (Object.keys(state.delivery_time).length > 0) {
    //     return state.delivery_time;
    //   }
    //   return false;
    // }
  },

  actions: {
    getUseCurrency () {

      const SettingsStore = useSettingsStore();
      if(!SettingsStore.multicurrency_enabled){
        return '';
      }

      if (
        typeof this.use_currency_code === "undefined" ||
        this.use_currency_code === null ||
        this.use_currency_code === "" ||
        this.use_currency_code === "null" ||
        this.use_currency_code === "undefined"
      ) {
        return "";
      } else {
        return this.use_currency_code;
      }
    },
    getCurrencyList(currency_code){
      this.loading = true;
      APIinterface.fetchDataPost('getCurrencyList',"currency_code="+currency_code)
      .then(data => {
        this.currency_data = data.details;
      })
      .catch(error => {
        this.currency_data = []
      })
      .then(data => {
        this.loading = false;
      })
    },
  }
})
