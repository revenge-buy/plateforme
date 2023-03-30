// sanity.js
import {createClient} from '@sanity/client'
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

const client = createClient({
  projectId: `${process.env.NEXT_PUBLIC_SANITY_ID}`,
  dataset: 'production',
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: '2022-01-12', // use current date (YYYY-MM-DD) to target the latest API version
  token: `${process.env.NEXT_PUBLIC_SANITY_TOKEN}` // Only if you want to update content with the client
})

export default client;