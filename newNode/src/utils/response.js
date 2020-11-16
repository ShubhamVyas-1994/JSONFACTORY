
export default responseWithError = (error, response) => {
  response.send({status: 201, message: error.toString()})
}

export default respondWithData = (data, message, response) => {
  response.send({status: 200, message: message, data: data})
}