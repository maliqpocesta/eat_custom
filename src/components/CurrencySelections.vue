<template>
  <template v-if="DataStorePersisted.loading">
    <div style="padding: 5px 3px">
      <q-circular-progress
        indeterminate
        rounded
        size="20px"
        color="yellow-9"
        :thickness="0.4"
      />
    </div>
  </template>
  <template v-else>
    <q-btn style="padding: 4px 3px">
      <q-chip color="white" text-color="dark">
        {{ currency_code }}
      </q-chip>
      <q-menu
        transition-show="jump-down"
        transition-hide="jump-up"
        active="red"
        max-width="300px"
      >
        <q-list>
          <template
            v-for="(items, items_currencycode) in DataStorePersisted.currencyList"
            :key="items"
          >
            <q-item clickable v-close-popup @click="setCurrency(items_currencycode)">
              <q-item-section>
                <q-item-label>{{ items }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
  </template>
</template>

<script>
import { userDataStorePersisted } from "stores/DataStorePersisted";
import { useTransactionStore } from "stores/Transaction";
import APIinterface from "src/api/APIinterface";
import { watch } from "vue";

export default {
  name: "CurrencySelections",
  setup() {
    const DataStorePersisted = userDataStorePersisted();
    const transactionStore = useTransactionStore();
    return { DataStorePersisted, transactionStore };
  },
  data() {
    return {
      currency_code: "",
    };
  },
  mounted() {
    let use_currency = !APIinterface.empty(this.DataStorePersisted.use_currency_code)
      ? this.DataStorePersisted.use_currency_code
      : "";
    this.DataStorePersisted.getCurrencyList(use_currency);
  },
  created() {
    this.$watch(
      () => this.DataStorePersisted.$state.currency_data,
      (newData, oldData) => {
        if (Object.keys(newData).length > 0) {
          this.currency_code = newData.based_currency;
        }
      }
    );
  },
  methods: {
    setCurrency(currencyCode) {
      this.currency_code = currencyCode;
      this.DataStorePersisted.use_currency_code = currencyCode;
      this.transactionStore.change_currency = currencyCode;
    },
  },
};
</script>
