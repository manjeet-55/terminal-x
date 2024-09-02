import { ApiServices } from "../../../Services/ApiServices";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useSignIn = () => {
  const { callPostApi } = ApiServices();

  const navigate = useNavigate();
  const handleSignIn = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (data) => callPostApi("/api/auth/login", data),
    onSuccess: (response) => {
      localStorage.setItem("user-token", response.data.data.token);
      localStorage.setItem("user-email", response.data.data.email);
      navigate("/");
    },
    onError: (error) => {
      console.log("error at login", error);
    },
  });
  return {
    handleSignIn,
  };
};

export default useSignIn;
