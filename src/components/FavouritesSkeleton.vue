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

    <div class="row justify-start items-center ">
      <div v-for="i in 9" :key="i" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none">
        <q-card flat class="column items-center full-height q-pa-sm position-relative">

            <q-avatar size="80px" square class="col self-center q-mb-sm"  >
              <q-skeleton type="QAvatar" />
            </q-avatar>
            <q-skeleton type="text" class="w-75"/>
            <q-skeleton type="text" class="w-50" height="15px"  />

        </q-card>
      </div>
    </div>
    <!-- row -->

</template>

<script>
export default {
  name: 'FavouritesSkeleton',
  setup () {
    return {}
  }
}
</script>
