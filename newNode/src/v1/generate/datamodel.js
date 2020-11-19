
import DataStore from '../../data/main';
const uuidv4 = require("uuid/v4");
import CDate from './cdate'
var crypto = require('crypto');

class DataGenerator {
  constructor() { }

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
  get uniqueId() {
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
      return new Date(this.number(new Date(from).getTime(), new Date(to).getTime())).toUTCString()
    } else if (from !== '' && to === '') {
      return new Date(this.number(new Date(from).getTime(), new Date().getTime())).toUTCString()
    } else if (from === '' && to !== '') {
      return new Date(this.number(new Date(CDate.subtractDaysToDate(to, 200)).getTime(), new Date(to).getTime())).toUTCString()
    } else {
      return new Date(this.number(new Date(CDate.subtractDaysToDate(new Date(), 100)).getTime(), new Date(CDate.addDaysToDate(new Date(), 100)).getTime())).toUTCString()
    }
  }
  get phone_number() {
    return this.number(6000000000, 9999999999).toString()
  }
  get bank_account_number() {
    return '00000' + this.number(45721371238181, 2412131231231231 * 100).toString()
  }
  get event() {
    return DataStore.dateEventList[this.number(0, this.dateType.length)].event
  }
  // Leave type
  get leave_type() {
    return DataStore.leaveType[this.number(0, DataStore.leaveType.length)]
  }
  get gender() {
    return (Math.random() * 10) > 5 ? 'Male' : 'Female'
  }

  // returns leave status i.e open, cancelled
  get leave_status() {
    return DataStore.leaveStatus[this.number(0, DataStore.leaveStatus.length)]
  }
  // returns lead status i.e Open, Unqualified
  get lead_status() {
    return DataStore.leadStatus[this.number(0, DataStore.leadStatus.length)]
  }
  // return industry labels
  get industry_type() {
    return DataStore.industryType[this.number(0, DataStore.industryType.length)]
  }
  // return phone labels
  get phone_type() {
    return DataStore.phoneType[this.number(0, DataStore.phoneType.length)]
  }
  // returns email labels
  get email_type() {
    return DataStore.emailType[this.number(0, DataStore.emailType.length)]
  }
  // returns true or false
  get boolean() {
    return Math.random() * 10 > 5
  }
  get blood_group() {
    return DataStore.bloodGroupList[this.number(0, DataStore.bloodGroupList.length)]
  }
  get first_name() {
    return DataStore.userList[this.number(0, DataStore.userList.length)].first_name
  }
  get user_name() {
    return DataStore.userList[this.number(0, DataStore.userList.length)].user_name
  }
  get last_name() {
    return DataStore.userList[this.number(0, DataStore.userList.length)].last_name
  }
  get middle_name() {
    return DataStore.userList[this.number(0, DataStore.userList.length)].middle_name
  }
  get full_name() {
    return DataStore.userList[this.number(0, DataStore.userList.length)].full_name
  }
  get address() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].full_address
  }
  get address_line1() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].address_line1
  }
  get address_line2() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].address_line2
  }
  get city() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].city
  }
  get state() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].state
  }
  get country() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].country
  }
  get zipcode() {
    return DataStore.addressList[this.number(0, DataStore.addressList.length)].zipcode
  }
  get unique_code() {
    return crypto.randomBytes(10).toString('hex')
  }
  get uuid() {
    return uuidv4();
  }
  get image() {
    return DataStore.imageList[this.number(0, DataStore.imageList.length)].download_url
  }
  get notes () {
    return DataStore.notes.substr(0, this.number(0, 500))
  }
  get element_name() {
    return DataStore.materialList[0, this.number(0, DataStore.materialList.length)].element
  }
  get element_symbol() {
    return DataStore.materialList[0, this.number(0, DataStore.materialList.length)].symbol
  }
  get alloy_name() {
    return DataStore.alloyList[0, this.number(0, DataStore.alloyList.length)].alloyName
  }
  get newspaper() {
    return DataStore.newspaperList[0, this.number(0, DataStore.newspaperList.length)]
  }
  get payment_method() {
    return DataStore.paymentMethod[0, DataStore.paymentMethod.length]
  }
  get payment_status() {
    return DataStore.paymentStatus[0, DataStore.paymentStatus.length]
  }
  get company_department() {
    return DataStore.companyDepartmentList[0, this.number(0, DataStore.companyDepartmentList.length)]
  }
}


export default new DataGenerator()