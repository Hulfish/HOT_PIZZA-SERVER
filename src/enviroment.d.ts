declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: 5000
            CLIENT_URL: string
            DB_URL: string
            JWT_ACCESS_SECRET: string
            JWT_REFRESH_SECRET: string
            NODE_ENV: "DEV" | "PROD"
        }
    }
}

export {}