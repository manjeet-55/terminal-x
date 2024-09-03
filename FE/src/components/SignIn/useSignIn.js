import { ApiServices } from "../../../Services/ApiServices";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../../store/slices/toastSlice";
const useSignIn = () => {
  const { callPostApi } = ApiServices();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user-token")) navigate("/");
  }, []);
  const handleSignIn = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (data) => callPostApi("/api/auth/login", data),
    onSuccess: (response) => {
      localStorage.setItem("user-token", response.data.data.token);
      localStorage.setItem("user-email", response.data.data.email);
      dispatch(
        showToast({
          message: "Login successful",
          open: true,
          variant: "success",
        })
      );
      navigate("/");
    },
    onError: (error) => {
      dispatch(
        showToast({
          message: error.response.data.message || "Error! please try again",
          open: true,
          variant: "error",
        })
      );
      console.log("error at login", error);
    },
  });
  return {
    handleSignIn,
  };
};

export default useSignIn;
