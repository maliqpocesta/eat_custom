<template>
  <div class="text-center margin-auto" style="width: 25%">
    <h4 class="no-margin text-weight-bold q-pb-sm"><q-skeleton type="rect" /></h4>
    <p><q-skeleton type="text" class="w-50 margin-auto" /></p>
  </div>

  <div class="w-50x m-auto relative-position">
    <q-skeleton type="QInput" height="35px" class="rounded q-mb-sm" />

    <q-card v-for="i in 8" :key="i" flat class="q-mb-md">
      <q-card-section>
        <div class="row">
          <div class="col no-padding">
            <q-item-label>
              <q-skeleton type="text" class="w-25" />
            </q-item-label>
            <q-item-label caption class="q-mb-sm">
              <q-skeleton type="text" />
            </q-item-label>

            <q-item-label>
              <q-skeleton type="text" class="w-25" />
            </q-item-label>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
          </div>
          <div class="col no-padding text-right">
            <q-item-label>
              <q-skeleton type="text" class="w-25 float-right" />
            </q-item-label>
          </div>
        </div>
        <!-- row -->
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "OrderSkeleton",
};
</script>
