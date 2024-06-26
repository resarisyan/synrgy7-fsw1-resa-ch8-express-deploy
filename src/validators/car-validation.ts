import { z, ZodType } from 'zod';

export class CarValidation {
  static CREATE: ZodType = z.object({
    plate: z.string().min(1).max(255),
    manufacture: z.string().min(1).max(255),
    model: z.string().min(1).max(255),
    image: z.string().refine((data) => {
      return data.startsWith('data:image/');
    }),
    rentPerDay: z.number().min(1),
    capacity: z.number().min(1),
    description: z.string().min(1).max(255),
    transmission: z.string().min(1).max(255),
    year: z.number().min(1900).max(new Date().getFullYear()),
    availableAt: z.string().refine((data) => {
      return new Date(data).getTime() > new Date().getTime();
    }),
    driverType: z.boolean()
  });

  static readonly UPDATE: ZodType = z.object({
    plate: z.string().min(1).max(255).optional(),
    manufacture: z.string().min(1).max(255).optional(),
    model: z.string().min(1).max(255).optional(),
    image: z
      .string()
      .refine((data) => {
        return data.startsWith('data:image/');
      })
      .optional()
      .nullable(),
    rentPerDay: z.number().min(1).optional(),
    capacity: z.number().min(1).optional(),
    description: z.string().min(1).max(255).optional(),
    transmission: z.string().min(1).max(255).optional(),
    year: z.number().min(1900).max(new Date().getFullYear()).optional(),
    availableAt: z
      .string()
      .refine((data) => {
        return new Date(data).getTime() > new Date().getTime();
      })
      .optional(),
    driverType: z.boolean().optional().nullable()
  });
  static readonly SEARCH: ZodType = z.object({
    driverType: z.string().refine((value) => value === '1' || value === '0', {
      message: "driverType must be '1' or '0'"
    }),
    capacity: z.number().min(0).optional(),
    pickUpTime: z.string(),
    pickUpDate: z.string()
  });
}
