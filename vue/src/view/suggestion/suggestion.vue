<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" xl="6" lg="6">
        <div class="feedback_wrapper">
          <div class="feedback_card">
            <v-form ref="form">
              <v-row>
                <v-col cols="12" class="pa-2">
                  <p class="feedback_title">Feedback</p>
                </v-col>
                <v-col cols="12" class="pa-2">
                  <v-text-field
                    outlined
                    background-color="white"
                    label="Name"
                    :rules="[v => !!v || 'Please enter your name']"
                    v-model="feedbackDetails.addedBy"></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-2">
                  <v-textarea rows="10" outlined background-color="white" label="Message" placeholder="Report a bug? Suggestion? Did jsonfactory helped you?" :rules="[v => !!v || 'Enter your feedback']" v-model="feedbackDetails.suggestion"></v-textarea>
                </v-col>
                <v-col cols="12" class="pa-2 text-right">
                  <v-btn @click="submitfeedback" depressed rounded color="primary">Submit</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </div>
      </v-col>
      <v-col cols="12" xl="6" lg="6">
        <div class="feedback_view_wrapper">
      <div class="feedback_view_card_wrapper">
        <div class="view_cards" v-for="(data, index) in feedbackList" :key="index">
          <v-row>
            <v-col cols="6" class="pa-2">
              <p class="subtitles">{{data.addedBy}}</p>
            </v-col>
            <v-col cols="6">
              <p class="pa-2 text-right subtitles">{{data.addedOn | formatTimeInToday}}</p>
            </v-col>
            <v-col cols="12" class="px-2">
              <blockquote>{{data.suggestion}}</blockquote>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import JsonFactory from '@/view/api/api.js'

export default {
  data () {
    return {
      feedbackList: [],
      feedbackDetails: {
        addedBy: '',
        feedback: ''
      }
    }
  },
  mounted () {
    this.getfeedbackList()
  },
  methods: {
    submitfeedback () {
      if (this.$refs.form.validate()) {
        JsonFactory.SubmitReview(
          this.feedbackDetails
        ).then(response => {
          this.clearInputs()
          this.getfeedbackList()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    getfeedbackList () {
      JsonFactory.GetFeedbackList().then(response => {
        this.feedbackList = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    clearInputs () {
      this.feedbackDetails.addedBy = ''
      this.feedbackDetails.suggestion = ''
      this.$refs.form.resetValidation()
    }
  }
}
</script>
<style scoped>
.feedback_wrapper {
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.feedback_view_wrapper {
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
}
@media only screen and (max-width: 1264px) {
  .feedback_wrapper{
    width: 100% !important;
  }
  .feedback_view_wrapper{
    width: 100% !important;
  }
}
.feedback_card {
  width: 100%;
  max-width: 600px;
  min-width: 350px;
  height: 500px;
}
.feedback_title {
  font-family: "Montserrat-Medium";
  font-size: 35px;
  font-weight: bold;
}
.feedback_view_card_wrapper {
  width: 90%;
  height: 90%;
  overflow: scroll;
  min-width: 500px;
  min-height: 500px;
}
.view_cards {
  width: 100%;
  min-height: 100px;
  background: white;
  padding: 10px;
  margin: 10px 0px;
  border-radius: 10px;
  border: solid 1px #999999;
}
.subtitles {
  font-size: 0.7rem;
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
