<template>
  <q-page padding>
    <LocationNav />
    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <template v-if="loading">
          <q-inner-loading
            :showing="loading"
            label-class="text-warning"
            label-style="font-size: 1.1em"
            color="warning"
          />
        </template>
        <template v-else>
          <template v-if="!loading && hasData">
            <div class="text-left">
              <h4 class="no-margin text-weight-bold q-pb-sm">
                {{ data.title }}
              </h4>
            </div>
            <q-card flat>
              <q-card-section>
                <span v-html="data.long_content"></span>
              </q-card-section>
            </q-card>
          </template>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "CustomPage",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
  },
  data() {
    return {
      loading: true,
      data: [],
      message: "",
    };
  },
  created() {
    this.getPage();
  },
  updated() {
    this.getPage();
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
    getPage() {
      this.loading = true;
      APIinterface.fetchDataPost("getPage", "slug=" + this.$route.params.slug)
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
