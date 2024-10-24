<template>
  <h4 class="text-weight-medium no-margin">{{ $t("Order where you are") }}</h4>
  <p class="no-margin font12 text-weight-light">
    {{ $t("download our mobile application") }}.
  </p>

  <div class="row inline q-mt-md">
    <div class="column q-pr-md">
      <q-img src="app-store@2x.png" spinner-color="white" style="width: 95px" />
    </div>
    <div class="column">
      <q-img src="google-play@2x.png" spinner-color="white" style="width: 95px" />
    </div>
  </div>
  <!-- row -->
</template>

<script>
export default {
  name: "FooterApp",
  data() {
    return {
      data: [],
    };
  },
};
</script>
