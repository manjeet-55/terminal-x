import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiServices } from "../../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { showToast } from "../../../store/slices/toastSlice";

export const useWorkSpace = () => {
  const { callGetApi, callPostApi, callDeleteApi } = ApiServices();
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const { data: workSpacesData } = useQuery({
    queryKey: ["getWorkSpaces"],
    queryFn: () => callGetApi("/api/workspaces", true),
  });

  const handleCreateWorkspace = useMutation({
    mutationKey: ["handleCreateWorkspace"],
    mutationFn: async (data) => callPostApi("/api/workspace", data, true),
    onSuccess: (data) => {
      dispatch(
        showToast({
          message: "Workspace created!",
          open: true,
          variant: "success",
        })
      );
      queryClient.invalidateQueries(["getWorkSpaces"]);
    },
    onError: (error) => {
      dispatch(
        showToast({
          message: error.response.data.message || "Error! please try again",
          open: true,
          variant: "error",
        })
      );
      console.log("error at creating workspace", error);
    },
  });

  const handleAddCommand = useMutation({
    mutationKey: ["handleAddCommand"],
    mutationFn: async (data) =>
      callPostApi("/api/workspace/command", data, true),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getWorkSpaces"]);
    },
    onError: (error) => {
      console.log("error at adding command", error);
    },
  });

  const handleDeleteWorkspace = useMutation({
    mutationKey: ["handleDeleteWorkspace"],
    mutationFn: async (workspaceId) =>
      callDeleteApi(`/api/workspaces/${workspaceId}`),
    onSuccess: (data) => {
      dispatch(
        showToast({
          message: "Workspace deleted!",
          open: true,
          variant: "success",
        })
      );
      queryClient.invalidateQueries(["getWorkSpaces"]);
    },
    onError: (error) => {
      dispatch(
        showToast({
          message: error.response.data.message || "Error! please try again",
          open: true,
          variant: "error",
        })
      );
      console.log("error at deleting workspace", error);
    },
  });

  return {
    workSpacesData,
    handleCreateWorkspace,
    handleAddCommand,
    handleDeleteWorkspace,
  };
};
