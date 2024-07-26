import axios from "./axios.js";

export const ApiServices = () => {
  const callPostApi = async (endPoint, data) => {
    try {
      const response = await axios.post(endPoint, data, {
        headers: {
          "Content-Type": "application/json",
          referrerPolicy: "no-referrer",
          mode: "no-mode",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const callGetApi = async (endPoint, data) => {
    try {
      const response = await axios.get(endPoint, {
        headers: {
          "Content-Type": "application/json",
          referrerPolicy: "no-referrer",
          mode: "no-mode",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  return { callGetApi, callPostApi };
};
