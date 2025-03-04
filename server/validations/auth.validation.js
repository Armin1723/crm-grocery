const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 characters")
    .max(10, "Phone number must be at most 10 characters"),
});

const loginSchema = z.object({
  email: z.union([
    z.string().email("Invalid email format"), // Validate as email
    z.string().regex(/^[a-zA-Z0-9]+$/, "empId must be alphanumeric"), // Validate as empId
  ]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
    .refine((val) => !/\s/.test(val), {
      message: "Password must not contain spaces",
    }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
    .refine((val) => !/\s/.test(val), {
      message: "Password must not contain spaces",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
