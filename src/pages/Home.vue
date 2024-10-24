<template>
  <q-page padding>
    <!-- location nav -->
    <LocationNav
      ref="location_nav"
      @after-getinfo="afterGetinfo"
      @change-transaction="changeTransaction"
    />
    <!-- location nav -->

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <!-- banner -->
        <BannerCarousel ref="banner_carousel" />
        <!-- banner -->

        <!-- items of the day-->
        <section>
          <ItemCarousel
            ref="item_carousel_best"
            meta="best_seller"
            :title="$t('Best seller')"
            :subtitle="$t('Looking for Best Sellers food near your area')"
          />
        </section>
        <!-- items of the day-->

        <!-- Menu -->
        <section>
          <CategoryCarousel
            ref="category_carousel"
            :title="$t('Menu')"
            :subtitle="$t('What you like to eat today')"
          />
        </section>
        <!-- Menu -->

        <!-- exclusive deals -->
        <section>
          <ItemCarousel
            ref="item_carousel_recommended"
            meta="recommended"
            :title="$t('Recommended')"
            :subtitle="$t('See our recommended food for today')"
          />
        </section>
        <!-- exclusive deals -->

        <!-- review carousel -->
        <section>
          <ReviewsCarousel :title="$t('What people say about us')" />
        </section>
        <!-- review carousel -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <!-- <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="yellow-9" padding="10px" />
    </q-page-scroller> -->
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "Home",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    ItemCarousel: defineAsyncComponent(() => import("components/ItemCarousel")),
    CategoryCarousel: defineAsyncComponent(() => import("components/CategoryCarousel")),
    ReviewsCarousel: defineAsyncComponent(() => import("components/ReviewsCarousel")),
    BannerCarousel: defineAsyncComponent(() => import("components/BannerCarousel")),
  },
  data() {
    return {
      slide_banner: 1,
      autoplay: true,
    };
  },
};
</script>

<style lang="scss"></style>
