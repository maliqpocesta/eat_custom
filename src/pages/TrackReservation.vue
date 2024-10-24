<template>
  <q-page padding>
    <LocationNav />
    <div id="reservation" class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <template v-if="loading">
          <q-inner-loading :showing="loading" color="warning" />
        </template>
        <template v-else>
          <template v-if="steps <= 3">
            <q-stepper
              v-if="$q.screen.gt.xs"
              v-model="steps"
              ref="stepper"
              color="primary"
              animated
              active-icon="las la-check"
              active-color="warning"
              done-color="warning"
              flat
              class="bg-grey-2"
            >
              <q-step
                :name="1"
                :title="$t('Pending')"
                icon="las la-check"
                :done="step > 1 || steps >= 2"
              >
              </q-step>
              <q-step
                :name="2"
                :title="$t('Confirm')"
                icon="las la-check"
                :done="step > 2 || steps >= 3"
              >
              </q-step>
              <q-step
                :name="3"
                :title="$t('Completed')"
                icon="las la-check"
                :done="step > 3"
              >
              </q-step>
            </q-stepper>
            <template v-else>
              <div class="text-center">
                <div class="h5" :class="bookingStatus">{{ data.status_pretty }}</div>
              </div>
            </template>
          </template>
          <template v-else>
            <q-stepper
              v-model="steps"
              ref="stepper"
              color="primary"
              animated
              active-icon="las la-times"
              active-color="red"
              flat
              class="bg-grey-2"
            >
              <q-step
                :name="4"
                :title="$t('Reservation Cancelled')"
                icon="las la-times"
                :done="step > 4"
              />
            </q-stepper>
          </template>
          <div class="row items-center q-pa-sm">
            <div class="col-xs-12 col-md-6">
              <div class="row inline items-center q-gutter-sm">
                <q-img
                  :src="merchant.logo"
                  style="height: 60px; width: 60px"
                  class="circle"
                  spinner-color="grey"
                  spinner-size="sm"
                />
                <div>
                  <h5 class="q-ma-none">{{ merchant.restaurant_name }}</h5>
                  <div class="text-grey font12">
                    {{ merchant.address }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-6 text-right">
              <q-btn
                v-if="CanCancelReservation"
                type="submit"
                unelevated
                color="red"
                text-color="white"
                no-caps
                :label="$t('Cancel Reservation')"
                size="17px"
                rounded
                :to="{ name: 'reservation-cancel', query: { id: this.id } }"
                :class="{ 'full-width q-mt-md q-mb-sm': $q.screen.lt.sm }"
              >
              </q-btn>
            </div>
          </div>
          <q-card flat>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-sm-12 col-md-6">
                  <h5 class="q-ma-none">{{ $t("Reservation Details") }}</h5>
                  <q-space class="q-pa-sm"></q-space>
                  <q-list separator>
                    <q-item>{{ $t("Reservation ID") }}: {{ data.reservation_id }}</q-item>
                    <q-item>{{ data.guest_number }}</q-item>
                    <q-item>{{ data.reservation_date }}</q-item>
                    <q-item>{{ data.reservation_time }}</q-item>
                  </q-list>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6">
                  <h5 class="q-ma-none">{{ $t("Your Details") }}</h5>
                  <q-space class="q-pa-sm"></q-space>
                  <q-list separator>
                    <q-item>{{ data.full_name }}</q-item>
                    <q-item>{{ data.email_address }}</q-item>
                    <q-item>{{ data.contact_phone }}</q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>{{ $t("Special Request") }}</q-item-label>
                        <q-item-label caption>{{ data.special_request }}</q-item-label>
                        <q-item-label v-if="data.cancellation_reason">
                          <span class="text-red"
                            >{{ $t("CANCELLATION NOTES") }} =
                            {{ data.cancellation_reason }}</span
                          >
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <q-space class="q-pa-sm"></q-space>
              <q-btn
                v-if="CanCancelReservation"
                type="submit"
                unelevated
                color="warning"
                text-color="dark"
                no-caps
                class="full-width"
                aria-setsize=""
                :label="$t('Modify Reservation')"
                :to="{ name: 'reservation-update', query: { id: this.id } }"
                :size="!this.$q.screen.lt.md ? '17px' : '15px'"
                rounded
              >
              </q-btn>
            </q-card-section>
          </q-card>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "TrackReservation",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
  },
  data() {
    return {
      id: "",
      steps: 1,
      loading: false,
      data: [],
      merchant: [],
      cancel_link: "",
      update_link: "",
      cancel_reservation_stats: [],
      pending_reservation_stats: [],
      confirm_reservation_stats: [],
      completed_reservation_stats: [],
      cancel_reservation_stats2: [],
    };
  },
  created() {
    this.getBookingDetails();
  },
  computed: {
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    hasMerchant() {
      if (Object.keys(this.merchant).length > 0) {
        return true;
      }
      return false;
    },
    CanCancelReservation() {
      if (this.cancel_reservation_stats.includes(this.data.status) === true) {
        return false;
      }
      return true;
    },
    bookingStatus() {
      if (this.cancel_reservation_stats2.includes(this.data.status) === true) {
        return "text-red";
      } else if (this.pending_reservation_stats.includes(this.data.status) === true) {
        return "text-blue";
      } else if (this.completed_reservation_stats.includes(this.data.status) === true) {
        return "text-orange";
      } else {
        return "text-green";
      }
    },
  },
  methods: {
    getBookingDetails() {
      this.id = this.$route.query.id;
      this.loading = true;
      APIinterface.fetchDataPostTableToken("BookingDetails", "id=" + this.id)
        .then((response) => {
          this.data = response.details.data;
          this.merchant = response.details.merchant;

          this.cancel_reservation_stats = response.details.cancel_reservation_stats;
          this.cancel_reservation_stats2 = response.details.cancel_reservation_stats2;
          this.pending_reservation_stats = response.details.pending_reservation_stats;
          this.confirm_reservation_stats = response.details.confirm_reservation_stats;
          this.completed_reservation_stats = response.details.completed_reservation_stats;
          this.setSteps();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
          this.data = [];
          this.merchant = [];
          this.cancel_link = "";
          this.update_link = "";

          this.cancel_reservation_stats = [];
          this.pending_reservation_stats = [];
          this.confirm_reservation_stats = [];
          this.completed_reservation_stats = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
    setSteps() {
      if (this.confirm_reservation_stats.includes(this.data.status) === true) {
        this.steps = 2;
      } else if (this.completed_reservation_stats.includes(this.data.status) === true) {
        this.steps = 3;
      } else if (this.cancel_reservation_stats.includes(this.data.status) === true) {
        this.steps = 4;
      } else {
        this.steps = 1;
      }
    },
    //
  },
};
</script>
