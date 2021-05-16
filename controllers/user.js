// Absolute imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Relative imports
import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query user from database by email
    const existingUser = await User.findOne({ email });

    // Check if user does not already exist
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    // Check if password is correct
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create session token
    // TODO: Move secret string to .env
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, could not sign in :(" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    // Check if user already exists
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Check if passwords match
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // Encrypt provided password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    // Create session token
    // TODO: Move secret string to .env
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, could not sign up :(" });
  }
};
