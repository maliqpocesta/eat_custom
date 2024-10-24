<template>
  <div class="row justify-center q-pa-md">
    <div class="col-md-9 col-12">
      <TrackOrderSkeleton v-if="loading" />

      <q-card v-else flat class="q-pa-md">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 q-pr-md q-mb-xs-md">
            <h5 class="text-weight-bold">{{ order_status }}</h5>
            <p class="no-margin font11">{{ order_status_details }}</p>

            <template v-if="order_info.order_type == 'delivery'">
              <template v-if="order_progress > 0">
                <q-linear-progress
                  v-if="order_progress <= 3"
                  indeterminate
                  color="warning"
                  class="q-mt-sm"
                />
              </template>
              <q-stepper
                v-model="order_progress"
                ref="stepper"
                color="primary"
                animated
                flat
                class="no-padding tracking-steps"
              >
                <q-step
                  :name="1"
                  title=""
                  icon="east"
                  active-icon="east"
                  done-icon="east"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress > 1 || order_progress <= 0"
                />
                <q-step
                  :name="2"
                  title=""
                  icon="local_dining"
                  active-icon="local_dining"
                  done-icon="local_dining"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress > 2 || order_progress <= 0"
                />
                <q-step
                  :name="3"
                  title=""
                  icon="drive_eta"
                  active-icon="drive_eta"
                  done-icon="drive_eta"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress > 3 || order_progress <= 0"
                />
                <q-step
                  :name="4"
                  title=""
                  icon="home"
                  active-icon="home"
                  done-icon="check_circle"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress >= 4 || order_progress <= 0"
                />
              </q-stepper>
            </template>

            <template v-else>
              <template v-if="order_progress > 0">
                <q-linear-progress
                  v-if="order_progress <= 2"
                  indeterminate
                  color="warning"
                  class="q-mt-sm"
                />
              </template>
              <q-stepper
                v-model="order_progress"
                ref="stepper"
                color="primary"
                animated
                flat
                class="no-padding tracking-steps"
              >
                <q-step
                  :name="1"
                  title=""
                  icon="east"
                  active-icon="east"
                  done-icon="east"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress > 1 || order_progress <= 0"
                />
                <q-step
                  :name="2"
                  title=""
                  icon="local_dining"
                  active-icon="local_dining"
                  done-icon="local_dining"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress > 2 || order_progress <= 0"
                />
                <q-step
                  :name="3"
                  title=""
                  icon="shopping_basket"
                  active-icon="shopping_basket"
                  done-icon="check_circle"
                  active-color="warning"
                  :done-color="order_progress > 1 ? 'warning' : 'negative'"
                  :done="order_progress >= 3 || order_progress <= 0"
                />
              </q-stepper>
            </template>

            <div class="row">
              <div class="col-3">
                <q-avatar>
                  <q-img
                    :src="merchant_info.url_logo"
                    :fit="contain"
                    style="height: 50px; max-width: 50px"
                    class="no-margin"
                    loading="lazy"
                  />
                </q-avatar>
              </div>
              <div class="col">
                <h5 class="no-margin text-weight-medium">
                  {{ merchant_info.restaurant_name }}
                </h5>
                <template
                  v-for="(cuisine, index) in merchant_info.cuisine"
                  :key="cuisine.cuisine_name"
                >
                  <q-badge
                    v-if="index <= 0"
                    :label="cuisine.cuisine_name"
                    :style="`background-color:${cuisine.bgcolor};color:${cuisine.fncolor};`"
                    class="font11"
                  />
                </template>
                <p class="font11 ellipsis-2-lines">
                  {{ merchant_info.merchant_address }}
                </p>

                <div v-if="order_info.order_type == 'pickup'">
                  <q-btn
                    :href="'tel:' + merchant_info.contact_phone"
                    round
                    color="positive"
                    icon="call"
                    dense
                    size="12px"
                    outline
                    class="q-mr-sm"
                  />
                  <q-btn
                    :href="merchant_info.restaurant_direction"
                    target="_blank"
                    round
                    color="positive"
                    icon="directions"
                    dense
                    size="12px"
                    outline
                  />
                </div>
                <div v-else-if="order_info.order_type == 'dinein'">
                  <q-btn
                    :href="'tel:' + merchant_info.contact_phone"
                    round
                    color="positive"
                    icon="call"
                    dense
                    size="12px"
                    outline
                    class="q-mr-sm"
                  />
                  <q-btn
                    :href="merchant_info.restaurant_direction"
                    target="_blank"
                    round
                    color="positive"
                    icon="directions"
                    dense
                    size="12px"
                    outline
                  />
                </div>
              </div>
            </div>
            <!-- row -->

            <template v-if="order_progress === 4">
              <h5 class="text-weight-bold q-mt-xs">{{ $t("HOWS WAS YOUR ORDER") }}?</h5>
              <p class="font11 q-mb-xs">
                {{
                  $t("let us know how your delivery wen and how you liked your order")
                }}!
              </p>
              <q-btn
                flat
                color="warning"
                label="Rate your order"
                dense
                no-caps
                @click="modal_review = true"
              />
            </template>

            <template v-if="hasInstructions">
              <h5 class="text-weight-bold q-mt-xs">{{ $t("UPON ARRIVAL") }}</h5>
              <p class="font12 q-mb-xs">{{ instructions.text }}</p>
            </template>

            <q-separator class="q-mb-md q-mt-sm"></q-separator>

            <div class="flex justify-between items-center q-mt-xs">
              <div class="text-h5 text-weight-bold">
                {{ merchant_info.restaurant_name }}
              </div>
              <div>
                <q-btn
                  round
                  color="amber-5"
                  icon="chat"
                  size="sm"
                  unelevated
                  @click="createChat"
                  :loading="loading_chat"
                />
              </div>
            </div>

            <p class="font12 q-mb-xs text-weight-bold">
              {{ $t("Order") }} #{{ order_info.order_id }}
            </p>
            <p class="font12 q-mb-xs text-weight-bold">
              {{ items_count }} {{ $t("items") }}
            </p>
            <p class="font11 q-mb-xs">{{ order_info.sub_total }} {{ $t("Subtotal") }}</p>

            <template v-if="items.length > 0">
              <p v-for="item in items" :key="item.item_name" class="font11 q-mb-xs">
                {{ item.qty }}x {{ item.item_name }}
                <template v-if="item.size_name != ''"> ({{ item.size_name }}) </template>
              </p>
            </template>

            <div v-if="order_info.order_type == 'delivery'">
              <q-separator class="q-mb-md q-mt-md"></q-separator>
              <h5 class="text-weight-bold">{{ $t("Delivery Address") }}</h5>
              <p class="font12 q-mb-xs text-weight-medium">
                {{ meta.formatted_address }}
              </p>
            </div>
          </div>
          <!-- col -->
          <div class="col-xs-12 col-sm-6 col-md-8 relative-position">
            <Maps
              ref="maps"
              :lat="merchant_info.latitude"
              :lng="merchant_info.longitude"
              :default_lat="merchant_info.latitude"
              :default_lng="merchant_info.longitud"
              :zoom="maps_config.zoom"
              :keys="maps_config.key"
              class_map="maps fit"
              :provider="maps_config.provider"
              :detect_location="false"
              :marker="marker"
              @after-selectmap="afterSelectmap"
              @drag-marker="dragMarker"
              @show-loader="showLoader"
            />
            <q-inner-loading
              :showing="loading_map"
              color="warning"
              label-class="text-dark"
              label-style="font-size: 11px"
            />
          </div>
          <!-- col -->
        </div>
        <!-- row -->
      </q-card>
    </div>
    <!-- col -->
  </div>
  <!-- row -->

  <q-dialog
    v-model="modal_review"
    persistent
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
  >
    <q-card :class="{ 'card-medium-width1': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("Write A Review") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <WriteReview
        ref="review"
        :order_uuid="order_uuid"
        :initital_rate="0"
        @after-addreview="afterAddreview"
      />
    </q-card>
  </q-dialog>

  <ComponentsRealtime ref="realtime" getevent="tracking" @after-receive="afterReceive" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import FirebaseService from "src/api/FirebaseService";
