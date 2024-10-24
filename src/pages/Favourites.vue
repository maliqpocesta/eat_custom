<template>
  <q-page padding>
    <StickyBack url="/account/menu" label="Back" v-if="isMobile" />
    <LocationNav v-else />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row">
          <!-- left -->
          <div v-if="!isMobile" class="col-md-4 col-sm-4 col-xs-12">
            <AccountNav></AccountNav>
          </div>
          <!-- left -->

          <!-- right -->
          <div class="col-md-8 col-sm-8 col-xs-12">
            <q-card flat class="fit">
              <FavouritesSkeleton v-if="loading" />

              <template v-else>
                <q-item>
                  <q-item-section>
                    <h5 class="text-weight-bold">{{ $t("My Favorites") }}</h5>
                    <p v-if="hasData" class="no-margin font12 text-weight-thin">
                      {{ $t("Your collection of foods") }}
                    </p>
                    <p v-else class="no-margin font12 text-weight-thin">
                      {{ $t("You don't have any save food item here") }}!
                    </p>
                  </q-item-section>
                </q-item>

                <q-separator />

                <section>
                  <div class="row justify-start items-center">
                    <!-- item col -->
                    <template v-for="items in data" :key="items.item_id">
                      <div
                        v-if="data_items[items.item_id]"
                        class="col-lg-4 col-md-4 col-sm-4 col-xs-6 q-mb-md q-mb-sm-none"
                      >
                        <q-card
                          flat
                          class="column items-center full-height q-pa-sm position-relative"
                        >
                          <Favs
                            ref="favs"
                            :item_token="data_items[items.item_id].item_uuid"
                            :cat_id="items.cat_id"
                            :active="items.save_item"
                            @after-savefav="afterSavefav(items)"
                            class="absolute-top-right q-mr-md v"
                            :dense="isMobile"
                          />

                          <q-avatar size="80px" square class="col self-center">
                            <q-img
                              fit="contain"
                              :src="data_items[items.item_id].url_image"
                              class="no-margin"
                              :class="{ 'light-dimmed': items.save_item === false }"
                              height="80px"
                              loading="lazy"
                            />
                          </q-avatar>

                          <p
                            class="font12 q-mt-sm q-mb-none col ellipsis-2-lines line-height-normal q-pb-sm"
                            :class="{ 'text-grey': items.save_item === false }"
                          >
                            {{ data_items[items.item_id].item_name }}
                          </p>
                          <div
                            class="font12 no-margin col q-pb-sm"
                            v-if="data_items[items.item_id]"
                            :class="{ 'text-grey': items.save_item === false }"
                          >
                            <template v-if="data_items[items.item_id].price[0]">
                              <template
                                v-if="data_items[items.item_id].price[0].discount <= 0"
                              >
                                {{ data_items[items.item_id].price[0].size_name }}
                                {{ data_items[items.item_id].price[0].pretty_price }}
                              </template>
                              <template v-else>
                                {{ data_items[items.item_id].price[0].size_name }}
                                <del>{{
                                  data_items[items.item_id].price[0].pretty_price
                                }}</del>
                                {{
                                  data_items[items.item_id].price[0]
                                    .pretty_price_after_discount
                                }}
                              </template>
                            </template>
                          </div>

                          <q-btn
                            unelevated
                            rounded
                            color="warning"
                            text-color="black"
                            no-caps
                            :label="$t('View Item')"
                            class="q-mb-sm q-pl-xs-sm q-pr-xs-sm"
                            :dense="$q.screen.lt.sm"
                            :disable="!items.save_item"
                            :to="{
                              name: 'product',
                              params: {
                                slug: data_items[items.item_id].slug,
                                cat_id: items.cat_id,
                                item_uuid: data_items[items.item_id].item_uuid,
                              },
                            }"
                          >
                          </q-btn>
                        </q-card>
                      </div>
                    </template>
                    <!-- item col -->
                  </div>
                  <!-- row  -->
                </section>
              </template>
            </q-card>
          </div>
          <!-- right -->
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "Favourites",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    Favs: defineAsyncComponent(() => import("components/Favs")),
    FavouritesSkeleton: defineAsyncComponent(() =>
      import("components/FavouritesSkeleton")
    ),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      data: [],
      data_items: [],
      loading: false,
    };
  },
  mounted() {
    this.getSaveItems();
  },
  computed: {
    hasData() {
      if (this.data.length > 0) {
        return true;
      }
      return false;
    },
    isMobile() {
      if (this.$q.screen.lt.md) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    getSaveItems() {
      /* eslint-disable */
      this.loading = true;
      APIinterface.getSaveItems()
        .then((data) => {
          this.data = data.details.data;
          this.data_items = data.details.items;
        })
        .catch((error) => {
          //
        })
        .then((data) => {
          this.loading = false;
        });
    },
    afterSavefav(item) {
      item.save_item = !item.save_item;
    },
  },
};
</script>

<style lang="sass"></style>
