import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiServices } from "../../../Services/ApiServices";

export const useWorkSpace = () => {
  const { callGetApi, callPostApi, callDeleteApi } = ApiServices();
  const queryClient = useQueryClient();

  const { data: workSpacesData } = useQuery({
    queryKey: ["getWorkSpaces"],
    queryFn: () => callGetApi("/api/workspaces", true),
  });

  const handleCreateWorkspace = useMutation({
    mutationKey: ["handleCreateWorkspace"],
    mutationFn: async (data) => callPostApi("/api/workspace", data, true),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getWorkSpaces"]);
    },
    onError: (error) => {
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
      callDeleteApi(`/api/workspaces/${workspaceId}`, true),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getWorkSpaces"]);
    },
    onError: (error) => {
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
