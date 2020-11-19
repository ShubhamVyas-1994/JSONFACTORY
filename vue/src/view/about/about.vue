<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" xl="6" lg="7" md="12" class="about_details_wrapper">
        <div style="min-width: 600px;width:700px">
          <p class="about_title">
          About
        </p>
        <blockquote>
          <b>Jsonfactory</b> is a project meant to generate realistic data. I m pretty sure that all developers out there must have faced an issue of lack of data in the app. So did I.
          <br>Data is the life of any app. without data, any app seems lifeless. You can neither test the app nor demonstrate a demo of the app if your app lacks data.
          <br>JSON is a lightweight format for storing and transporting data. JSON is often used for transferring data from a server to a web page so I decided to go with JSON as input. We cannot use real customer data for testing as it is very sensitive.
          <br>Jsonfactory will not only help you in generating desired data but it will also improve the quality of testing and your app will make more sense.
          <br>Generation of data is done in two simple ways.
          <br>First, get your desired JSON structure. (make sure its an object {}).
          <br>Then select available categories in your entered fields.
          <br>That's it, folks. Now click on the generate button and wait for the magic to happen.
          <br>Do you any suggestions? Did you saw a bug? For that, I have added a feedback section where you can add review, bug, and suggestion.<br>
          You can contribute to this project by donating any amount with no compulsion.<br>
          <b>Developed By,</b><br>
          Shubham Vyas
        </blockquote>
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
  font-family: "Montserrat-Medium";
  font-size: 35px;
  font-weight: bold;
  padding:10px 0px;
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
  border-radius: 10px;
  min-height: 500px;
  padding: 20px;
  position: relative;
}
.about_details_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
}
blockquote{
  line-height: 30px;
}
</style>
