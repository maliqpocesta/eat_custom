import { defineStore } from 'pinia'
import APIinterface from 'src/api/APIinterface'
import { useDeliveryschedStore } from "stores/DeliverySched";
import { userDataStorePersisted } from "stores/DataStorePersisted";

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    // transaction_data: [],
    // delivery_option: [],
    // services_list: [],
    loading: true,
    enabled_tip : false,
    change_currency : '',
    format_transaction_data : []
  }),
  getters: {
    getTransactionData(state){
      if (Object.keys(state.format_transaction_data).length > 0) {
        return state.format_transaction_data;
      }
      return false;
    },
  },
  actions: {
    TransactionInfoOLD () {
      this.transaction_data = []
      this.delivery_option = []
      this.services_list = []
      const schedStore = useDeliveryschedStore();
      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        local_id: APIinterface.getStorage('local_id'),
        choosen_delivery: [],
        transaction_type : schedStore.transaction_type
      }
      this.loading = true
      APIinterface.TransactionInfo($params)
        .then(data => {
          this.transaction_data = data.details
          this.delivery_option = data.details.delivery_option
          this.services_list = data.details.services_list
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {
          this.loading = false
        })
    },
    getTipSettings(data){
      APIinterface.fetchDataPost('getTipSettings',data)
          .then(data => {
            this.enabled_tip = data.details.enabled_tip
          })
          .catch(error => {
            this.enabled_tip = false
          })
          .then(data => {

          })
    },
    formatTransaction(){
      this.loading = true;
      const DataStorePersisted = userDataStorePersisted();
      let params = {
        transaction_type :DataStorePersisted.transaction_type,
        whento_deliver :DataStorePersisted.whento_deliver,
        delivery_date :DataStorePersisted.delivery_date,
        delivery_time :DataStorePersisted.delivery_time,
        delivery_time_data :DataStorePersisted.delivery_time_data,
      };
      APIinterface.fetchDataPost(
        "formatTransaction",params
      ).then((data) => {
        this.format_transaction_data = data.details;
        if(data.details.time_already_past){
          DataStorePersisted.whento_deliver = 'now';
          DataStorePersisted.delivery_date = '';
          DataStorePersisted.delivery_time = '';
          DataStorePersisted.delivery_time_data = [];
        }
      })
        .catch((error) => {
          this.format_transaction_data = []
        })
        .then((data) => {
          this.loading = false;
        });
    }
  },
})
