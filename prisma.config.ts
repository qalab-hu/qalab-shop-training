import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  // A schema fájl helye
  schema: 'prisma/schema.prisma',
  
  // Migration konfiguráció
  migrations: {
    // A seed script
    seed: 'node prisma/seed.js'
  }
})
