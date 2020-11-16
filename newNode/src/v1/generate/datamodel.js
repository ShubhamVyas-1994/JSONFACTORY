
import DataStore from '../../data/main'
class DataGenerator {
  constructor() {}

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
    let randomNumber = Math.random()
    if (max > 0 && min > 0) {
      return (randomNumber * (max - min) + min).toFixed(2)
    } else if (min > 0 && max === 0) {
      return (randomNumber * min + min).toFixed(2)
    } else if (max > 0 && min === 0) {
      return (randomNumber * max).toFixed(2)
    } else {
      return (randomNumber * 100).toFixed(2)
    }
  }
  date_time(from, to) {
    from = from.trim()
    to = to.trim()
    if (from !== '' && to !== '') {
      return new Date(this.getNumber(new Date(from).getTime(), new Date(to).getTime())).toUTCString()
    } else if (from !== '' && to === '') {
      return new Date(this.getNumber(new Date(from).getTime(), new Date().getTime())).toUTCString()
    } else if (from === '' && to !== '') {
      return new Date(this.getNumber(new Date(CDate.subtractDaysToDate(to, 200)).getTime(), new Date(to).getTime())).toUTCString()
    } else {
      return new Date(this.getNumber(new Date(CDate.subtractDaysToDate(new Date(), 100)).getTime(), new Date(CDate.addDaysToDate(new Date(), 100)).getTime())).toUTCString()
    }
  }
  get phone_number () {
    return this.number(6000000000, 9999999999).toString()
  }
  get bank_account_number () {
    return '00000' + this.number(45721371238181, 2412131231231231 * 100).toString()
  }
  get date_label () {
    return DataStore.dateEventList[this.number[0, this.dateType.length]].event
  }
  // Leave type
  get leave_type () {
    return DataStore.leaveType[this.number[0, DataStore.leaveType.length]]
  }
  // returns leave status i.e open, cancelled
  get leave_status () {
    return DataStore.leaveStatus[this.number[0, DataStore.leaveStatus.length]]
  }
  // returns lead status i.e Open, Unqualified
  get lead_status () {
    return DataStore.leadStatus[this.number[0, DataStore.leadStatus.length]]
  }
  // return industry labels
  get industry_type () {
    return DataStore.industryType[this.number[0, DataStore.industryType.length]]
  }
  // return phone labels
  get phone_type () {
    return DataStore.phoneType[this.number[0, DataStore.phoneType.length]]
  }
  // returns email labels
  get email_type () {
    return DataStore.emailType[this.number[0, DataStore.emailType.length]]
  }
  // returns true or false
  get boolean() {
    return Math.random() * 10 > 5
  }
  
}


export default new DataGenerator()