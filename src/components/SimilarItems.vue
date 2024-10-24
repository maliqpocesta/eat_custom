<template>
  <div class="q-mt-md flex justify-between items-center">
    <div>
      <h5 class="text-weight-bold no-margin">{{ title }}</h5>
    </div>
    <div>
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

  <div class="q-mt-md">
    <template v-if="loading">
      <div>
        <q-skeleton height="130px" />
      </div>
    </template>
    <template v-else>
      <swiper
        :slides-per-view="getPerSlide"
        :space-between="10"
        :loop="true"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
        :modules="modules"
        @swiper="onSwiper"
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
                    item_uuid: items.item_uuid,
                  },
                }"
              >
                <q-card flat bordered="false" class="q-pa-sm">
                  <div class="relative-position">
                    <q-img
                      fit="contain"
                      :src="items.url_image"
                      style="max-width: 100%; height: 120px"
                      spinner-color="warning"
                      spinner-size="sm"
                      placeholder-src="placeholder.png"
                      class="radius10"
                    ></q-img>
                    <div class="absolute-bottom-right q-pa-sm">
                      <q-btn round color="dark" icon="add" unelevated size="sm" />
                    </div>
                  </div>

                  <div class="q-pt-sm">
                    <div class="text-weight-bold text-h5" v-if="items.price">
                      <template v-if="items.price[0]">
                        <template v-if="items.price[0].discount > 0">
                          {{ items.price[0].pretty_price_after_discount }}
                        </template>
                        <template v-else>
                          {{ items.price[0].pretty_price }}
                        </template>
                      </template>
                    </div>
                    <div class="line-normal text-body2 ellipsis">
                      {{ items.item_name }}
                    </div>
                  </div>
                </q-card>
              </router-link>
            </swiper-slide>
          </template>
        </template>
      </swiper>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import APIinterface from "src/api/APIinterface";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "SimilarItems",
  props: ["title", "bg", "change_currency"],
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
    const DataStorePersisted = userDataStorePersisted();
    const SettingsStore = useSettingsStore();
    const slider = ref(null);
    const onSwiper = (swiper) => {
      slider.value = swiper;
    };
    return {
      slider,
      onSwiper,
      modules: [Autoplay],
      DataStorePersisted,
      SettingsStore,
    };
  },
  async mounted() {
    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.getSimilarItems(true);
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.getSimilarItems(true);
        }
      );
    }
  },
  computed: {
    getPerSlide() {
      if (this.$q.screen.lt.sm) {
        return 1.2;
      } else if (this.$q.screen.lt.md) {
        return 2.2;
      } else {
        return 4;
      }
    },
  },
  watch: {
    change_currency(newval, oldval) {
      this.getSimilarItems(false);
    },
  },
  methods: {
    getSimilarItems(isRefresh) {
      this.loading = isRefresh;
      APIinterface.SimilarItems(this.DataStorePersisted.getUseCurrency())
        .then((results) => {
          this.data = results.details.data;
        })
        .catch((error) => {
          console.debug(error);
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
