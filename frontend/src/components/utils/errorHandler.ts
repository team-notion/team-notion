import { AxiosError } from "axios";

export const errorHandler = (error: AxiosError | any) => {
  if (!error) {
    return "An error occured. Please try again!";
  }

  if (typeof error === "string") {
    return error;
  }
  if (error.message.toLowerCase().includes("network error")) {
    return "You are not connected to the internet. Please check your internet connection and try again.";
  }
  if (error.response) {
    return (
      error.response.data.message ||
      error.response.statusText ||
      error.response.data.Message
    );
  }
  else if (error.request) {
    return error.request;
  }
  else {
    return (
      error.response
    );
    // return "Something went wrong. Please check your internet connection and try again.";
  }
};