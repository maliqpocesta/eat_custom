<template>
  <h5 class="text-weight-bold q-pt-xs q-pb-sm">{{ $t("My Account") }}</h5>
  <q-list class="text-dark list-menu q-mr-md">
    <q-item
      clickable
      v-ripple
      :active="link === 'profile'"
      active-class="menu-link"
      to="/account/profile"
      dense
    >
      <q-item-section>{{ $t("My Account") }}</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'orders'"
      active-class="menu-link"
      to="/account/orders"
      dense
    >
      <q-item-section>{{ $t("Orders") }}</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'change-password'"
      active-class="menu-link"
      to="/account/change-password"
      dense
    >
      <q-item-section>{{ $t("Change Password") }}</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'addresses'"
      active-class="menu-link"
      to="/account/addresses"
      dense
    >
      <q-item-section>{{ $t("Addresses") }}</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'payments'"
      active-class="menu-link"
      to="/account/payments"
      dense
    >
      <q-item-section>{{ $t("Payments") }}</q-item-section>
    </q-item>

    <q-item
      v-if="SettingsStore.points_enabled && SettingsStore.loyalty_points_activated"
      clickable
      v-ripple
      :active="link === 'points'"
      active-class="menu-link"
      to="/account/points"
      dense
    >
      <q-item-section>{{ $t("Points") }}</q-item-section>
    </q-item>

    <q-item
      v-if="SettingsStore.digitalwallet_enabled"
      clickable
      v-ripple
      :active="link === 'wallet'"
      active-class="menu-link"
      to="/account/wallet"
      dense
    >
      <q-item-section>{{ $t("Digital Wallet") }}</q-item-section>
    </q-item>

    <q-item
      v-if="SettingsStore.chat_enabled"
      clickable
      v-ripple
      :active="link === 'chat'"
      active-class="menu-link"
      to="/account/chat"
      dense
    >
      <q-item-section>{{ $t("Live Chat") }}</q-item-section>
    </q-item>

    <q-item
      v-if="SettingsStore.booking_enabled"
      clickable
      v-ripple
      :active="link === 'bookings'"
      active-class="menu-link"
      to="/account/bookings"
      dense
    >
      <q-item-section>{{ $t("Bookings") }}</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'favourites'"
      active-class="menu-link"
      to="/account/favourites"
      dense
    >
      <q-item-section>{{ $t("Favorites") }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { useSettingsStore } from "stores/SettingsStore";

export default {
  name: "AccountNav",
  data() {
    return {
      link: "profile",
    };
  },
  created() {
    const $path = this.$route.path;
    this.link = $path.replace("/account/", "");
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
};
</script>
