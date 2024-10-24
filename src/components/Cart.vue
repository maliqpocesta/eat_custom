<template>
  <!-- cart -->
  <section class="cart">
    <div class="rounded-borders border-grey q-pa-sm">
      <div class="row justify-start items-center">
        <div class="col-7">
          <div class="text-caption col-12 font11 text-grey">
            {{ transaction_data.formatted_address }}
          </div>
          <div class="text-h6 col-12 line-height-normal text-weight-bolder">
            <span v-if="services_list[transaction_data.transaction_type]">
              {{ services_list[transaction_data.transaction_type].service_name }}
            </span>

            <span v-if="transaction_data.whento_deliver === 'schedule'">
              ({{ transaction_data.delivery_datetime }})
            </span>
            <span v-else>
              <template v-if="delivery_option[transaction_data.whento_deliver]">
                ({{ delivery_option[transaction_data.whento_deliver].short_name }})
              </template>
            </span>
          </div>
        </div>
        <div class="col">
          <q-btn
            flat
            color="warning"
            no-caps
            class="full-width"
            @click="showDeliveryDetails"
          >
            <div class="ellipsis">Change</div>
          </q-btn>
        </div>
      </div>
    </div>
    <!-- rounded -->

    <DIV v-if="cart_loading">
      {{ $t("loading") }}
    </DIV>
    <DIV v-else>
      <template v-if="items_count > 0">
        <div class="row q-mt-md items-center">
          <div class="col">
            <div class="text-h5">{{ $t("Summary") }}</div>
          </div>
          <div class="col text-right">
            <a class="text-weight-light font11 cursor-pointer" @click="ConfirmClearCart">
              <u>{{ $t("Clear") }}</u>
            </a>
          </div>
        </div>

        <div class="items" v-for="items in cart_items" :key="items.item_id">
          <!-- items -->
          <div class="row q-mt-md">
            <div class="col-3">
              <q-img
                fit="cover"
                :src="items.url_image"
                class="no-margin"
                height="50px"
                width="50px"
                loading="lazy"
              />
            </div>
            <!-- col -->
            <div class="col">
              <p class="no-margin">
                {{ items.item_name }}
                <template v-if="items.price.size_name != ''">
                  ({{ items.price.size_name }})
                </template>
              </p>

              <template v-if="items.price.discount > 0">
                <p class="no-margin">
                  <del>{{ items.price.pretty_price }}</del>
                  {{ items.price.pretty_price_after_discount }}
                </p>
              </template>
              <template v-else>
                <p class="no-margin">{{ items.price.pretty_price }}</p>
              </template>

              <div
                class="row inline q-mt-xs q-mb-xs items-center justify-center w-75"
                style="margin-left: -10px"
              >
                <div class="col q-pl-sm">
                  <q-select
                    v-model="items.qty"
                    @update:model-value="updateCartQty(items.qty, items)"
                    filled
                    borderless
                    color="warning"
                    label-color="black"
                    bg-color="grey-2"
                    :disable="loading"
                    :options="qty_options"
                    transition-show="jump-up"
                    transition-hide="jump-up"
                    dense
                    size="sm"
                    style="width: 70px"
                  />

                  <!-- <div class="col text-center no-padding">
                      <q-btn
                      @click="updateCartQty(0,items)"
                      :loading="loading"
                      round unelevated dense size="11px" color="warning" icon="remove" />
                    </div>
                  <div class="col text-center no-padding">{{  items.qty }}</div>
                  <div class="col text-center no-padding">
                    <q-btn
                    @click="updateCartQty(1,items)"
                    :loading="loading"
                    round unelevated dense size="11px" color="warning" icon="add" />
                  </div> -->
                </div>
              </div>

              <p class="no-margin text-grey" v-if="items.special_instructions != ''">
                {{ items.special_instructions }}
              </p>

              <template v-if="items.attributes != ''">
                <template v-for="attributes in items.attributes" :key="attributes">
                  <p class="no-margin">
                    <template v-for="(attributes_data, attributes_index) in attributes">
                      {{ attributes_data
                      }}<template v-if="attributes_index < attributes.length - 1"
                        >,
                      </template>
                    </template>
                  </p>
                </template>
              </template>
            </div>
            <!-- col -->
            <div class="col-3 text-right">
              <q-btn
                @click="removeItem(items)"
                round
                unelevated
                dense
                size="11px"
                color="warning"
                icon="close"
              />

              <template v-if="items.price.discount <= 0">
                <p class="q-mt-sm">
                  <q-skeleton
                    v-if="loading"
                    type="QBadge"
                    class="float-right"
                    style="width: 50px"
                  />
                  <template v-else>{{ items.price.pretty_total }}</template>
                </p>
              </template>
              <template v-else>
                <p class="q-mt-sm">
                  <q-skeleton
                    v-if="loading"
                    type="QBadge"
                    class="float-right"
                    style="width: 50px"
                  />
                  <template v-else>{{
                    items.price.pretty_total_after_discount
                  }}</template>
                </p>
              </template>
            </div>
          </div>
          <!-- row -->
          <!-- items -->

          <!-- addons -->
          <div
            v-for="addons in items.addons"
            :key="addons"
            class="addons q-mb-sm border-bottom"
          >
            <div class="row q-mt-xs">
              <div class="col-3"></div>
              <div class="col">
                <p class="no-margin text-weight-bold">{{ addons.subcategory_name }}</p>
              </div>
            </div>
            <!-- row -->
            <div
              v-for="addon_items in addons.addon_items"
              :key="addon_items"
              class="row q-mb-xs"
            >
              <div class="col-3"></div>
              <div class="col">
                <p class="no-margin">
                  {{ addon_items.qty }} x {{ addon_items.pretty_price }}
                  {{ addon_items.sub_item_name }}
                </p>
              </div>
              <div class="col-3 text-right">
                <p class="no-margin">{{ addon_items.pretty_addons_total }}</p>
              </div>
            </div>
          </div>
          <!-- addons -->
        </div>
        <!-- end loop items -->
      </template>

      <template v-else>
        <div class="q-mt-lg q-pa-sm text-center">
          <q-img
            src="orders-icon.png"
            spinner-color="white"
            lazy
            style="height: 40px; width: 36px"
            class="q-mb-md"
          />
          <div class="text-h6">{{ $t("You don't have any orders here") }}!</div>
          <p class="font-11 text-weight-thin">{{ $t("let's change that") }}!</p>
        </div>
      </template>
    </DIV>
    <!-- end loading card -->
  </section>
  <!-- cart -->

  <q-page-sticky expand position="bottom" class="">
    <div class="q-pa-md fit bg-white">
      <q-btn
        unelevated
        rounded
        color="warning"
        text-color="black"
        no-caps
        class="full-width"
        size="17px"
        :disable="!hasItem"
        :loading="cart_reloading"
        @click="checkout"
      >
        <div class="row full-width">
          <div class="col text-left">{{ $t("Checkout") }}</div>
          <div class="col text-right">{{ cart_subtotal.value }}</div>
        </div>
      </q-btn>
    </div>
  </q-page-sticky>

  <DeliveryDetails
    ref="delivery_details"
    :transaction_data="transaction_data"
    :delivery_option="delivery_option"
    :services_list="services_list"
    @change-address="changeAddress"
    @refresh-transinfo="refreshTransinfo"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";

