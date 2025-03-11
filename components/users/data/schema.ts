import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'USER', 'CUSTOMER']),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDefault: z.boolean().optional(),
})

export type User = z.infer<typeof userSchema>
