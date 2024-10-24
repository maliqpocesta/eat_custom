<template>
  <q-page padding>
    <StickyBack url="/account/menu" label="Back" v-if="this.$q.screen.lt.md" />
    <LocationNav v-else />

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row">
          <!-- left -->
          <div v-if="!this.$q.screen.lt.md" class="col-md-4 col-sm-4 col-xs-12">
            <AccountNav></AccountNav>
          </div>
          <!-- left -->

          <!-- right -->
          <div class="col-md-8 col-sm-8 col-xs-12">
            <q-card flat class="fit">
              <q-inner-loading
                :showing="upload_loading"
                color="warning"
              ></q-inner-loading>
              <q-item>
                <q-item-section avatar v-if="!this.$q.screen.lt.md">
                  <q-btn
                    dense
                    flat
                    color="dark"
                    icon="arrow_back_ios"
                    to="/account/orders"
                    no-caps
                    :label="$t('Back')"
                    class="no-margin"
                    v-if="!isMobile"
                  />
                </q-item-section>
                <q-item-section>
                  <h5 class="text-weight-bold">{{ $t("Upload Proof of Payment") }}</h5>
                  <p class="no-margin font12 text-weight-thin">
                    {{
                      $t("Please enter the details of your bank deposit payment below.")
                    }}
                  </p>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-form @submit="onSubmit" class="q-pa-md">
                <div class="text-caption q-mb-md">
                  {{
                    $t(
                      "Failure to provide accurate information may cause delays in processing or invalidation of your payment"
                    )
                  }}
                </div>

                <template v-if="loading_get">
                  <q-inner-loading :showing="true" color="warning"></q-inner-loading>
                </template>
                <template v-else>
                  <template v-if="hasData">
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label> {{ $t("Order#") }}: </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label>{{ order_info.order_id }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label> {{ $t("Amount") }}: </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label>{{ order_info.total }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>

                    <q-input
                      v-model="account_name"
                      :label="$t('Account name')"
                      outlined
                      lazy-rules
                      :bg-color="$q.dark.mode ? 'grey600' : 'input'"
                      :label-color="$q.dark.mode ? 'grey300' : 'grey'"
                      borderless
                      class="input-borderless"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || this.$t('This field is required'),
                      ]"
                    />

                    <q-input
                      v-model="amount"
                      :label="$t('Amount')"
                      outlined
                      lazy-rules
                      :bg-color="$q.dark.mode ? 'grey600' : 'input'"
                      :label-color="$q.dark.mode ? 'grey300' : 'grey'"
                      borderless
                      class="input-borderless"
                      :rules="[(val) => val > 0 || 'Amount must be greater than zero']"
                    />

                    <q-input
                      v-model="reference_number"
                      :label="$t('Reference Number')"
                      outlined
                      :bg-color="$q.dark.mode ? 'grey600' : 'input'"
                      :label-color="$q.dark.mode ? 'grey300' : 'grey'"
                      borderless
                      class="input-borderless"
                    />

                    <q-space class="q-pa-sm"></q-space>

                    <div
                      class="bg-white text-dark q-pl-sm q-pr-sm border-grey row items-center"
                    >
                      <div class="col-2">
                        <q-btn
                          unelevated
                          round
                          :color="$q.dark.mode ? 'grey600' : 'mygrey'"
                          :text-color="$q.dark.mode ? 'grey300' : 'grey'"
                          @click="pickFiles"
                          dense
                        >
                          <q-icon name="attach_file" class="rotate-45"></q-icon>
                        </q-btn>
                      </div>
                      <div class="col">
                        <q-uploader
                          :url="upload_api_url"
                          multiple
                          max-files="1"
                          ref="uploader"
                          flat
                          accept=".jpg, image/*"
                          max-total-size="10485760"
                          field-name="file"
                          @added="afterAddedFiles"
                          @removed="afterRemoveFiles"
                          @rejected="onRejectedFiles"
                          @uploading="onUploadingFiles"
                          @uploaded="afterUploaded"
                          @finish="afterFinishUpload"
                          class="full-width"
                        >
                          <template v-slot:header>
                            <q-uploader-add-trigger></q-uploader-add-trigger>
                          </template>
                          <template v-slot:list="scope">
                            <div class="flex justify-start q-col-gutter-x-md">
                              <template v-for="file in scope.files" :key="file.__key">
                                <div class="relative-position">
                                  <img
                                    :src="file.__img.src"
                                    style="max-width: 60px; height: 60px"
                                    class="radius10"
                                  />
                                  <div
                                    class="absolute-right"
                                    style="margin-right: -10px; margin-top: -5px"
                                  >
                                    <q-btn
                                      unelevated
                                      round
                                      color="blue"
                                      icon="close"
                                      size="xs"
                                      @click="scope.removeFile(file)"
                                    ></q-btn>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </template>
                        </q-uploader>
                      </div>
                    </div>

                    <q-space class="q-pa-sm"></q-space>

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
                      :dense="$q.screen.lt.sm"
                    >
                    </q-btn>
                  </template>
                  <template v-else>
                    <div class="bg-myyellow q-pa-sm radius8">
                      {{ $t("No data available") }}
                    </div>
                  </template>
                </template>
              </q-form>
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
import config from "src/api/config";

export default {
  name: "ChangePassword",
  components: {
    LocationNav: defineAsyncComponent(() => import("components/LocationNav")),
    AccountNav: defineAsyncComponent(() => import("components/AccountNav")),
    StickyBack: defineAsyncComponent(() => import("components/StickyBack")),
  },
  data() {
    return {
      loading: false,
      order_uuid: "",
      account_name: "",
      amount: 0,
      reference_number: "",
      upload_api_url: config.api_base_url + "/partnerapi/uploadimage",
      files: {},
      file_name: "",
      upload_loading: false,
      loading_get: false,
      data: [],
      order_info: [],
    };
  },
  mounted() {
    this.order_uuid = this.$route.query.order_uuid;
    this.getBankDeposit();
  },
  computed: {
    hasData() {
      if (Object.keys(this.order_info).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    getBankDeposit() {
      this.loading_get = true;
      APIinterface.fetchDataByTokenPost("getBankDeposit", "order_uuid=" + this.order_uuid)
        .then((data) => {
          this.data = data.details.data;
          this.order_info = data.details.order_info;

          if (Object.keys(this.data).length > 0) {
            this.account_name = this.data.account_name;
            this.amount = this.data.amount;
            this.reference_number = this.data.reference_number;
          }
        })
        .catch((error) => {
          APIinterface.notify("dark", error, "error", this.$q);
        })
        .then((data) => {
          this.loading_get = false;
        });
    },
    onSubmit() {
      if (Object.keys(this.files).length > 0) {
        this.$refs.uploader.upload();
      } else {
        this.uploadDeposit();
      }
    },
    pickFiles() {
      this.$refs.uploader.pickFiles();
    },
    onRejectedFiles(data) {
      console.log(data);
      APIinterface.notify("dark", this.$t("Invalid file type"), "error", this.$q);
    },
    afterAddedFiles(data) {
      Object.entries(data).forEach(([key, items]) => {
        this.files[items.name] = {
          name: items.name,
        };
      });
    },
    afterRemoveFiles(data) {
      Object.entries(data).forEach(([key, items]) => {
        delete this.files[items.name];
      });
    },
    onUploadingFiles(data) {
      this.upload_loading = true;
    },
    afterUploaded(data) {
      console.log(data);
      if (data.xhr.status == 200) {
        let result = JSON.parse(data.xhr.response);
        let code = result.code || false;
        let details = result.details || [];
        let message = result.msg || "";
        if (code == 1) {
          this.file_name = details.file_name;
          this.uploadDeposit();
        } else {
          APIinterface.notify("dark", message, "error", this.$q);
          this.$refs.uploader.reset();
        }
      } else {
        APIinterface.notify("dark", this.$t("IError uploading files"), "error", this.$q);
        this.$refs.uploader.reset();
      }
    },
    afterFinishUpload() {
      this.upload_loading = false;
    },
    uploadDeposit() {
      this.loading = true;
      let params = "order_uuid=" + this.order_uuid;
      params += "&account_name=" + this.account_name;
      params += "&amount=" + this.amount;
      params += "&reference_number=" + this.reference_number;
      params += "&file_name=" + this.file_name;
      APIinterface.fetchDataByTokenPost("uploadBankDeposit", params)
        .then((data) => {
          APIinterface.notify("positive", data.msg, "check_circle", this.$q);
          setTimeout(() => {
            this.$router.push("/account/orders");
          }, 200);
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
