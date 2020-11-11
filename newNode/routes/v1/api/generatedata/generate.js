import CDate from './cdate'
var crypto = require('crypto');

function GenerateData () {}

GenerateData.prototype.getNumber = function (min, max) {
  // generating a random number
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

GenerateData.prototype.getFloat = function (min, max) {
  // generating a random number
  let randomNumber = Math.random()
  if (max > 0 && min > 0) {
    return randomNumber * (max - min) + min
  } else if (min > 0 && max === 0) {
    return randomNumber * min + min
  } else if (max > 0 && min === 0) {
    return randomNumber * max
  } else {
    return randomNumber * 100
  }
}

GenerateData.prototype.getDate = function (from, to) {
  from = from.trim()
  to = to.trim()
  
  if (from !== '' && to !== '') {
    return new Date(this.getNumber(new Date(from).getTime(), new Date(to).getTime())).toUTCString()
  } else if (from !== '' && to === '') {
    return new Date(this.getNumber(new Date(from).getTime(), new Date().getTime())).toUTCString()
  } else if (from === '' && to !== '') {
    return new Date(this.getNumber(new Date(CDate.subtractDaysToDate(to, 200)).getTime(), new Date(to).getTime())).toUTCString()
  } else {
    console.log(new Date(CDate.subtractDaysToDate(new Date(), 100)).getTime())
    console.log(new Date(CDate.addDaysToDate(new Date(), 100)).getTime())
    return new Date(this.getNumber(new Date(CDate.subtractDaysToDate(new Date(), 100)).getTime(), new Date(CDate.addDaysToDate(new Date(), 100)).getTime()))
  }
}
GenerateData.prototype.addRandomTimeInDate = function (from, to) {
  let fromTime = 0
  let toTime = 0
  return new Date(this.getNumber(new Date(from).getTime(), new Date(to).getTime())).toUTCString()
  // return new Date(new Date(new Date(this.getDate(from, to)).setHours(this.getNumber(0, 23))).setMinutes(this.getNumber(0, 719)))
}
GenerateData.prototype.getBoolean = function () {
  return this.getNumber(0, 10) > 3
}

GenerateData.prototype.getEmail = function (firstname, lastname) {
  return `${firstname}${lastname}${this.getNumber(1, 1000)}@gmail.com`
}

GenerateData.prototype.phoneNumber = function () {
  return this.getNumber(6000000000, 9999999999).toString()
}

GenerateData.prototype.bankAccountNumber = function () {
  return this.getNumber(45721371238181, 2412131231231231 * 100)
}

GenerateData.prototype.uniqueId = function () {
  return Math.round(new Date().getTime() / 100000)
}

GenerateData.prototype.uniqueCode = function () {
  return crypto.randomBytes(10).toString('hex')
}
export default new GenerateData()