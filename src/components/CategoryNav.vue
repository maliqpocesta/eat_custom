<template>
  <q-page-sticky expand position="top">
    <q-toolbar class="bg-white">
      <template v-if="loading">
        <div class="row inline full-width q-col-gutter-md">
          <div v-for="i in 5" :key="i" class="col-2">
            <q-skeleton type="rect" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="row fit items-center justify-start">
          <div class="col-1 lt-md">
            <q-btn
              @click="$emit('showCategory')"
              round
              color="white"
              unelevated
              text-color="dark"
              icon="list"
              dense
            />
          </div>
          <div class="col">
            <q-tabs
              v-model="category"
              align="left"
              class="text-dark"
              style="max-width: 100%"
              indicator-color="warning"
              outside-arrows
              content-class="category-nav"
            >
              <template v-for="items in data" :key="items.cat_id">
                <q-tab
                  :name="items.category_uiid"
                  class="text-black"
                  :label="items.category_name"
                  no-caps
                  @click="$emit('afterCategoryselected', items.category_uiid)"
                />
              </template>
            </q-tabs>
          </div>
        </div>
        <!-- row -->
      </template>
    </q-toolbar>
  </q-page-sticky>
  <div class="q-pa-xs-md q-pa-md-lg"></div>
  {{ cat_dialog }}
</template>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "CategoryNav",
  props: ["selected_category"],
  data() {
    return {
      slide: 0,
      data: [],
      category: "",
      loading: false,
    };
  },
  mounted() {
    this.getCategory();
  },
  watch: {
    selected_category(newval, oldval) {
      this.category = newval;
    },
  },
  methods: {
    getCategory() {
      this.loading = true;
      APIinterface.Category(0)
        .then((data) => {
          this.data = data.details.data;
        })
        // eslint-disable-next-line
        .catch((error) => {})
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
