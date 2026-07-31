import { z } from 'zod';

/**
 * Centralised zod schemas for forms across the app.
 * Keep messages in Spanish (default product language).
 */

// ---------- Trades ----------
export const tradeFormSchema = z
  .object({
    symbol: z
      .string()
      .trim()
      .min(1, 'El símbolo es requerido')
      .max(20, 'El símbolo no puede superar 20 caracteres'),
    direction: z.enum(['long', 'short'], {
      errorMap: () => ({ message: 'Selecciona una dirección válida' }),
    }),
    status: z.enum(['open', 'closed']),
    entry_price: z.coerce
      .number({ invalid_type_error: 'El precio de entrada debe ser numérico' })
      .positive('El precio de entrada debe ser mayor a 0'),
    quantity: z.coerce
      .number({ invalid_type_error: 'La cantidad debe ser numérica' })
      .positive('La cantidad debe ser mayor a 0'),
    exit_price: z
      .union([z.literal(''), z.coerce.number().positive('El precio de salida debe ser mayor a 0')])
      .optional()
      .nullable(),
    stop_size: z
      .union([z.literal(''), z.coerce.number().refine((v) => v !== 0, 'El tamaño del stop no puede ser 0')])
      .optional()
      .nullable(),
    take_profit: z
      .union([z.literal(''), z.coerce.number().refine((v) => v !== 0, 'El take profit no puede ser 0')])
      .optional()
      .nullable(),
    commission: z
      .union([z.literal(''), z.coerce.number().min(0, 'La comisión no puede ser negativa')])
      .optional()
      .nullable(),
    pnl: z
      .union([
        z.literal(''),
        z.coerce
          .number({ invalid_type_error: 'El resultado (P&L) debe ser numérico' })
          .refine((v) => Number.isFinite(v), 'El resultado (P&L) debe ser numérico')
          .refine((v) => Math.abs(v) <= 1_000_000_000, 'El resultado (P&L) está fuera de rango')
          .refine(
            (v) => Math.round(v * 100) === Number((v * 100).toFixed(6)),
            'El resultado (P&L) admite como máximo 2 decimales'
          ),
      ])
      .optional()
      .nullable(),
    pnl_percentage: z
      .union([
        z.literal(''),
        z.coerce
          .number({ invalid_type_error: 'El porcentaje debe ser numérico' })
          .refine((v) => Number.isFinite(v), 'El porcentaje debe ser numérico')
          .refine((v) => v >= -10_000 && v <= 10_000, 'El porcentaje debe estar entre -10000 y 10000')
          .refine(
            (v) => Math.round(v * 100) === Number((v * 100).toFixed(6)),
            'El porcentaje admite como máximo 2 decimales'
          ),
      ])
      .optional()
      .nullable(),

    strategy: z.string().trim().max(100, 'Máximo 100 caracteres').optional(),
    notes: z.string().trim().max(2000, 'Máximo 2000 caracteres').optional(),
    entry_date: z.string().min(1, 'La fecha de apertura es requerida'),
    exit_date: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      data.status === 'open' ||
      data.exit_price === '' ||
      data.exit_price === null ||
      data.exit_price === undefined ||
      typeof data.exit_price === 'number',
    { path: ['exit_price'], message: 'Precio de salida inválido' }
  )
  .refine(
    (data) => data.status !== 'closed' || typeof data.pnl === 'number',
    { path: ['pnl'], message: 'Ingresá el resultado (P&L) de la operación cerrada' }
  )
  // Coherencia de signo: el % debe acompañar el signo del P&L
  .refine(
    (data) =>
      typeof data.pnl !== 'number' ||
      typeof data.pnl_percentage !== 'number' ||
      data.pnl === 0 ||
      data.pnl_percentage === 0 ||
      Math.sign(data.pnl) === Math.sign(data.pnl_percentage),
    {
      path: ['pnl_percentage'],
      message: 'El porcentaje debe tener el mismo signo que el P&L (negativo = pérdida)',
    }
  );


export type TradeFormValues = z.infer<typeof tradeFormSchema>;

// ---------- Psychology check-in ----------
export const psychologyEntrySchema = z.object({
  emotion: z.enum(
    ['confident', 'calm', 'neutral', 'excited', 'fomo', 'anxious', 'frustrated', 'vengeful'],
    { errorMap: () => ({ message: 'Selecciona una emoción' }) }
  ),
  disciplineScore: z
    .number()
    .min(0, 'Mínimo 0')
    .max(10, 'Máximo 10'),
  sleepQuality: z.number().min(0, 'Mínimo 0').max(5, 'Máximo 5'),
  stressLevel: z.number().min(0, 'Mínimo 0').max(5, 'Máximo 5'),
  lessonsLearned: z
    .string()
    .trim()
    .max(2000, 'Máximo 2000 caracteres')
    .optional(),
  goals: z.string().trim().max(2000, 'Máximo 2000 caracteres').optional(),
});

export type PsychologyEntryValues = z.infer<typeof psychologyEntrySchema>;

// ---------- Auth ----------
export const signInSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(72),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(1, 'El nombre es requerido').max(100),
});

/**
 * Translate raw Supabase auth error messages into friendly Spanish.
 */
export function translateAuthError(message?: string): string {
  if (!message) return 'Ocurrió un error. Intenta nuevamente.';
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos';
  if (m.includes('email not confirmed')) return 'Debés confirmar tu email antes de ingresar';
  if (m.includes('user already registered')) return 'Ya existe una cuenta con ese email';
  if (m.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres';
  if (m.includes('rate limit')) return 'Demasiados intentos. Esperá un momento e intentá de nuevo.';
  if (m.includes('network')) return 'Error de red. Verificá tu conexión.';
  return 'No pudimos completar la operación. Intentá nuevamente.';
}
