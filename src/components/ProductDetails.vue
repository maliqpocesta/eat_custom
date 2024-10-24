<template>
  <q-dialog
    v-model="modal"
    @before-show="getMenuItem"
    @before-hide="beforeHide"
    persistent
    :position="this.$q.screen.lt.md ? 'bottom' : 'standard'"
  >
    <q-card :class="{ 'card-medium-items': !this.$q.screen.lt.md }">
      <template v-if="loading">
        <q-card-section style="min-height: 250px">
          <q-inner-loading :showing="true" color="warning" />
        </q-card-section>
      </template>
      <template v-else>
        <template v-if="hasData">
          <!-- <pre>{{ this.addons }}</pre> -->
          <div class="relative-position">
            <q-img
              fit="cover"
              :src="this.image_featured ? this.image_featured : items.url_image"
              class="no-margin"
              height="170px"
              placeholder-src="placeholder.png"
              spinner-color="warning"
              loading="lazy"
            />
            <div class="q-pa-sm absolute-top-right">
              <q-btn icon="close" color="grey" flat round dense v-close-popup />
            </div>
            <div class="q-pa-sm absolute-bottom-right">
              <Favs
                ref="favs"
                :item_token="items.item_token"
                :cat_id="items.cat_id"
                :active="items.save_item"
                @after-savefav="afterSavefav(items)"
              />
            </div>
          </div>
          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="text-h5 ellipsis text-weight-bold" v-html="items.item_name"></div>
            <div
              class="ellipsis-2-lines text-weight-light font12"
              v-html="items.item_description"
            ></div>

            <template v-if="hasGallery">
              <div class="q-mt-md">
                <ItemGallery
                  :item_gallery="item_gallery"
                  @after-selectimage="afterSelectimage"
                ></ItemGallery>
              </div>
            </template>

            <!-- size -->
            <div class="q-mt-sm">
              <div class="text-h6">{{ $t("Customize your Order") }}</div>
              <q-option-group
                v-model="item_size_id"
                :options="size_data"
                color="warning"
                inline
              />
            </div>
            <!-- size -->

            <!-- cooking ref -->
            <div
              v-if="cooking_data.length > 0"
              class="row justify-between q-pa-sm bg-grey-1 q-mt-md"
            >
              <div class="col">
                <h5 class="text-weight-bold q-ma-none">{{ $t("Cooking Reference") }}</h5>
              </div>
              <div class="col text-right">
                <template v-if="items.cooking_ref_required">
                  <span class="bg-yellow-11 q-pa-xs rounded-borders">{{
                    $t("Required")
                  }}</span>
                </template>
                <template v-else>
                  <span class="font12">({{ $t("Optional") }})</span>
                </template>
              </div>
            </div>
            <q-option-group
              v-model="cooking_ref"
              :options="cooking_data"
              color="warning"
              inline
            />
            <!-- cooking ref -->

            <!-- Ingredients -->
            <h5 v-if="ingredients_data.length > 0" class="text-weight-bold">
              {{ $t("Ingredients") }}
            </h5>
            <q-option-group
              v-model="ingredients"
              :options="ingredients_data"
              color="warning"
              inline
              type="checkbox"
            />
            <!-- Ingredients -->

            <!-- addons -->

            <template v-if="addons[item_size_id]">
              <template v-for="addons in addons[item_size_id]" :key="addons.subcat_id">
                <!-- addons -->

                <h5 class="text-weight-bold q-mb-none q-mb-xs">
                  {{ addons.subcategory_name }}
                </h5>
                <div class="row justify-between bg-grey-1 q-pa-sm">
                  <p
                    v-if="addons.multi_option === 'one'"
                    class="col no-margin q-pr-sm font12"
                  >
                    {{ $t("Select 1") }}
                  </p>
                  <p
                    v-else-if="addons.multi_option === 'multiple'"
                    class="col no-margin q-pr-sm font12"
                  >
                    <template v-if="addons.multi_option_min > 0">
                      {{
                        $t("Select minimum {min} to maximum {max}", {
                          min: addons.multi_option_min,
                          max: addons.multi_option_value,
                        })
                      }}
                    </template>
                    <template v-else>
                      {{
                        $t("Choose up to {count}", { count: addons.multi_option_value })
                      }}
                    </template>
                  </p>
                  <p
                    v-else-if="addons.multi_option === 'custom'"
                    class="col no-margin q-pr-sm font12"
                  >
                    <template v-if="addons.multi_option_min > 0">
                      {{
                        $t("Select minimum {min} to maximum {max}", {
                          min: addons.multi_option_min,
                          max: addons.multi_option_value,
                        })
                      }}
                    </template>
                    <template v-else>
                      {{
                        $t("Choose up to {count}", { count: addons.multi_option_value })
                      }}
                    </template>
                  </p>

                  <p
                    v-if="addons.require_addon == 1"
                    class="col no-margin font12 text-right"
                  >
                    <span class="bg-yellow-11 q-pa-xs rounded-borders">{{
                      $t("Required")
                    }}</span>
                  </p>
                  <p v-else class="col no-margin font12 text-right">
                    ({{ $t("Optional") }})
                  </p>
                </div>

                <template v-if="SettingsStore.addons_use_checkbox">
                  <q-list>
                    <q-item
                      v-for="sub_items in addons.sub_items"
                      :key="sub_items.sub_item_id"
                      tag="label"
                      v-ripple
                    >
                      <template v-if="addons.multi_option === 'one'">
                        <q-item-section avatar>
                          <q-radio
                            v-model="addons.sub_items_checked"
                            :val="sub_items.sub_item_id"
                            color="warning"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ sub_items.sub_item_name }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{
                            sub_items.pretty_price
                          }}</q-item-label>
                        </q-item-section>
                      </template>

                      <template v-else-if="addons.multi_option === 'custom'">
                        <q-item-section avatar>
                          <q-checkbox
                            v-model="sub_items.checked"
                            :val="sub_items.sub_item_id"
                            label=""
                            :disable="sub_items.disabled"
                            color="warning"
                          >
                          </q-checkbox>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ sub_items.sub_item_name }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{
                            sub_items.pretty_price
                          }}</q-item-label>
                        </q-item-section>
                      </template>

                      <template v-else-if="addons.multi_option === 'multiple'">
                        <q-item-section :side="!sub_items.checked">
                          <div
                            v-if="sub_items.checked == true"
                            class="row items-center justify-center"
                            style="max-width: 100px"
                          >
                            <div class="col no-padding text-center">
                              <q-btn
                                @click="
                                  sub_items.qty > 1
                                    ? sub_items.qty--
                                    : (sub_items.checked = false)
                                "
                                round
                                unelevated
                                dense
                                size="11px"
                                color="warning"
                                icon="remove"
                              />
                            </div>
                            <div class="col no-padding text-center">
                              {{ sub_items.qty }}
                            </div>
                            <div class="col no-padding text-center">
                              <q-btn
                                @click="sub_items.qty++"
                                round
                                unelevated
                                dense
                                size="11px"
                                color="warning"
                                icon="add"
                                :disabled="sub_items.disabled"
                              />
                            </div>
                          </div>
                          <div v-else>
                            <q-btn
                              @click="sub_items.checked = true"
                              round
                              unelevated
                              dense
                              size="11px"
                              color="grey-4"
                              icon="add"
                              :disabled="sub_items.disabled"
                            />
                          </div>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ sub_items.sub_item_name }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{
                            sub_items.pretty_price
                          }}</q-item-label>
                        </q-item-section>
                      </template>
                    </q-item>
                  </q-list>
                </template>

                <div
                  v-else
                  class="row q-gutter-none addon-carousel q-mt-md q-col-gutter-sm"
                >
                  <div
                    v-for="sub_items in addons.sub_items"
                    :key="sub_items.sub_item_id"
                    class="col-lg-3 col-md-3 col-sm-6 col-xs-6 text-center"
                  >
                    <q-card flat class="column items-center full-height">
                      <template v-if="addons.multi_option === 'one'">
                        <q-radio
                          v-model="addons.sub_items_checked"
                          :val="sub_items.sub_item_id"
                          label=""
                        >
                          <q-avatar size="80px" square class="col self-center">
                            <q-img
                              fit="contain"
                              :src="
                                sub_items.hasimage
                                  ? sub_items.url_image
                                  : 'default-addon.png'
                              "
                              class="no-margin"
                              height="80px"
                              loading="lazy"
                            />
                          </q-avatar>
                        </q-radio>
                      </template>

                      <template v-else-if="addons.multi_option === 'multiple'">
                        <div>
                          <q-avatar size="80px" square class="col self-center">
                            <q-img
                              fit="contain"
                              :src="sub_items.url_image"
                              class="no-margin"
                              height="80px"
                              loading="lazy"
                            />
                          </q-avatar>
                        </div>
                      </template>

                      <template v-else-if="addons.multi_option === 'custom'">
                        <q-checkbox
                          v-model="sub_items.checked"
                          :val="sub_items.sub_item_id"
                          label=""
                          :disable="sub_items.disabled"
                        >
                          <q-avatar size="80px" square class="col self-center">
                            <q-img
                              fit="contain"
                              :src="sub_items.url_image"
                              class="no-margin"
                              height="80px"
                              loading="lazy"
                            />
                          </q-avatar>
                        </q-checkbox>
                      </template>

                      <p
                        class="font12 q-mt-sm q-mb-none col ellipsis-2-lines line-height-normal q-pb-sm"
                      >
                        {{ sub_items.sub_item_name }}
                      </p>
                      <p class="font12 no-margin col q-mt-sm">
                        {{ sub_items.pretty_price }}
                      </p>

                      <!-- multiple button -->
                      <div
                        v-if="addons.multi_option === 'multiple'"
                        class="col-auto w-75 q-mt-xs"
                      >
                        <div
                          v-if="sub_items.checked == true"
                          class="row items-center justify-center"
                        >
                          <div class="col no-padding text-center">
                            <q-btn
                              @click="
                                sub_items.qty > 1
                                  ? sub_items.qty--
                                  : (sub_items.checked = false)
                              "
                              round
                              unelevated
                              dense
                              size="11px"
                              color="warning"
                              icon="remove"
                            />
                          </div>
                          <div class="col no-padding text-center">
                            {{ sub_items.qty }}
                          </div>
                          <div class="col no-padding text-center">
                            <q-btn
                              @click="sub_items.qty++"
                              round
                              unelevated
                              dense
                              size="11px"
                              color="warning"
                              icon="add"
                              :disabled="sub_items.disabled"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <q-btn
                            @click="sub_items.checked = true"
                            round
                            unelevated
                            dense
                            size="11px"
                            color="grey-4"
                            icon="add"
                            :disabled="sub_items.disabled"
                          />
                        </div>
                      </div>
                      <!-- multiple button -->
                    </q-card>
                  </div>
                  <!-- col -->
                </div>
                <!-- row -->

                <!-- addons -->
              </template>
              <!-- v-for="addons in addons[item_size_id]" -->
            </template>
            <!-- v-if="addons[item_size_id]" -->
            <!-- addons -->

            <div class="q-mt-md">
              <p class="no-margin font12 text-weight-bold">
                {{ $t("Special Instructions") }}
              </p>
              <q-input
                v-model="special_instructions"
                autogrow
                outlined
                class="q-mb-md full-width"
                color="warning"
              />
            </div>

            <div class="q-mt-md">
              <p class="no-margin font12 text-weight-bold">{{ $t("If sold out") }}</p>
              <q-select
                outlined
                dense
                v-model="if_sold_out"
                :options="sold_out_options"
                color="warning"
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
              />
            </div>
          </q-card-section>
          <q-separator />

          <q-card-actions class="q-pa-md">
            <div class="row items-center justify-center full-width">
              <div class="col-sm-4 col-4 no-padding">
                <div class="row items-center justify-center q-mr-sm">
                  <div class="col no-padding text-center">
                    <q-btn
                      @click="item_qty > 1 ? item_qty-- : 1"
                      round
                      unelevated
                      dense
                      :size="!this.$q.screen.lt.md ? '15px' : '13px'"
                      color="warning"
                      icon="remove"
                    />
                  </div>
                  <div class="col no-padding text-center">{{ item_qty }}</div>
                  <div class="col no-padding text-center">
                    <q-btn
                      @click="item_qty++"
                      round
                      unelevated
                      dense
                      :size="!this.$q.screen.lt.md ? '15px' : '13px'"
                      color="warning"
                      icon="add"
                    />
                  </div>
                </div>
              </div>
              <!-- col -->
              <div class="col-sm-8 col-8">
                <template v-if="!loading && items.not_for_sale">
                  <q-btn
                    unelevated
                    rounded
                    color="warning"
                    text-color="black"
                    no-caps
                    class="full-width"
                    :disable="true"
                    label="Not for sale"
                    :size="!this.$q.screen.lt.md ? '17px' : '15px'"
                  >
                  </q-btn>
                </template>
                <template v-else>
                  <q-btn
                    v-if="itemAvailable(items.item_id, items.cat_id)"
                    unelevated
                    rounded
                    color="warning"
                    text-color="black"
                    no-caps
                    class="full-width"
                    :disable="disabled_cart"
                    @click="AddToCart()"
                    :loading="loading_add"
                    :size="!this.$q.screen.lt.md ? '17px' : '15px'"
                  >
                    <div class="row justify-between full-width">
                      <div class="q-pl-lg">{{ $t("Add to cart") }}</div>
                      <div class="q-pr-sm">{{ item_total }}</div>
                    </div>
                  </q-btn>
                  <q-btn
                    v-else
                    unelevated
                    rounded
                    color="warning"
                    text-color="black"
                    no-caps
                    class="full-width"
                    :disable="true"
                    :label="$t('Not available')"
                    :dense="$q.screen.lt.sm"
                  />
                </template>
              </div>
              <!-- col -->
            </div>
          </q-card-actions>
        </template>
        <template v-else>
          <q-card-section class="row items-center q-pb-none">
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="default-height flex flex-center text-grey">
            {{ $t("No data available") }}
          </q-card-section>
        </template>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { format } from "v-money3";
