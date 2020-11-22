import {responseWithError, respondWithData} from '../../utils/response';
import pool from '../../db/db';
import {generateAuthToken} from '../../utils/common';
import {sendEmail} from '../../utils/email';
import CDate from '../generate/cdate';

export async function resendEmail(requset, response) {
  console.log('Its working')
  respondWithData(null,'Data',response)
}