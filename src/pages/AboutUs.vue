<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="text-left">
          <h4 class="no-margin text-weight-bold q-pb-sm">{{ $t("About Us") }}</h4>
        </div>
        <template v-if="loading">
          <q-inner-loading
            :showing="loading"
            label-class="text-warning"
            label-style="font-size: 1.1em"
            color="warning"
          />
        </template>
        <q-card v-if="!loading && hasData" flat>
          <q-card-section>
            <div class="row items-start q-mb-lg">
              <div v-if="$q.screen.gt.sm" class="col-1">
                <q-icon name="las la-info-circle" size="md" />
              </div>
              <div class="col">
                <h5 class="q-ma-none">{{ data.data.few_words }}</h5>
                <div class="q-ma-md"></div>
                <span
                  class="text-weight-light"
                  v-html="data.data.short_description"
                ></span>
              </div>
            </div>
            <!-- row -->

            <div class="row items-start q-mb-lg">
              <div v-if="$q.screen.gt.sm" class="col-1">
                <q-icon name="las la-map-marker-alt" size="md" />
              </div>
              <div class="col">
                <h5 class="q-ma-none">{{ $t("Address") }}</h5>
                <div class="q-ma-md"></div>
                <div class="row justify-between items-center">
                  <div class="text-weight-light">{{ data.data.merchant_address }}</div>
                  <div>
                    <q-btn
                      :label="$t('Get directions')"
                      flat
                      color="warning"
                      :dense="$q.screen.lt.sm"
                      v-close-popup
                      no-caps
                      :href="data.data.map_direction"
                      target="_blank"
                    >
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
            <!-- row -->

            <div class="row items-start q-mb-lg">
              <div v-if="$q.screen.gt.sm" class="col-1">
                <q-icon name="las la-clock" size="md" />
              </div>
              <div class="col">
                <h5 class="q-ma-none">{{ $t("Opening hours") }}</h5>
                <div class="q-ma-md"></div>

                <q-list>
                  <q-expansion-item
                    expand-separator
                    :label="$t('Today')"
                    :caption="data.open_at"
                  >
                    <q-card class="text-weight-light">
                      <q-card-section>
                        <div v-for="items in data.opening_hours" :key="items" class="row">
                          <div class="col text-capitalize">{{ items.value }}</div>
                          <div class="col">
                            {{ items.start_time }} - {{ items.end_time }}
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
            <!-- row -->

            <div class="row items-start q-mb-lg">
              <div v-if="$q.screen.gt.sm" class="col-1">
                <q-icon name="las la-photo-video" size="md" />
              </div>
              <div class="col">
                <h5 class="q-ma-none">{{ $t("Gallery") }}</h5>
                <div class="q-ma-md"></div>

                <div class="row inline gallery w-50" @click="carousel = true">
                  <template v-for="(items, index) in data.gallery" :key="items">
                    <div class="image-col q-ma-xs">
                      <template v-if="index > 4">
                        <div class="dimmed relative-position cursor-pointer">
                          <q-img
                            :src="items.thumbnail"
                            spinner-color="warning"
                            spinner-size="sm"
                            style="height: 90px; max-width: 100px"
                            class="rounded-borders-10 cursor-pointer"
                          />
                          <div class="absolute-center text-white" style="z-index: 9">
                            <h4 class="q-ma-none">+2</h4>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <q-img
                          :src="items.thumbnail"
                          spinner-color="warning"
                          spinner-size="sm"
                          style="height: 90px; max-width: 100px"
                          class="rounded-borders-10 cursor-pointer"
                        />
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- row -->
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="carousel">
      <q-card style="width: 700px; max-width: 80vw; min-height: 30vw">
        <q-card-section v-if="!loading && hasData">
          <q-carousel animated v-model="slide" arrows navigation infinite>
            <template v-for="(items, index) in data.gallery" :key="items">
              <q-carousel-slide :name="index" :img-src="items.image_url" />
            </template>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "AboutUs",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
  },
  data() {
    return {
      loading: true,
      data: [],
      carousel: false,
      slide: 0,
    };
  },
  created() {
    this.getInfo();
  },
  computed: {
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    getInfo() {
      this.loading = true;
      APIinterface.fetchDataPost("getInfo", "")
        .then((data) => {
          this.data = data.details;
        })
        .catch((error) => {
          this.$router.push("/404");
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
