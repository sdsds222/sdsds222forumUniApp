"use strict";
function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const decodedPayload = JSON.parse(atob(parts[1]));
      return decodedPayload;
    } else {
      throw new Error("Invalid JWT Token");
    }
  } catch (error) {
    console.error("JWT Parsing Error:", error);
    return null;
  }
}
exports.parseJwt = parseJwt;
