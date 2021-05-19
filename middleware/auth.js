import jwt from "jsonwebtoken";

// Authentication middleware to be used in routes
const auth = async (req, res, next) => {
  try {
    const token = req.headers.Authorization.split(" ")[1];

    // Token from custom auth implementation will be less than 500 characters
    // Google OAuth token will be more than 500 characters
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      // TODO: Create better secret string
      decodedData = jwt.verify(token, "test");

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.error(error);
  }
};

export default auth;
