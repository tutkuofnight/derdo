import { Client } from "pg"

const client = new Client({
    connectionString: process.env.NEXT_PUBLIC_DB_URL
});
(async () => {
    try {
        await client.connect();
        console.log('Database connected successfully!');
    } catch (err) {
        console.error('Database connection error:', err);
    }
})()

export default client