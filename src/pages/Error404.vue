<template>
  <q-page padding>

  <!-- location nav -->
    <LocationNav
    ref="location_nav"
    @after-getinfo="afterGetinfo"
    @change-transaction="changeTransaction"
    />
    <!-- location nav -->

    <div class="text-center q-pa-md flex flex-center">

      <div>
        <q-img
          src="404@2x.png"
          :style="screenSize"
          lazy
        />
        <div class="text-h5">
          Page not found
        </div>
        <div class="text-h6" style="opacity:.4">
          uh-oh! Looks like the page you are trying to access, doesn't exist. Please start afresh.
        </div>
        <q-btn
          class="q-mt-xl"
          color="warning"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'Error404',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav'))
  },
  computed: {
    screenSize () {
      if (this.$q.screen.lt.sm) {
        return 'max-width:200px'
      } else if (this.$q.screen.lt.md) {
        return 'max-width:250px'
      } else {
        return 'max-width:350px'
      }
    }
  }
}
</script>
