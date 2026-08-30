import { z } from 'zod';
import { USER_ROLES } from '../../../constants/roles';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
  confirmPassword: z.string(),
  role: z.enum([USER_ROLES.BEEKEEPER, USER_ROLES.CUSTOMER]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
