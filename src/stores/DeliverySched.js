import { defineStore } from 'pinia'
import APIinterface from 'src/api/APIinterface'

let $openingHours = []
let $openingDates = []

export const useDeliveryschedStore = defineStore('deliverysched', {
  state: () => ({
    loading: false,
    transaction_type: '',
    transaction_list: [],
    delivery_options: [],
    trans_data: [],
    delivery_date_list: [],
    delivery_time_list: [],
    delivery_date: '',
    delivery_time: ''
  }),

  persist: true,

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    getDeliverySched (cartUuid) {
      this.transaction_list = [];
      this.delivery_options = [];
      let transaction_type = this.transaction_type || null;
      APIinterface.fetchDataPost("getDeliveryDetails","cart_uuid="+cartUuid+"&transaction_type="+transaction_type)
        .then(data => {
          this.transaction_type = data.details.transaction_type
          if (Object.keys(data.details.data).length > 0) {
            Object.entries(data.details.data).forEach(([key, items]) => {
              this.transaction_list.push({ label: items.service_name, value: items.service_code })
            })
          }

          if (Object.keys(data.details.delivery_option).length > 0) {
            Object.entries(data.details.delivery_option).forEach(([key, items]) => {
              this.delivery_options.push({ label: items.name, value: items.value })
            })
          }

          this.trans_data = {
            delivery_date: data.details.delivery_date,
            delivery_time: data.details.delivery_time,
            whento_deliver: data.details.whento_deliver
          }

          //
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {

        })
    },
    clearData () {
      this.delivery_date_list = []
      this.delivery_time_list = []
    },
    getDeliveryTimes () {
      this.clearData()
      this.loading = true
      APIinterface.getDeliveryTimes(APIinterface.getStorage('cart_uuid'))
        .then(data => {
          if (Object.keys(data.details.opening_hours).length > 0) {
            Object.entries(data.details.opening_hours.dates).forEach(([key, items]) => {
              this.delivery_date_list.push({ label: items.name, value: items.value })
            })
          }

          $openingDates = data.details.opening_hours.dates
          $openingHours = data.details.opening_hours.time_ranges

          const keys = Object.keys($openingDates)
          this.delivery_date = keys[0]

          this.getTimeList(this.delivery_date)
          if (!APIinterface.empty($openingHours[this.delivery_date])) {
            const keystime = $openingHours[this.delivery_date][0]
            this.delivery_time = {
              label: keystime.pretty_time,
              value: keystime.end_time,
              start_time: keystime.start_time,
              end_time: keystime.end_time,
              pretty_time: keystime.pretty_time
            }
          }

          if (!APIinterface.empty(this.trans_data.delivery_date)) {
            this.delivery_date = this.trans_data.delivery_date
            const temptime = JSON.parse(this.trans_data.delivery_time)
            if (Object.keys(temptime).length > 0) {
              this.delivery_time = temptime
            }
          }

        //
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {
          this.loading = false
        })
    },
    getTimeList (dateSelected) {
      if (!APIinterface.empty($openingHours[dateSelected])) {
        Object.entries($openingHours[dateSelected]).forEach(([key, items]) => {
          this.delivery_time_list.push({
            label: items.pretty_time,
            value: items.end_time,
            start_time: items.start_time,
            end_time: items.end_time,
            pretty_time: items.pretty_time
          })
        })
      }
    }
  }
})
