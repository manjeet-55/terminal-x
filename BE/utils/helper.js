import { StatusCodes } from 'http-status-codes';

const responseGenerators = (responseData, responseStatusCode, responseStatusMsg, responseStatus) => {
    return {
      data: responseData,
      code: responseStatusCode,
      message: responseStatusMsg,
      status: responseStatus,
    };
  };
  
  export default responseGenerators;
  