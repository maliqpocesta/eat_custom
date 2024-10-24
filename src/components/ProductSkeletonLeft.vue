<template>
   <div class="float-right q-mb-xs">
      <q-skeleton type="QCheckbox" size="32px" class="q-mb-sm"  />
  </div>

  <div style="clear:both;"></div>
  <q-skeleton height="170px" class="q-mb-md" />

  <q-item-label>
    <q-skeleton type="rect" />
  </q-item-label>
  <q-item-label >
    <q-skeleton type="text" v-for="i in 3" :key="i" />
  </q-item-label>

   <q-skeleton height="50px" class="q-mt-md" />
   <q-skeleton height="40px" class="q-mt-md q-mb-md" />

     <!-- quantity -->
      <div class="row items-center justify-center">
        <div class="col-sm-6 col-8 no-padding">
          <div class="text-h5 no-margin text-weight-bold"><q-skeleton type="text" class="w-25" /></div>
        </div>
        <div class="col-sm-6 col-4">

          <div class="row items-center justify-center ">
              <div class="col no-padding text-center "><q-skeleton type="QCheckbox"  size="32px"  /></div>
              <div class="col no-padding text-center "><q-skeleton type="text" class="w-50 margin-auto" /></div>
              <div class="col no-padding text-center "><q-skeleton type="QCheckbox"  size="32px"  /></div>
          </div>

        </div>
      </div>
      <!-- quantity -->

    <q-skeleton height="35px" class="q-mt-md" />

</template>

<script>
export default {
  name: 'ProductSkeletonLeft'
}
</script>
