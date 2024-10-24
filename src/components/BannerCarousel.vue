<template>
  <q-skeleton :height="screenSize" square v-if="loading" />
  <template v-else>
    <q-carousel
      v-if="hasData"
      animated
      v-model="slide"
      arrows
      infinite
      swipeable
      :autoplay="autoplay"
      control-color="cnavigation"
      control-type="unelevated"
      height="400px"
      class="banner-carousel bg-grey-2"
    >
      <q-carousel-slide
        v-for="(items, index) in data"
        :key="items.banner_id"
        :name="index"
        :img-src="items.image"
        class="cursor-pointer"
        @click="showItems(items)"
      />
    </q-carousel>
  </template>
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "BannerCarousel",
  mounted() {
    this.getBanner();
  },
  data() {
    return {
      slide: 0,
      data: [],
      item_data: [],
      loading: false,
      autoplay: true,
    };
  },
  computed: {
    screenSize() {
      if (this.$q.screen.lt.sm) {
        return "150px";
      } else if (this.$q.screen.lt.md) {
        return "300px";
      } else {
        return "400px";
      }
    },
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    showItems(data) {
      if (!APIinterface.empty(this.item_data[data.item_id])) {
        this.$router.push({
          name: "product",
          params: {
            slug: this.item_data[data.item_id].slug,
            cat_id: this.item_data[data.item_id].cat_id,
            item_uuid: this.item_data[data.item_id].item_token,
          },
        });
      }
    },
    getBanner() {
      this.loading = true;
      APIinterface.getBanner()
        .then((data) => {
          this.data = data.details.data;
          this.item_data = data.details.item_data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.data = [];
          this.item_data = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
