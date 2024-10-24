<template>
  <LocationNav />

  <q-page padding>
    <div id="menu" class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <template v-if="loading">
          <div class="q-mb-md"><q-skeleton type="rect" width="250px" /></div>
          <div class="row fit justify-start items-center q-col-gutter-md">
            <div
              v-for="i in 4"
              :key="i"
              class="col-lg-2 col-md-3 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none"
            >
              <SkeletonItem />
            </div>
          </div>
        </template>
        <!-- skeleton loader -->

        <template v-else>
          <template v-if="hasData">
            <h4 class="no-margin text-weight-bold q-pb-sm">
              {{ $t("Search results for") }} “{{ q }}” ({{ totalFound }})
            </h4>
            <div class="row fit justify-start items-center q-col-gutter-md">
              <!-- col -->
              <div
                v-for="items in data"
                :key="items.item_id"
                class="col-lg-2 col-md-3 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none"
              >
                <q-card flat bordered="false">
                  <q-item>
                    <q-item-section>
                      <q-img
                        :src="items.url_image"
                        style="height: 120px"
                        class="full-width"
                        loading="lazy"
                        fit="cover"
                      ></q-img>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="ellipsis">
                        <span v-html="items.item_name"></span>
                      </q-item-label>
                      <q-item-label caption>
                        <template v-if="items.price[0]">
                          <template v-if="items.price[0].discount <= 0">
                            <span class="q-mr-sm"
                              >{{ items.price[0].size_name }}
                              {{ items.price[0].pretty_price }}</span
                            >
                          </template>
                          <template v-else>
                            <span class="q-mr-sm"
                              >{{ items.price[0].size_name }}
                              <del>{{ items.price[0].pretty_price }}</del>
                              {{ items.price[0].pretty_price_after_discount }}</span
                            >
                          </template>
                        </template>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-btn
                        unelevated
                        rounded
                        text-color="black"
                        no-caps
                        class="full-width"
                        :label="items.available ? $t('Add to cart') : $t('Not available')"
                        :to="{
                          name: 'product',
                          params: {
                            slug: items.slug,
                            cat_id: items.cat_id,
                            item_uuid: items.item_uuid,
                          },
                        }"
                        :disable="items.available ? false : true"
                        :color="items.available ? 'warning' : 'grey-3'"
                      />
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </template>
          <template v-else>
            <div class="w-50 margin-auto q-pt-lg">
              <h4 class="no-margin text-weight-bold q-pb-sm">
                {{ $t("No results for") }} “{{ q }}”
              </h4>
              <p class="text-grey">
                {{ $t("Sorry, no product matched for your search. Please try again") }}.
              </p>
            </div>
          </template>
        </template>
        <!-- end if loading -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useTransactionStore } from "stores/Transaction";

export default {
  name: "SearchProduct",
  data() {
    return {
      q: "",
      loading: false,
      data: [],
    };
  },
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    const transactionStore = useTransactionStore();
    return { DataStorePersisted, transactionStore };
  },
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    SkeletonItem: defineAsyncComponent(() => import("components/SkeletonItem")),
  },
  mounted() {
    this.initSearch(false);
  },
  updated() {
    this.initSearch(false);
  },
  watch: {
    transactionStore: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (!APIinterface.empty(newValue.change_currency)) {
          this.initSearch(true);
        }
      },
    },
  },
  computed: {
    totalFound() {
      return Object.keys(this.data).length;
    },
    hasData() {
      if (Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    initSearch(data) {
      this.q = this.$route.params.q;
      this.menuSearch(data);
    },
    menuSearch(data) {
      if(!data){
        this.loading = true;
      }
      APIinterface.menuSearch(this.q, this.DataStorePersisted.getUseCurrency())
        .then((data) => {
          this.data = data.details.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.data = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
