import { api } from 'boot/axios'
import { LocalStorage } from "quasar";
import jwtDecode from 'jwt-decode'

const auth = {

  authenticated () {
    if (this.getToken()) {
      return true
    }
    return false
  },

  setUser (user) {
    LocalStorage.set('customer_identity', user)
  },

  getUser () {
    if (LocalStorage.has('customer_identity')) {
      const $data = LocalStorage.getItem('customer_identity')
      if (!this.empty($data)) {
        if (Object.keys($data).length > 0) {
          try {
            return jwtDecode($data)
          } catch (err) {
            return false
          }
        }
      }
    }
    return false
  },

  setToken (token) {
    LocalStorage.set('customer_token', token)
  },

  getToken () {
    if (LocalStorage.has('customer_token')) {
      const $data = LocalStorage.getItem('customer_token')
      if (!this.empty($data)) {
        return $data
      }
    }
    return false
  },

  logout () {
    LocalStorage.remove('customer_token')
    LocalStorage.remove('customer_identity')
  },

  empty (data) {
    if (typeof data === 'undefined' || data === null || data === '' || data === 'null' || data === 'undefined') {
      return true
    }
    return false
  },

  async authenticate () {
    return api.post('/authenticate', 'token=' + this.getToken())
      .then(result => {
        if (result.data.code === 1) {
          return result.data
        } else {
          throw result.data.msg
        }
      })
      .catch(error => {
        throw error
      })
  }

}
export default auth
