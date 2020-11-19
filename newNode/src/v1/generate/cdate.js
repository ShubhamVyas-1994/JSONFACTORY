function CDate () {}

CDate.prototype.getDayDifference = function (from, to) {
  return Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24))
}

CDate.prototype.addDaysToDate = function (date, daysToAdd) {
  return new Date(new Date(date).setDate(new Date(date).getDate() + daysToAdd)).toUTCString()
}
CDate.prototype.subtractDaysToDate = function (date, daysToSubtract) {
  return new Date(new Date(date).setDate(new Date(date).getDate() - daysToSubtract)).toUTCString()
}
export default new CDate()