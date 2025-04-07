import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { MIN_PASSWORD_LENGTH } from "../constants";
import { User as UserType } from "../types";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({ message: "Your password is too short" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, confirmationPassword, name } = req.body;

    // Check if a different user with same email already exist
    const existingUser = await User.findOne({ email });
    const userId = req.user?.userId;
    if (existingUser && userId !== existingUser.id) {
      res
        .status(400)
        .json({ message: "Another user with this email already exists" });
      return;
    }

    if (password) {
      if (password !== confirmationPassword) {
        res.status(400).json({ message: "Passwords don't match" });
        return;
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        res.status(400).json({ message: "Your password is too short" });
        return;
      }
    }

    let updatingFields: Pick<UserType, "email" | "name"> & {
      password?: string;
    } = {
      email,
      name,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);

      updatingFields = {
        ...updatingFields,
        password: hashedPassword,
      };
    }

    await User.updateOne(
      {
        _id: userId,
      },
      updatingFields
    );

    // Generate token
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Your info updated successfully",
      token,
      user: {
        id: userId,
        email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
