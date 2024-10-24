import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import auth from 'src/api/auth'
import config from 'src/api/config'

const APIinterface = {

  setStorage (key, value) {
    try {
      LocalStorage.set(key, value)
    } catch (e) {
      console.debug(e)
    }
  },
  getStorage (key) {
    return LocalStorage.getItem(key)
  },
  notify (color, message, icon, $q) {
    $q.notify({
      message: message,
      color: color,
      icon: icon,
      position: 'bottom-right',
      html: true,
      timeout: 6000,
      multiLine: true,
      actions: [
        {
          label: 'Dismiss',
          noCaps: true,
          color: 'white',
          handler: () => {
          /* ... */
          }
        }
      ]
    })
  },

  showLoadingBox (message, $q) {
    $q.loading.show({
      message: message,
      boxClass: 'bg-white text-dark',
      spinnerColor: 'grey-4',
      spinnerSize: '55',
      html: true
    })
  },

  getLocalID () {
    const errorMessage = { code: 2, message: 'Local id not found' }
    const localId = APIinterface.getStorage('local_id')
    if (!APIinterface.empty(localId)) {
      return localId
    }
    throw errorMessage
  },

  hideLoadingBox ($q) {
    $q.loading.hide()
  },

  empty (data) {
    if (typeof data === 'undefined' || data === null || data === '' || data === 'null' || data === 'undefined') {
      return true
    }
    return false
  },

  inArray (needle, haystack) {
    const length = haystack.length
    for (let i = 0; i < length; i++) {
      if (haystack[i] === needle) return true
    }
    return false
  },

  async ItemFeatured (meta,currency_code) {
    return api.get('/itemfeatured/?meta='+meta+"&currency_code="+currency_code)
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
  },

  async getBanner (rows) {
    return api.get('/getBanner')
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
  },

  async getFooter () {
    return api.post('/getFooter')
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
  },

  async Category (rows) {
    return api.get('/category/?rows=' + rows)
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
  },

  async MenuCategory () {
    return api.get('/MenuCategory')
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
  },

  async geStoreMenu (currency_code) {
    return api.post('/geStoreMenu','currency_code='+currency_code)
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
  },

  async getMenuItem (catId, itemUuid, currency_code) {
    if (auth.authenticated()) {
      return api.post('/getMenuItem2', 'cat_id=' + catId + '&item_uuid=' + itemUuid +"&currency_code="+currency_code, {
        headers: {
          Authorization: `token ${auth.getToken()}`
        }
      }).then(result => {
        if (result.data.code === 1) {
          return result.data
        } else {
          throw result.data.msg
        }
      })
        .catch(error => {
          throw error
        })
    } else {
      return api.post('/getMenuItem', 'cat_id=' + catId + '&item_uuid=' + itemUuid +"&currency_code="+currency_code)
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
  },

  async getReview (page, rows) {
    return api.post('/getReview', 'page=' + page + '&rows=' + rows)
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
  },

  async SimilarItems (currency_code) {
    return api.get('/SimilarItems/?currency_code='+currency_code)
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
  },

  async AddToCart (data) {
    return api.post('/addCartItems', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getCart (data, ischeckout) {
    const $method = ischeckout === true ? 'getCart' : 'getCartCheckout'
    let $headers = {
      'Content-Type': 'application/json'
    }
    if ($method === 'getCartCheckout') {
      $headers = {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }
    return api.post('/' + $method, data, {
      headers: $headers
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async clearCart (cartUuid) {
    return api.post('/clearCart', 'cart_uuid=' + cartUuid)
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
  },

  async removeCartItem (cartUuid, Row) {
    return api.post('/removeCartItem', 'cart_uuid=' + cartUuid + '&row=' + Row)
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
  },

  async updateCartItems (cartUuid, cartRow, itemQty) {
    return api.post('/updateCartItems', 'cart_uuid=' + cartUuid + '&cart_row=' + cartRow + '&item_qty=' + itemQty)
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
  },

  async getlocationAutocomplete (q) {
    return api.post('/getlocationAutocomplete', 'q=' + q)
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
  },

  async reverseGeocoding (lat, lng) {
    return api.post('/reverseGeocoding', 'lat=' + lat + '&lng=' + lng)
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
  },

  async getLocationDetails (id) {
    return api.post('/getLocationDetails', 'place_id=' + id)
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
  },

  async getDeliveryDetails (cartUuid) {
    return api.post('/getDeliveryDetails', 'cart_uuid=' + cartUuid)
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
  },
  async getDeliveryTimes (cartUuid) {
    return api.post('/getDeliveryTimes', 'cart_uuid=' + cartUuid)
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
  },

  async saveTransactionInfo (data) {
    return api.post('/saveTransactionInfo', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async TransactionInfo (data) {
    return api.post('/TransactionInfo', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async userLogin (data) {
    return api.post('/userLogin', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async addressAtttibues () {
    return api.get('/addressAtttibues')
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
  },
  async saveClientAddress (data) {
    return api.post('/saveClientAddress', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${auth.getToken()}`
        // Authorization: auth.getToken()
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async clientAddresses (data) {
    return api.post('/clientAddresses', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async deleteAddress (addressUuid) {
    return api.post('/deleteAddress', 'address_uuid=' + addressUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async validateCoordinates (data) {
    return api.post('/validateCoordinates', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async checkoutAddress (placeid) {
    return api.post('/checkoutAddress', 'place_id=' + placeid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getPhone (cartUuid) {
    return api.post('/getPhone', 'cart_uuid=' + cartUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async RequestEmailCode (cartUuid) {
    return api.post('/RequestEmailCode', '', {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },
  async verifyCode (code) {
    return api.post('/verifyCode', 'code=' + code, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async ChangePhone (data) {
    return api.post('/ChangePhone', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async loadPromo (cartUuid) {
    return api.post('/loadPromo', 'cart_uuid=' + cartUuid)
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
  },

  async applyPromo (data) {
    return api.post('/applyPromo', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },
  async removePromo (data) {
    return api.post('/removePromo', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async applyPromoCode (data) {
    return api.post('/applyPromoCode', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async loadTips (cartUuid) {
    return api.post('/loadTips', 'cart_uuid=' + cartUuid)
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
  },

  async checkoutAddTips (data) {
    return api.post('/checkoutAddTips', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async PaymentList (cartUuid) {
    return api.post('/PaymentList', 'cart_uuid=' + cartUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async SavedPaymentProvider (data) {
    return api.post('/SavedPaymentProvider', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async SavedPaymentList (cartUuid) {
    return api.post('/SavedPaymentList', 'cart_uuid=' + cartUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async setDefaultPayment (paymentUuid) {
    return api.post('/setDefaultPayment', 'payment_uuid=' + paymentUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async deleteSavedPaymentMethod (data) {
    return api.post('/deleteSavedPaymentMethod', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async savedCards (data) {
    return api.post('/savedCards', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async StripeCreateCustomer (data) {
    return api.post(config.api_base_url + '/pv1/StripeCreateCustomer', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async StripeSavePayment (data) {
    return api.post(config.api_base_url + '/pv1/StripeSavePayment', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async StripeCreateIntent (data) {
    return api.post(config.api_base_url + '/pv1/StripeCreateIntent', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async StripePaymentIntent (data) {
    return api.post(config.api_base_url + '/pv1/StripePaymentIntent', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async PaypalVerifyPayment (data) {
    return api.post(config.api_base_url + '/pv1/PaypalVerifyPayment', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async RazorpayCreateCustomer (data) {
    return api.post(config.api_base_url + '/pv1/RazorpayCreateCustomer', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async RazorpayCreateOrder (data) {
    return api.post(config.api_base_url + '/pv1/RazorpayCreateOrder', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async RazorpayVerifyPayment (data) {
    return api.post(config.api_base_url + '/pv1/RazorpayVerifyPayment', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async MercadopagoCustomer (data) {
    return api.post(config.api_base_url + '/pv1/MercadopagoCustomer', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async MercadopagoAddcard (data) {
    return api.post(config.api_base_url + '/pv1/MercadopagoAddcard', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async MercadopagoGetcard (data) {
    return api.post(config.api_base_url + '/pv1/MercadopagoGetcard', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async MercadopagoCapturePayment (data) {
    return api.post(config.api_base_url + '/pv1/MercadopagoCapturePayment', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async PlaceOrder (data) {
    return api.post('/PlaceOrder', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getOrder (orderUuid) {
    return api.post('/getOrder', 'order_uuid=' + orderUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getMapsConfig () {
    return api.post('/getMapsConfig', '')
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
  },

  async orderHistory (page, q) {
    return api.post('/orderHistory', 'page=' + page + '&q=' + q, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async orderDetails (orderUuid) {
    return api.post('/orderDetails', 'order_uuid=' + orderUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async orderBuyAgain (data) {
    return api.post('/orderBuyAgain', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async cancelOrderStatus (orderUuid) {
    return api.post('/cancelOrderStatus', 'order_uuid=' + orderUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async applyCancelOrder (orderUuid) {
    return api.post('/applyCancelOrder', 'order_uuid=' + orderUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async addReview (data) {
    return api.post('/addReview', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getProfile () {
    return api.post('/getProfile', '', {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async saveProfile (data) {
    return api.post('/saveProfile', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async updatePassword (data) {
    return api.post('/updatePassword', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getAddresses () {
    return api.post('/getAddresses', '', {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async MyPayments () {
    return api.post('/MyPayments', '', {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async deletePayment (paymentUuid) {
    return api.post('/deletePayment', 'payment_uuid=' + paymentUuid, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async PaymentMethod () {
    return api.post('/PaymentMethod', '', {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async addTofav (itemToken, catId) {
    return api.post('/addTofav', 'item_token=' + itemToken + '&cat_id=' + catId, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getSaveItems () {
    return api.post('/getSaveItems', '', {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async registerUser (data) {
    return api.post('/registerUser', data, {
      headers: {
        // Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async requestCode (clientUuid) {
    return api.post('/requestCode', 'client_uuid=' + clientUuid).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async verifyCodeSignup (data) {
    return api.post('/verifyCodeSignup', data, {
      headers: {
        // Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getSignupSettings () {
    return api.post('/getSignupSettings', '')
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
  },

  async socialRegistration (data) {
    return api.post('/SocialRegister', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async getAccountStatus (clientUuid) {
    return api.post('/getAccountStatus', 'client_uuid=' + clientUuid)
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
  },

  async getCustomerInfo (clientUuid) {
    return api.post('/getCustomerInfo', 'client_uuid=' + clientUuid)
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
  },

  async completeSocialSignup (data) {
    return api.post('/completeSocialSignup', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async storeAvailable (merchantUUID) {
    return api.post('/storeAvailable', 'merchant_uuid=' + merchantUUID)
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
  },

  async menuSearch (q,currency_code) {
    return api.post('/menuSearch', 'q=' + q +"&currency_code="+currency_code)
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
  },

  async getRealtime (data) {
    return api.post('/getRealtime', 'getevent=' + data, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async subscribeNews (emailAddress) {
    return api.post('/subscribeNews', 'email_address=' + emailAddress)
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
  },

  async SavePlaceByID (placeId) {
    return api.post('/SavePlaceByID', 'place_id=' + placeId, {
      headers: {
        Authorization: `token ${auth.getToken()}`
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async CloverCheckout (data) {
    return api.post(config.api_base_url + '/pv1/CloverCheckout', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async RevolutCheckout (data) {
    return api.post(config.api_base_url + '/pv1/RevolutCheckout', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async UpdateOrderStatus (data) {
    return api.post(config.api_base_url + '/pv1/UpdateOrderStatus', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async VivaCheckout (data) {
    return api.post(config.api_base_url + '/pv1/VivaCheckout', data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async fetchDataPost(method, data) {
    return api
      .post("/" + method, data)
      .then((result) => {
        if (result.data.code === 1) {
          return result.data;
        } else {
          throw result.data.msg;
        }
      })
      .catch((error) => {
        throw error;
      });
  },

  async fetchDataPostTable(method, data) {
    return api
      .post(config.api_base_url  + "/apibooking/" + method, data)
      .then((result) => {
        if (result.data.code === 1) {
          return result.data;
        } else {
          throw result.data.msg;
        }
      })
      .catch((error) => {
        throw error;
      });
  },

  async fetchDataPostTableToken(method, data) {
    return api.post(config.api_base_url + '/apibooking/'+ method, data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
      }
    }).then(result => {
        if (result.data.code === 1) {
          return result.data;
        } else {
          throw result.data.msg;
        }
      })
      .catch((error) => {
        throw error;
      });
  },

  async fetchDataPayment (method,data) {
    return api.post(config.api_base_url + '/pv1/'+ method, data, {
      headers: {
        Authorization: `token ${auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      if (result.data.code === 1) {
        return result.data
      } else {
        throw result.data.msg
      }
    })
      .catch(error => {
        throw error
      })
  },

  async fetchDataByTokenPost(method, data) {
    return api
      .post("/" + method, data, {
        headers: {
          Authorization: `token ${auth.getToken()}`,
        },
      })
      .then((result) => {
        if (result.data.code === 1) {
          return result.data;
        } else if (result.data.code === 3) {
          return result.data;
        } else {
          throw result.data.msg;
        }
      })
      .catch((error) => {
        throw error;
      });
  },

  async fetchDataChats(method, data) {
    return api
      .post( config.api_base_url + "/chatapi/"+method, data, {
        headers: {
          Authorization: `token ${auth.getToken()}`,
        },
      })
      .then((result) => {
        if (result.data.code === 1) {
          return result.data;
        } else if (result.data.code === 3) {
          return result.data;
        } else {
          throw result.data.msg;
        }
      })
      .catch((error) => {
        throw error;
      });
  },

}
export default APIinterface
