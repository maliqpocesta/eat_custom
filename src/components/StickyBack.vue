<template>
  <q-page-sticky expand position="top">
      <q-toolbar class="bg-white">
        <q-btn dense flat color="dark"
        icon="arrow_back_ios"
        no-caps
        :to="url"
        :label="label" />
      </q-toolbar>
    </q-page-sticky>
    <div class="q-pa-xs-md q-pa-md-lg"></div>
</template>

<script>
export default {
  name: 'StickyBack',
  props: ['url', 'label'],
  setup () {
    return {}
  }
}
</script>
