<template>
  <template v-if="loading">
    <div class="row fit justify-start items-center q-col-gutter-md">
      <div
        v-for="items in screenSize"
        :key="items"
        class="col-lg-3 col-md-2 col-sm-4 col-xs-6 text-center"
      >
        <q-card style="max-width: 300px" flat bordered="false" class="q-pa-none">
          <q-item class="q-pa-xs">
            <q-skeleton height="100px" width="100%" square />
          </q-item>
          <q-item-section class="q-pa-sm">
            <q-item-label class="text-center">
              <q-skeleton type="text" />
              <q-skeleton type="text" style="width: 40%; margin: auto" />
            </q-item-label>
          </q-item-section>
        </q-card>
      </div>
    </div>
  </template>
  <template v-else>
    <h4 class="no-margin text-weight-bold">{{ title }}</h4>
    <p class="text-weight-thin">{{ subtitle }}</p>
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
        <swiper-slide>
          <router-link
            :to="{
              name: 'menu',
              query: {
                cat_id: items.category_uiid,
              },
            }"
          >
            <div class="rounded-bg">
              <div class="row justify-center items-center fit">
                <div class="col q-pa-sm">
                  <q-avatar size="35px">
                    <q-img
                      fit="contain"
                      :src="items.url_icon"
                      class="no-margin"
                      loading="lazy"
                      height="35px"
                    />
                  </q-avatar>
                  <div class="text-h6 q-pt-lg ellipsis">{{ items.category_name }}</div>
                  <q-badge rounded color="warning" text-color="dark">
                    <!-- {{items.items.length}} items -->
                    {{ items.items.length }} {{ $t("items") }}
                  </q-badge>
                </div>
              </div>
            </div>
          </router-link>
        </swiper-slide>
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

export default {
  name: "CategoryCarousel",
  props: ["title", "subtitle"],
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      slide: ref("index0"),
      data: [],
      loading: false,
    };
  },
  setup(props) {
    const slider = ref(null);
    const DataStorePersisted = userDataStorePersisted();
    const onSwiper = (swiper) => {
      slider.value = swiper;
    };
    return {
      slider,
      onSwiper,
      modules: [Autoplay],
      DataStorePersisted,
    };
  },
  mounted() {
    this.getCategory();
  },
  beforeUnmount() {
    if (!APIinterface.empty(this.$refs.mySwiper)) {
      this.$refs.mySwiper.$el.swiper.destroy(true, true);
    }
  },
  computed: {
    screenSize() {
      if (this.$q.screen.lt.sm) {
        return 2;
      } else if (this.$q.screen.lt.md) {
        return 4;
      } else {
        return 6;
      }
    },
  },
  methods: {
    getCategory() {
      this.loading = true;
      APIinterface.Category(null)
        .then((data) => {
          this.data = data.details.data;
        })
        .catch((error) => {})
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
