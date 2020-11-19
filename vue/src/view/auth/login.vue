<template>
  <v-container fluid fill-height>
    <div class="card_wrapper">
      <div class="login_wrapper">
        <div class="c_card">
          <p class="login_title">LOGIN</p>
          <v-row class="pa-5 pb-0">
            <v-col cols="12" class="pa-2">
              <v-text-field
                autofocus
                label="Email Id"
                outlined
                :rules="[v => !!v || 'Email is required']"
                autocomplete="new-password"
                append-icon="mdi-email"></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-2">
              <v-text-field
                label="Password"
                outlined
                :rules="[v => !!v || 'Password is required']"
                autocomplete="new-password"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-2">
              <v-btn
                color="primary"
                width="100%"
                x-large
                depressed
                large
                class="font-weight-bold"
                >Log In</v-btn
              >
            </v-col>
            <v-col cols="4" class="pa-2">
              <p class="c_pointer">Forgot Password?</p>
            </v-col>
            <v-col cols="8" class="pa-2 text-right">
              <p class="">
                Don't have account?
                <span @click="$router.push({name: 'Signup'})" class="font-weight-bold primary--text c_pointer"
                  >Sign Up</span
                >
              </p>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
import JsonFactory from '@/view/api/api.js'
export default {
  data () {
    return {
      showPassword: false
    }
  },
  mounted () {},
  methods: {
    login () {
      JsonFactory.Login({emailId: '123', password: '1231123'}).then(val => {
        console.log(val)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
.card_wrapper {
  width: 100%;
  height: calc(100vh - 64px);
  display: inline-flex;
  align-items: center;
  justify-content: left;
  background: url("~@/assets/background.jpg") no-repeat;
  background-size: cover;
  background-position: center;
}
.card {
  display: inline-flex;
}
.login_wrapper {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
@media only screen and (max-width: 1264px) {
  .login_wrapper {
    width: 100% !important;
  }
}
.login_details {
  width: 50%;
  justify-content: center;
}
.login_title {
  font-family: "Montserrat-Black";
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}
.c_card {
  width: 550px;
  min-height: 380px;
  min-width: 550px;
  background: white;
  border-radius: 20px;
  padding: 25px;
}
</style>
