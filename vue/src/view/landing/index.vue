<template>
  <div class="c-container">
    <div class="json_add_wrapper">
      <div class="json_textbox_wrapper">
        <v-row>
          <v-col cols="12" style="max-height: 550px">
            <div class="json_textbox" :style="!showTextarea ? '' : 'display:none'" @click="showTextarea = true">
              <p class="mb-4">Enter your JSON structure here...</p>
              <pre id="json_pre"></pre>
            </div>
            <textarea
              @input="disableGenerateButton = false"
              v-model="enteredJson"
              @blur="checkIfAnyJsonIsEntered"
              v-if="showTextarea"
              id="json_textarea"
              placeholder="Enter your JSON structure here..."
              type="text"
              class="json_textbox"></textarea>
              <p v-if="jsonError" class="error--text my-1">Entered JSON is invalid</p>
          </v-col>
          <v-col cols="12" class="pt-5 text-right">
              <v-btn :disabled="disableGenerateButton" depressed @click="addStruct" class="button_generate" rounded color="primary">Customize</v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="json_factory_details" v-if="$store.getters.resolutionOfScreenInCurrentState.width > 1264">
        <img class="json_factory_logo" src="@/assets/json_factory.svg" />
    </div>
  </div>
</template>
<script>
import addStructure from './addStructure'
import jsonPrettify from '@/mixins/jsonprettify.js'
export default {
  components: {
    addStructure
  },
  mixins: [jsonPrettify],
  data () {
    return {
      showAddStructureView: false,
      showTextarea: false,
      dummyObject: {
        userId: 1,
        userName: 'johndoe-1994',
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '777 Brockton Avenue',
        addressLine2: '',
        city: 'Abington',
        state: 'MA',
        country: 'USA',
        postalCode: '2351',
        dob: '1989-07-17T00:00:00.000Z',
        accountNumber: '1234567890',
        phoneNumber: '0077111311'
      },
      enteredJson: '',
      disableGenerateButton: true,
      jsonError: false
    }
  },
  watch: {
    showTextarea: {
      handler () {
        if (this.showTextarea) {
          setTimeout(() => {
            document.getElementById('json_textarea').focus()
          }, 100)
        }
      }
    }
  },
  mounted () {
    console.log(JSON.stringify(this.dummyObject))
    document.getElementById('json_pre').innerHTML = this.syntaxHighlight(JSON.stringify(this.dummyObject, null, 2))
  },
  methods: {
    checkIfAnyJsonIsEntered () {
      if (this.enteredJson === '') {
        this.showTextarea = false
        this.jsonError = false
        this.disableGenerateButton = true
      }
    },
    addStruct () {
      try {
        let data = JSON.parse(this.enteredJson)
        localStorage.setItem('addedJson', JSON.stringify(data))
        this.jsonError = false
        this.$router.push({name: 'CustomizeData'})
      } catch (err) {
        this.jsonError = true
        document.getElementById('json_textarea').style.border = '2px solid red'
      }
    },
    clearJsonInput () {
      this.jsonStruct = ''
      this.jsonError = false
      localStorage.removeItem('addedJson')
    }
  }
}
</script>
<style scoped>
#json_pre{
  overflow: hidden;
}
::-webkit-scrollbar{
  width: 0px;
}
</style>
