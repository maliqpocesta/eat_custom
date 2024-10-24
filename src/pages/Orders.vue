<template>
  <q-page padding>
    <StickyBack url="/account/menu" label="Back" v-if="isMobile" />
    <LocationNav v-else />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row">
          <!-- left -->
          <div v-if="!isMobile" class="col-md-4 col-sm-4 col-xs-12">
            <AccountNav></AccountNav>
          </div>
          <!-- left -->
          <!-- right -->
          <div class="col-md-8 col-sm-8 col-xs-12">
            <template v-if="loading">
              <OrderSkeleton />
            </template>

            <template v-else>
              <div class="text-center">
                <h4 class="no-margin text-weight-bold q-pb-sm">
                  {{ $t("We like each other") }}
                </h4>
                <p>{{ $t("Let's not change this") }}!</p>
              </div>

              <div class="m-auto relative-position">
                <div class="q-mb-sm">
                  <q-input
                    class="text-search"
                    outlined
                    rounded
                    v-model="q"
                    :label="$t('Search order')"
                    bg-color="white"
                    label-color="grey"
                    :loading="awaitingSearch"
                    clearable
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="ion-search" />
                    </template>
                  </q-input>
                </div>

                <template v-for="datas in data" :key="datas">
                  <q-card
                    v-for="order in datas"
                    :key="order.order_id_raw"
                    flat
                    class="q-mb-md"
                  >
                    <q-card-section>
                      <div class="row">
                        <div class="col no-padding">
                          <h6
                            v-if="services[order.service_code]"
                            class="no-margin text-weight-bold"
                          >
                            {{ services[order.service_code].service_name }}
                          </h6>
                          <p class="no-margin font11 text-grey">
                            {{ order.date_created }}
                          </p>
                        </div>
                        <div class="col no-padding text-right">
                          <p class="no-margin">{{ order.total }}</p>
                        </div>
                      </div>

                      <div class="q-mt-md">
                        <p class="no-margin font12">
                          {{ order.order_id }}

                          <q-badge
                            :label="status[order.status].status"
                            class="q-ml-sm"
                            :style="`background-color:${
                              status[order.status].background_color_hex
                            };color:${status[order.status].font_color_hex};`"
                          />
                        </p>
                        <p class="no-margin font12">
                          <q-badge color="warning">{{ order.total_items }}</q-badge>
                        </p>
                        <div class="row items-center">
                          <div class="col-11">
                            <p class="no-margin font12 text-weight-thin">
                              <template v-for="item in order.items" :key="item.item_id">
                                <span class="q-mr-sm">
                                  {{ items[item.item_id] }}
                                  <span v-if="size[item.item_size_id]"
                                    >({{ size[item.item_size_id] }})</span
                                  >
                                  ,
                                </span>
                              </template>
                            </p>
                          </div>
                          <div class="col-1">
                            <q-btn
                              color="grey-5"
                              round
                              :loading="order.is_loading"
                              dense
                              unelevated
                              padding="2px"
                              icon="more_horiz"
                            >
                              <q-menu
                                transition-show="scale"
                                transition-hide="scale"
                                :offset="[120, 5]"
                                auto-close
                              >
                                <q-list style="min-width: 180px">
                                  <q-item
                                    clickable
                                    @click="orderDetails(order.order_uuid)"
                                  >
                                    <q-item-section>{{
                                      $t("View order")
                                    }}</q-item-section>
                                  </q-item>
                                  <q-item clickable @click="orderBuyagain(order)">
                                    <q-item-section>{{ $t("Buy again") }}</q-item-section>
                                  </q-item>
                                  <q-item
                                    clickable
                                    :to="{
                                      path: '/account/trackorder',
                                      query: { order_uuid: order.order_uuid },
                                    }"
                                    :disable="
                                      status_allowed_review.includes(order.status)
                                        ? true
                                        : false
                                    "
                                  >
                                    <q-item-section>{{ $t("Track") }}</q-item-section>
                                  </q-item>

                                  <!-- <q-item clickable :href="order.pdf" target="_blank"> -->
                                  <q-item
                                    clickable
                                    :href="
                                      api_base_url +
                                      '/print/pdfdownload/?order_uuid=' +
                                      order.order_uuid
                                    "
                                    target="_blank"
                                  >
                                    <q-item-section>{{
                                      $t("Download PDF")
                                    }}</q-item-section>
                                  </q-item>

                                  <!-- <q-item
                                    :clickable="
                                      status_allowed_review.includes(order.status)
                                    "
                                    :disable="
                                      status_allowed_review.includes(order.status)
                                        ? false
                                        : true
                                    "
                                    @click="showReview(order.order_uuid)"
                                  >
                                    <q-item-section>{{
                                      $t("Write review")
                                    }}</q-item-section>
                                  </q-item> -->

                                  <q-separator />
                                  <q-item
                                    :clickable="
                                      status_allowed_cancelled.includes(order.status)
                                    "
                                    :disable="
                                      status_allowed_cancelled.includes(order.status)
                                        ? false
                                        : true
                                    "
                                    @click="
                                      this.$refs.cancel_order.showModal(order.order_uuid)
                                    "
                                  >
                                    <q-item-section>{{
                                      $t("Cancel order")
                                    }}</q-item-section>
                                  </q-item>
                                </q-list>
                              </q-menu>
                            </q-btn>
                          </div>
                        </div>
                      </div>
                    </q-card-section>

                    <template v-if="status_allowed_review.includes(order.status)">
                      <q-separator></q-separator>
                      <template v-if="reviews[order.order_id_raw]">
                        <div class="q-pa-sm flex flex-center text-caption text-grey">
                          {{ $t("You have rated this") }}
                          <q-icon name="star" size="2em" color="yellow-9" />
                          <span class="text-weight-bold">{{
                            reviews[order.order_id_raw]
                          }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <q-item>
                          <q-item-section avatar>
                            <q-item-label caption>{{ $t("Tap to rate") }}</q-item-label>
                          </q-item-section>
                          <q-item-section>
                            <q-rating
                              :model-value="rate_value[order.order_uuid]"
                              size="2em"
                              :max="5"
                              color="grey-5"
                              color-selected="warning"
                              class="q-mb-xs"
                              @update:model-value="
                                (v) => setRateValue(v, order.order_uuid)
                              "
                            />
                          </q-item-section>
                          <q-item-section side></q-item-section>
                        </q-item>
                      </template>
                    </template>
                  </q-card>
                </template>

                <template v-if="search_error">
                  <div class="q-mt-md">
                    <h6 class="no-margin">{{ $t("No results") }}</h6>
                    <p class="font11 text-grey">
                      {{ $t("Sorry, no order matched your search. Please try again") }}.
                    </p>
                  </div>
                </template>

                <template v-if="!loading">
                  <template v-if="q == ''">
                    <div class="text-center">
                      <q-btn
                        v-if="show_next_page"
                        unelevated
                        rounded
                        color="warning"
                        text-color="black"
                        no-caps
                        :loading="load_more"
                        @click="loadMoreOrders(page)"
                        style="letter-spacing: 2px"
                      >
                        {{ $t("Load more") }}
                      </q-btn>
                      <p v-else class="text-body2 text-grey">
                        {{ $t("end of results") }}
                      </p>
                    </div>
                  </template>
                </template>
              </div>
              <!-- w-50 -->
            </template>
            <!-- end loading -->
          </div>
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <!-- <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="yellow-9" padding="10px" />
    </q-page-scroller> -->

    <!-- <q-drawer
      side="right"
      v-model="drawer"
      :show-if-above="false"
      :width="350"
      :breakpoint="sm"
      bordered
      overlay
    >
    <q-scroll-area class="fit" >
      <q-page padding style="padding-bottom:50px;">
         <q-btn @click="drawer=false" color="grey-5" round  dense unelevated padding="2px" icon="close" ></q-btn>

         <OrderDetails
         ref="order_details"
         @order-buyagain="orderBuyagain"
         />

       </q-page>
     </q-scroll-area>
    </q-drawer> -->

    <q-dialog
      v-model="drawer"
      persistent
      @before-show="onShoworderdetails"
      :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
    >
      <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
        <OrderSummary
          ref="order_details"
          :loading="loading_order"
          :order_data="order_data"
          @order-buyagain="orderBuyagain"
        />
      </q-card>
    </q-dialog>

    <CancelOrder ref="cancel_order" @after-cancelorder="afterCancelorder" />

    <q-dialog v-model="modal_review" persistent>
      <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5 text-weight-bold">{{ $t("Write A Review") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <WriteReview
          ref="review"
          :order_uuid="order_uuid"
          :initital_rate="initital_rate"
          @after-addreview="afterAddreview"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";
import config from "src/api/config";

export default {
  name: "Orders",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    OrderSummary: defineAsyncComponent(() => import("components/OrderSummary")),
    CancelOrder: defineAsyncComponent(() => import("components/CancelOrder")),
    WriteReview: defineAsyncComponent(() => import("components/WriteReview")),
    OrderSkeleton: defineAsyncComponent(() => import("components/OrderSkeleton")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
  },
  data() {
    return {
      loading: false,
      show_next_page: false,
      load_more: false,
      drawer: false,
      q: "",
      page: 0,
      data: [],
      items: [],
      size: [],
      status: [],
      services: [],
      status_allowed_cancelled: [],
      status_allowed_review: [],
      buyagain_loading: false,
      modal_review: false,
      order_uuid: "",
      star_rating: "",
      reviews: [],
      awaitingSearch: false,
      search_error: "",
      search_found: false,
      loading_order: false,
      order_data: [],
      api_base_url: config.api_base_url,
      rate_value: [],
      initital_rate: 0,
    };
  },
  computed: {
    hasData() {
      if (this.data.length > 0) {
        return true;
      }
      return false;
    },
    isMobile() {
      if (this.$q.screen.lt.md) {
        return true;
      } else {
        return false;
      }
    },
  },
  unmounted() {
    //
  },
  mounted() {
    this.orderHistory(0);
  },
  watch: {
    q(newsearch, oldsearch) {
      if (!this.awaitingSearch) {
        if (APIinterface.empty(this.q)) {
          this.search_error = "";
          this.search_found = false;
          this.orderHistory(0);
          return false;
        }

        setTimeout(() => {
          APIinterface.orderHistory(0, this.q)
            .then((data) => {
              this.search_found = true;
              this.search_error = "";
              this.data = [];
              this.data.push(data.details.data.data);
              this.items = this.addObjectToArray(this.items, data.details.data.items);
              this.size = data.details.data.size;
              this.services = data.details.data.services;
              this.status = data.details.data.status;
              this.show_next_page = data.details.show_next_page;
              this.page = data.details.page;
              this.reviews = data.details.data.reviews;
            })
            .catch((error) => {
              this.data = [];
              this.search_error = error;
              this.search_found = false;
            })
            .then((data) => {
              this.loading = false;
              this.load_more = false;
              this.awaitingSearch = false;
            });
        }, 1000); // 1 sec delay

        this.awaitingSearch = true;
      }
    },
  },
  methods: {
    orderHistory(page) {
      if (!this.load_more) {
        this.loading = true;
      }
      APIinterface.orderHistory(page, "")
        .then((data) => {
          this.data.push(data.details.data.data);
          this.items = this.addObjectToArray(this.items, data.details.data.items);
          this.size = data.details.data.size;
          this.services = data.details.data.services;
          this.status = data.details.data.status;
          this.show_next_page = data.details.show_next_page;
          this.page = data.details.page;
          this.reviews = data.details.data.reviews;
          this.status_allowed_review = data.details.data.status_allowed_review;
          this.status_allowed_cancelled = data.details.data.status_allowed_cancelled;
        })
        .catch((error) => {
          //
        })
        .then((data) => {
          this.loading = false;
          this.load_more = false;
        });
    },
    addObjectToArray(element, elementnew) {
      const newobject = {};
      Object.entries(element).forEach(([key, value]) => {
        newobject[key] = value;
      });
      Object.entries(elementnew).forEach(([key, value]) => {
        newobject[key] = value;
      });
      return newobject;
    },
    loadMoreOrders(page) {
      this.load_more = true;
      this.orderHistory(page);
    },
    orderDetails(orderUuid) {
      this.drawer = true;
      this.order_uuid = orderUuid;
    },
    onShoworderdetails() {
      this.loading_order = true;
      APIinterface.orderDetails(this.order_uuid)
        .then((data) => {
          this.order_data = data.details;
        })
        .catch((error) => {
          this.drawer = false;
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_order = false;
        });
    },
    orderBuyagain(orderData) {
      orderData.is_loading = true;
      const $params = {
        cart_uuid: APIinterface.getStorage("cart_uuid"),
        order_uuid: orderData.order_uuid,
      };
      this.buyagain_loading = true;
      APIinterface.orderBuyAgain($params)
        .then((data) => {
          APIinterface.setStorage("cart_uuid", data.details.cart_uuid);
          this.$router.push({ name: "menu", params: { addcart: true } });
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.buyagain_loading = false;
          orderData.is_loading = false;
        });
    },
    afterCancelorder() {
      this.page = 0;
      this.data = [];
      this.orderHistory(this.page);
    },
    showReview(orderuuid) {
      this.order_uuid = orderuuid;
      this.modal_review = true;
    },
    afterAddreview() {
      this.order_uuid = "";
      this.modal_review = false;
      this.page = 0;
      this.data = [];
      this.orderHistory(this.page);
    },
    setRateValue(data, order_uuid) {
      this.order_uuid = order_uuid;
      this.initital_rate = data;
      this.modal_review = true;
    },
  },
};
</script>
