
export function responseWithError (error, response) {
  response.send({status: 201, message: error.toString()});
};

export function respondWithData (data, message, response) {
  response.send({status: 200, message: message, data: data});
}