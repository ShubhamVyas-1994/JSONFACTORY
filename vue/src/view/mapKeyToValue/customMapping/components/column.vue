<template>
  <div>
    <div v-for="(value, key, index) in objectToIterate" :key="index" class="table_row">
        <v-card class="column_card" outlined>
          <div class="column_key">
            <p class="subtitle">{{value.value === 'text' ? 'Text' : value.value === 'number' ? 'Number' : value.value === 'float' ? 'Float' : value.value === 'object' ? '{}' : value.value === 'array' ? '[...]' : value.value === 'arrayOfObjects' ? '[{...}]' : value.value === 'boolean' ? 'Boolean' : 'Date Time'}}</p>
            <p>{{key}}</p>
            <v-icon class="column_key_icon" v-if="value.value === 'arrayOfObjects' || value.value === 'object'">mdi mdi-arrow-down-bold-outline</v-icon>
          </div>
          <div class="column_map_to">
            <v-autocomplete
            v-if="value.value === 'text' || value.value === 'date_time' || value.value === 'array'"
              v-model="value.mapTo"
              label="Map"
              :items="categoryList"
              dense
              outlined
              item-text="categoryName"
              @input="checkForMapping(value)"
              autocomplete="new-password"
              :rules="[v => !!v || '']"
              :name="$store.getters.uniqueNameForTextField"
              item-value="mapTo">
            </v-autocomplete>
            <v-checkbox class="ma-0" v-if="value.value === 'number'" label="Unique Id" v-model="value.isUniqueId"></v-checkbox>
            <div v-if="value.value === 'boolean'">
              <p>True/ False</p>
            </div>
            <v-text-field type="number" label="Length" v-model.number="value.len" v-if="value.value === 'arrayOfObjects'" @blur="value.len = value.len > 10 ? 10 : value.len" outlined dense></v-text-field>
          </div>
          <div class="column_additional_info">
            <v-text-field class="addition_info_text_field" label="Code" v-model="value.prefix" outlined dense v-if="value.mapTo === 'phone_number' && value.value === 'text'"></v-text-field>
            <v-text-field
              label="Min"
              type="number"
              dense
              class="addition_info_text_field"
              outlined
              v-if="(value.value === 'number' || value.value === 'float') && value.isUniqueId === false"
              v-model.number="value.min"
              @blur="checkForMinMaxValidation(value)"
            ></v-text-field>
            <v-text-field
              label="Max"
              type="number"
              dense
              outlined
              class="addition_info_text_field"
              v-if="(value.value === 'number' || value.value === 'float') && value.isUniqueId === false"
              v-model.number="value.max"
              @blur="checkForMinMaxValidation(value)"
            ></v-text-field>
            <v-menu
              v-model="value.fromModal"
              transition="scale-transition"
              offset-y
              :close-on-content-click="false"
              v-if="value.value === 'date_time'"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="value.from"
                  label="From"
                  class="addition_info_text_field"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
                <datetimepicker @closeMenu="() => value.fromModal = false" v-model="value.from" :maxDate="value.to"/>
            </v-menu>
            <v-menu
              v-model="value.toModal"
              transition="scale-transition"
              offset-y
              :close-on-content-click="false"
              v-if="value.value === 'date_time'"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="value.to"
                  label="To"
                  readonly
                  outlined
                  dense
                  class="addition_info_text_field"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
                <datetimepicker @closeMenu="value.toModal = false" v-model="value.to" :minDate="value.from" />
            </v-menu>
          </div>
          <v-btn x-small fab v-if="value.value === 'text'" class="edit_dataToMap__icon" depressed color="white" @click="customizeDataObject = value;customizeData = true">
              <v-icon
                small>mdi mdi-pencil</v-icon>
            </v-btn>
        </v-card>
      <div style="display:block;width:100%" v-if="value.value === 'array' || value.value === 'object' || value.value === 'arrayOfObjects'">
        <row-iterator :categoryList="categoryList" :objectToIterate="value.value === 'object' ? value.children : value.children[0]" v-if="value.value !== 'array'" />
      </div>
    </div>
    <v-dialog v-model="customizeData" width="600">
      <customeDataSelection @closeCustomEditDialog="customizeData = false" :dataToCustomize="customizeDataObject" v-if="customizeData"/>
    </v-dialog>
  </div>
</template>
<script>
import datetimepicker from '@/components/datetimepicker/datetimepicker.vue'
import customeDataSelection from './customData'
export default {
  components: {
    datetimepicker,
    customeDataSelection
  },
  name: 'row-iterator',
  props: ['objectToIterate', 'categoryList'],
  data () {
    return {
      customizeData: false,
      customizeDataObject: {}
    }
  },
  methods: {
    checkForMinMaxValidation (dataToMap) {
      if (dataToMap.min > dataToMap.max && dataToMap.max !== 0) {
        dataToMap.max = dataToMap.min + 1
      }
    },
    async checkForMapping (value) {
      if (value.mapTo === 'date_time') {
        value.value = 'date_time'
        value.from = ''
        value.to = ''
        value.fromModal = false
        value.toModal = false
      } else {
        let obj = await this.returnTableNameFromCategoryList(value.mapTo)
        value.extractFrom = obj[0]
      }
    },
    async returnTableNameFromCategoryList (mapTo) {
      let x = this.categoryList.find(val => {
        return val.mapTo === mapTo
      })
      return x !== undefined ? [x.valueFromTable, !x.isTablePresent] : ['', false]
    }
  }
}
</script>
<style scoped>
.table_row {
  width: 100%;
}
.column_card {
  display: inline-flex;
  width: 100% !important;
  border-top: none !important;
  border-radius: 0px !important;
}
.column_card:hover{
  background: #fbfbfb;
}
.column_type {
  width: 7em;
  padding: 10px;
  background: #f1f6f9;
  font-family: 'Raleway-Regular';
  color: black;
}
.column_key {
  width: 20em;
  display: block;
  padding: 10px;
  align-items: center;
  font-family: 'Montserrat-Regular';
  font-weight: bold;
  background: #fbfbfb;
  position: relative;
}
.column_additional_info{
  width: 50em;
  padding: 0px 10px;
  display: inline-flex;
  align-items: center;
}
.subtitle {
  font-size: x-small;
}
.column_map_to {
  width: 20em;
  align-items: center;
  display: flex;
  padding: 0px 10px;
  font-family: 'Raleway-Regular';
  font-size: 15px;
}
input {
  font-size: 15px;
}
.addition_info_text_field {
  width: 25% !important;
  max-width: 150px;
  padding: 0px 5px;
}
.column_key_icon {
  position: absolute;
  right: 10px;
  top: 18px;
}
.edit_dataToMap__icon {
  position: absolute;
  right: 10px;
  top: 14px;
}
</style>
