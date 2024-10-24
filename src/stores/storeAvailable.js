import { defineStore } from 'pinia'
import APIinterface from 'src/api/APIinterface'
import { userDataStorePersisted } from "stores/DataStorePersisted";

export const usestoreAvailable = defineStore('storeavailable', {
  state: () => ({
    code: 2,
    messsage: '',
    loading: false,
    loading_status : true,
    merchant_open_status : false,
    merchant_status_msg : '',
    after_addtocart : false,
    default_lang : '',
    ajax_bar_loading: false,
  }),

  actions: {
    storeAvailable () {
      this.loading = true
      APIinterface.storeAvailable('')
        .then(data => {
          this.code = data.code
        })
        .catch(error => {
          this.code = 2
          this.messsage = error
        })
        .then(data => {
          this.loading = false
        })
    },
    checkStoreOpen () {
      this.loading_status = true;
      const DataStorePersisted = userDataStorePersisted();
      let params = {
        whento_deliver : DataStorePersisted.whento_deliver,
        delivery_date :  DataStorePersisted.delivery_date,
        delivery_time :  DataStorePersisted.delivery_time_data,
      };
      APIinterface.fetchDataPost('checkStoreOpen',params)
        .then(data => {
          this.merchant_open_status = true;
          this.merchant_status_msg = data.msg;
        })
        .catch(error => {
          this.merchant_open_status = false;
          this.merchant_status_msg  = error;
        })
        .then(data => {
          this.loading_status = false;
        })
    },
    setLoading(value) {
       this.ajax_bar_loading = value
    },
  }
})
