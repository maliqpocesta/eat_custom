<template>
  <q-page padding>
    <!-- location nav -->
    <LocationNav
      ref="location_nav"
      @after-getinfo="afterGetinfo"
      @change-transaction="changeTransaction"
    />
    <!-- location nav

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">

        <BannerCarousel ref="banner_carousel" />

      </div>
    </div>-->

    <!-- Menu Section -->
    <div id="menu" class="row justify-center" v-scroll="onScroll">
      <div class="col-md-12 col-12">
        <CategoryNav
          ref="category_nav"
          @show-category="showCategory"
          @after-categoryselected="afterCategoryselected"
          :selected_category="selected_category"
        />

        <CategoryDialog
          ref="category_dialog"
          :data="data_category"
          @after-categoryselected="afterCategoryselected"
        />

        <template v-if="loading">
          <section v-for="i in 2" :key="i" class="q-mb-md">
            <q-skeleton type="rect" width="200px" class="q-mb-sm" />
            <div class="row  justify-start items-center q-col-gutter-md">
              <div
                v-for="ii in 4"
                :key="ii"
                class="col-lg-2 col-md-3 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none"
              >
                <SkeletonItem />
              </div>
            </div>
          </section>
        </template>

        <template v-else>
          <section
            v-for="(category, category_index) in data_category"
            :key="category.cat_id"
            class="q-mb-md"
          >
            <div class="row justify-between items-center q-mb-sm">
              <div class="col">
                <h4
                  :id="category.category_uiid"
                  :ref="setItemRef"
                  class="no-margin text-weight-bold q-pb-sm"
                >
                  {{ category.category_name }}
                </h4>
              </div>

            </div>

            <template v-if="DataStorePersisted.menu_type == 'list'">
              <div class="row q-col-gutter-md">
                <template v-for="items_id in category.items" :key="items_id">
                  <div v-if="data_items[items_id]" class="col-md-6 col-sm-6 col-xs-12">
                    <q-card flat bordered="false" class="q-pa-sm">
                      <q-item>
                        <q-item-section avatar>
                          <q-img
                            :src="data_items[items_id].url_image"
                            style="height: 120px; width: 120px"
                            loading="lazy"
                            fit="cover"
                            spinner-color="warning"
                            spinner-size="sm"
                          ></q-img>
                        </q-item-section>
                        <q-item-section top>
                          <q-item-label>
                            <span v-html="data_items[items_id].item_name"></span>
                          </q-item-label>
                          <q-item-label caption class="ellipsis-3-lines">
                            <span v-html="data_items[items_id].item_description"></span>
                          </q-item-label>
                          <q-item-label v-if="data_items[items_id].dish">
                            <div class="q-gutter-x-xs">
                              <template
                                v-for="dish_id in data_items[items_id].dish"
                                :key="dish_id"
                              >
                                <template v-if="dish[dish_id]">
                                  <q-avatar
                                    size="md"
                                    style="border: 2px solid white"
                                    class="bg-yellow-9"
                                  >
                                    <img :src="dish[dish_id].url_image" />
                                  </q-avatar>
                                </template>
                              </template>
                            </div>
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <div>
                        <q-item>
                          <q-item-section avatar style="width: 120px">
                            <template v-if="data_items[items_id].total_allergens > 0">
                              <q-btn
                                round
                                unelevated
                                color="mygrey"
                                text-color="dark"
                                size="sm"
                                icon="o_info"
                                @click.stop="showAllergens(items_id)"
                              />
                            </template>
                          </q-item-section>
                          <q-item-section>
                            <div class="row items-center">
                              <div class="col text-weight-medium">
                                <template v-if="data_items[items_id].price[0]">
                                  <template
                                    v-if="data_items[items_id].price[0].discount <= 0"
                                  >
                                    <span class="q-mr-sm"
                                      >{{ data_items[items_id].price[0].size_name }}
                                      {{
                                        data_items[items_id].price[0].pretty_price
                                      }}</span
                                    >
                                  </template>
                                  <template v-else>
                                    <span class="q-mr-sm"
                                      >{{ data_items[items_id].price[0].size_name }}
                                      <del class="text-grey">{{
                                        data_items[items_id].price[0].pretty_price
                                      }}</del>
                                      {{
                                        data_items[items_id].price[0]
                                          .pretty_price_after_discount
                                      }}</span
                                    >
                                  </template>
                                </template>
                              </div>
                              <div class="col-3 text-right">
                                <q-btn
                                  round
                                  :color="
                                    itemAvailable(items_id, category.cat_id)
                                      ? 'warning'
                                      : 'grey-3'
                                  "
                                  icon="add"
                                  unelevated
                                  size="12px"
                                  :disable="
                                    itemAvailable(items_id, category.cat_id)
                                      ? false
                                      : true
                                  "
                                  @click.stop="
                                    ShowItems(
                                      data_items[items_id].slug,
                                      category.cat_id,
                                      data_items[items_id].item_uuid
                                    )
                                  "
                                />
                              </div>
                            </div>
                          </q-item-section>
                        </q-item>
                      </div>
                    </q-card>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="row justify-start items-center q-col-gutter-md">
  <template v-for="items_id in category.items" :key="items_id">
    <div v-if="data_items[items_id]" class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
      <q-card flat bordered="false">
        <!-- Name and Button Row -->
        <q-item>
          <q-item-section class="col-9">
            <q-item-label class="ellipsis-2-lines">
              <span v-html="data_items[items_id].item_name"></span>
            </q-item-label>
          </q-item-section>

          <q-item-section class="col-3">
            <q-btn
              unelevated
              rounded
              :color="itemAvailable(items_id, category.cat_id) ? 'warning' : 'grey-3'"
              :disable="itemAvailable(items_id, category.cat_id) ? false : true"
              text-color="black"
              no-caps
              size="sm"
              class="full-width"
              :label="itemAvailable(items_id, category.cat_id) ? $t('Add to cart') : $t('Not available')"
              @click.stop="ShowItems(data_items[items_id].slug, category.cat_id, data_items[items_id].item_uuid)"
            />
          </q-item-section>
        </q-item>

        <!-- Price Section -->
        <q-item class="item-min-height">
          <q-item-section>
            <template v-if="data_items[items_id].price[0]">
              <template v-if="data_items[items_id].price[0].discount <= 0">
                <span class="q-mr-sm">
                  {{ data_items[items_id].price[0].size_name }}
                  {{ data_items[items_id].price[0].pretty_price }}
                </span>
              </template>
              <template v-else>
                <span class="q-mr-sm">
                  {{ data_items[items_id].price[0].size_name }}
                  <del class="text-grey">{{ data_items[items_id].price[0].pretty_price }}</del>
                  {{ data_items[items_id].price[0].pretty_price_after_discount }}
                </span>
              </template>
            </template>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </template>
