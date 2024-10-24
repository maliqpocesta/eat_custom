<template>
  <q-card flat class="q-mb-sm">
    <q-card-section>
      <div class="row items-start q-col-gutter-sm">
        <div class="col-3">
          <div class="text-h5 no-margin line-normal">
            {{ $t("Choose Table") }}<span class="text-red">*</span>
          </div>
        </div>
        <div class="col-9">
          <!-- <pre>{{ SettingsStore.room_list }}</pre> -->
          <q-select
            outlined
            dense
            v-model="guest_number"
            color="warning"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            :options="guest_options"
            emit-value
            map-options
            :label="$t('Guest')"
          />

          <q-select
            outlined
            dense
            v-model="room_uuid"
            :options="SettingsStore.room_list"
            @update:model-value="table_uuid = ''"
            :label="$t('Room name')"
            color="warning"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            emit-value
            map-options
          />

          <q-select
            outlined
            dense
            v-model="table_uuid"
            :options="SettingsStore.table_list[room_uuid]"
            :label="$t('Table name')"
            color="warning"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            emit-value
            map-options
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useSettingsStore } from "stores/SettingsStore";
export default {
  name: "BookingCheckout",
  data() {
    return {
      guest_number: 1,
      guest_options: [],
      room_uuid: "",
      table_uuid: "",
    };
  },
  setup() {
    const SettingsStore = useSettingsStore();
    return { SettingsStore };
  },
  mounted() {
    this.guest_options = [];
    for (let i = 1; i < 20; i++) {
      this.guest_options.push(i);
    }
  },
};
</script>
