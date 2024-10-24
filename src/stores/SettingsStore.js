import { defineStore } from 'pinia';
import APIinterface from 'src/api/APIinterface';
import { api } from 'boot/axios'
import { userDataStorePersisted } from "stores/DataStorePersisted";

export const useSettingsStore = defineStore('SettingsStore', {
  state: () => ({
    merchant_uuid : '',
    settings_data : [],
    booking_enabled : false,
    enabled_language : false,
    language_list : [],
    merchant_delivery : false,
    addons_use_checkbox : false,
    base_currency : '',
    booking_status_list : [],
    room_list : [],
    table_list : [],
    points_enabled : false,
    points_use_thresholds :false,
    loyalty_points_activated : false,
    enabled_include_utensils : false,
    multicurrency_enabled : false,
    digitalwallet_enabled : false,
    chat_enabled : false,
    default_services : '',
    services_list : [],
    delivery_option : [],
    delivery_date_list: [],
    delivery_time_list: [],
    loading_gettimes : false,
    loading_settings : false,
  }),

  getters: {
    getBookingFlag (state) {
      return state.booking_enabled;
    }
  },

  actions: {
    getSettings(){
      this.loading_settings = true;
      APIinterface.fetchDataPost('getSettings',)
      .then(data => {
        this.merchant_uuid = data.details.merchant_uuid;
        this.settings_data = data.details;
        this.booking_enabled = data.details.booking_enabled;
        this.enabled_language = data.details.enabled_language;
        this.language_list = data.details.language_list;
        this.merchant_delivery = data.details.merchant_delivery;
        this.addons_use_checkbox = data.details.addons_use_checkbox;
        this.base_currency = data.details.base_currency
        this.booking_status_list = data.details.booking_status_list
        this.room_list = data.details.room_list
        this.table_list = data.details.table_list
        this.points_enabled = data.details.points_enabled;
        this.points_use_thresholds = data.details.points_use_thresholds;
        this.enabled_include_utensils = data.details.enabled_include_utensils;
        this.loyalty_points_activated = data.details.loyalty_points_activated;
        this.multicurrency_enabled = data.details.multicurrency_enabled;
        this.digitalwallet_enabled = data.details.digitalwallet_enabled;
        this.chat_enabled = data.details.chat_enabled;

        this.default_services = data.details.default_services;
        this.services_list = data.details.services_list;
        this.delivery_option = data.details.delivery_option;

        const DataStorePersisted = userDataStorePersisted();
        if(APIinterface.empty(DataStorePersisted.transaction_type)){
          DataStorePersisted.transaction_type = this.default_services;
        }
        if(APIinterface.empty(DataStorePersisted.whento_deliver)){
          DataStorePersisted.whento_deliver = data.details.default_when;
        }

      })
      .catch(error => {
        this.merchant_uuid = '';
        this.enabled_language = false;
        this.booking_enabled = false;
        this.settings_data = [];
        this.language_list  = [];
        this.merchant_delivery = false;
        this.addons_use_checkbox = false;
        this.base_currency = '';
        this.booking_status_list = []
        this.room_list = []
        this.table_list = []
      })
      .then(data => {
        this.loading_settings = false;
      })
    },
    async getAsyncSettings() {
      return new Promise((resolve) => {
        if (Object.keys(this.settings_data).length > 0) {
          resolve(this.settings_data);
        } else {
            setTimeout(() => {
             resolve(this.settings_data);
            }, 1500);
        }
      });
    },
    async getDeliveryTimes () {
      try {
        this.loading_gettimes = true;
        const response = await api.get('/getDeliveryTimes');
        const data = await response.data;
        if(data.code==1){
          if (Object.keys(data.details.opening_date).length > 0) {
            Object.entries(data.details.opening_date).forEach(([key, items]) => {
              this.delivery_date_list.push({ label: items.name, value: items.value })
            })
          }

          const keys = Object.keys(data.details.opening_date);
          const delivery_date = keys[0]
          this.delivery_time_list = data.details.opening_time;
          return delivery_date;
        }
        return false;
      } catch (error) {
         console.error('Error fetching data:', error);
         return false;
      } finally {
         this.loading_gettimes = false;
      }
    },
    SavePlaceByID(place_id){
      APIinterface.fetchDataPost('SavePlaceByID',"place_id="+place_id)
      .then(data => {
      })
      .catch(error => {
      })
      .then(data => {
      })
    }
  }
})
