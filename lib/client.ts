import { treaty } from '@elysiajs/eden'
import { app } from '../app/api/[[...slugs]]/route'

export const client = treaty<typeof app>("localhost:3000").api