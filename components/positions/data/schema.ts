import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const positionsSchema = z.object({
  id: z.string().optional(),
  positionNo: z.string().optional(),
  positionType: z.string().optional(),
  orderDate: z.string().optional(),
  openingDate: z.string().optional(),
  sender: z.string().optional(),
  receiver: z.string().optional(),
  countryOfLoading: z.string().optional(),
  placeOfLoading: z.string().optional(),
  dateOfLoading: z.string().optional(),
  countryOfUnloading: z.string().optional(),
  placeOfUnloading: z.string().optional(),
  dateOfUnloading: z.string().optional(),
  truckUnit: z.string().optional(),
  trailer: z.string().optional(),
  customs: z.string().optional(),
  freightInvoice: z.string().optional(),
  lastLocation: z.array(z.string()).optional(), // Array of location names (e.g. ["Istanbul", "Ankara"])
})

export type Position = z.infer<typeof positionsSchema>