export default {
  name: "Cart",
  components: {
    DeliveryDetails: defineAsyncComponent(() => import("components/DeliveryDetails")),
  },
  data() {
    return {
      // drawer: false,
      loading: false,
      items_count: 0,
      cart_loading: true,
      cart_reloading: false,
      cart_uuid: "",
      cart_items: [],
      cart_summary: [],
      cart_merchant: [],
      cart_total: [],
      cart_subtotal: [],
      error: [],
      qty_options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      transaction_data: [],
      delivery_option: [],
      services_list: [],
    };
  },
  mounted() {
    // if (this.$route.path === '/menu') {
    //   this.drawer = true
    // } else {
    //   this.drawer = false
    // }

    this.getCart(true);
    this.TransactionInfo();

    this.qty_options = [];
    for (let i = 1; i < 100; i++) {
      this.qty_options.push(i);
    }
  },
  computed: {
    hasItem() {
      if (this.items_count > 0) {
        return true;
      }
      return false;
    },
  },
  updated() {
    //
  },
  methods: {
    showDeliveryDetails() {
      this.$refs.delivery_details.show_modal = true;
    },
    getCart(cardLoading) {
      const $data = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        payload: ["items", "subtotal", "distance_local", "items_count"],
      };

      if (cardLoading) {
        this.cart_loading = true;
      } else {
        this.cart_reloading = true;
      }
      APIinterface.getCart($data)
        .then((data) => {
          this.items_count = data.details.items_count;
          this.$emit("setCartcount", this.items_count);
          this.cart_uuid = data.details.cart_uuid;
          this.cart_items = data.details.data.items;
          this.cart_summary = data.details.data.summary;
          this.cart_total = data.details.data.total;
          this.error = data.details.error;
          this.cart_subtotal = data.details.data.subtotal;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.resetData();
        })
        .then((data) => {
          this.cart_loading = false;
          this.cart_reloading = false;
        });
    },
    resetData() {
      this.items_count = 0;
      this.cart_items = [];
      this.cart_summary = [];
      this.cart_total = [];
      this.error = [];
      this.cart_subtotal = [];
    },
    ConfirmClearCart() {
      this.$q
        .dialog({
          title: "Clear cart",
          message: "Are your sure you want to clear your cart?",
          stackButtons: false,
          ok: {
            unelevated: true,
            rounded: true,
            color: "warning",
            "text-color": "black",
            size: "md",
            label: "Yes clear cart",
            "no-caps": true,
          },
          cancel: {
            unelevated: true,
            rounded: true,
            color: "grey-3",
            "text-color": "black",
            size: "md",
            label: "Cancel",
            "no-caps": true,
          },
        })
        .onOk((data) => {
          this.clearCart();
        });
    },
    clearCart() {
      this.loading = false;
      APIinterface.clearCart(APIinterface.getStorage("cart_uuid"))
        .then((data) => {
          this.getCart();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    removeItem(items) {
      this.$q
        .dialog({
          title: "Delete Item",
          message: "Are you sure you want to delete this item?",
          stackButtons: false,
          ok: {
            unelevated: true,
            rounded: true,
            color: "warning",
            "text-color": "black",
            size: "md",
            label: "Delete",
            "no-caps": true,
          },
          cancel: {
            unelevated: true,
            rounded: true,
            color: "grey-3",
            "text-color": "black",
            size: "md",
            label: "Cancel",
            "no-caps": true,
          },
        })
        .onOk((data) => {
          this.loading = true;
          APIinterface.removeCartItem(this.cart_uuid, items.cart_row)
            .then((data) => {
              this.getCart();
            })
            .catch((error) => {
              APIinterface.notify("negative", error, "error_outline", this.$q);
            })
            .then((data) => {
              this.loading = false;
            });
        });
    },
    updateCartQty(itemQty, item) {
      this.updateCartItems(itemQty, item);
    },
    updateCartItems(itemQty, item) {
      this.loading = true;
      APIinterface.updateCartItems(this.cart_uuid, item.cart_row, itemQty)
        .then((data) => {
          this.getCart();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    TransactionInfo() {
      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        local_id: APIinterface.getStorage("local_id"),
        choosen_delivery: [],
      };
      APIinterface.TransactionInfo($params)
        .then((data) => {
          this.transaction_data = data.details;
          this.delivery_option = data.details.delivery_option;
          this.services_list = data.details.services_list;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "warning", this.$q);
        })
        .then((data) => {});
    },
    refreshTransinfo() {
      this.TransactionInfo();
    },
    checkout() {
      let $redirectTo = "";
      if (this.$route.path === "/menu") {
        $redirectTo = "/login?checkout=true";
      } else {
        $redirectTo = "/login";
      }
      if (auth.authenticated()) {
        this.$router.push("/checkout");
      } else {
        this.$router.push($redirectTo);
      }
    },
  },
};
</script>
