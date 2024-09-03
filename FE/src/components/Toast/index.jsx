import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../../store/slices/toastSlice";
import { Snackbar, Alert, Typography } from "@mui/material";
import {
  IoCheckmarkCircle,
  IoAlertCircle,
  IoInformationCircle,
} from "react-icons/io5";

const DEFAULT_DURATION = 5000;

const CustomToast = ({ duration = DEFAULT_DURATION }) => {
  const { title, message, variant, open } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    dispatch(hideToast());
  };

  const getAlertStyle = (variant) => {
    switch (variant) {
      case "success":
        return { backgroundColor: "rgb(56, 161, 105)", color: "white" };
      case "error":
        return { backgroundColor: "rgb(244, 67, 54)", color: "white" };
      case "info":
        return { backgroundColor: "rgb(66, 165, 245)", color: "white" };
      default:
        return { backgroundColor: "rgb(66, 165, 245)", color: "white" };
    }
  };

  const getIcon = (variant) => {
    switch (variant) {
      case "success":
        return <IoCheckmarkCircle style={{ color: "white", marginRight: 8 }} />;
      case "error":
        return <IoAlertCircle style={{ color: "white" }} />;
      case "info":
        return (
          <IoInformationCircle style={{ color: "white", marginRight: 8 }} />
        );
      default:
        return null;
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={duration}
      onClose={handleSnackbarClose}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={variant}
        icon={getIcon(variant)}
        style={{
          ...getAlertStyle(variant),
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography>{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default CustomToast;
