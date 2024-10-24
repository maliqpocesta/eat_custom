<template>
    <q-card
      flat
      bordered="false"
      class="full-height q-pa-sm">

      <q-skeleton height="150px" square />

      <q-card-section class="no-margin q-pt-sm q-pb-none">
        <q-skeleton type="QBadge"/>
        <q-skeleton type="text"/>
      </q-card-section>

      <q-card-actions class="q-pa-sm" vertical align="between">
          <q-skeleton type="QBtn" class="full-width" />
      </q-card-actions>

    </q-card>
</template>

<script>
export default {
  name: 'SkeletonItem',
  setup () {
    return {}
  }
}
</script>
