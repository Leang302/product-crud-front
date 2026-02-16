import { z } from 'zod';

export const ProductSchema = z.object({
  code: z.string().min(3, "ProductCode is required").max(30, "ProductCode must be less than 30 characters"),
  name: z.string().min(1, "Product Name is required").max(50, "Product Name must be less than 50 characters"),
  description: z.string().optional(), 
  price: z.number().positive("Price must be greater than 0"), 
  currency: z.enum(["USD", "RIEL"]),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type Product = z.infer<typeof ProductSchema>;
export const ProductWithIdSchema = ProductSchema.extend({
  id: z.string().optional(), 
createdAt: z.string().datetime().optional().catch(undefined),
  updatedAt: z.string().datetime().optional().catch(undefined),
});

// Extract the type for use in your components/services
export type ProductWithId = z.infer<typeof ProductWithIdSchema>;