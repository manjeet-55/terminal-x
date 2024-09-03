import { ApiServices } from "../../../Services/ApiServices";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  const { callPostApi } = ApiServices();

  const navigate = useNavigate();
  const handleSignUp = useMutation({
    mutationKey: ["signupUser"],
    mutationFn: async (data) => callPostApi("/api/auth/register", data),
    onSuccess: (data) => {
      navigate("/login");
    },
    onError: (error) => {
      console.log("error at signup", error);
    },
  });
  return {
    handleSignUp,
  };
};

export default useSignUp;
