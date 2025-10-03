const baseUrl = import.meta.env.VITE_PUBLIC_BASEURL;
const publicKey = import.meta.env.VITE_PUBLIC_PUBLIC_KEY;
const flutUrl = import.meta.env.VITE_PUBLIC_FLUT_URL;
const secretKey = import.meta.env.VITE_PUBLIC_SECRET_KEY;
const encryptKey = import.meta.env.VITE_PUBLIC_ENCRYPT_KEY;
const enquiry = import.meta.env.VITE_PUBLIC_ENQUIRY_KEY;

const CONFIG = {
  BASE_URL: `${baseUrl}`,
  PUBLIC_KEY: `${publicKey}`,
  SECRET_KEY: `${secretKey}`,
  FLUT_URL: `${flutUrl}`,
  ENCRYPTKEY: `${encryptKey}`,
  ENQUIRY: `${enquiry}`,
};

export default CONFIG;