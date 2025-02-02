import { createClient } from "@redis/client"

const client = createClient({ 
  url: process.env.REDIS_URL!,
  legacyMode: false // Changed from true to false for better compatibility
});

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export default client