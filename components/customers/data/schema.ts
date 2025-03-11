import { z } from 'zod'

export const customerSchema = z.object({
  id: z.string(),
  company: z.string(),
  taxOffice: z.string(),
  taxValue: z.string(),
  currency: z.string(),
  country: z.string(),
  city: z.string(),
  district: z.string(),
  accountId: z.string(),
})

export type Customer = z.infer<typeof customerSchema>
