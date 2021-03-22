import jwt from "jsonwebtoken";
import { Response } from "express";

// Private Key for RSA encryption
const privateKey = ``;

// Public Key for RSA encryption
export const publicKey = ``;

const options = {
  issuer: "Roor Corporation",
  subject: "auth-token",
  audience: "http://roor.com",
  expiresIn: "7d",
};

export const createJwtToken = (payload: any) => {
  // Creating the token
  const token = jwt.sign(payload, privateKey, {
    ...options,
    algorithm: "RS256",
  });

  return token;

};

export const setJwtToken = (res: Response, payload: any) => {
  const token = createJwtToken(payload);
  res.cookie("auth", token, { httpOnly: true, sameSite: "lax" });
};

// Validate and get the data from jwt
export function getPayload(authtoken: string) {
  const valid = jwt.verify(authtoken, publicKey);
  if (!valid) return { success: false, payload: null };
  return { success: true, payload: valid };
}

// Verifying the token
//const verified = jwt.verify(token, publicKey, {
//...options,
//algorithms: ["RS256"],
//});

//console.log("Verified", JSON.stringify(verified));

//const decoded = jwt.decode(token, { complete: true });

//if (decoded !== null)
//console.log(`
//Headers : ${JSON.stringify(decoded.header)}
//------------------------------------------
//Payload : ${JSON.stringify(decoded.payload)}

//`);
