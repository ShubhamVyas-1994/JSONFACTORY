<template>
  <div class="c-container pa-2" v-if="categoryList.length > 0">
    <div class="table_card pa-2">
        <div class="table_row_header pa-3">
          <p class="table_card_title">Customize values</p>
          <v-spacer></v-spacer>
          <v-btn depressed color="primary" rounded @click="getOutput">
            Generate Data
          </v-btn>
        </div>
      <!-- <v-card color="accent lighten-2" style="border-radius:0% !important ">
      </v-card> -->
      <div class="table_rows">
        <column :objectToIterate="jsonAdded" :categoryList="categoryList"/>
      </div>
    </div>
    <div class="table_help pa-2">
      <v-card style="border-radius:10px" outlined :height="$store.getters.resolutionOfScreenInCurrentState.height - 96">
        <v-row>
          <v-col cols="12" class="pa-3">
            <v-text-field rounded append-icon="mdi-magnify" dense outlined label="Search for mapping value" v-model="searchValue" @input="filterCategoriesAsPerSearch"></v-text-field>
          </v-col>
        </v-row>
        <div :style="`height:${$store.getters.resolutionOfScreenInCurrentState.height - 176}px;overflow-y:scroll`">
          <v-card :elevation="hover ? 6 : 0" :outlined="!hover" class="category_cards" v-for="(data, index) in searchForCategoryList" :key="index">
            <p class="card_title primary--text">{{data.categoryName}} <span class="grey--text">({{data.mapTo}})</span></p>
            <v-chip small class="mr-1 my-1" v-for="(examples, eIndex) in data.example.split(',')" :key="eIndex">{{examples}}</v-chip>
          </v-card>
          <div >
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
import JsonFactory from '@/view/api/api.js'
import column from './components/column'
export default {
  components: {
    column
  },
  data () {
    return {
      jsonAdded: {},
      categoryList: [],
      finisedStructure: [],
      dataToMapList: [],
      searchForCategoryList: [],
      searchValue: ''
    }
  },
  created () {
    this.getMapList()
  },
  beforeMount () {
    this.jsonAdded = JSON.parse(localStorage.getItem('addedJson'))
  },
  mounted () {
    // localStorage.removeItem('addedJson')
  },
  methods: {
    async getCategoryList () {
      JsonFactory.GetCategoryList().then(response => {
        // for (let i = 0; i < response.data.length; i++) {
        //   response.data[i].categoryExample = response.data[i].example.split(',')
        // }
        this.categoryList = response.data
        this.searchForCategoryList = response.data
        this.extractDataFromAddedJson()
      }).catch(error => {
        console.log(error)
      })
    },
    // Getting list to search for possible match for entered data
    getMapList () {
      JsonFactory.GetMapToObjectList().then(response => {
        this.dataToMapList = response.data
        this.getCategoryList()
      }).catch(error => {
        console.log('Error while getting map list', error)
      })
    },
    async extractDataFromAddedJson () {
      let data = Array.isArray(this.jsonAdded) ? this.jsonAdded[0] : this.jsonAdded
      // await this.loopThroughDataToDeStructureIt(data, this.finisedStructure)
      await this.autofilling(data)
      this.jsonAdded = data
      console.log('Data', data)
    },
    async autofilling (data) {
      Object.entries(data).forEach(async value => {
        let obj = await this.returnMapObject(value)
        await this.getCategoryMap(value[0], obj)
        if (obj.value === 'arrayOfObjects') {
          obj.children = [...value[1]]
          await this.autofilling(obj.children[0])
        }
        if (obj.value === 'object') {
          await this.autofilling(obj.children)
        }
        data[value[0]] = obj
      })
    },
    async returnMapObject (data) {
      switch (typeof data[1]) {
        case 'number':
          return {value: 'number', min: 0, max: 0, isUniqueId: false}
        case 'float':
          return {value: 'float', min: 0.0, max: 0.0}
        case 'boolean':
          return {value: 'boolean', min: 0, max: 0}
        case 'string':
          if (this.$store.getters.dateValidateRegex.test(data[1])) {
            return {value: 'date_time', mapTo: 'date_time', from: '', to: '', toModal: false, fromModal: false}
          } else {
            return {
              value: 'text',
              mapTo: '',
              extractFrom: '',
              prefix: '+91',
              toModal: false,
              fromModal: false,
              maxChars: 250
            }
          }
        case 'object':
          if (Array.isArray(data[1])) {
            if (typeof data[1][0] === 'object' && data[1][0] !== undefined) {
              console.log('inside array', data[1][0])
              return {value: 'arrayOfObjects', children: [...data[1][0]], len: 10}
            } else {
              return {value: 'array', children: '', mapTo: '', len: 10}
            }
          } else {
            return {value: 'object', children: data[1]}
          }
        default:
          return {value: 'default'}
      }
    },
    async getCategoryMap (data, parent) {
      data = data.toLowerCase()
      if (data.slice(-2) === 'id' && data !== 'emailid') {
        parent.extractFrom = ''
        parent.haveToGenerateData = true
        parent.mapTo = 'unique_id'
        return
      }
      let foundData = this.dataToMapList.find(val => {
        return data.includes(val.name)
      })
      if (foundData !== undefined) {
        parent.extractFrom = foundData.tableName
        parent.haveToGenerateData = !foundData.isTablePresent
        parent.mapTo = foundData.mapTo
      }
    },
    filterCategoriesAsPerSearch (input) {
      this.searchForCategoryList = this.categoryList.filter(val => {
        return this.checkName(val.categoryName.toLowerCase(), this.searchValue.toLowerCase()) || this.checkName(val.mapTo, this.searchValue.toLowerCase())
      })
    },
    checkName (name, str) {
      var pattern = str.split('').map((x) => {
        return `(?=.*${x})`
      }).join('')
      var regex = new RegExp(`${pattern}`, 'g')
      return name.match(regex)
    },
    getOutput () {
      JsonFactory.GenerateDataFromEnteredJson(this.jsonAdded).then(response => {
        localStorage.setItem('outputData', JSON.stringify(response.data))
        this.$router.push({name: 'OutputView'})
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
.table_row_header {
  height: 30;
  background: white;
  display: flex;
  border-radius: 10px 10px 0px 0px;
  position: relative;
  border: 1px solid rgb(206, 206, 206);
  padding: 10px;
}
.table_card {
  width: 75vw;
  height: 100%;
}
.table_rows {
  width: 100%;
  height: calc(100vh - 158px);
  background: white;
  border-radius: 0px 0px 10px 10px;
  overflow: scroll;
  white-space: nowrap;
}
@media only screen and (max-width: 1264px) {
  .table_card {
    width: 100%;
  }
  .c-container {
    display: block;
    width: 98vw !important;
    max-height: none !important;
  }
  .table_rows {
    height: 100%;
    overflow: scroll;
    white-space: nowrap;
    max-height: none !important;
  }
  .table_help {
    display: none;
  }
}
.table_help {
  width: 25vw;
  height: 100%;
  border-radius: 20px;
}
.category_cards {
  width: 100%;
  padding: 10px;
  border-radius: 0px !important;
  border-top: none;
}
.category_cards:hover{
  background: #fbfbfb;
}
.card_title{
  font-family: 'Montserrat-Regular';
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.table_card_title {
  font-family: 'Montserrat-Regular';
  font-size: 20px;
  font-weight: 500;
}
</style>
