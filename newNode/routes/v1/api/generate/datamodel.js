
class DataGenerator {
  constructor() {
    this.linkType = []
    this.dateType = []
    this.emailType = []
    this.phoneType = []
    this.leadStatus = []
    this.leaveStatus = []
    this.categoryList = []
  }

  number(min, max) {
    let randomNumber = Math.random()
    if (max > 0 && min > 0) {
      return Math.floor(randomNumber * (max - min) + min)
    } else if (min > 0 && max === 0) {
      return Math.floor(randomNumber * min + min)
    } else if (max > 0 && min === 0) {
      return Math.floor(randomNumber * max)
    } else {
      return Math.floor(randomNumber * 100)
    }
  }
  get uniqueId () {
    return Math.round(new Date().getTime() / 100000)
  }
  float(min, max) {
    return 10.11
  }
  date_time(from, to) {
    return new Date().toISOString()
  }
  get phone_number () {
    return this.number(6000000000, 9999999999).toString()
  }
  get bank_account_number () {
    return '00000' + this.number(45721371238181, 2412131231231231 * 100).toString()
  }
  get date_type () {
    return this.dateType[this.number[0, this.dateType.length]]
  }
  get boolean() {
    return Math.random() * 10 > 5
  }
  
}


export default new DataGenerator()