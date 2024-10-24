<template>
  <q-dialog
    v-model="show_modal"
    persistent
    :position="this.$q.screen.gt.sm ? 'standard' : 'bottom'"
    :full-width="this.$q.screen.gt.sm ? false : true"
  >
    <q-card class="q-pa-md" style="width: 450px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none no-margin no-padding">
        <div class="text-h5 text-weight-bold">{{ $t("Edit phone number") }}</div>
        <q-space />
        <q-btn icon="ion-close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="beforeSubmit">
        <q-card-section>
          <div class="row q-mt-md q-col-gutter-xs">
            <div class="col-4">{{ $t("Country") }}</div>
            <div class="col-8">{{ $t("Phone number") }}</div>
          </div>
          <div class="row q-mt-sm q-col-gutter-xs">
            <div class="col-4">
              <q-select
                outlined
                dense
                v-model="phone_prefix"
                color="warning"
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                :options="prefixes"
              />
            </div>
            <div class="col-8">
              <q-input
                v-model="phone_number"
                maxlength="20"
                dense
                bg-color="white"
                color="warning"
                outlined
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="float-right q-mb-md">
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-btn
                unelevated
                dense
                rounded
                color="grey-2"
                text-color="black"
                no-caps
                class="q-pa-lg"
                :label="$t('Cancel')"
                size="17px"
                v-close-popup
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || $t('Please type something')]"
              >
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                unelevated
                dense
                rounded
                color="warning"
                text-color="black"
                no-caps
                class="full-width q-pa-lg"
                :label="$t('Save')"
                size="17px"
                type="submit"
                :loading="loading"
                :disabled="hasChangePhone"
              >
              </q-btn>
            </div>
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <StepsVerification
    ref="steps_verification"
    :sent_message="sent_message"
    :phone_prefix="phone_prefix"
    :phone_number="phone_number"
    @after-verifycode="afterVerifycode"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";

export default {
  name: "ChangePhoneModal",
  components: {
    StepsVerification: defineAsyncComponent(() => import("components/StepsVerification")),
  },
  data() {
    return {
      show_modal: false,
      loading: false,
      phone_prefix: "",
      phone_number: "",
      orig_phone_prefix: "",
      orig_phone_number: "",
      prefixes: [],
      sent_message: "",
    };
  },
  mounted() {
    this.getPhone();
  },
  computed: {
    hasChangePhone() {
      if (this.orig_phone_prefix !== this.phone_prefix.value) {
        return false;
      }
      if (this.orig_phone_number !== this.phone_number) {
        return false;
      }
      return true;
    },
  },
  methods: {
    getPhone() {
      this.$emit("beforeLoadphone");
      APIinterface.getPhone(APIinterface.getStorage("cart_uuid"))
        .then((data) => {
          this.prefixes = data.details.prefixes;
          this.phone_prefix = data.details.default_prefix_array;
          this.phone_number = data.details.contact_number;
          this.orig_phone_prefix = data.details.default_prefix_array.value;
          this.orig_phone_number = data.details.contact_number;
          this.$emit("afterGetphone", data.details.contact_number_w_prefix);
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.$emit("afterLoadphone");
        });
    },
    beforeSubmit() {
      this.loading = true;
      APIinterface.RequestEmailCode()
        .then((data) => {
          this.sent_message = data.msg;
          this.show_modal = false;
          this.$refs.steps_verification.show_modal = true;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    afterVerifycode(code) {
      this.$refs.steps_verification.visible = true;
      const $data = {
        code: code,
        phone_prefix: this.phone_prefix.value,
        phone_number: this.phone_number,
        cart_uuid: APIinterface.getStorage("cart_uuid"),
      };
      APIinterface.ChangePhone($data)
        .then((data) => {
          this.$refs.steps_verification.show_modal = false;
          APIinterface.notify("green-5", data.msg, "check_circle", this.$q);
          this.$emit("afterChangephone", data.details.contact_number);
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.$refs.steps_verification.visible = false;
        });
    },
  },
};
</script>
