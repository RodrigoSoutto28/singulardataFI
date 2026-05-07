import { z } from 'zod';

export const emailSchema = z.string().email('Email inválido');

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres');

export const nonEmptyString = z.string().trim().min(1, 'Campo requerido');

export const positiveNumber = z.number().positive('Debe ser mayor a 0');

export const nonNegativeNumber = z.number().min(0, 'No puede ser negativo');

export const isoDateString = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Fecha inválida');
