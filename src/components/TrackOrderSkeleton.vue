<template>
  <q-card flat class="q-pa-md">
  <div class="row justify-center q-pa-md ">
      <div class="col-xs-12 col-sm-6 col-md-4 q-pr-md q-mb-xs-md q-pr-md">

       <q-item-section class="q-mb-md">
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>

        <div class="row q-mb-sm q-mb-md">
             <div class="col-3">
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" />
                </q-item-section>
             </div>
             <div class="col">
                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" class="w-50" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" />
                  </q-item-label>
                </q-item-section>
             </div>
         </div>

         <q-skeleton type="rect" class="q-mb-md" />

        <q-item-section class="q-mb-md">
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>

        <template v-for="i in 3" :key="i">
        <q-separator></q-separator>
        <q-skeleton type="text" class="w-50 q-mt-md" />
        <q-item-section class="q-mb-md">
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
        </template>

      </div>
      <!-- col -->
      <div class="col-xs-12 col-sm-6 col-md-8">
        <div class="maps fit relative-position gt-xs">
           <q-inner-loading
            :showing="visible"
            label-class="text-dark"
          />
        </div>
      </div>
      <!-- col -->
  </div>
  <!-- row -->
  </q-card>
</template>

<script>
export default {
  name: 'TrackOrderSkeleton',
  data () {
    return {
      visible: true
    }
  }
}
</script>
