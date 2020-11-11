<template>
  <v-container fluid>
    <v-row class="pa-2">
      <v-col cols="12" xl="7" lg="7" class="pa-2" style="position:relative">
        <div class="output_options">
          <v-row>
            <v-col cols="4" class="output_header">
              <p class="output_title">Generated Data</p>
            </v-col>
            <v-col cols="8" class="pa-1 text-right">
              <v-menu
                bottom
                left
                v-if="$store.getters.resolutionOfScreenInCurrentState.width < 800"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title>Raw</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Pretty</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Copy To Clipboard</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Download JSON File</v-list-item-title>
                  </v-list-item>
                  <!-- <v-list-item>
                    <v-list-item-title>Download CSV File</v-list-item-title>
                  </v-list-item> -->
                </v-list>
              </v-menu>
              <div v-else>
                <v-btn small rounded depressed class="ma-1" :color="!showPrettyView ? 'secondary' : '#eee'" @click="showPrettyView = false" >Raw</v-btn>
                <v-btn small rounded depressed class="ma-1" :color="showPrettyView ? 'secondary' : '#eee'" @click="showPrettyView = true" >Pretty</v-btn>
                <v-btn small rounded depressed @click="copyToClipboard" class="ma-1"  color="primary">
                  <v-icon small color="white" class="mr-2">mdi mdi-content-copy</v-icon> Copy
                </v-btn>
                <v-btn small class="ma-1" rounded depressed @click="downloadJsonFile" color="primary">
                  <v-icon small color="white" class="mr-2">mdi mdi-download-outline</v-icon> JSON
                </v-btn>
                <!-- <v-btn @click="downloadCSVFile" small class="ma-1" rounded depressed color="primary">
                  <v-icon small color="white" class="mr-2">mdi mdi-download-outline</v-icon>
                  CSV
                </v-btn> -->
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="output_card" id="output_card" @scroll="toggleScrollButton">
          <p v-if="!showPrettyView">
            {{outPutData}}
          </p>
          <pre id="pretty_json" :style="showPrettyView ? '' : 'display: none'"></pre>
        </div>
        <v-btn
            fab
            small
            color="primary"
            dark
            botto
            right
            @click="scrollIntoViewOfCard"
            class="example"
          >
            <v-icon>{{showScrollToButton ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-up'}}</v-icon>
          </v-btn>
      </v-col>
      <v-col cols="12" xl="5" lg="5" class="pa-2">
        <div class="added_json">
          <div class="added_json_header">
            Input JSON
          </div>
          <div class="added_json_pre">
            <pre id="added_json"></pre>
          </div>
        </div>
        <a id="downloadAnchorElem" style="display:none"></a>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="clipboardSnakBar"
      light
      color="success"
      class="snakbar"
    >
      <v-icon small color="secondary" class="mr-4">{{snakbarIcon}}</v-icon> {{snakbarText}}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="clipboardSnakBar = false"
        >
          <v-icon small color="secondary">mdi mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      outPutData: '',
      prettyJson: '',
      showPrettyView: true,
      showScrollToButton: true,
      clipboardSnakBar: false,
      snakbarText: 'Copied To Clipboard',
      snakbarIcon: 'mdi mdi-content-copy'
    }
  },
  mounted () {
    this.outPutData = localStorage.getItem('outputData')
    let elem = document.getElementById('pretty_json')
    elem.innerHTML = this.syntaxHighlight(JSON.stringify(JSON.parse(this.outPutData), null, 2))
    document.getElementById('added_json').innerHTML = this.syntaxHighlight(JSON.stringify(JSON.parse(localStorage.getItem('addedJson')), null, 2))
  },
  methods: {
    toggleScrollButton () {
      let elem = document.getElementById('output_card')
      this.showScrollToButton = (elem.scrollHeight - elem.offsetHeight) > elem.scrollTop
    },
    scrollIntoViewOfCard () {
      if (this.showScrollToButton) {
        document.getElementById('output_card').scrollTop = document.getElementById('output_card').scrollHeight
      } else {
        document.getElementById('output_card').scrollTop = 0
      }
    },
    syntaxHighlight (json) {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    },
    copyToClipboard () {
      const el = document.createElement('textarea')
      el.value = this.outPutData
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      el.style.display = 'hidden'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      this.clipboardSnakBar = true
    },
    downloadJsonFile () {
      var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(this.outPutData)
      var dlAnchorElem = document.getElementById('downloadAnchorElem')
      dlAnchorElem.setAttribute('href', dataStr)
      dlAnchorElem.setAttribute('download', 'data.json')
      dlAnchorElem.click()
      this.snakbarText = 'JSON File Downloaded'
      this.snakbarIcon = 'mdi mdi-file-document-outline'
      this.clipboardSnakBar = true
    },
    downloadCSVFile () {
      let csvstring = 'data:text/csv;charset=utf-8,'
      const items = JSON.parse(this.outPutData)
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
      const header = Object.keys(items[0])
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      csv.unshift(header.join(','))
      csv = csv.join('\r\n')
      csvstring += csv

      var encodedUri = encodeURI(csvstring)
      var link = document.getElementById('downloadAnchorElem')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'my_data.csv')
      link.click()

      this.snakbarText = 'Downloaded File'
      this.snakbarIcon = 'md mdi-file-document-outline'
      this.clipboardSnakBar = true
    }
  }
}
</script>
<style scoped>
.output_options{
  width: 100%;
  border: 1px solid rgb(206, 206, 206);
  border-bottom: none;
  border-radius: 10px 10px 0px 0px;
  border-top: none;
  display: flex;
  background: white;
  align-items: center;
  padding: 5px;
  justify-content: flex-end;
}

.output_card {
  width: 100%;
  background: white;
  position: relative;
  padding: 20px;
  overflow: scroll;
  scroll-behavior: smooth;
  height: calc(100vh - 150px);
  border: 1px solid rgb(206, 206, 206);
  border-radius: 0px 0px 10px 10px;
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.added_json_header {
  padding: 12px;
  font-family: 'Montserrat-Regular';
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(206, 206, 206);
}
.added_json {
  border: 1px solid rgb(206, 206, 206);
  height: calc(100vh - 64px - 32px);
  border-radius: 10px;
  background: white;
}
.added_json_pre {
  overflow: scroll;
  height: calc(100% - 55px);
  padding: 20px;
}
.example {
    bottom: 20px;
    right: 20px;
    position: absolute !important;
  }
.output_title {
  font-family: 'Montserrat-Regular';
  font-weight: bold;
  font-size: 16px;
  padding-left: 12px;
}
.output_header {
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.snakbar {
  font-family: 'Montserrat-Regular';
}
</style>
