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
            <q-card flat class="fit">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    <h5 class="text-weight-bold">{{ $t("Total Bookings") }}</h5>
                  </q-item-label>
                  <q-item-label caption>
                    {{ $t("Your bookings reservations") }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-item-label>
                    <template v-if="loading_balance">
                      <q-inner-loading :showing="true" size="md" color="warning" />
                    </template>
                    <template v-else>
                      <h4 class="text-weight-bold text-warning">
                        {{ balance }}
                      </h4>
                    </template>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />

              <div class="q-pa-md">
                <q-tabs
                  v-model="tab"
                  dense
                  active-color="dark"
                  indicator-color="warning"
                  align="justify"
                  narrow-indicator
                  no-caps
                  :class="{
                    'text-grey300': $q.dark.mode,
                    'text-dark': !$q.dark.mode,
                  }"
                  class="bg-grey-2 rounded-borders"
                  :breakpoint="0"
                  @update:model-value="tabChange"
                >
                  <template v-for="(items, index) in getTabList" :key="items">
                    <q-tab
                      :name="index"
                      :label="items"
                      no-caps
                      content-class="text-weight-500 "
                    />
                  </template>
                </q-tabs>

                <q-infinite-scroll ref="nscroll" @load="getTransaction" :offset="350">
                  <template v-slot:default>
                    <template v-if="!hasData && !loading">
                      <div class="default-height flex flex-center text-grey">
                        {{ $t("No data available") }}
                      </div>
                    </template>

                    <q-list class="q-mt-md">
                      <template v-for="datas in getData" :key="datas">
                        <template v-for="items in datas" :key="items.reservation_id">
                          <q-item
                            clickable
                            :to="{
                              path: '/reservation/track',
                              query: {
                                id: items.reservation_uuid,
                              },
                            }"
                          >
                            <q-item-section v-if="merchant[items.merchant_id]" avatar>
                              <q-avatar size="80px" square>
                                <q-img
                                  fit="contain"
                                  :src="merchant[items.merchant_id].url_logo"
                                  loading="lazy"
                                  spinner-color="warning"
                                  spinner-size="sm"
                                />
                              </q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label v-if="merchant[items.merchant_id]">
                                {{ merchant[items.merchant_id].restaurant_name }}
                              </q-item-label>
                              <q-item-label caption>{{ items.booking_id }}</q-item-label>
                              <q-item-label caption class="font11">
                                {{ items.reservation_date_raw }}
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-badge
                                rounded
                                :label="items.status"
                                class="q-pl-sm q-pr-sm"
                                :style="{
                                  'background-color': `${items.status_color.background}`,
                                  color: `${items.status_color.color}`,
                                }"
                              />
                            </q-item-section>
                          </q-item>
                          <q-separator spaced inset />
                        </template>
                      </template>
                    </q-list>
                  </template>

                  <template v-slot:loading>
                    <template v-if="page <= 1">
                      <div class="q-pa-xl">
                        <q-inner-loading
                          :showing="true"
                          color="warning"
                          size="md"
                          label-class="dark"
                          class="transparent"
                        />
                      </div>
                    </template>
                    <div v-else-if="page > 2" class="row justify-center absolute-bottom">
                      <q-spinner-dots color="warning" size="40px" />
                    </div>
                  </template>
                </q-infinite-scroll>
              </div>
            </q-card>
          </div>
          <!-- right -->
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { defineAsyncComponent } from "vue";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "BookingPage",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    AddressesSkeleton: defineAsyncComponent(() => import("components/AddressesSkeleton")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      data: [],
      merchant: [],
      loading: false,
      tab: "all",
      page: 0,
      is_refresh: undefined,
      balance: 0,
      loading_balance: true,
    };
  },
  setup(props) {
    const DataStorePersisted = userDataStorePersisted();
    const SettingsStore = useSettingsStore();
    return { DataStorePersisted, SettingsStore };
  },
  async mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      if (this.SettingsStore.settings_data.booking_enabled) {
        this.getAvailablePoints();
      } else {
        this.$router.push("/home");
      }
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          if (newData.booking_enabled) {
            this.getAvailablePoints();
          } else {
            this.$router.push("/home");
          }
        }
      );
    }
  },
  computed: {
    hasData() {
      if (this.data.length > 0) {
        return true;
      }
      return false;
    },
    getData() {
      return this.data;
    },
    isMobile() {
      if (this.$q.screen.lt.md) {
        return true;
      } else {
        return false;
      }
    },
    getTabList() {
      if (Object.keys(this.DataStorePersisted.booking_status_list).length > 0) {
        return this.DataStorePersisted.booking_status_list;
      }
      return false;
    },
  },
  methods: {
    getAvailablePoints() {
      this.loading_balance = true;
      APIinterface.fetchDataPostTableToken("BookingSummary")
        .then((data) => {
          if (data.code == 1) {
            this.balance = data.details.summary.total_reservation;
          } else {
            this.balance = 0;
          }
        })
        .catch((error) => {})
        .then((data) => {
          this.loading_balance = false;
        });
    },
    getTransaction(index, done) {
      this.loading = true;
      this.page = index;
      APIinterface.fetchDataPostTableToken(
        "BookingList",
        "page=" + index + "&status=" + this.tab
      )
        .then((data) => {
          if (data.code == 1) {
            this.data.push(data.details.data);
            this.merchant = data.details.merchant;
            this.table_list = data.details.table_list;
          } else {
            if (this.$refs.nscroll) {
              this.$refs.nscroll.stop();
            }
          }
        })
        .catch((error) => {
          if (this.$refs.nscroll) {
            this.$refs.nscroll.stop();
          }
        })
        .then((data) => {
          this.loading = false;
          done();
          if (!APIinterface.empty(this.is_refresh)) {
            this.is_refresh();
          }
        });
    },
    tabChange() {
      this.resetPagination();
    },
    resetPagination() {
      this.page = 0;
      this.data = [];
      this.merchant = [];
      this.table_list = [];
      this.$refs.nscroll.reset();
      this.$refs.nscroll.resume();
      this.$refs.nscroll.trigger();
    },
  },
};
</script>

<style lang="sass"></style>
