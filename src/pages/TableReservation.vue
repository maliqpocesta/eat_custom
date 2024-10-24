<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="text-left">
          <template v-if="isEdit">
            <q-btn
              flat
              color="warning"
              icon="las la-angle-left"
              :label="$t('Back to reservation')"
              no-caps
              dense
              :to="{ name: 'track-reservation', query: { id: this.reservation_uuid } }"
            />
            <h4 class="no-margin text-weight-bold q-pb-sm">
              {{ $t("Update Reservation") }}
            </h4>
          </template>
          <template v-else>
            <h4 class="no-margin text-weight-bold q-pb-sm">
              {{ $t("Table reservations") }}
            </h4>
          </template>
        </div>
        <q-card flat>
          <q-card-section id="reservation_details">
            <template v-if="steps == 1">
              <div class="row q-col-gutter-md">
                <q-select
                  v-model="guest"
                  :options="guest_list"
                  @update:model-value="getTimeslot"
                  :label="$t('Guest')"
                  dense
                  color="warning"
                  class="q-mb-md col-xs-12 col-sm-12 col-md-4"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                />
                <q-select
                  v-model="reservation_date"
                  :options="date_list"
                  @update:model-value="getTimeslot"
                  :label="$t('Date')"
                  dense
                  color="warning"
                  class="q-mb-md col-xs-12 col-sm-12 col-md-4"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  map-options
                />
                <q-input
                  filled
                  class="col-xs-12 col-sm-12 col-md-4"
                  v-model="reservation_time"
                  :label="$t('Time')"
                  dense
                  disable
                />
              </div>

              <!-- time list -->
              <div class="q-mt-sm q-mb-sm">
                <q-inner-loading :showing="loading" color="warning" />
                <div v-if="hasTimeSlot" class="row q-gutter-sm">
                  <template v-for="items in time_slot" :key="items">
                    <template v-for="(item, index) in items" :key="item">
                      <div class="col-2 text-center">
                        <!-- :color="isSelected(index) ? 'warning' : 'black'" -->
                        <q-btn
                          unelevated
                          :outline="isSelected(index) ? false : true"
                          :color="
                            isSelected(index)
                              ? 'warning'
                              : isNotavailable(index)
                              ? 'grey'
                              : 'black'
                          "
                          :label="item"
                          class="full-width"
                          @click="reservation_time = index"
                          :disabled="isNotavailable(index)"
                        />
                      </div>
                    </template>
                  </template>
                </div>
                <div v-else class="bg-deep-orange-1 q-pa-md">
                  <span class="text-deep-orange-4">
                    {{
                      $t(
                        "We do not have any slots available for given criteria, please view the next available date"
                      )
                    }}
                  </span>
                </div>
              </div>
              <!-- time list -->

              <div class="q-mt-lg">
                <q-btn
                  type="submit"
                  unelevated
                  color="warning"
                  text-color="dark"
                  no-caps
                  class="full-width"
                  :label="$t('Continue')"
                  size="17px"
                  rounded
                  :disabled="!bookingValid"
                  :loading="loading"
                  @click="nextStep"
                >
                </q-btn>
              </div>
            </template>
            <!-- STEP 1 -->

            <template v-else-if="steps == 2">
              <q-form @submit="onSubmit">
                <q-btn
                  flat
                  color="warning"
                  icon="las la-angle-left"
                  :label="$t('Back')"
                  no-caps
                  dense
                  @click="this.steps = 1"
                />
                <h5 class="q-mt-sm">{{ $t("Reservation details") }}</h5>
                <div class="text-grey">
                  <div>{{ reservation_info.full_time }}</div>
                  <div>{{ reservation_info.guest }}</div>
                </div>

                <h5>{{ $t("Personal details") }}</h5>

                <div class="row q-col-gutter-md">
                  <q-input
                    bg-color="mygrey"
                    color="warning"
                    outlined
                    v-model="first_name"
                    :label="$t('First name')"
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                    class="col-xs-12 col-sm-12 col-md-6"
                  />
                  <q-input
                    bg-color="mygrey"
                    color="warning"
                    outlined
                    v-model="last_name"
                    :label="$t('Last name')"
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                    class="col-xs-12 col-sm-12 col-md-6"
                  />
                </div>

                <q-input
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  v-model="email_address"
                  :label="$t('Email address')"
                  lazy-rules
                  :rules="[
                    (val, rules) =>
                      rules.email(val) || $t('Please enter a valid email address'),
                  ]"
                />

                <q-input
                  bg-color="mygrey"
                  color="warning"
                  outlined
                  v-model="mobile_number"
                  :label="$t('Mobile number')"
                  :prefix="mobile_prefix"
                  mask="##################"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('This field is required'),
                    (val) => val.length <= 15 || $t('Please use maximum 15 characters'),
                  ]"
                />

                <div v-if="allowed_choose_table" class="row q-col-gutter-md">
                  <q-select
                    v-model="room_uuid"
                    :options="room_list"
                    @update:model-value="table_uuid = ''"
                    :label="$t('Room name')"
                    color="warning"
                    class="q-mb-md col-xs-12 col-sm-12 col-md-6"
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                  />
                  <q-select
                    v-model="table_uuid"
                    :options="table_list[room_uuid]"
                    :label="$t('Table name')"
                    color="warning"
                    class="q-mb-md col-xs-12 col-sm-12 col-md-6"
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                  />
                </div>

                <div class="text-grey q-mb-xs">{{ $t("Special requests") }}</div>
                <q-input
                  v-model="special_request"
                  filled
                  type="textarea"
                  color="warning"
                />

                <p class="text-grey q-mt-md q-mb-md">
                  {{
                    $t("By continuing, you agree to Terms of Service and Privacy Policy")
                  }}.
                </p>

                <div class="q-mt-sm q-mb-md" v-if="!SettingsStore.loading_settings">
                  <componentsRecaptcha
                    ref="recapcha"
                    :sitekey="SettingsStore.settings_data.captcha_site_key"
                    :is_enabled="
                      SettingsStore.settings_data.captcha_enabled ? '1' : false
                    "
                    :language_code="SettingsStore.settings_data.captcha_lang"
                    size="normal"
                    theme="light"
                    :tabindex="0"
                    @verify="recaptchaVerified"
                    @expire="recaptchaExpired"
                    @fail="recaptchaFailed"
                  />
                </div>

                <q-btn
                  type="submit"
                  unelevated
                  color="warning"
                  text-color="dark"
                  no-caps
                  class="full-width"
                  :label="$t('Reserve')"
                  size="17px"
                  rounded
                  :disabled="!reservationValid"
                  :loading="submit_loading"
                >
                </q-btn>
              </q-form>
            </template>
            <!-- STEP 2 -->

            <template v-else-if="steps == 3">
              <div class="text-center">
                <svg
                  class="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                  <path
                    class="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>

                <h4 v-if="isEdit">{{ $t("Your reservation succesfully updated") }}.</h4>
                <h4 v-else>{{ $t("Your reservation successfully placed") }}.</h4>
                <p class="text-grey">
                  {{
                    $t("You will receive another email once your reservation is confirm")
                  }}.
                </p>

                <h5>{{ success_data.full_time }}</h5>
                <div class="text-grey">
                  <div>{{ success_data.guest }}</div>
                  <div>
                    {{ $t("Reservation ID") }}#
                    <span class="text-success">{{ success_data.reservation_id }}</span>
                  </div>
                </div>

                <div
                  class="row inline q-gutter-md q-mt-lg"
                  :class="{ column: $q.screen.lt.sm }"
                >
                  <q-btn
                    v-if="!isEdit"
                    unelevated
                    color="warning"
                    text-color="white"
                    no-caps
                    :label="$t('Reserved table again')"
                    size="17px"
                    rounded
                    @click="resetReservation()"
                  >
                  </q-btn>
                  <q-btn
                    outline
                    unelevated
                    color="white"
                    text-color="grey"
                    no-caps
                    :label="$t('Track your reservation')"
                    size="17px"
                    rounded
                    :to="{
                      name: 'track-reservation',
                      query: { id: success_data.reservation_uuid },
                    }"
                  >
                  </q-btn>
                </div>
              </div>
            </template>
            <!-- STEP 3 -->
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { useSettingsStore } from "stores/SettingsStore";
import { scroll } from "quasar";
import auth from "src/api/auth";
const { getScrollTarget, setVerticalScrollPosition, getVerticalScrollPosition } = scroll;

