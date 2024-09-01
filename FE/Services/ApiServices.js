import { useNavigate } from "react-router-dom";
import axios from "./axios.js";

export const ApiServices = () => {
  const navigate = useNavigate();

  const callPostApi = async (endPoint, data, authorization) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        referrerPolicy: "no-referrer",
        mode: "no-mode",
        "Access-Control-Allow-Origin": "*",
      };

      if (authorization) {
        const token = localStorage.getItem("x-token") || "";
        if (token) {
          headers.token = token;
        } else {
          return navigate("/login");
        }
      }

      const response = await axios.post(endPoint, data, { headers });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const callGetApi = async (endPoint, authorization) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        referrerPolicy: "no-referrer",
        mode: "no-mode",
        "Access-Control-Allow-Origin": "*",
      };

      if (authorization) {
        const token = localStorage.getItem("x-token") || "";
        if (token) {
          headers.token = token;
        } else {
          return navigate("/login");
        }
      }

      const response = await axios.get(endPoint, { headers });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const callDeleteApi = async (endPoint, authorization) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        referrerPolicy: "no-referrer",
        mode: "no-mode",
        "Access-Control-Allow-Origin": "*",
      };

      if (authorization) {
        const token = localStorage.getItem("x-token") ||"";
        if (token) {
          headers.token = token;
        } else {
          return navigate("/login");
        }
      }

      const response = await axios.delete(endPoint, { headers });
      return response;
    } catch (error) {
      throw error;
    }
  };
  return { callGetApi, callPostApi, callDeleteApi };
};
