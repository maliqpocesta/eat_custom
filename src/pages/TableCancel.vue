<template>
  <q-page padding>
    <LocationNav />
    <div id="reservation" class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <template v-if="loading">
          <q-inner-loading :showing="loading" color="warning" />
        </template>
        <template v-else>
          <q-btn
            flat
            color="warning"
            icon="las la-angle-left"
            :label="$t('Back')"
            no-caps
            dense
            :to="{ name: 'track-reservation', query: { id: this.id } }"
          />

          <div class="text-left">
            <h4 class="no-margin text-weight-bold q-pb-sm">
              {{ $t("We're sorry that you have to cancel your reservation") }}.
            </h4>
            <p>{{ $t("Would you please tell us why you wish to cancel") }}?</p>
            <q-card flat>
              <q-card-section v-if="!loading">
                <q-list>
                  <q-item v-for="items in data" :key="items" tag="label" v-ripple>
                    <q-item-section avatar>
                      <q-radio v-model="reason" :val="items" color="warning" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ items }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-space class="q-pa-sm"></q-space>
                <q-btn
                  type="submit"
                  unelevated
                  color="warning"
                  text-color="dark"
                  no-caps
                  class="full-width"
                  :label="$t('Cancel reservation')"
                  :size="!this.$q.screen.lt.md ? '17px' : '15px'"
                  rounded
                  :disabled="!hasData"
                  :loading="submit"
                  @click="ConfirmcancelReservation"
                >
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </template>
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
  name: "TableCancel",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
  },
  data() {
    return {
      reason: "",
      loading: true,
      data: [],
      submit: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getCancelreason();
  },
  computed: {
    hasData() {
      if (!APIinterface.empty(this.reason)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    getCancelreason() {
      this.loading = true;
      APIinterface.fetchDataPostTable("getCancelreason", "id=" + this.id)
        .then((response) => {
          this.data = response.details.data;
        })
        .catch((error) => {
          this.data;
        })
        .then((data) => {
          this.loading = false;
        });
    },
    ConfirmcancelReservation() {
      this.$q
        .dialog({
          title: "Cancel reservation",
          message: "Are you sure to continue?",
          cancel: true,
          persistent: true,
          ok: {
            label: "Ok",
            flat: true,
            color: "warning",
            "no-caps": true,
          },
          cancel: {
            label: "No",
            flat: true,
            "no-caps": true,
            color: "grey",
          },
        })
        .onOk(() => {
          this.CancelReservation();
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    CancelReservation() {
      this.submit = true;
      APIinterface.fetchDataPostTableToken(
        "CancelReservation",
        "id=" + this.id + "&reason=" + this.reason
      )
        .then((response) => {
          APIinterface.notify("green", response.msg, "check", this.$q);
          setTimeout(() => {
            this.$router.push({
              name: "track-reservation",
              query: { id: this.id },
            });
          }, 500);
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.submit = false;
        });
    },
    //
  },
};
</script>
