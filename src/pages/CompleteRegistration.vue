<template>
  <q-page padding>
    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="text-center">
          <h4 class="no-margin text-weight-bold q-pb-sm">
            {{ $t("Complete your signup") }}
          </h4>
          <p>{{ $t("lets complete your information") }}</p>
        </div>

        <q-card flat class="w-75 margin-auto">
          <q-card-section>
            <q-form @submit="obSubmit" autocomplete="off">
              <h5 class="text-weight-bold">{{ $t("Fill your information") }}</h5>
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <q-input
                    bg-color="mygrey"
                    color="warning"
                    outlined
                    v-model="first_name"
                    :label="$t('First name')"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                    :disable="loading"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6">
                  <q-input
                    bg-color="mygrey"
                    color="warning"
                    outlined
                    v-model="last_name"
                    :label="$t('Last name')"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('This field is required'),
                    ]"
                    :disable="loading"
                  />
                </div>
              </div>

              <q-input
                bg-color="mygrey"
                color="warning"
                outlined
                v-model="email_address"
                :label="$t('Email')"
                disable
                :rules="[(val) => !!val || $t('this field is required'), isValidEmail]"
              />

              <q-input
                bg-color="mygrey"
                color="warning"
                outlined
                v-model="mobile_number"
                :label="$t('Mobile number')"
                :prefix="mobile_prefix"
                mask="##################"
                :rules="[
                  (val) => (val && val.length > 0) || $t('This field is required'),
                  (val) => val.length <= 15 || $t('Please use maximum 15 characters'),
                ]"
                :disable="loading"
              />

              <q-input
                type="password"
                bg-color="mygrey"
                color="warning"
                outlined
                v-model="password"
                :label="$t('Password')"
                :rules="[
                  (val) => (val && val.length > 0) || $t('This field is required'),
                  isValidPassword,
                ]"
                :disable="loading"
              />

              <q-input
                type="password"
                bg-color="mygrey"
                color="warning"
                outlined
                v-model="cpassword"
                :label="$t('Confirm Password')"
                :rules="[
                  (val) => (val && val.length > 0) || $t('This field is required'),
                  isValidPassword,
                ]"
                :disable="loading"
              />

              <div
                v-if="settings.merchant_signup_enabled_terms == 1"
                class="q-pl-md q-pr-md"
              >
                <p
                  class="font12 text-weight-thin"
                  v-html="settings.merchant_signup_terms"
                ></p>
              </div>

              <q-btn
                type="submit"
                unelevated
                rounded
                color="warning"
                text-color="black"
                no-caps
                class="full-width"
                :label="$t('Submit')"
                size="17px"
                :loading="loading"
              >
              </q-btn>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";

export default {
  name: "CompleteRegistration",
  data() {
    return {
      loading: false,
      mobile_prefix: "",
      settings: [],
      first_name: "",
      last_name: "",
      email_address: "",
      mobile_number: "",
      password: "",
      cpassword: "",
    };
  },
  mounted() {
    this.getCustomerInfo();
  },
  methods: {
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || this.$t("Please enter valid email address");
    },
    isValidPassword() {
      if (this.password === this.cpassword) {
        return true;
      }
      return this.$t("Confirm password does not macth with password");
    },
    getCustomerInfo() {
      this.loading = true;
      APIinterface.getCustomerInfo(this.$route.query.uuid)
        .then((data) => {
          this.first_name = data.details.firstname;
          this.last_name = data.details.lastname;
          this.email_address = data.details.email_address;
          this.mobile_prefix = data.details.options.phonecode;
          this.settings = data.details.options;
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    obSubmit() {
      const params = {
        local_id: APIinterface.getStorage("local_id"),
        client_uuid: this.$route.query.uuid,
        firstname: this.first_name,
        lastname: this.last_name,
        mobile_prefix: this.mobile_prefix,
        mobile_number: this.mobile_number,
        password: this.password,
        cpassword: this.cpassword,
      };
      APIinterface.completeSocialSignup(params)
        .then((data) => {
          auth.setUser(data.details.user_data);
          auth.setToken(data.details.user_token);
          this.$router.push("/menu");
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {});
    },
  },
};
</script>
