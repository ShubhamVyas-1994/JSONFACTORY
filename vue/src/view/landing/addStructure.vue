<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="10" xs12>
          <v-card-title class="py-3 px-1 ctitle">
            <p class="structure_add_title">Add JSON</p>
            <v-menu
              v-model="menu"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ attrs }">
                <v-icon
                 class="ml-2"
                  v-bind="attrs"
                  small
                  @mouseover="menu = true">
                  mdi mdi-information-outline
                </v-icon>
              </template>

              <v-card
                @mouseleave="menu = false"
                flat >
                <v-card-text class="info_card">
                  <blockquote>
                    Enter a json object to parse.
                    <br />
                    Output structure would be same as entered json structure
                    <br />
                    Don't know what json is ? <span class="primary--text c_pointer" style="text-decoration:underline" @click="redirectToJsonUrl">Click here</span>
                  </blockquote>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-card-title>
        <v-textarea style="background:white" :error="jsonError" rows="20" v-model="jsonStruct" placeholder  ="Add Struct" outlined>
          </v-textarea>
        <p v-if="jsonError" class="error--text mt-2">Enter a valid json</p>
      <v-col xl="12" lg="12" md="12" sm="12" class="py-2 text-right">
        <v-btn :disabled="jsonStruct === ''" class="mr-2" @click="clearJsonInput">
          Clear
        </v-btn>
        <v-btn color="primary" :disabled="jsonStruct === ''" @click="addStruct">
          Continue
        </v-btn>
      </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      showAddJsonDialog: false,
      jsonStruct: '',
      jsonError: false,
      menu: false
    }
  },
  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    }
  },
  mounted () {
    let jsonData = localStorage.getItem('jsonStructureAdded')
    if (jsonData !== null && jsonData !== undefined) this.jsonStruct = jsonData
    console.log(JSON.stringify({
      customerAccountId: 0,
      customerName: '',
      customerCode: '',
      staffSize: '',
      industryType: '',
      notes: '',
      assignToEmployeeId: 0,
      externalLinkList: [{
        externalLinksId: 0,
        linkType: '',
        link: '',
        notes: '',
        linkTypeError: '',
        linkError: ''
      }],
      importantDatesList: [{
        importantDatesId: 0,
        dateType: '',
        selectedDate: '',
        notes: ''
      }],
      customerMappingList: [],
      contactEmailList: [{
        contactEmailDetailId: 0,
        emailType: '',
        emailId: '',
        notes: '',
        isPrimary: true
      }],
      contactNumberList: [{
        contactNumberDetailId: 0,
        countryCode: '',
        selectedCode: '',
        numberType: '',
        contactNumber: '',
        notes: '',
        isPrimary: true
      }],
      relationList: [
        {
          customerRelationTypeMappingId: 0,
          relationTypeMasterId: 1
        }
      ],
      profileData: [],
      addressList: [{
        addressDetailId: 0,
        addressTitle: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        isPrimary: true
      }]
    }))
  },
  methods: {
    redirectToJsonUrl () {
      window.open('https://www.json.org/')
    },
    addStruct () {
      try {
        let data = JSON.parse(this.jsonStruct)
        localStorage.setItem('addedJson', JSON.stringify(data))
        this.$router.push({name: 'CustomizeData'})
      } catch (err) {
        this.jsonError = true
      }
    },
    clearJsonInput () {
      this.jsonStruct = ''
      this.jsonError = false
      localStorage.removeItem('addedJson')
    },
    getObjectEntries (data) {
      Object.entries(data).forEach(val => {
        // console.log('val', val[0], typeof val[1], typeof val[1] === "object" ? Array.isArray(val[1]) : '')
      })
    }
  }
}
</script>
