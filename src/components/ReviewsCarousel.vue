<template>
  <div class="row items-center justify-between q-mt-lg q-mb-md">
    <div class="col-md-6 col-xs-6">
      <q-skeleton type="rect" v-if="loading" />
      <h4 v-else class="text-weight-bold no-margin">{{ title }}</h4>
    </div>
    <div class="col-md-3 text-right col-xs-6">
      <div class="row inline q-col-gutter-md">
        <div class="column">
          <q-skeleton v-if="loading" type="circle" style="height: 2.4em; width: 2.4em" />
          <q-btn
            v-else
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
          <q-skeleton v-if="loading" type="circle" style="height: 2.4em; width: 2.4em" />
          <q-btn
            v-else
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
  <!-- row -->

  <!-- skeleton -->
  <div
    v-if="loading"
    class="row full-width justify-start items-center q-gutter-none no-wrap"
  >
    <div v-for="items in 3" :key="items" class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <q-card flat bordered class="full-height q-pa-sm rounded-borders-10">
        <div class="row q-mt-lg q-col-gutter-md">
          <div class="col-3">
            <q-skeleton type="QAvatar" style="height: 35px; width: 35px" />
          </div>
          <div class="col">
            <q-skeleton type="text" />
            <q-skeleton type="text" />
          </div>
        </div>

        <div class="q-pa-sm q-mt-md">
          <q-skeleton type="text" />
          <q-skeleton type="text" />
          <q-skeleton type="text" />
        </div>
      </q-card>
    </div>
  </div>
  <!-- skeleton -->
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
    <template v-for="items in data.data" :key="items">
      <swiper-slide>
        <q-card flat bordered class="full-height q-pa-sm rounded-borders-10">
          <div class="row items-center q-mt-lg">
            <div class="col">
              <div class="row inline items-center q-col-gutter-md">
                <div class="column">
                  <q-avatar class="col" size="35px">
                    <q-img
                      fit="contain"
                      :src="items.url_image"
                      class="no-margin"
                      loading="lazy"
                      height="35px"
                      spinner-size="sm"
                      spinner-color="warning"
                    />
                  </q-avatar>
                </div>
                <div class="column">
                  <p class="no-margin">
                    <template v-if="items.as_anonymous == 1">
                      {{ items.hidden_fullname }}
                    </template>
                    <template v-else>
                      {{ items.fullname }}
                    </template>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-3 self-start">
              <q-icon name="format_quote" color="warning" size="2.5rem" />
            </div>
          </div>

          <div class="q-pa-sm q-mt-sm">
            <p class="font12 text-weight-thin ellipsis-3-lines">
              {{ items.review }}
            </p>
          </div>
        </q-card>
      </swiper-slide>
    </template>
  </swiper>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { userDataStorePersisted } from "stores/DataStorePersisted";

export default {
  name: "ReviewsCarousel",
  props: ["title"],
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      slide: 0,
      data: [],
      page: 0,
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
    this.getReview();
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
        return 3;
      }
    },
  },
  methods: {
    getReview() {
      this.loading = true;
      APIinterface.getReview(this.page, null)
        .then((data) => {
          this.data = data.details;
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
