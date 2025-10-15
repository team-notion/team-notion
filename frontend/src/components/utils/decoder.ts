// export const decodeJWT = (token: string) => {
//   if (!token) throw new Error('No token provided');
  
//   try {
//     const parts = token.split("|");
//     if (parts.length < 2) {
//         throw new Error("Token format is invalid: expected at least two parts separated by '|'.");
//     }
//     const base64Url = parts[1];
//     const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );

//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return null;
//   }
// };










export const decodeJWT = (token: string) => {
  if (!token) throw new Error('No token provided');
  
  // Check if it's a Sanctum token (contains | character)
  if (token.includes('|')) {
    console.warn('This is a Laravel Sanctum token, not a JWT. Cannot decode.');
    return null;
  }
  
  try {
    const parts = token.split(".");
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};