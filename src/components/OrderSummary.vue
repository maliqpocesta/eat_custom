<template>
  <q-card-section class="row items-center q-pb-none">
    <div class="text-h5 text-weight-bold">{{ $t("Orders Details") }}</div>
    <q-space />
    <q-btn icon="close" flat round dense v-close-popup />
  </q-card-section>

  <q-card-section class="scroll" style="max-height: 60vh">
    <section class="cart">
      <!-- skeleton -->
      <template v-if="loading">
        <div class="q-mt-md">
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-skeleton type="text" style="width: 50%" />
              <q-skeleton type="text" />
              <q-skeleton type="text" />
            </div>
            <div class="col">
              <q-skeleton type="text" style="width: 50%" />
            </div>
          </div>
        </div>
        <q-separator class="q-mt-sm q-mb-md"></q-separator>
        <q-skeleton type="text" />
        <q-skeleton type="text" />
        <q-separator class="q-mt-sm q-mb-md"></q-separator>
        <q-skeleton type="text" />
        <q-skeleton type="text" />
        <q-separator class="q-mt-sm q-mb-md"></q-separator>

        <div v-for="i in 3" :key="i" class="border-bottom">
          <div class="row q-mt-md">
            <div class="col-3">
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>
            </div>
            <div class="col">
              <q-skeleton type="text" style="width: 50%" />
              <q-skeleton type="text" />
              <q-skeleton type="text" style="width: 30%" />
            </div>
            <div class="col-3 text-right">
              <q-skeleton type="text" style="width: 30%" class="float-right" />
            </div>
          </div>
        </div>

        <div v-for="i in 3" :key="i" class="row justify-center q-mb-sm q-mt-sm">
          <div class="col"><q-skeleton type="text" style="width: 80%" /></div>
          <div class="col">
            <q-skeleton type="text" style="width: 30%" class="float-right" />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col"><q-skeleton type="QBtn" style="width: 90%" /></div>
          <div class="col">
            <q-skeleton type="QBtn" style="width: 90%" class="float-right" />
          </div>
        </div>
        <!-- skeleton -->
      </template>

      <template v-else>
        <template v-if="!hasData">
          <div class="bg-myyellow q-pa-sm radius8">
            {{ $t("No available data") }}
          </div>
        </template>

        <div v-if="hasData">
          <div v-if="hasRefund">
            <h5 class="q-mb-sm q-mt-none text-weight-600">{{ $t("Refund Issued") }}</h5>
            <div
              v-for="item_refund in refund_transaction"
              :key="item_refund"
              class="bg-grey-2 q-pa-sm rounded-borders q-mb-md font11"
            >
              <p class="no-margin">
                <b>{{ $t("Description") }}:</b> {{ item_refund.description }}
              </p>
              <p class="no-margin">
                <b>{{ $t("Amount") }}:</b> {{ item_refund.trans_amount }}
              </p>
              <p v-if="item_refund.used_card" class="no-margin">
                <b>{{ $t("Issued to") }}:</b> {{ item_refund.used_card }}
              </p>
              <p v-else class="no-margin">
                <b>{{ $t("Issued to") }}:</b> {{ item_refund.payment_code }}
              </p>
              <p class="no-margin">
                <b>{{ $t("Date issued") }}:</b> {{ item_refund.date }}
              </p>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <q-badge
                :label="order_status.status"
                :style="`background-color:${order_status.background_color_hex};color:${order_status.font_color_hex};`"
              />
            </div>
            <div class="col text-right">
              <q-badge
                :label="order_services.service_name"
                class="q-ml-sm"
                :style="`background-color:${order_services.background_color_hex};color:${order_services.font_color_hex};`"
              />
            </div>
          </div>
          <!-- row -->

          <h6 class="no-margin text-weight-600">
            {{ $t("Order") }} #{{ order_info.order_id }}
          </h6>
          <p class="font12 no-margin text-grey">{{ order_info.payment_name }}</p>
          <p class="font12 no-margin text-grey">{{ order_info.place_on }}</p>
          <p class="font12 no-margin text-grey" v-if="order_info.paid_on != ''">
            {{ order_info.paid_on }}
          </p>
          <q-separator class="q-mt-sm q-mb-sm"></q-separator>
          <h6 class="no-margin text-weight-600">
            {{ order_info.customer_name }}
            <span class="text-dark q-ml-sm" v-if="order_info.contact_number != ''">{{
              order_info.contact_number
            }}</span>
          </h6>
          <p v-if="order_info.delivery_address != ''" class="font12 no-margin text-grey">
            {{ order_info.delivery_address }}
          </p>
          <p v-if="order_info.whento_deliver == 'now'" class="font12 no-margin text-grey">
            {{ order_info.schedule_at }}
          </p>
          <p
            v-if="order_info.whento_deliver == 'schedule'"
            class="font12 no-margin text-grey"
          >
            {{
              $t("Scheduled at {schedule_at}", { schedule_at: order_info.schedule_at })
            }}
          </p>

          <q-separator class="q-mt-sm q-mb-md"></q-separator>

          <div class="row items-top">
            <div class="col-sm-6 col-xs-12">
              <div>{{ order_info.payment_name }}</div>
              <div class="text-caption text-weight-light">
                {{ order_info.place_on }}
              </div>
            </div>
            <div
              v-if="order_info.upload_deposit_link"
              class="col-sm-6 col-xs-12"
              :class="{ 'text-right': !this.$q.screen.lt.md }"
            >
              <q-btn
                flat
                label="Upload bank deposit"
                no-caps
                color="blue"
                :to="{
                  path: '/account/orders/upload-deposit',
                  query: { order_uuid: order_info.order_uuid },
                }"
              ></q-btn>
            </div>
          </div>

          <template v-if="hasBooking">
            <q-separator class="q-mt-sm q-mb-md"></q-separator>
            <div>{{ $t("Table information") }}</div>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ $t("Guest") }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ order_table_data.guest_number }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ $t("Room name") }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ order_table_data.table_name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ $t("Table name") }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ order_table_data.room_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>

          <q-separator class="q-mt-sm q-mb-md"></q-separator>

          <h6 class="no-margin text-weight-600">{{ $t("Summary") }}</h6>

          <div
            class="items border-bottom"
            v-for="items in order_items"
            :key="items.item_id"
          >
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
              <div class="col">
                <p class="no-margin">
                  {{ items.qty }}x
                  {{ items.item_name }}
                  <template v-if="items.price.size_name != ''">
                    ({{ items.price.size_name }})
                  </template>

                  <template v-if="items.item_changes == 'replacement'">
                    <div class="m-0 text-grey">
                      Replace "{{ items.item_name_replace }}"
                    </div>
                    <q-badge
                      color="primary"
                      text-color="white"
                      :label="$t('Replacement')"
                    />
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

                <p class="no-margin" v-if="items.special_instructions != ''">
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
                <template v-if="items.price.discount <= 0">
                  <p class="no-margin">{{ items.price.pretty_total }}</p>
                </template>
                <template v-else>
                  <p class="no-margin">{{ items.price.pretty_total_after_discount }}</p>
                </template>
              </div>
              <!-- col -->
            </div>
            <!-- row -->

            <!--addon-items-->
            <div
              v-for="addons in items.addons"
              :key="addons"
              class="addons q-mb-sm border-bottomx"
            >
              <div class="row q-mt-xs">
                <div class="col-3"></div>
                <div class="col">
                  <p class="no-margin text-weight-bold">{{ addons.subcategory_name }}</p>
                </div>
              </div>
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
            <!--addon-items-->
          </div>
          <!-- items -->

          <!-- SUMMARY -->
          <div
            v-for="summary in order_summary"
            :key="summary.name"
            class="row justify-center q-mb-sm q-mt-sm"
          >
            <template v-if="summary.type == 'total'">
              <div class="col text-weight-bold">{{ summary.name }}</div>
              <div class="col text-right text-weight-bold">{{ summary.value }}</div>
            </template>
            <template v-else>
              <div class="col text-weight-light">{{ summary.name }}</div>
              <div class="col text-right text-weight-light">{{ summary.value }}</div>
            </template>
          </div>
          <!-- SUMMARY -->
        </div>
        <!-- q-mt-md -->
      </template>
    </section>
  </q-card-section>
  <q-separator />
  <q-card-actions align="center">
    <div v-if="loading" class="row q-col-gutter-md full-width q-pa-sm">
      <div class="col"><q-skeleton type="QBtn" style="width: 90%" /></div>
      <div class="col">
        <q-skeleton type="QBtn" style="width: 90%" class="float-right" />
      </div>
    </div>

    <div v-else class="row q-col-gutter-md full-width q-pa-sm">
      <div class="col" v-if="!order_info.is_completed">
        <q-btn
          unelevated
          rounded
          color="negative"
          text-color="white"
          no-caps
          class="full-width"
          :loading="loading"
          :to="{
            path: '/account/trackorder',
            query: { order_uuid: order_info.order_uuid },
          }"
          size="17px"
        >
          {{ $t("Track") }}
        </q-btn>
      </div>
      <div class="col">
        <q-btn
          unelevated
          rounded
          color="warning"
          text-color="black"
          no-caps
          class="full-width"
          :loading="loading"
          style="letter-spacing: 2px"
          @click="this.$emit('orderBuyagain', order_info)"
          size="17px"
        >
          {{ $t("Buy again") }}
        </q-btn>
      </div>
    </div>
    <!-- row button -->
  </q-card-actions>
