<template>
  <q-page padding>
    <LocationNav />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row">
          <!-- left -->
          <div class="col-md-4 col-sm-4 col-xs-12">
            <AccountNav></AccountNav>
          </div>
          <!-- left -->

          <!-- right -->
          <div class="col-md-8 col-sm-8 col-xs-12">
            <q-card flat class="fit">
              <q-item>
                <q-item-section>
                  <h5 class="text-weight-bold">{{ $t("Enter Location") }}</h5>
                  <p class="font12 text-weight-light">
                    {{
                      $t(
                        "Enter your delivery address to see your nearest stores and available products"
                      )
                    }}
                  </p>
                </q-item-section>
              </q-item>

              <div class="w-75 m-auto">
                <q-input bottom-slots v-model="text" rounded outlined>
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="my_location"
                      @click="text = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </div>

              <div class="maps bg-grey-1"></div>

              <div class="q-pa-md">
                <q-btn
                  unelevated
                  rounded
                  color="warning"
                  text-color="black"
                  no-caps
                  class="full-width q-mb-md"
                  :label="$t('Confirm Location')"
                  size="17px"
                  @click="address_details = true"
                >
                </q-btn>

                <q-btn
                  unelevated
                  rounded
                  outline
                  text-color="black"
                  no-caps
                  class="full-width"
                  :label="$t('Cancel')"
                  size="17px"
                >
                </q-btn>
              </div>
            </q-card>
          </div>
          <!-- right -->
        </div>
        <!-- row -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <q-dialog v-model="address_details">
      <q-card style="width: 500px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="ion-close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <h5 class="text-weight-bold no-margin">{{ $t("Address details") }}</h5>
        </q-card-section>

        <div class="maps bg-grey-1 small"></div>

        <div class="row full-width q-mt-md">
          <div class="col">
            <h6 class="text-weight-bold no-margin"></h6>
            <p class="no-margin font11"></p>
          </div>
          <div class="col text-right">
            <q-btn color="dark" unelevated label="Adjust pin" no-caps />
          </div>
        </div>

        <div class="cursor-pointer">
          <q-btn color="dark" flat icon-right="mode_edit" :label="$t('Edit')" no-caps />
          <q-popup-edit v-model="label" auto-save v-slot="scope">
            <q-input
              v-model="scope.value"
              dense
              autofocus
              counter
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </div>

        <q-input
          v-model="text"
          autogrow
          outlined
          class="q-mb-md full-width"
          color="warning"
          :label="$t('Aparment, suite or floor')"
        />

        <h6 class="text-weight-bold no-margin q-pl-md q-pb-sm">
          {{ $t("Delivery options") }}
        </h6>
        <q-select
          outlined
          dense
          v-model="if_sold_out"
          :options="data_select"
          color="warning"
          class="q-mb-md"
          transition-show="scale"
          transition-hide="scale"
        />

        <h6 class="text-weight-bold no-margin q-pl-md q-pb-sm">
          {{ $t("Add delivery instructions") }}
        </h6>
        <q-input
          v-model="text"
          autogrow
          outlined
          class="q-mb-md full-width"
          color="warning"
          :label="
            $t(
              'eg. ring the bell after dropoff, leave next to the porch, call upon arrival, etc'
            )
          "
        />

        <h6 class="text-weight-bold no-margin q-pl-md q-pb-sm">
          {{ $t("Address label") }}
        </h6>

        <q-btn-toggle
          class="q-mb-lg q-ml-md rounded-group"
          v-model="transaction_type"
          toggle-color="warning"
          no-caps
          unelevated
          :options="[
            { label: $t('Home'), value: 'delivery' },
            { label: $t('Work'), value: 'pickup' },
            { label: $t('Office'), value: 'dinein' },
          ]"
        />

        <q-separator spaced />

        <q-card-actions>
          <div class="row full-width">
            <div class="col">
              <q-btn
                unelevated
                roundedx
                outline
                text-color="black"
                no-caps
                class="full-width"
                :label="$t('Cancel')"
                size="17px"
                v-close-popup
              >
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                unelevated
                roundedx
                color="warning"
                text-color="black"
                no-caps
                class="full-width q-mb-md"
                :label="$t('Save')"
                size="17px"
              >
              </q-btn>
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineAsyncComponent, ref } from "vue";

export default {
  name: "AddressesNew",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
  },
  setup() {
    return {
      text: ref(""),
      address_details: ref(false),
      transaction_type: ref("delivery"),
      label: ref("Click me"),
    };
  },
};
</script>

<style lang="sass"></style>
