<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" xl="6" lg="7" md="12" class="about_details_wrapper">
        <div class="about_details">

        </div>
      </v-col>
      <!-- <v-col cols="12" xl="6" lg="5" md="12" class="json_factory_img_wrapper">
        <img class="json_factory_logo" src="@/assets/json_factory.svg" />
      </v-col> -->
    </v-row>
  </v-container>
</template>
<script>
export default {}
</script>
<style scoped>
.json_factory_img_wrapper {
display: flex;
align-items: center;
justify-content: center;
height: calc(100vh - 64px);
}
.json_factory_logo {
  max-width: 400px;
}
.about_details {
  background: white;
  max-height: 700px;
  max-width: 900px;
  border-radius: 10px;
  height: 80%;
  width: 80%;
}
.about_details_wrapper {
  display: flex;
align-items: center;
justify-content: center;
height: calc(100vh - 64px);
}
</style>
