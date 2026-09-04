import { z } from 'zod';
import { USER_ROLES } from '../../../constants/roles';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().refine((val) => !val || val.length >= 10, {
    message: 'Phone number must be at least 10 digits',
  }),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum([USER_ROLES.BEEKEEPER, USER_ROLES.CUSTOMER]),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms & Conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});
