import { z } from "zod"

const env = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(10000),
  SECRET: z.string(),
})

export default env.parse(process.env)