import auth from "src/api/auth";

export default {
  name: "TrackOrder",
  components: {
    Maps: defineAsyncComponent(() => import("components/Maps")),
    TrackOrderSkeleton: defineAsyncComponent(() =>
      import("components/TrackOrderSkeleton")
    ),
    WriteReview: defineAsyncComponent(() => import("components/WriteReview")),
    ComponentsRealtime: defineAsyncComponent(() =>
      import("components/ComponentsRealtime")
    ),
  },
  data() {
    return {
      loading: false,
      order_uuid: "",
      lat: "",
      lng: "",
      merchant_info: [],
      order_info: [],
      items: [],
      meta: [],
      items_count: 0,
      order_progress: -1,
      order_status: "",
      order_status_details: "",
      instructions: [],
      maps_config: [],
      marker: [],
      modal_review: false,
      loading_chat: false,
      user_uuid: "",
    };
  },
  mounted() {
    this.order_uuid = this.$route.query.order_uuid;
    this.getOrder();
    let user = auth.getUser();
    this.user_uuid = user.client_uuid;
  },
  methods: {
    getOrder() {
      this.loading = true;
      APIinterface.getOrder(this.order_uuid)
        .then((data) => {
          this.merchant_info = data.details.merchant_info;
          this.order_info = data.details.order_info;
          this.items = data.details.items;
          this.meta = data.details.meta;
          this.items_count = data.details.items_count;
          this.order_progress = data.details.progress.order_progress;
          this.order_status = data.details.progress.order_status;
          this.order_status_details = data.details.progress.order_status_details;
          this.instructions = data.details.instructions;
          this.maps_config = data.details.maps_config;

          if (this.order_info.order_type === "delivery") {
            this.marker = [
              {
                id: 0,
                draggable: false,
                icon: this.maps_config.icon_merchant,
                lat: this.merchant_info.latitude,
                lng: this.merchant_info.longitude,
              },
              {
                id: 1,
                draggable: false,
                icon: this.maps_config.icon_destination,
                lat: this.meta.latitude,
                lng: this.meta.longitude,
              },
            ];
          } else {
            this.marker = [
              {
                id: 0,
                draggable: false,
                icon: this.maps_config.icon_merchant,
                lat: this.merchant_info.latitude,
                lng: this.merchant_info.longitude,
              },
            ];
          }
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    afterAddreview() {
      this.modal_review = false;
    },
    afterReceive(data) {
      if (data.order_id !== this.order_info.order_id) {
        return false;
      }
      if (data.order_progress === 0) {
        this.order_progress = data.order_progress;
        this.order_status = data.order_status;
        this.order_status_details = data.order_status_details;
      } else if (data.order_progress === -1) {
        // do nothing
      } else {
        this.order_progress = data.order_progress;
        this.order_status = data.order_status;
        this.order_status_details = data.order_status_details;
      }
    },
    async createChat() {
      this.loading_chat = true;
      FirebaseService.createChatOrder(
        this.order_info.order_id,
        this.order_uuid,
        this.merchant_info.merchant_uuid,
        this.user_uuid
      )
        .then((documentId) => {
          this.$router.push({
            path: "/account/chat/conversation",
            query: { doc_id: documentId },
          });
        })
        .catch((error) => {
          APIinterface.notify("dark", error, "error", this.$q);
        })
        .then((data) => {
          this.loading_chat = false;
        });
    },
  },
};
</script>
