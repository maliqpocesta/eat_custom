<template>

    <q-item>
      <q-item-section>
          <h5 class="text-weight-bold q-mb-none w-25"><q-skeleton type="rect" /></h5>
          <q-item-label>
            <q-skeleton type="text" class="w-50" />
          </q-item-label>
      </q-item-section>
      </q-item>

    <q-separator />

    <q-space class="q-mt-lg" />

    <q-list >
    <q-item v-for="i in 4" :key="i"  class="border-bottom" >
      <q-item-section top>
          <q-item-label>
            <q-skeleton type="text" class="w-25" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" class="w-75" />
          </q-item-label>
      </q-item-section>
      <q-item-section top side>
          <div class="row inline q-gutter-xs">
            <q-skeleton type="QCheckbox" size="25px"></q-skeleton>
            <q-skeleton type="QCheckbox" size="25px"></q-skeleton>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

   <div class="q-pa-md">
   <q-skeleton type="QBtn" class="full-width rounded-borders-20"></q-skeleton>
   </div>

</template>

<script>
export default {
  name: 'AddressesSkeleton',
  setup () {
    return {}
  }
}
</script>
