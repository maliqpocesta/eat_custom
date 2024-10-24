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
                    <h5 class="text-weight-bold">{{ $t("Available Points") }}</h5>
                  </q-item-label>
                  <q-item-label caption>
                    {{ $t("Your points transaction history") }}
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
                  <template v-for="items in tabList" :key="items">
                    <q-tab
                      :name="items.value"
                      :label="items.label"
                      no-caps
                      content-class="text-weight-500 "
                    />
                  </template>
                </q-tabs>

                <q-infinite-scroll
                  ref="nscroll"
                  @load="getPointsTransaction"
                  :offset="350"
                >
                  <template v-slot:default>
                    <q-list class="q-mt-md">
                      <template v-for="datas in getData" :key="datas">
                        <template v-for="items in datas" :key="items.transaction_date">
                          <template v-if="tab == 'transaction'">
                            <q-item>
                              <q-item-section>
                                <q-item-label>{{
                                  items.transaction_description
                                }}</q-item-label>
                                <q-item-label caption>{{
                                  items.transaction_date
                                }}</q-item-label>
                              </q-item-section>
                              <q-item-section side>
                                <div
                                  class="text-bold"
                                  :class="{
                                    'text-green': items.transaction_type == 'credit',
                                    'text-red': items.transaction_type == 'debit',
                                  }"
                                >
                                  {{ items.transaction_amount }}
                                </div>
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-else>
                            <q-item>
                              <q-item-section>
                                <q-item-section>
                                  {{ items.restaurant_name }}
                                </q-item-section>
                              </q-item-section>
                              <q-item-section side>
                                <q-item-section>
                                  <div class="text-bold text-green">
                                    {{ items.total_earning }}
                                  </div>
                                </q-item-section>
                              </q-item-section>
                            </q-item>
                          </template>
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
                      <q-spinner-dots color="secondary" size="40px" />
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
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "Payments",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    AddressesSkeleton: defineAsyncComponent(() => import("components/AddressesSkeleton")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      data: [],
      loading: false,
      tab: "transaction",
      tabList: [
        {
          value: "transaction",
          label: this.$t("Transactions"),
        },
        {
          value: "points_merchant",
          label: this.$t("Points by merchant"),
        },
      ],
      page: 0,
      is_refresh: undefined,
      balance: 0,
      loading_balance: true,
    };
  },
  setup(props) {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  async mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      if (this.SettingsStore.settings_data.points_enabled) {
        this.getAvailablePoints();
      } else {
        this.$router.push("/home");
      }
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          if (newData.points_enabled) {
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
  },
  methods: {
    getAvailablePoints() {
      this.loading_balance = true;
      APIinterface.fetchDataByTokenPost("getAvailablePoints")
        .then((data) => {
          if (data.code == 1) {
            this.balance = data.details.total;
          } else {
            this.balance = 0;
          }
        })
        .catch((error) => {})
        .then((data) => {
          this.loading_balance = false;
        });
    },
    getPointsTransaction(index, done) {
      this.loading = true;
      this.page = index;
      const method =
        this.tab == "transaction"
          ? "getPointsTransaction"
          : "getPointsTransactionMerchant";
      APIinterface.fetchDataByTokenPost(method, "page=" + index)
        .then((data) => {
          if (data.code == 1) {
            this.data.push(data.details.data);
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
      this.$refs.nscroll.reset();
      this.$refs.nscroll.resume();
      this.$refs.nscroll.trigger();
    },
  },
};
</script>

<style lang="sass"></style>
