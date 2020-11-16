<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" xl="6" lg="7" md="12" class="about_details_wrapper">
        <div class="about_details">
          <p class="about_title">
            ABOUT
          </p>
          <div class="article_wrapper">
            <p class="article">
              Lacking data while developing an app? We all have faced this issue and to overcome this, I have developed this JSON-FACTORY which generate's data and returns generated data according to entered json structure.<br>
              Generation of data work's in two simple steps.<br>
              1. First add your json structure.<br>
              2. Select desired data by selecting/map to available categories.<br>
              Don't want to generate? I have covered this by adding numerous predefined data of employee, user, company's etc. Go in explore and search for your desired result.<br>
            </p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" xl="6" lg="5" md="12" class="json_factory_img_wrapper" v-if="$store.getters.resolutionOfScreenInCurrentState.width > 1264">
        <img class="json_factory_logo" src="@/assets/json_factory.svg" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {}
}
</script>
<style scoped>
.about_card {
  position: absolute;
  top: -30px;
  left: 20px;
  width: 100px;
  height: 100px;
  background: rgb(21, 180, 21);
}
.about_title {
  font-family: 'Montserrat-Regular';
  font-size: x-large;
  font-weight: bolder;
}
.json_factory_img_wrapper {
display: flex;
align-items: center;
justify-content: center;
height: calc(100vh - 64px);
}
.json_factory_logo {
  width: 100%;
  height: 100%;
}
.about_details {
  background: white;
  max-height: 700px;
  max-width: 900px;
  border-radius: 10px;
  height: 80%;
  padding: 20px;
  width: 80%;
  position: relative;
}
.about_details_wrapper {
  display: flex;
align-items: center;
justify-content: center;
height: calc(100vh - 64px);
}
article {
  font-family: 'Raleway-Regular';
  font-size: 15px;
}
.article_wrapper {
  padding: 20px;
}
</style>
