<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-header q-layout__section--marginal fixed-top" style="height: auto;">
      <q-toolbar class="row no-wrap items-center bg-yellow" role="toolbar">
        <div class="row items-center justify-start full-width">
          <div class="col-md-2 col-6">
            <router-link to="/">
              <img
                alt=""
                src="logored@2x.png"
                class="cursor-pointer top-logo"
                style="max-width: 170px; max-height: 50px"
              />
            </router-link>
          </div>
          <!-- Rest of the existing header content -->
          <div class="col-10 gt-sm">
            <div class="column items-end">
              <template v-if="!is_login">
                <q-btn-group outline>
                  <q-btn
                    v-if="SettingsStore.booking_enabled"
                    :label="$t('Reservation')"
                    to="/reservation"
                  />
                  <q-btn :label="$t('Login')" to="/login" />
                  <template v-if="SettingsStore.multicurrency_enabled">
                    <CurrencySelections ref="currency"></CurrencySelections>
                  </template>

                  <LanguageSelection
                    v-if="SettingsStore.enabled_language"
                    @after-selectlanguage="afterSelectlanguage"
                    ref="language_selection"
                  ></LanguageSelection>

                  <q-btn class="" @click="showCart">
                    <q-icon name="img:shopping-bag.svg" />
                    <q-badge color="dark" rounded floating>{{
                      cartStore.counter
                    }}</q-badge>
                  </q-btn>
                </q-btn-group>
              </template>

              <template v-else>
                <q-btn-group outline>
                  <q-btn
                    v-if="SettingsStore.booking_enabled"
                    :label="$t('Reservation')"
                    to="/reservation"
                  />

                  <template v-if="SettingsStore.multicurrency_enabled">
                    <CurrencySelections ref="currency"></CurrencySelections>
                  </template>

                  <LanguageSelection
                    v-if="SettingsStore.enabled_language"
                    @after-selectlanguage="afterSelectlanguage"
                    ref="language_selection"
                  ></LanguageSelection>
                  <q-btn style="padding: 4px 3px">
                    <q-chip style="margin: 0" color="grey-2">
                      <q-avatar size="sm">
                        <q-img :src="avatar" fit="contain" />
                      </q-avatar>
                      <div class="ellipsis" style="max-width: 60px">{{ first_name }}</div>
                    </q-chip>
                    <q-menu
                      transition-show="jump-down"
                      transition-hide="jump-up"
                      active="red"
                      style="width: 190px"
                    >
                      <q-list style="max-width: 200px">
                        <q-item clickable v-close-popup to="/account/profile">
                          <q-item-section>{{ $t("My Account") }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup to="/account/orders">
                          <q-item-section>{{ $t("Orders") }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup to="/account/change-password">
                          <q-item-section>{{ $t("Change Password") }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup to="/account/addresses">
                          <q-item-section>{{ $t("Addresses") }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup to="/account/payments">
                          <q-item-section>{{ $t("Payments") }}</q-item-section>
                        </q-item>
                        <q-item
                          v-if="
                            SettingsStore.points_enabled &&
                            SettingsStore.loyalty_points_activated
                          "
                          clickable
                          v-close-popup
                          to="/account/points"
                        >
                          <q-item-section>{{ $t("Points") }}</q-item-section>
                        </q-item>
                        <q-item
                          v-if="SettingsStore.digitalwallet_enabled"
                          clickable
                          v-close-popup
                          to="/account/wallet"
                        >
                          <q-item-section>{{ $t("Digital Wallet") }}</q-item-section>
                        </q-item>

                        <q-item
                          v-if="SettingsStore.chat_enabled"
                          clickable
                          v-close-popup
                          to="/account/chat"
                        >
                          <q-item-section>{{ $t("Live Chat") }}</q-item-section>
                        </q-item>

                        <q-item
                          v-if="SettingsStore.booking_enabled"
                          clickable
                          v-close-popup
                          to="/account/bookings"
                        >
                          <q-item-section>{{ $t("Bookings") }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup to="/account/favourites">
                          <q-item-section>{{ $t("Favorites") }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="logout">
                          <q-item-section>{{ $t("Logout") }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <q-btn class="" @click="showCart">
                    <q-icon name="img:shopping-bag.svg" />
                    <q-badge color="dark" rounded floating>{{
                      cartStore.counter
                    }}</q-badge>
                  </q-btn>
                </q-btn-group>
              </template>
            </div>
          </div>
          <!-- col -->

          <div class="col-6 lt-md">
            <div class="column items-end">
              <q-btn-group outline>
                <template v-if="SettingsStore.multicurrency_enabled">
                  <CurrencySelections ref="currency"></CurrencySelections>
                </template>

                <LanguageSelection
                  v-if="SettingsStore.enabled_language"
                  @after-selectlanguage="afterSelectlanguage"
                  ref="language_selection"
                >
                </LanguageSelection>
                <template v-if="!this.$q.screen.lt.md">
                  <q-btn to="/cart">
                    <q-icon name="img:shopping-bag.svg" />
                    <q-badge id="mobile-cart-count" color="dark" rounded floating>{{
                      cartStore.counter
                    }}</q-badge>
                  </q-btn>
                </template>
              </q-btn-group>
            </div>
          </div>
        </div>
        <!-- row -->
      </q-toolbar>
    </q-header>

    <!-- cart components -->
    <section :class="this.$route.name" v-if="this.$route.path != '/checkout'">
      <q-drawer
        side="right"
        @show="whenCartShow"
        @on-layout="onLayout"
        v-model="cart_drawer"
        :show-if-above="false"
        :width="350"
        :breakpoint="sm"
        bordered
        :overlay="is_overlay"
         class="cart-drawer"
      >
        <q-scroll-area class="fit cart-scroll">
          <div class="q-pa-md" style="padding-bottom: 100px">
            <CartDrawer
              ref="cart"
              :page="this.$route.path"
              @set-cartcount="setCartcount"
              @show-transaction="showTransaction"
            />
          </div>
        </q-scroll-area>
      </q-drawer>
    </section>
    <!-- cart components -->

    <!-- Mobile menu footer -->
    <q-footer bordered class="bg-white text-dark lt-md">
      <q-tabs
        v-model="mobile_tabmenu"
        dense
        indicator-color="transparent"
        active-color="dark"
        class="text-grey-5"
        align="justify"
        content-class="qtabs-modified"
      >
        <q-route-tab name="home" icon="o_home" :label="$t('Home')" no-caps to="/home" />
        <q-route-tab
          v-if="SettingsStore.booking_enabled"
          name="table"
          icon="chair_alt"
          :label="$t('Table')"
          no-caps
          to="/reservation"
        />
        <q-route-tab
          name="account"
          icon="o_account_circle"
          :label="$t('Account')"
          no-caps
          to="/account/menu"
        />
      </q-tabs>
    </q-footer>
    <!-- Mobile menu footer -->

    <q-page-container>

      <router-view />

      <template v-if="this.$q.screen.lt.md && this.$route.name == 'menu'">
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="shopping_bag" color="red-10" padding="10px" to="/cart">
            <q-badge color="red" floating v-if="cartStore.counter > 0">
              {{ cartStore.counter }}
            </q-badge>
          </q-btn>
        </q-page-sticky>

        <q-page-scroller expand position="bottom" :scroll-offset="150" :offset="[0, 0]">
          <div class="col cursor-pointer q-pa-sm bg-yellow-9 text-white text-center">
            {{ $t("Scroll back up") }}...
          </div>
        </q-page-scroller>
      </template>

      <template v-if="!this.$q.screen.lt.md">
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
          <q-btn fab icon="keyboard_arrow_up" color="yellow-9" padding="10px" />
        </q-page-scroller>
      </template>
    </q-page-container>

    <!-- About Us Section -->
    <div class="cfooter row justify-center q-pa-md gt-xs" v-if="!loading && hasData">
      <div class="col-12">
        <div class="text-left">
          <h4 class="no-margin text-weight-bold q-pb-sm">{{ $t("About Us") }}</h4>
        </div>
        <q-card class="q-card1" flat>
          <q-card-section>
            <div class="row items-start q-mb-lg">
              <div v-if="$q.screen.gt.sm" class="col-1">
                <q-icon name="las la-info-circle" size="md" />
              </div>
              <div class="col">
                <h5 class="q-ma-none">{{ aboutData.data.few_words }}</h5>
                <div class="q-ma-md"></div>
                <span
                  class="text-weight-light"
                  v-html="aboutData.data.short_description"
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
                  <div class="text-weight-light">{{ aboutData.data.merchant_address }}</div>

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
                    :caption="aboutData.open_at"
                  >
                    <q-card class="text-weight-light">
                      <q-card-section>
                        <div v-for="items in aboutData.opening_hours" :key="items" class="row">
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
            <!-- row -->
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="carousel">
      <q-card style="width: 700px; max-width: 80vw; min-height: 30vw">
        <q-card-section v-if="!loading && hasData">
          <q-carousel animated v-model="slide" arrows navigation infinite>
            <template v-for="(items, index) in aboutData.gallery" :key="items">
              <q-carousel-slide :name="index" :img-src="items.image_url" />
            </template>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- End About Us Section -->

    <div class="cfooter gt-sm">
      <div class="row justify-center q-pa-md gt-xs">
        <div class="col-md-9 col-12">
          <div class="row">
            <div class="col-md-6 col-sm-6">
              <FooterApp ref="footer_app" />
            </div>
            <!-- col -->
            <div class="col-md-6 col-sm-6 text-right">
              <Subscribe ref="subscribe" />
            </div>
            <!-- col -->
          </div>
          <!-- row -->
        </div>
        <!-- col -->
      </div>
      <!-- row

      <q-separator />
      <Footer ref="footer"></Footer>-->
    </div>
    <!-- cfooter -->
    <LoaderComponents></LoaderComponents>
  </q-layout>
</template>

<script>
import { defineAsyncComponent } from "vue";
import auth from "src/api/auth";
import { useCartStore } from "stores/Cart";
import { usestoreAvailable } from "stores/storeAvailable";
import { useI18n } from "vue-i18n";
import APIinterface from "src/api/APIinterface";
import { api } from "boot/axios";
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "MainLayout",
  components: {
    CartDrawer: defineAsyncComponent(() => import("components/CartDrawer")),
    Subscribe: defineAsyncComponent(() => import("components/Subscribe")),
    FooterApp: defineAsyncComponent(() => import("components/FooterApp")),
    Footer: defineAsyncComponent(() => import("components/Footer")),
    LanguageSelection: defineAsyncComponent(() => import("components/LanguageSelection")),
    LoaderComponents: defineAsyncComponent(() => import("components/LoaderComponents")),
    CurrencySelections: defineAsyncComponent(() =>
      import("components/CurrencySelections")
    ),
  },
  setup() {
    const cartStore = useCartStore();
    const ifstoreAvailable = usestoreAvailable();
    const { locale } = useI18n({ useScope: "global" });
    const DataStorePersisted = userDataStorePersisted();
    const SettingsStore = useSettingsStore();
    return { cartStore, ifstoreAvailable, locale, DataStorePersisted, SettingsStore };
  },
  data() {
    return {
      data: [],
      cart_qty: 0,
      path: "",
      cart_drawer: false,
      is_overlay: true,
      is_login: false,
      avatar: "",
      first_name: "",
      mobile_tabmenu: "home",
      rtl: false,
      loading: true,
      aboutData: [],
      carousel: false,
      slide: 0,
    };
  },
  created() {
    this.rtl = this.DataStorePersisted.rtl;
    this.getInfo();
  },
  mounted() {
    this.path = this.$route.path;
    if (this.$route.path === "/" || this.$route.path === "/home") {
      if (this.$q.screen.gt.sm) {
        this.cart_drawer = true;
        this.is_overlay = false;
      }
    }
    this.is_login = this.authenticated();

    this.getCurrentProfile();
  },
  updated() {
    this.is_login = this.authenticated();
    if (this.is_login) {
      this.getCurrentProfile();
    }

    this.path = this.$route.path;
    this.is_overlay = true;
    if (this.$route.path === "/" || this.$route.path === "/home") {
      if (this.$q.screen.gt.sm) {
        this.cart_drawer = true;
        this.is_overlay = false;
      }
    } else if (this.$route.path === "/account/trackorder") {
      if (this.$refs.cart) {
        this.$refs.cart.refreshCart();
      }
      this.cart_drawer = false;
    } else {
      this.cart_drawer = false;
    }
  },
  computed: {
    iSCartPage() {
      if (this.$route.name === "cart") {
        return false;
      }
      return true;
    },
    hasData() {
      if (Object.keys(this.aboutData).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    onLayout() {
      //this.ifstoreAvailable.checkStoreOpen();
    },
    whenCartShow() {},
    getCurrentProfile() {
      const $oldprofile = auth.getUser();
      if ($oldprofile) {
        this.avatar = $oldprofile.avatar;
        this.first_name = $oldprofile.first_name;
      }
    },
    showCart() {
      if (this.$route.path === "/checkout") {
        //
      } else {
        this.cart_drawer = !this.cart_drawer;
      }
    },
    setCartcount(qty) {
      this.cart_qty = qty;
    },
    showTransaction() {
      this.$refs.delivery_details.show_modal = true;
    },
    authenticated() {
      if (auth.authenticated()) {
        return true;
      }
      return false;
    },
    logout() {
      this.$q
        .dialog({
          title: this.$t("Confirm"),
          message: this.$t("Are you sure you want to logout?"),
          stackButtons: false,
          ok: {
            unelevated: true,
            rounded: true,
            color: "warning",
            "text-color": "black",
            size: "md",
            label: this.$t("Yes"),
            "no-caps": true,
          },
          cancel: {
            unelevated: true,
            rounded: true,
            color: "grey-3",
            "text-color": "black",
            size: "md",
            label: this.$t("No"),
            "no-caps": true,
          },
        })
        .onOk((data) => {
          auth.logout();
          this.$router.push("/home");
        });
    },
    afterSelectlanguage(lang_code) {
      this.$i18n.locale = lang_code;
      APIinterface.setStorage("language_code", lang_code);
      api.defaults.params = {};
      api.defaults.params["language"] = this.$i18n.locale;

      this.setRTL(lang_code);
      this.$router.go(0);
    },
    setRTL(lang_code) {
      if (Object.keys(this.SettingsStore.language_list).length > 0) {
        Object.entries(this.SettingsStore.language_list.list).forEach(([key, items]) => {
          if (lang_code == items.code) {
            if (items.rtl == 1) {
              this.$q.lang.set({ rtl: true });
              this.DataStorePersisted.rtl = true;
            } else {
              this.$q.lang.set({ rtl: false });
              this.DataStorePersisted.rtl = false;
            }
          }
        });
      }
    },
    getInfo() {
      this.loading = true;
      APIinterface.fetchDataPost("getInfo", "")
        .then((data) => {
          this.aboutData = data.details;
        })
        .catch((error) => {
          console.error("Error fetching about info:", error);
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.featured-header {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: 50px;
  z-index: 1;
}

.featured-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
}

.restaurant-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  z-index: 1;

  h1 {
    color: white;
    margin: 0;
    padding: 0 20px;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}

.dimmed {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
}

.cart-drawer {
  z-index: 2001;
}
</style>
