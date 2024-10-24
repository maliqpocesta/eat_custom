<template>
  <template v-if="loading">
    <q-skeleton type="text" class="w-50" />
  </template>
  <template v-else>
    <template v-if="getData">
      <div class="row items-center">
        <div class="col">
          <template v-if="use_thresholds">
            <template v-if="data.discount > 0">
              <div class="text-green text-caption">{{ data.discount_label }}</div>
            </template>
            <template v-else>
              <div>{{ $t("Add Points") }}</div>
            </template>
          </template>
          <template v-else>
            <template v-if="data.discount > 0">
              <div class="text-green text-caption">{{ data.discount_label }}</div>
            </template>
            <template v-else>
              {{ data.redeem_discount }}
            </template>
            <div v-if="data.discount <= 0" class="text-green text-caption font11">
              {{ data.redeem_label }}
            </div>
          </template>
        </div>
        <div class="col-3 text-right">
          <template v-if="data.discount > 0">
            <q-btn @click.stop="removePoints" flat color="warning" no-caps>{{
              $t("Remove")
            }}</q-btn>
          </template>
          <template v-else>
            <q-btn @click.stop="showDialog" flat color="warning" no-caps>{{
              $t("Add")
            }}</q-btn>
          </template>
        </div>
      </div>
    </template>
  </template>

  <q-dialog
    v-model="dialog"
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
    @before-show="this.points = 0"
  >
    <q-card :class="{ 'card-medium-width': !this.$q.screen.lt.md }">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-bold">{{ $t("Apply discount") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form @submit="applyPoints" class="q-gutter-sm">
          <div>
            <template v-if="use_thresholds">
              <template v-if="loading_points">
                <div class="text-center q-pa-sm">
                  <q-spinner color="primary" size="2em" />
                </div>
              </template>
              <template v-else>
                <q-tabs
                  v-model="points_tab"
                  class="text-dark q-mb-lg"
                  no-caps
                  active-color="white"
                  active-bg-color="blue"
                  indicator-color="blue"
                  @update:model-value="setPoints"
                >
                  <template v-for="items in data_points" :key="items">
                    <q-tab :name="items" :disable="balance > items.points ? false : true">
                      <div class="text-caption">{{ items.label }}</div>
                      <div class="text-subtitle2 q-mb-sm">
                        {{ items.amount }}
                      </div>
                      <q-linear-progress
                        size="18px"
                        :value="balance / items.points"
                        style="min-width: 70px"
                        class="radius28"
                        :color="balance >= items.points ? 'yellow-9' : 'blue'"
                      >
                        <div
                          v-if="balance >= items.points"
                          class="absolute-full flex flex-center"
                        >
                          <span class="text-white font12 text-weight-bold">{{
                            $t("REDEEM")
                          }}</span>
                        </div>
                      </q-linear-progress>
                    </q-tab>
                  </template>
                </q-tabs>
              </template>
            </template>
            <template v-else>
              <q-input
                v-model="points"
                :label="$t('Enter points to convert to discount')"
                outlined
                lazy-rules
                :bg-color="$q.dark.mode ? 'grey600' : 'input'"
                :label-color="$q.dark.mode ? 'grey300' : 'grey'"
                borderless
                class="input-borderless"
              />
            </template>
          </div>
          <div class="q-mt-md">
            <q-btn
              :loading="loading_apply"
              :disable="points > 0 ? false : true"
              type="submit"
              unelevated
              color="warning"
              text-color="dark"
              no-caps
              class="full-width"
              :label="$t('Apply')"
              size="17px"
              rounded
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  props: ["currency_code", "use_thresholds", "cart_loaded", "cart_updated"],
  name: "PointsCart",
  data() {
    return {
      loading: true,
      loading_apply: false,
      loading_remove: false,
      data: [],
      dialog: false,
      points: 0,
      loading_points: false,
      points_tab: 0,
      data_points: [],
      balance: 0,
      points_id: 0,
    };
  },
  watch: {
    cart_loaded(newval, oldval) {
      if (newval == false) {
        this.getCartpoints();
      }
    },
    cart_updated(newval, oldval) {
      if (newval == false) {
        this.getCartpoints();
      }
    },
  },
  computed: {
    getData() {
      if (Object.keys(this.data).length > 0) {
        return this.data;
      }
      return false;
    },
  },
  methods: {
    showDialog() {
      if (this.use_thresholds) {
        this.getPointsthresholds();
      }
      this.dialog = !this.dialog;
    },
    getCartpoints(isRefresh) {
      if (!isRefresh) {
        this.loading = true;
      }
      APIinterface.fetchDataByTokenPost(
        "getCartpoints",
        "cart_uuid=" +
          APIinterface.getStorage("cart_uuid") +
          "&currency_code=" +
          this.currency_code
      )
        .then((data) => {
          this.data = data.details;
        })
        .catch((error) => {
          this.data = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
    applyPoints() {
      this.loading_apply = true;
      APIinterface.fetchDataByTokenPost(
        "applyPoints",
        "cart_uuid=" +
          APIinterface.getStorage("cart_uuid") +
          "&currency_code=" +
          this.currency_code +
          "&points=" +
          this.points +
          "&points_id=" +
          this.points_id
      )
        .then((data) => {
          this.dialog = false;
          this.$emit("afterApplypoints");
          this.getCartpoints();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_apply = false;
        });
    },
    removePoints() {
      this.loading_remove = true;
      APIinterface.fetchDataByTokenPost(
        "removePoints",
        "cart_uuid=" + APIinterface.getStorage("cart_uuid")
      )
        .then((data) => {
          this.$emit("afterApplypoints");
          this.getCartpoints();
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_remove = false;
        });
    },
    getPointsthresholds() {
      this.loading_points = true;
      APIinterface.fetchDataByTokenPost(
        "getPointsthresholds",
        "cart_uuid=" +
          APIinterface.getStorage("cart_uuid") +
          "&currency_code=" +
          this.currency_code
      )
        .then((data) => {
          this.data_points = data.details.data;
          this.balance = data.details.balance;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_points = false;
        });
    },
    setPoints() {
      this.points = this.points_tab.points;
      this.points_id = this.points_tab.id;
    },
  },
};
</script>
