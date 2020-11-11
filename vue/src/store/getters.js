
const getters = {
  // companyLogo: state => state.system.companyLogo
  categoryList: state => state.system.categoryList,
  jsonValue: state => state.body.jsonValue,
  resolutionOfScreenInCurrentState: state => state.system.resolutionOfScreenInCurrentState,
  uniqueNameForTextField: () => new Date().getTime(),
  gridView: state => state.body.gridView,
  dateValidateRegex: () => /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
}
export default getters
