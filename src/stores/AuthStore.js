import { defineStore } from 'pinia';
import { api } from 'boot/axios'
import auth from 'src/api/auth';


export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    loading: false,
    data: null,
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    async validateToken () {
      try {
        this.loading = true;
        const response = await api.get('/verifytoken?token='+auth.getToken());
        this.data = response.data;
        return this.data;
      } catch (error) {
         console.error('Error fetching data:', error);
      } finally {
         this.loading = false;
      }
    }
  }
})