</template>

<script>
export default {
  name: "OrderSummary",
  props: ["loading", "order_data"],
  data() {
    return {
      order_items: [],
      order_summary: [],
      order_info: [],
      order_label: [],
      refund_transaction: [],
      order_status: [],
      order_services: [],
      order_table_data: [],
    };
  },
  updated() {
    this.order_items = this.order_data.data.items;
    this.order_summary = this.order_data.data.summary;
    this.order_info = this.order_data.data.order.order_info;
    this.order_label = this.order_data.data.label;
    this.refund_transaction = this.order_data.data.refund_transaction;
    this.order_status = this.order_data.data.order.status;
    this.order_services = this.order_data.data.order.services;
    this.order_services = this.order_services[this.order_info.service_code];
    this.order_status = this.order_status[this.order_info.status];
    this.order_table_data = this.order_data.data.order_table_data;
  },
  computed: {
    hasData() {
      if (Object.keys(this.order_items).length > 0) {
        return true;
      }
      return false;
    },
    hasRefund() {
      if (Object.keys(this.order_data.data.refund_transaction).length > 0) {
        return true;
      }
      return false;
    },
    hasBooking() {
      if (Object.keys(this.order_table_data).length > 0) {
        return true;
      }
      return false;
    },
  },
};
</script>
