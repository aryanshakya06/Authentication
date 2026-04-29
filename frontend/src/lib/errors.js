import { toast } from "react-toastify";

export const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again.";

export const showError = (err) => {
    const msg = getErrorMessage(err);
    toast.error(msg);
    return msg;
};
