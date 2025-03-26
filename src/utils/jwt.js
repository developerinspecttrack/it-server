import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "private.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.join(process.cwd(), "public.key"),
  "utf8"
);

export const generateToken = (userId, email, days) => {
  return jwt.sign({ id: userId, email }, privateKey, {
    algorithm: "RS256",
    expiresIn: `${days}d`,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  } catch (error) {
    return null;
  }
};
