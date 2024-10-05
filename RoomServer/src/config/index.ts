import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.${process.env.SPECIFIC_ENV || 'local'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const { CACHE_HOST, CACHE_PORT } = process.env;
export const { BIN_PATH } = process.env;
export const { LOBBY_SERVER_HOST, LOBBY_SERVER_PORT } = process.env;
export const { MATCH_MAKING_SERVER_HOST, MATCH_MAKING_SERVER_PORT } = process.env;
