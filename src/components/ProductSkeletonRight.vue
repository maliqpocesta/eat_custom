<template>

  <div v-for="i in 2" :key="i" class="q-mb-lg">
  <q-skeleton type="rect" class="w-50 q-mb-md" />

  <div class="row inline w-75">
    <div class="col ">
      <div class="row ">
         <q-skeleton type="QCheckbox" size="25px" class="column q-mr-md" />
         <q-skeleton type="text" class="column w-50"  />
      </div>
    </div>
    <div class="col">
      <div class="row">
         <q-skeleton type="QCheckbox" size="25px" class="column q-mr-md" />
         <q-skeleton type="text" class="column w-50"  />
      </div>
    </div>
  </div>
  </div>
  <!-- size -->

  <!-- addons -->
  <DIV v-for="e in 2" :key="e" class="q-mb-md">
  <div class="row justify-between bg-grey-1 q-pa-sm">
      <div class="col-3 no-margin">
      <q-item-label>
        <q-skeleton type="text" />
      </q-item-label>
      </div>
  </div>
  <div class="row q-gutter-none addon-carousel q-mt-md q-col-gutter-sm" >
    <div v-for="x in 4" :key="x" class="col-lg-3 col-md-3 col-sm-6 col-xs-12 text-center text-center">
       <q-item-section avatar class="q-mb-sm" >
          <q-skeleton type="QAvatar" class="margin-auto" />
        </q-item-section>
        <q-item-label>
            <q-skeleton type="text" class="w-75 margin-auto" />
          </q-item-label>
          <q-item-label>
            <q-skeleton type="text" class="w-50 margin-auto" />
          </q-item-label>
    </div>
  </div>
  </DIV>
  <!-- addons -->

</template>

<script>
export default {
  name: 'ProductSkeletonRight'
}
</script>