</div>
            </template>
          </section>
        </template>
      </div>
    </div>

    <ProductDetails ref="product_details" @after-addtocart="afterAddtocart">
    </ProductDetails>
    <AddressNeededModal ref="address_needed"></AddressNeededModal>
    <AllergensDetails
      ref="allergens"
      :merchant_id="merchant_id"
      :allergens_item_id="allergens_item_id"
    ></AllergensDetails>

    <template v-if="!is_guest">
      <LocationModal
        ref="location_modal"
        :enabled_search="false"
        :title="$t('Choose location')"
        @after-selectaddress="afterSelectaddress"
        @after-setplaceid="afterSetplaceid"
      />
    </template>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { scroll } from "quasar";
import APIinterface from "src/api/APIinterface";
import { useSettingsStore } from "stores/SettingsStore";
const { getScrollTarget, setVerticalScrollPosition } = scroll;
import { useTransactionStore } from "stores/Transaction";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { usestoreAvailable } from "stores/storeAvailable";
import auth from "src/api/auth";

export default {
  name: "Home",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    BannerCarousel: defineAsyncComponent(() => import("components/BannerCarousel")),
    CategoryNav: defineAsyncComponent(() => import("components/CategoryNav")),
    SkeletonItem: defineAsyncComponent(() => import("components/SkeletonItem")),
    CategoryDialog: defineAsyncComponent(() => import("components/CategoryDialog")),
    ProductDetails: defineAsyncComponent(() => import("components/ProductDetails")),
    AddressNeededModal: defineAsyncComponent(() =>
      import("components/AddressNeededModal")
    ),
    AllergensDetails: defineAsyncComponent(() => import("components/AllergensDetails")),
    LocationModal: defineAsyncComponent(() => import("components/LocationModal")),
  },
  data() {
    return {
      slide_banner: 1,
      autoplay: true,
      drawer: false,
      data: [],
      data_category: [],
      data_items: [],
      loading: false,
      category_seleted: "",
      itemRefs: [],
      category_position: [],
      items_not_available: [],
      category_not_available: [],
      trans_type: "",
      merchant_id: "",
      allergens_item_id: "",
      selected_category: "default",
      is_guest: false,
      menu_type: 1,
      dish: [],
    };
  },
  setup() {
    const SettingsStore = useSettingsStore();
    const transactionStore = useTransactionStore();
    const DataStorePersisted = userDataStorePersisted();
    const ifstoreAvailable = usestoreAvailable();
    return { SettingsStore, transactionStore, DataStorePersisted, ifstoreAvailable };
  },
  created() {
    this.$watch(
      () => this.transactionStore.$state.change_currency,
      (newData, oldData) => {
        this.getMenu(true);
      }
    );
  },
  mounted() {
    this.selected_category = this.$route.query.cat_id;
    if (!APIinterface.empty(this.selected_category)) {
      setTimeout(() => {
        this.afterCategoryselected(this.selected_category);
      }, 800);
    }

    if (Object.keys(this.SettingsStore.settings_data).length > 0) {
      this.menu_type = this.SettingsStore.settings_data.menu_type;
      this.getMenu(false);
    } else {
      this.$watch(
        () => this.SettingsStore.$state.settings_data,
        (newData, oldData) => {
          this.menu_type = newData.menu_type;
          this.getMenu(false);
        }
      );
    }

    this.is_guest = true;
    if (auth.authenticated()) {
      this.is_guest = false;
    }

    if (this.is_guest) {
      this.showAddressIfNeeded();
    } else {
      this.showAddressBook();
    }
  },
  methods: {
    showAddressBook() {
      if (
        APIinterface.empty(this.DataStorePersisted.local_id) &&
        this.DataStorePersisted.transaction_type == "delivery"
      ) {
        setTimeout(() => {
          this.$refs.location_modal.show_modal = true;
        }, 1000);
      }
    },
    showAddressIfNeeded() {
      if (
        APIinterface.empty(this.DataStorePersisted.local_id) &&
        this.DataStorePersisted.transaction_type == "delivery"
      ) {
        setTimeout(() => {
          this.$refs.address_needed.modal = true;
        }, 1000);
      }
    },
    itemAvailable(item_id, cat_id) {
      if (this.items_not_available.includes(parseInt(item_id)) === false) {
        if (this.category_not_available.includes(parseInt(cat_id)) === false) {
          return true;
        }
      }
      return false;
    },
    getMenu(isRefresh) {
      if (!isRefresh) {
        this.loading = true;
      }
      APIinterface.geStoreMenu(this.DataStorePersisted.getUseCurrency())
        .then((data) => {
          this.merchant_id = data.details.merchant_id;
          this.data_category = data.details.data.category;
          this.data_items = data.details.data.items;
          this.items_not_available = data.details.data.items_not_available;
          this.category_not_available = data.details.data.category_not_available;
          this.dish = data.details.data.dish;
        })
        .catch((error) => {
          console.debug(error);
          this.items_not_available = [];
          this.category_not_available = [];
        })
        .then((data) => {
          this.loading = false;
        });
    },
    showCategory() {
      this.$refs.category_dialog.show_modal = true;
    },
    afterCategoryselected(id) {
      this.$refs.category_dialog.show_modal = false;
      this.$refs.category_dialog.category = id;
      this.scrollToElement(id);
    },
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el);
      }
    },
    onScroll(position) {
      //
    },
    scrollToElement(id) {
      const ele = document.getElementById(id);
      if (!APIinterface.empty(ele)) {
        const target = getScrollTarget(ele);
        const offset = ele.offsetTop;
        const duration = 500;
        setVerticalScrollPosition(target, offset, duration);
      }
    },
    ShowItems(slug, cat_id, item_uuid) {
      if (this.menu_type == 1) {
        this.$router.push({
          name: "product",
          params: {
            slug: slug,
            cat_id: cat_id,
            item_uuid: item_uuid,
          },
        });
      } else {
        this.itemModal(cat_id, item_uuid);
      }
    },
    itemModal(cat_id, item_uuid) {
      this.$refs.product_details.showItem(cat_id, item_uuid);
    },
    afterAddtocart() {
      this.ifstoreAvailable.after_addtocart = true;
    },
    showAllergens(item_id) {
      this.allergens_item_id = item_id;
      this.$refs.allergens.dialog = true;
    },
    afterSetplaceid(data) {
      console.log("afterSetplaceid", data);
      this.ifstoreAvailable.after_addtocart = true;
    },
    changeMenuType() {
      this.DataStorePersisted.menu_type =
        this.DataStorePersisted.menu_type == "column" ? "list" : "column";
    },
  },
};
</script>

<style lang="scss">
.item-min-height {
  min-height: 50px;
}
</style>
