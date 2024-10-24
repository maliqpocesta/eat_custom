<template>
  <div class="row justify-center q-pa-md">
    <div class="col-md-9 col-12">
      <div v-if="loading" class="row justify-center q-col-gutter-md">
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <q-skeleton type="QBtn" />
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <q-skeleton type="text" />
          <q-skeleton type="text" />
        </div>
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <div class="row inline q-col-gutter-md float-right">
            <div class="col"><q-skeleton type="QAvatar" size="40px" /></div>
            <div class="col"><q-skeleton type="QAvatar" size="40px" /></div>
            <div class="col"><q-skeleton type="QAvatar" size="40px" /></div>
          </div>
        </div>
      </div>
      <!-- row -->

      <div v-else class="row justify-center">
        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <router-link to="/">
            <img
              alt="Quasar logo"
              src="logo@2x.png"
              class="cursor-pointer top-logo"
              style="max-width: 170px; max-height: 50px"
            />
          </router-link>
        </div>
        <!-- col -->
        <div
          v-for="items in data"
          :key="items.label"
          class="col-lg-3 col-md-3 col-sm-6 col-xs-12"
        >
          <h6 class="text-weight-bold q-mt-none q-mb-sm">{{ $t(items.label) }}</h6>

          <q-list v-for="item in items.items" :key="item.label">
            <template v-if="item.custom_url">
              <q-item clickable v-ripple :href="item.url" target="_blank">
                <q-item-section>
                  {{ item.label }}
                </q-item-section>
              </q-item>
            </template>
            <template v-else>
              <q-item
                clickable
                v-ripple
                :to="{
                  name: 'page',
                  params: {
                    slug: item.slug,
                  },
                }"
              >
                <q-item-section>
                  {{
                    page_title_translation[item.slug]
                      ? page_title_translation[item.slug]
                      : item.label
                  }}
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
        <!-- col -->

        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <q-btn
            v-if="social.facebook_page"
            :href="social.facebook_page"
            target="_blank"
            round
            flat
            color="warning"
            icon="lab la-facebook"
          />
          <q-btn
            v-if="social.twitter_page"
            :href="social.twitter_page"
            target="_blank"
            round
            flat
            color="warning"
            icon="lab la-twitter-square"
          />
          <q-btn
            v-if="social.instagram_page"
            :href="social.instagram_page"
            target="_blank"
            round
            flat
            color="warning"
            icon="lab la-instagram"
          />
          <q-btn
            v-if="social.google_page"
            :href="social.google_page"
            target="_blank"
            round
            flat
            color="warning"
            icon="lab la-google-plus"
          />
        </div>
        <!-- col -->
      </div>
      <!-- row -->
    </div>
  </div>
  <!-- row -->
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "Footer",
  data() {
    return {
      loading: false,
      data: [],
      social: [],
      page_title_translation: [],
    };
  },
  mounted() {
    this.getFooter();
  },
  methods: {
    getFooter() {
      this.loading = true;
      APIinterface.getFooter()
        .then((data) => {
          this.data = data.details.data;
          this.social = data.details.social;
          this.page_title_translation = data.details.page_title_translation;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
          this.page_title_translation = [];
          this.data = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
