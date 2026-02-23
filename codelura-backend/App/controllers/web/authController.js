import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";

/**
 * ===============================
 * SIGNUP + EMAIL VERIFICATION
 * ===============================
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔒 Admin creation protection
    let finalRole = "user";
    if (role === "admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Invalid admin secret" });
      }
      finalRole = "admin";
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 🔐 Email verify token
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      emailVerifyToken,
      isEmailVerified: false
    });

     res.status(201).json({
      message: "Signup successful. Please verify your email.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
    // 📧 EMAIL BACKGROUND ME BHEJO
    try {
 const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${emailVerifyToken}`;

await sendEmail({
  to: user.email,
  subject: "Verify your email - Codelura",
  html: `
  <div style="
    max-width:600px;
    margin:40px auto;
    padding:32px;
    background:#ffffff;
    border-radius:12px;
    font-family:Arial,Helvetica,sans-serif;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
  ">
    
    <h1 style="
      text-align:center;
      font-size:28px;
      margin-bottom:10px;
      color:#111827;
    ">
      Codelura<span style="color:#6366f1;">.</span>
    </h1>

    <p style="
      text-align:center;
      font-size:15px;
      color:#6b7280;
      margin-bottom:30px;
    ">
      Build • Learn • Ship faster
    </p>

    <h2 style="
      font-size:20px;
      color:#111827;
      margin-bottom:12px;
    ">
      Welcome to Codelura 👋
    </h2>

    <p style="
      font-size:15px;
      color:#374151;
      line-height:1.6;
      margin-bottom:24px;
    ">
      Thanks for creating an account. Please confirm your email address by clicking the button below.
    </p>

    <div style="text-align:center; margin:32px 0;">
      <a href="${verifyUrl}" 
        style="
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#ffffff;
          text-decoration:none;
          padding:14px 28px;
          font-size:16px;
          font-weight:600;
          border-radius:8px;
          display:inline-block;
        ">
        Verify Email
      </a>
    </div>

    <p style="
      font-size:14px;
      color:#6b7280;
      line-height:1.6;
      margin-top:24px;
    ">
      If you didn’t create a Codelura account, you can safely ignore this email.
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

    <p style="
      font-size:13px;
      color:#9ca3af;
      text-align:center;
    ">
      © ${new Date().getFullYear()} Codelura. All rights reserved.
    </p>
  </div>
  `
});

    } catch (emailError) {
      console.error("EMAIL ERROR 👉", emailError.message);
    }

  } catch (error) {
    console.error("SIGNUP ERROR 👉", error);
    return res.status(500).json({
      message: "Signup failed"
    });
  }
};

/**
 * ===============================
 * VERIFY EMAIL
 * ===============================
 */
export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    emailVerifyToken: req.params.token
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

/**
 * ===============================
 * RESEND VERIFICATION EMAIL
 * ===============================
 */
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isEmailVerified) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerifyToken = token;
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;

  await sendEmail({
  to: user.email,
  subject: "Verify your email - Codelura",
  html: `
    <div style="
      max-width:520px;
      margin:40px auto;
      padding:28px;
      font-family:Arial, Helvetica, sans-serif;
      background:#ffffff;
      border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
    ">

      <h2 style="
        text-align:center;
        color:#111827;
        margin-bottom:8px;
      ">
        Codelura<span style="color:#6366f1;">.</span>
      </h2>

      <p style="
        text-align:center;
        color:#6b7280;
        font-size:14px;
        margin-bottom:24px;
      ">
        Build • Learn • Ship faster
      </p>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.6;
        margin-bottom:20px;
      ">
        Welcome to <strong>Codelura</strong> 👋  
        <br />
        Please verify your email address to complete your signup.
      </p>

      <div style="text-align:center; margin:28px 0;">
        <a href="${verifyUrl}"
          style="
            display:inline-block;
            background:#6366f1;
            color:#ffffff;
            text-decoration:none;
            padding:12px 24px;
            border-radius:6px;
            font-size:15px;
            font-weight:600;
          ">
          Verify Email
        </a>
      </div>

      <p style="
        color:#6b7280;
        font-size:13px;
        line-height:1.6;
      ">
        If you didn’t create a Codelura account, you can safely ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

      <p style="
        text-align:center;
        color:#9ca3af;
        font-size:12px;
      ">
        © ${new Date().getFullYear()} Codelura
      </p>
    </div>
  `
});



  res.json({ message: "Verification email resent" });
};

/**
 * ===============================
 * LOGIN
 * ===============================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 COOKIE SET KARO (IMPORTANT)
    res.cookie("auth_token", token, {
      httpOnly: true,          // XSS safe
      // sameSite: "lax",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",        // localhost safe
      secure: process.env.NODE_ENV === "production", 
       // 🔥 allow cross-origin          // localhost → false
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      token, // 👈 SEND TOKEN
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * ===============================
 * FORGOT PASSWORD
 * ===============================
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // 🔒 Do not reveal existence
    return res.json({ message: "If email exists, reset link sent" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

 await sendEmail({
  to: user.email,
  subject: "Reset Password - Codelura",
  html: `
    <div style="
      max-width:520px;
      margin:40px auto;
      padding:28px;
      font-family:Arial, Helvetica, sans-serif;
      background:#ffffff;
      border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
    ">

      <h2 style="
        text-align:center;
        color:#111827;
        margin-bottom:8px;
      ">
        Codelura<span style="color:#6366f1;">.</span>
      </h2>

      <p style="
        text-align:center;
        color:#6b7280;
        font-size:14px;
        margin-bottom:24px;
      ">
        Build • Learn • Ship faster
      </p>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.6;
        margin-bottom:20px;
      ">
        We received a request to reset your password for your
        <strong>Codelura</strong> account.
      </p>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.6;
        margin-bottom:24px;
      ">
        Click the button below to set a new password:
      </p>

      <div style="text-align:center; margin:28px 0;">
        <a href="${resetUrl}"
          style="
            display:inline-block;
            background:#ef4444;
            color:#ffffff;
            text-decoration:none;
            padding:12px 24px;
            border-radius:6px;
            font-size:15px;
            font-weight:600;
          ">
          Reset Password
        </a>
      </div>

      <p style="
        color:#6b7280;
        font-size:13px;
        line-height:1.6;
      ">
        This password reset link will expire in <strong>15 minutes</strong>.
        If you didn’t request a password reset, please ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

      <p style="
        text-align:center;
        color:#9ca3af;
        font-size:12px;
      ">
        © ${new Date().getFullYear()} Codelura
      </p>
    </div>
  `
});


  res.json({ message: "Password reset link sent" });
};

/**
 * ===============================
 * RESET PASSWORD
 * ===============================
 */
export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

/**
 * ===============================
 * CHANGE PASSWORD (LOGGED IN)
 * ===============================
 */
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({ message: "Old password incorrect" });
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
};