import { useSettingsStore } from "stores/SettingsStore";
import { useDeliveryschedStore } from "stores/DeliverySched";
import { userDataStorePersisted } from "stores/DataStorePersisted";

const empty = function (data) {
  if (
    typeof data === "undefined" ||
    data === null ||
    data === "" ||
    data === "null" ||
    data === "undefined"
  ) {
    return true;
  }
  return false;
};

export default {
  name: "ProductDetails",
  components: {
    Favs: defineAsyncComponent(() => import("components/Favs")),
    ItemGallery: defineAsyncComponent(() => import("components/ItemGallery")),
  },
  setup() {
    const SettingsStore = useSettingsStore();
    const schedStore = useDeliveryschedStore();
    const DataStorePersisted = userDataStorePersisted();
    return { SettingsStore, schedStore, DataStorePersisted };
  },
  data() {
    return {
      modal: false,
      cat_id: 0,
      item_uuid: "",
      loading: false,
      loading_add: false,
      item_qty: 1,
      items: [],
      item_size_id: 0,
      size_data: [],
      size_datas: [],
      cooking_ref: 0,
      cooking_data: [],
      ingredients: [],
      ingredients_data: [],
      addons: {},
      special_instructions: "",
      transaction_type: "",
      if_sold_out: "",
      sold_out_options: [],
      item_total: 0,
      disabled_cart: true,
      slide_items: 0,
      favorites: [],
      config: [],
      meta: [],
      items_not_available: [],
      category_not_available: [],
      item_gallery: [],
      image_featured: "",
    };
  },
  watch: {
    addons: {
      handler(newValue, oldValue) {
        this.ItemSummary();
      },
      deep: true,
    },
    item_size_id() {
      this.ItemSummary();
    },
    cooking_ref() {
      this.ItemSummary();
    },
    ingredients() {
      this.ItemSummary();
    },
    item_qty() {
      this.ItemSummary();
    },
  },
  computed: {
    hasGallery() {
      if (this.item_gallery.length > 0) {
        return true;
      }
      return false;
    },
    hasData() {
      if (Object.keys(this.items).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    showItem(cat_id, item_uuid) {
      this.cat_id = cat_id;
      this.item_uuid = item_uuid;
      this.modal = true;
    },
    itemAvailable(item_id, cat_id) {
      if (this.items_not_available.includes(item_id) === false) {
        if (this.category_not_available.includes(cat_id) === false) {
          return true;
        }
      }
      return false;
    },
    resetData() {
      this.item_qty = 1;
      this.items = [];
      this.item_size_id = 0;
      this.size_data = [];
      this.size_datas = [];
      this.cooking_ref = 0;
      this.cooking_data = [];
      this.ingredients = [];
      this.ingredients_data = [];
      this.addons = {};
      this.special_instructions = "";
      this.transaction_type = "";
      this.if_sold_out = "";
      this.sold_out_options = [];
      this.item_total = 0;
      this.disabled_cart = true;
      this.slide_items = 0;
    },
    getMenuItem() {
      this.resetData();
      this.loading = true;
      APIinterface.getMenuItem(
        this.cat_id,
        this.item_uuid,
        this.DataStorePersisted.getUseCurrency()
      )
        .then((data) => {
          this.config = data.details.config;
          this.items = data.details.data.items;
          this.meta = data.details.data.meta;
          this.size_datas = data.details.data.items.price;
          const soldOutData = data.details.sold_out_options;

          this.if_sold_out = data.details.default_sold_out_options;

          this.items_not_available = data.details.data.items_not_available;
          this.category_not_available = data.details.data.category_not_available;

          const prices = data.details.data.items.price;
          const metaCookingRef = data.details.data.meta
            ? data.details.data.meta.cooking_ref
            : {};
          const metaCookingRefDetails = data.details.data.meta
            ? data.details.data.meta_details.cooking_ref
            : {};

          const metaIngredients = data.details.data.meta
            ? data.details.data.meta.ingredients
            : {};
          const metaIngredientsDetails = data.details.data.meta
            ? data.details.data.meta_details.ingredients
            : {};

          const addons = data.details.data ? data.details.data.addons : {};
          const addonItems = data.details.data ? data.details.data.addon_items : {};

          if (Object.keys(soldOutData).length > 0) {
            Object.entries(soldOutData).forEach(([itemSoldKey, itemsSoldData]) => {
              this.sold_out_options.push({ label: itemsSoldData, value: itemSoldKey });
            });
          }

          if (Object.keys(prices).length > 0) {
            Object.entries(prices).forEach(([key, items]) => {
              if (items.discount <= 0) {
                this.size_data.push({
                  label: items.size_name + " " + items.pretty_price,
                  value: parseInt(items.item_size_id),
                });
              } else {
                this.size_data.push({
                  label: items.size_name + " " + items.pretty_price_after_discount,
                  value: parseInt(items.item_size_id),
                });
              }
            });
            this.item_size_id = parseInt(Object.keys(prices)[0]);
          }

          if (typeof metaCookingRef !== "undefined" && metaCookingRef !== null) {
            if (metaCookingRef.length > 0) {
              Object.entries(metaCookingRef).forEach(([key, value]) => {
                this.cooking_data.push({
                  label: metaCookingRefDetails[value].meta_name,
                  value: metaCookingRefDetails[value].meta_id,
                });
              });
            }
          }

          if (typeof metaIngredients !== "undefined" && metaIngredients !== null) {
            if (metaIngredients.length > 0) {
              Object.entries(metaIngredients).forEach(([key, value]) => {
                if (metaIngredientsDetails[value]) {
                  this.ingredients_data.push({
                    label: metaIngredientsDetails[value].meta_name,
                    value: metaIngredientsDetails[value].meta_id,
                  });
                }
                if (this.items.ingredients_preselected) {
                  if (metaIngredientsDetails[value]) {
                    this.ingredients.push(metaIngredientsDetails[value].meta_id);
                  }
                }
              });
            }
          }

          this.item_gallery = data.details.data.meta
            ? data.details.data.meta.item_gallery
            : [];

          if (APIinterface.empty(this.item_gallery)) {
            this.item_gallery = [];
          }

          // addons
          if (Object.keys(this.items.item_addons).length > 0) {
            Object.entries(this.items.item_addons).forEach(([sizeId, SubcatID]) => {
              const addOnsAdded = [];
              Object.entries(SubcatID).forEach(([key, child]) => {
                if (!APIinterface.empty(addons[sizeId])) {
                  if (!APIinterface.empty(addons[sizeId][child])) {
                    const addonDetails = addons[sizeId][child];

                    const subItems = [];
                    Object.entries(addonDetails.sub_items).forEach(
                      ([key2, subItemsID]) => {
                        if (addonItems[subItemsID]) {
                          const subItemsAdd = addonItems[subItemsID];
                          addonItems[subItemsID].checked = false;
                          addonItems[subItemsID].disabled = false;
                          addonItems[subItemsID].qty = 1;
                          subItems.push(subItemsAdd);
                        }
                      }
                    );

                    const subdata = {
                      subcat_id: addonDetails.subcat_id,
                      subcategory_name: addonDetails.subcategory_name,
                      subcategory_description: addonDetails.subcategory_description,
                      multi_option: addonDetails.multi_option,
                      multi_option_min: addonDetails.multi_option_min,
                      multi_option_value: addonDetails.multi_option_value,
                      require_addon: addonDetails.require_addon,
                      pre_selected: addonDetails.pre_selected,
                      sub_items_checked: "",
                      sub_items: subItems,
                    };
                    addOnsAdded.push(subdata);
                  }
                }
              });
              this.addons[sizeId] = addOnsAdded;
            });
          }
          // addons
        })
        .catch((error) => {
          //console.debug(error);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    ItemSummary() {
      let $itemTotal = 0;
      const $requiredAddon = [];
      const $requiredAddonAdded = [];
      let $min_addon = [];
      let $min_addon_added = [];

      if (!empty(this.size_datas[this.item_size_id])) {
        const item = this.size_datas[this.item_size_id];
        if (item.discount > 0) {
          $itemTotal += this.item_qty * parseFloat(item.price_after_discount);
        } else $itemTotal += this.item_qty * parseFloat(item.price);
      }

      if (!empty(this.addons[this.item_size_id])) {
        this.addons[this.item_size_id].forEach((item, index) => {
          if (item.require_addon === "1") {
            $requiredAddon.push(item.subcat_id);
          }

          if (item.multi_option === "custom") {
            let totalCheck = 0;
            const multiOptionValue = item.multi_option_value;
            let multi_option_min = item.multi_option_min;

            if (multiOptionValue > 0) {
              $min_addon.push({
                subcat_id: item.subcat_id,
                min: multi_option_min,
                max: multiOptionValue,
              });
            }

            const itemIndex = [];
            const itemIndex2 = [];
            item.sub_items.forEach((item2, index2) => {
              if (item2.checked === true) {
                totalCheck++;
                $itemTotal += this.item_qty * parseFloat(item2.price);
                $requiredAddonAdded.push(item.subcat_id);
              } else itemIndex.push(index2);

              if (item2.disabled === true) {
                itemIndex2.push(index2);
              }
            });

            $min_addon_added[item.subcat_id] = {
              total: totalCheck,
            };

            if (totalCheck >= multiOptionValue) {
              itemIndex.forEach((item3, index3) => {
                item.sub_items[item3].disabled = true;
              });
            } else {
              itemIndex2.forEach((item3, index3) => {
                item.sub_items[item3].disabled = false;
              });
            }
          } else if (item.multi_option === "one") {
            item.sub_items.forEach((item2, index2) => {
              if (item2.sub_item_id === item.sub_items_checked) {
                $itemTotal += this.item_qty * parseFloat(item2.price);
                $requiredAddonAdded.push(item.subcat_id);
              }
            });
          } else if (item.multi_option === "multiple") {
            var item_index = [];
            let multi_option_min = item.multi_option_min;
            var multi_option_value = item.multi_option_value;
            var limit = 0;

            if (multi_option_value > 0) {
              $min_addon.push({
                subcat_id: item.subcat_id,
                min: multi_option_min,
                max: multi_option_value,
              });
            }

            item.sub_items.forEach((item2, index2) => {
              if (item2.checked === true) {
                $itemTotal += item2.qty * parseFloat(item2.price);
                $requiredAddonAdded.push(item.subcat_id);
                limit += item2.qty;
              }
              item_index.push(index2);
            });

            $min_addon_added[item.subcat_id] = {
              total: limit,
            };

            this.addons[this.item_size_id][index].qty_selected = limit;
            if (
              this.addons[this.item_size_id][index].qty_selected >= multi_option_value
            ) {
              item_index.forEach((item3, index2) => {
                this.addons[this.item_size_id][index].sub_items[item3].disabled = true;
              });
            } else {
              item_index.forEach((item3, index2) => {
                this.addons[this.item_size_id][index].sub_items[item3].disabled = false;
              });
            }
          } /* endif custom */
        });
        // end loop addons
      }

      if ($itemTotal > 0) {
        this.item_total = format($itemTotal, this.config);
      }

      let $requiredMeet = true;
      if ($requiredAddon.length > 0) {
        $requiredAddon.forEach((requiedItem, requiredIndex) => {
          if ($requiredAddonAdded.includes(requiedItem) === false) {
            $requiredMeet = false;
            return false;
          }
        });
      }

      // CHECK COOKING REF
      if (this.items.cooking_ref_required) {
        let $cooking_ref_check = false;
        if (this.cooking_ref > 0) {
          $cooking_ref_check = true;
        }
        if (!$cooking_ref_check) {
          $requiredMeet = false;
        }
      }

      // CHECK ADDON MINIMUM AND MAXIMUM
      if (Object.keys($min_addon).length > 0) {
        let min_value, min_selected;
        Object.entries($min_addon).forEach(([key_min_addon, items_min_addon]) => {
          min_value = parseInt(items_min_addon.min);
          if ($min_addon_added[items_min_addon.subcat_id]) {
            min_selected = parseInt($min_addon_added[items_min_addon.subcat_id].total);
          }
          if (min_selected > 0) {
            if (min_value > min_selected) {
              $requiredMeet = false;
            }
          }
        });
      }

      if ($requiredMeet) {
        this.disabled_cart = false;
      } else this.disabled_cart = true;
    },
    AddToCart() {
      const $ingredients = [];
      if (this.ingredients.length > 0) {
        this.ingredients.forEach((ingredientsId, index) => {
          $ingredients.push({ meta_id: ingredientsId, checked: true, meta_name: "" });
        });
      }

      const $meta = {
        cooking_ref: [
          { meta_id: this.cooking_ref, checked: this.cooking_ref, meta_name: "" },
        ],
        ingredients: $ingredients,
      };
      const $cartUuid = APIinterface.getStorage("cart_uuid");
      const $data = {
        cart_uuid: $cartUuid,
        cat_id: this.cat_id,
        item_size_id: this.item_size_id,
        item_token: this.item_uuid,
        item_qty: this.item_qty,
        special_instructions: this.special_instructions,
        if_sold_out: this.if_sold_out.value,
        transaction_type: this.schedStore.transaction_type,
        meta: $meta,
        item_addons: !empty(this.addons[this.item_size_id])
          ? this.addons[this.item_size_id]
          : [],
      };

      this.loading_add = true;
      APIinterface.AddToCart($data)
        .then((data) => {
          if (empty($cartUuid)) {
            APIinterface.setStorage("cart_uuid", data.details.cart_uuid);
          }
          this.modal = false;
          this.$emit("afterAddtocart");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_add = false;
        });
    },
    afterSavefav(item) {
      item.save_item = !item.save_item;
    },
    afterSelectimage(data) {
      this.image_featured = data;
    },
    beforeHide() {
      this.qty = 1;
      this.image_featured = "";
    },
    //
  },
};
</script>
