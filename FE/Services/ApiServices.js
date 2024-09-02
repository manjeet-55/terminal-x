import { useNavigate } from "react-router-dom";
import axios from "./axios.js";

export const ApiServices = () => {
  const navigate = useNavigate();

  const getHeaders = async () => {
    const contentTypeValue = "application/json";

    const token = localStorage.getItem("user-token") || "";

    console.log("token at FE",token)
    return {
      "Content-Type": contentTypeValue,
      referrerPolicy: "no-referrer",
      mode: "no-mode",
      "Access-Control-Allow-Origin": "*",
      Authorization: token ? `Bearer ${token}` : undefined,
    };
  };

  const handleUnauthorized = async (error) => {
    if (error?.response && error.response?.status === 401) {
      alert("Your session has expired or the token is invalid.");
      localStorage.clear();
      navigate("/login");
    } else {
      throw error;
    }
  };

  const callApi = async (method, endPoint, data = null) => {
    try {
      const headers = await getHeaders();
      const config = { headers };
      const response =
        method === "get" || method === "delete"
          ? await axios[method](endPoint, config)
          : await axios[method](endPoint, data, config);
      return response;
    } catch (error) {
      await handleUnauthorized(error);
      throw error;
    }
  };

  const callGetApi = async (endPoint) => callApi("get", endPoint);
  const callPostApi = async (endPoint, data) => callApi("post", endPoint, data);
  const callPutApi = async (endPoint, data) => callApi("put", endPoint, data);
  const callDeleteApi = async (endPoint, id) =>
    callApi("delete", `${endPoint}${id}`);
  const callPatchApi = async (endPoint, data) =>
    callApi("patch", endPoint, data);

  return { callGetApi, callPostApi, callPutApi, callDeleteApi, callPatchApi };
};
