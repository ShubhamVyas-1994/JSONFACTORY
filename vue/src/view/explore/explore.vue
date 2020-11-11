<template>
  <v-container fluid fill-height class="pa-2">
    <v-row>
      <v-col cols="12">
        <div class="available_wrapper">
        <v-row>
          <v-col cols="12" xl="9" lg="9" sm="6" md="8" class="pa-2">
            <p class="explore_title">EXPLORE</p>
          </v-col>
          <v-col cols="12" xl="3" lg="3" md="4" sm="6" class="pa-2">
            <v-text-field background-color="white" dense label="Find desired data" append-icon="mdi-magnify" rounded outlined></v-text-field>
          </v-col>
        </v-row>
      </div>
        <div class="explore_title_wrapper">
          <img class="explore_img" src="@/assets/explore.svg" alt="">
            <div class="explore_subtitle_wrapper">
              <blockquote class="explore_subtitle">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </blockquote>
            </div>
          </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" class="category_wrapper">
        <div class="category_cards" v-for="(data, index) in categoryList" :key="index">
            <v-card style="border-radius:10px" flat color="white" height="100">
              <v-card-text>
                {{data}}
              </v-card-text>
            </v-card>
          </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      categoryList: ['Employee', 'User', 'Company', 'Inventory', 'Employee', 'User', 'Company', 'Inventory', 'Employee', 'User', 'Company', 'Inventory', 'Employee', 'User', 'Company', 'Inventory', 'Employee', 'User', 'Company', 'Inventory']
    }
  }
}
</script>
<style scoped>
.category_wrapper {
  width: 100%;
  display: contents;
}
.category_cards {
  width: 300px;
  padding: 6px;
}
.available_title {
  font-size: large;
  font-family: 'Montserrat-Regular';
}
.available_wrapper {
  width: 100%;
  display: block;
}
.explore_img_wrapper{
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.explore_img{
  width: 100%;
  max-width: 250px;
  max-height: 400px;
}
.header_wrapper {
  width: 100%;
  display: inline-flex;
  align-items: center;
}
.explore_title_wrapper {
  width: 100%;
  padding: 20px 0px;
  display: flex;
}
.explore_title {
  font-family: 'Montserrat-Regular';
  font-weight: bolder;
  font-size: 25px;
}
.explore_subtitle {
  font-family: 'Raleway-Regular';
  font-size: 16px;
  padding: 20px;
}
</style>
