const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import mongoose from "mongoose";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import serverCatchError from "@/libs/server-catch-error";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;
    const provider = body.provider;

    const user = await UserModel.findOne({ email });

    const payload = {
      id: user._id,
      name: user.fullname,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    if (!user) return res.json({ message: "User not found" }, { status: 404 });

    if (provider === "google") return res.json(payload);

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin)
      return res.json({ message: "incorrect password" }, { status: 401 });

    return res.json(payload);
  } catch (err) {
    serverCatchError(err);
  }
};
