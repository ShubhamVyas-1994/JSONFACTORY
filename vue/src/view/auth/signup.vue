<template>
  <v-container fluid fill-height>
    <div class="card_wrapper">
      <div class="login_wrapper">
        <div class="c_card">
          <p class="login_title">SIGN UP</p>
          <v-form ref="form" autocomplete="false">
            <v-row class="px-5 pt-2">
              <v-col cols="6" class="pa-2">
                <v-text-field
                  label="First Name"
                  outlined
                  autofocus
                  :rules="[v => !!v || 'First name is required']"
                  autocomplete="new-password"></v-text-field>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-text-field
                  label="Last Name"
                  outlined
                  :rules="[v => !!v || 'Last name is required']"
                  autocomplete="new-password"></v-text-field>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-text-field
                  label="Email Id"
                  outlined
                  :rules="[v => !!v || 'Email is required']"
                  autocomplete="new-password"
                  append-icon="mdi-email"></v-text-field>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-text-field
                  label="Phone Number"
                  outlined
                  v-mask="'(+##) ##########'"
                  v-model.number="signupDetails.phoneNumber"
                  :rules="[v => !!v || 'Phone number is required']"
                  autocomplete="new-password"
                  append-icon="mdi-phone"></v-text-field>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-select
                  label="Gender"
                  outlined
                  :items="genderList"
                  :rules="[v => !!v || 'Gender is required']"
                  v-model="signupDetails.username"
                  autocomplete="new-password"></v-select>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-menu
                    v-model="dobModal"
                    transition="scale-transition"
                    offset-y
                    :close-on-content-click="false"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="signupDetails.dob"
                        label="DOB"
                        readonly
                        outlined
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker no-title v-model="signupDetails.dob"  @input="dobModal = false"></v-date-picker>
                  </v-menu>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-text-field
                  label="Password"
                  outlined
                  v-model="signupDetails.password"
                  type="password"
                  :rules="[v => !!v || 'Password is required']"
                  autocomplete="new-password"></v-text-field>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-text-field
                  label="Confirm Password"
                  outlined
                  :rules="[v => !!v || 'Confirm password is required']"
                  :error-messages="confirmPasswordErrorMessage"
                  autocomplete="new-password"
                  v-model="signupDetails.confirmPassword"
                  @blur="checkForPassword"
                  type="password"></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-2">
                <v-btn
                  @click="signup"
                  color="primary"
                  width="100%"
                  x-large
                  depressed
                  large
                  >Sign up</v-btn
                >
              </v-col>
              <v-col cols="12" class="pa-2 text-right">
                <p>Already have an account? <span class="c_pointer primary--text font-weight-bold" @click="$router.push({name: 'Login'})">Login In</span></p>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
import JsonFactory from '@/view/api/api.js'
import EncryptDecrpytPassword from '@/utils/crypto.js'

export default {
  data () {
    return {
      showPassword: false,
      signupDetails: {
        firstName: '',
        userName: '',
        dob: '',
        gender: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        confirmPassword: ''
      },
      genderList: ['Male', 'Female', 'Other'],
      dobModal: false,
      confirmPasswordErrorMessage: ''
    }
  },
  mounted () {},
  methods: {
    signup () {
      if (this.$refs.form.validate()) {
        JsonFactory.Signup().then(response => {

        }).catch(error => {
          console.log(error)
        })
      }
    },
    checkForPassword () {
      if (this.signupDetails.password === '') return
      if (this.signupDetails.password !== this.signupDetails.confirmPassword) {
        this.confirmPasswordErrorMessage = `Password don't match`
      } else {
        this.confirmPasswordErrorMessage = ``
      }
    },
    getSignupDetailsStruct () {
      return {
        fullName: this.signupDetails.firstName + ' ' + this.signupDetails.lastName,
        userName: this.signupDetails.userName,
        dob: this.signupDetails.dob,
        phoneNumber: this.signupDetails.phoneNumber,
        emailId: this.signupDetails.email,
        password: EncryptDecrpytPassword.getEncryptedPassword(this.signupDetails.password),
        gender: this.signupDetails.gender
      }
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
  width: 700px;
  min-height: 380px;
  min-width: 700px;
  background: white;
  border-radius: 20px;
  padding: 20px;
}
</style>
