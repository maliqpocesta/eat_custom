<template>
  <template v-if="loading">
    <div class="row fit justify-start items-center q-gutter-none q-col-gutter-md">
      <div
        v-for="items in screenSize"
        :key="items"
        class="col-lg-3 col-md-3 col-sm-6 col-xs-12"
      >
        <q-card flat bordered="false" class="my-card full-height">
          <q-item>
            <q-skeleton height="150px" class="full-width" square />
          </q-item>

          <q-item-section class="q-pl-md q-pr-md">
            <q-item-label>
              <q-skeleton type="text" class="q-pt-sm" />
              <q-skeleton type="text" style="width: 40%" />
            </q-item-label>
          </q-item-section>
        </q-card>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="row items-center justify-between q-mt-lg">
      <div class="col-md-6 col-xs-6">
        <h4 class="text-weight-bold no-margin">{{ title }}</h4>
        <p class="text-weight-thin">{{ subtitle }}</p>
      </div>
      <div class="col-md-3 col-xs-6 text-right">
        <div class="row inline q-col-gutter-md">
          <div class="column">
            <q-btn
              round
              unelevated
              dense
              color="warning"
              icon="ion-arrow-back"
              class="btn-icon-small"
              @click.stop="slider.slidePrev()"
            />
          </div>
          <div class="column">
            <q-btn
              round
              unelevated
              dense
              color="warning"
              icon="ion-arrow-forward"
              class="btn-icon-small"
              @click.stop="slider.slideNext()"
            />
          </div>
        </div>
      </div>
    </div>

    <swiper
      ref="mySwiper"
      :dir="DataStorePersisted.rtl ? 'rtl' : 'ltr'"
      :space-between="15"
      :loop="true"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      :modules="modules"
      @swiper="onSwiper"
      :slides-per-view="screenSize"
    >
      <template v-for="items in data" :key="items">
        <template v-if="items.slug">
          <swiper-slide>
            <router-link
              :to="{
                name: 'product',
                params: {
                  slug: items.slug,
                  cat_id: items.cat_id,
                  item_uuid: items.item_token,
                },
              }"
            >
              <q-card
                flat
                bordered="false"
                class="my-card full-height cursor-pointer q-pt-sm"
              >
                <q-img
                  fit="contain"
                  :src="items.url_image"
                  class="no-margin"
                  loading="lazy"
                  height="150px"
                  spinner-size="sm"
                  spinner-color="warning"
                />
                <q-card-section class="no-margin q-pt-sm">
                  <div class="text-weight-bold text-h5">{{ items.pretty_price }}</div>
                  <div class="line-normal text-body2 ellipsis">
                    {{ items.item_name }}
                  </div>
                </q-card-section>
              </q-card>
            </router-link>
          </swiper-slide>
        </template>
      </template>
    </swiper>
  </template>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useTransactionStore } from "stores/Transaction";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "ItemCarousel",
  props: ["meta", "title", "subtitle"],
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      data: [],
      loading: true,
    };
  },
  setup(props) {
    const slider = ref(null);
    const DataStorePersisted = userDataStorePersisted();
    const transactionStore = useTransactionStore();
    const SettingsStore = useSettingsStore();
    const onSwiper = (swiper) => {
      slider.value = swiper;
    };
    return {
      slider,
      onSwiper,
      modules: [Autoplay],
      DataStorePersisted,
      transactionStore,
      SettingsStore,
    };
  },
  async mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.getItemFeatured(false);
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.getItemFeatured(false);
        }
      );
    }
  },
  watch: {
    transactionStore: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (!APIinterface.empty(newValue.change_currency)) {
          this.getItemFeatured(true);
        }
      },
    },
  },
  beforeUnmount() {
    if (!APIinterface.empty(this.$refs.mySwiper)) {
      this.$refs.mySwiper.$el.swiper.destroy(true, true);
    }
  },
  computed: {
    screenSize() {
      if (this.$q.screen.lt.sm) {
        return 1.2;
      } else if (this.$q.screen.lt.md) {
        return 2.2;
      } else {
        return 4;
      }
    },
    hasData() {
      if (this.data.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    getItemFeatured(isRefresh) {
      if (!isRefresh) {
        this.loading = true;
      }
      APIinterface.ItemFeatured(this.meta, this.DataStorePersisted.getUseCurrency())
        .then((data) => {
          this.data = data.details;
        })
        .catch((error) => {
          //
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
