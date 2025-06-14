import jwt from "jsonwebtoken";

// This function generates a JWT token and sets it as an HTTP-only cookie in the response
export const generateToken = (userId, res) => {
  // Create the JWT token by signing the payload (userId) with the secret key and setting expiry to 7 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token validity: 7 days
  });

  // Store the token in a cookie with security options
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (in milliseconds)
    httpOnly: true, // Prevents JavaScript from accessing the cookie (protects against XSS attacks)
    sameSite: "strict", // Prevents CSRF (Cross-Site Request Forgery) attacks by only allowing requests from the same site
    secure: process.env.NODE_ENV !== "development", // Allows cookie only on HTTPS in production
  });

  return token; // Optionally returning the token if you want to use it elsewhere
};
