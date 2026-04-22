export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME;
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;
export const CURRENCY = "PKR";
export const DELIVERY_FEE = 200;
export const PHONE_REGEX = /^03[0-9]{9}$/;
export const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
];
export const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery" },
  { id: "jazzcash", label: "JazzCash" },
  { id: "easypaisa", label: "Easypaisa" },
];