export default {
  name: "TableReservation",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    componentsRecaptcha: defineAsyncComponent(() =>
      import("components/componentsRecaptcha")
    ),
  },
  data() {
    return {
      loading: true,
      data: [],
      loaded: true,
      steps: 1,
      guest_list: [],
      guest: 1,
      reservation_date: "",
      reservation_time: "",
      reservation_time_pretty: "",
      time_slot: [],
      new_time_slot: [],
      date_list: [],
      all_time_slot: [],
      tc: "",
      first_name: "",
      last_name: "",
      email_address: "",
      special_request: "",
      mobile_prefix: "",
      mobile_number: "",
      loading: false,
      loading_time_slot: false,
      submit_loading: false,
      next_step_loading: false,
      reservation_info: [],
      success_data: [],
      recaptcha_response: "",
      not_available_time: [],
      track_reservation_link: "",
      data_booking: [],
      details_link: "",
      allowed_choose_table: false,
      room_list: [],
      room_uuid: "",
      table_uuid: "",
      reservation_uuid: "",
    };
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  async created() {
    this.reservation_uuid = !APIinterface.empty(this.$route.query.id)
      ? this.$route.query.id
      : "";
    if (auth.authenticated()) {
      let user = auth.getUser();
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email_address = user.email_address;
      this.mobile_number = user.contact_number;
    }
  },
  mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.getSettings();
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.getSettings();
        }
      );
    }
  },
  computed: {
    hasTimeSlot() {
      if (Object.keys(this.all_time_slot).length > 0) {
        return true;
      }
      return false;
    },
    bookingValid() {
      let $pass = true;
      if (this.guest <= 0) {
        $pass = false;
      }
      if (APIinterface.empty(this.reservation_date)) {
        $pass = false;
      }
      if (APIinterface.empty(this.reservation_time)) {
        $pass = false;
      }
      return $pass;
    },
    reservationValid() {
      let $pass = true;
      if (APIinterface.empty(this.first_name)) {
        $pass = false;
      }
      if (APIinterface.empty(this.last_name)) {
        $pass = false;
      }
      if (APIinterface.empty(this.mobile_number)) {
        $pass = false;
      }
      return $pass;
    },
    isEdit() {
      if (!APIinterface.empty(this.reservation_uuid)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async getSettings() {
      const resp = await this.SettingsStore.getAsyncSettings();
      if (resp.booking_enabled) {
        this.Getbookingattributes();
        this.mobile_prefix = resp.phone_data.phonecode;
      } else {
        this.$router.push("/home");
      }
    },
    isSelected(data) {
      if (this.reservation_time == data) {
        return true;
      } else {
        return false;
      }
    },
    Getbookingattributes() {
      this.loaded = true;
      this.loading = true;
      APIinterface.fetchDataPostTable(
        "Getbookingattributes",
        "merchant_uuid=" +
          this.SettingsStore.merchant_uuid +
          "&id=" +
          this.reservation_uuid
      )
        .then((response) => {
          this.guest_list = response.details.guest_list;
          this.date_list = response.details.date_list;
          this.time_slot = response.details.time_slot;
          this.all_time_slot = response.details.all_time_slot;
          this.reservation_date = response.details.default_date;
          this.tc = response.details.tc;
          this.allowed_choose_table = response.details.allowed_choose_table;
          this.room_list = response.details.room_list;

          if (Object.keys(this.time_slot).length > 0) {
            Object.entries(this.time_slot).forEach(([key, items]) => {
              Object.entries(items).forEach(([key1, items1]) => {
                this.new_time_slot.push({
                  label: items1,
                  value: key1,
                });
              });
            });
          }

          this.not_available_time = response.details.not_available_time;
          this.guest = response.details.default_guest;
          this.data_booking = response.details.data_booking;
          this.details_link = response.details.details_link;

          if (!APIinterface.empty(this.reservation_uuid)) {
            this.guest = response.details.data_booking.guest_number_raw;
            this.reservation_time = response.details.data_booking.reservation_time_raw;
            this.first_name = response.details.data_booking.first_name;
            this.last_name = response.details.data_booking.last_name;
            this.email_address = response.details.data_booking.email_address;
            this.special_request = response.details.data_booking.special_request;

            this.mobile_prefix = response.details.data_booking.phone_prefix;
            this.mobile_number =
              response.details.data_booking.contact_phone_without_prefix;
          }
        })
        .catch((error) => {
          this.guest_list = [];
          this.date_list = [];
          this.time_slot = [];
          this.all_time_slot = [];
          this.reservation_date = "";
          this.tc = "";
          this.not_available_time = [];
          this.data_booking = [];
          this.allowed_choose_table = [];
          this.room_list = [];
          this.room_uuid = "";
          this.table_uuid = "";
        })
        .then((data) => {
          this.loading = false;
        });
    },
    getTimeslot() {
      this.loading_time_slot = true;
      this.reservation_time = "";
      let $params = "merchant_uuid=" + this.SettingsStore.merchant_uuid;
      $params += "&reservation_date=" + this.reservation_date;
      $params += "&guest=" + this.guest;
      $params += "&id=" + this.reservation_uuid;
      console.log($params);

      APIinterface.fetchDataPostTable("Gettimeslot", $params)
        .then((response) => {
          this.time_slot = response.details.time_slot;
          this.all_time_slot = response.details.all_time_slot;
          this.not_available_time = response.details.not_available_time;
        })
        .catch((error) => {
          this.time_slot = [];
          this.all_time_slot = [];
          this.not_available_time = [];
        })
        .then((data) => {
          this.loading_time_slot = false;
        });
    },
    isNotavailable(bookingTime) {
      if (Object.keys(this.not_available_time).length > 0) {
        if (this.not_available_time.includes(bookingTime) === true) {
          return true;
        }
      }
      return false;
    },
    nextStep() {
      this.next_step_loading = true;
      let $params = "merchant_uuid=" + this.SettingsStore.merchant_uuid;
      $params += "&reservation_date=" + this.reservation_date;
      $params += "&reservation_time=" + this.reservation_time;
      $params += "&guest=" + this.guest;
      $params += "&id=" + this.reservation_uuid;
      console.log($params);

      APIinterface.fetchDataPostTableToken("SetBooking", $params)
        .then((response) => {
          this.steps = 2;
          this.reservation_info = response.details;
          this.table_list = response.details.table_list;
          if (!APIinterface.empty(this.reservation_uuid)) {
            this.room_uuid = response.details.room_uuid;
            this.table_uuid = response.details.table_uuid;
          } else {
            this.room_uuid = "";
            this.table_uuid = "";
          }
        })
        .catch((error) => {
          this.reservation_info = [];
          this.table_list = [];
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.next_step_loading = false;
        });
    },
    onSubmit() {
      this.submit_loading = true;
      let $params = "merchant_uuid=" + this.SettingsStore.merchant_uuid;
      $params += "&reservation_date=" + this.reservation_date;
      $params += "&reservation_time=" + this.reservation_time;
      $params += "&guest=" + this.guest;
      $params += "&first_name=" + this.first_name;
      $params += "&last_name=" + this.last_name;
      $params += "&email_address=" + this.email_address;
      $params += "&mobile_prefix=" + this.mobile_prefix;
      $params += "&mobile_number=" + this.mobile_number;
      $params += "&room_uuid=" + this.room_uuid;
      $params += "&table_uuid=" + this.table_uuid;
      $params += "&special_request=" + this.special_request;
      $params += "&recaptcha_response=" + this.recaptcha_response;
      $params += "&id=" + this.reservation_uuid;
      $params += "&request_from=single_app";

      APIinterface.fetchDataPostTableToken("ReserveTable", $params)
        .then((response) => {
          this.steps = 3;
          this.success_data = response.details;
          this.room_uuid = "";
          this.table_uuid = "";
          this.scrollToElement("reservation_details");
        })
        .catch((error) => {
          this.success_data = [];
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.submit_loading = false;
        });
    },
    resetReservation() {
      this.steps = 1;
      this.Getbookingattributes();
      this.guest = 1;
      this.reservation_date = "";
      this.reservation_time = "";
    },
    scrollToElement(id) {
      const ele = document.getElementById(id);
      console.log(ele);
      const target = getScrollTarget(ele);
      const offset = ele.offsetTop;
      const duration = 500;
      setVerticalScrollPosition(target, offset, duration);
    },
    recaptchaVerified(response) {
      this.recaptcha_response = response;
    },
    recaptchaExpired() {
      if (this.settings.merchant_captcha_enabled == "1") {
        this.$refs.recapcha.reset();
      }
    },
    recaptchaFailed() {},
    //
  },
};
</script>
