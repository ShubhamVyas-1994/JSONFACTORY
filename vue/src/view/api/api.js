import axios from 'axios'

function JsonFactory () {
  this.api = axios.create()
  console.log(process.env)
  this.api.defaults.baseURL = process.env.BASE_URL
  this.api.defaults.timeout = 10000
  this.postDataUsingFormData = function (url, body) {
    return this.api.post(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  this.fetchData = function (url) {
    return this.api.get(url)
  }
}

JsonFactory.prototype.GenerateDataFromEnteredJson = async function (body) {
  // url goes here
  let url = '/generate/data'
  // form data
  let formData = new FormData()
  formData.append('dataMapStructure', JSON.stringify(body))
  console.log('body', body)
  // calling api
  try {
    let response = await this.postDataUsingFormData(url, formData)
    if (response.data.status === 200) {
      return response.data
    } else {
      throw response.data
    }
  } catch (error) {
    // throwing error
    throw error
  }
}

JsonFactory.prototype.GetCategoryList = async function () {
  // url goes here
  let url = '/admin/category/list'
  // calling api
  try {
    let response = await this.fetchData(url)
    if (response.data.status === 200) {
      return response.data
    } else {
      throw response.data
    }
  } catch (error) {
    // throwing error
    throw error
  }
}
JsonFactory.prototype.GetMapToObjectList = async function () {
  // url goes here
  let url = '/admin/map/list'
  // calling api
  try {
    let response = await this.fetchData(url)
    if (response.data.status === 200) {
      return response.data
    } else {
      throw response.data
    }
  } catch (error) {
    // throwing error
    throw error
  }
}
export default new JsonFactory()
