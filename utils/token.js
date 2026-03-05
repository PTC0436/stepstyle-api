import jwt from "jsonwebtoken";

/*
ACCESS TOKEN
dùng cho request API
thời gian ngắn
*/
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

/*
REFRESH TOKEN
dùng để xin access token mới
thời gian dài
*/
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

/*
VERIFY TOKEN
*/
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
