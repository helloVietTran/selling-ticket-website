import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.js';
import config from './config.js';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.db.host,
    port: Number(config.db.port),
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    synchronize: true, // dev only
    logging: false,
    entities: [User, Role],
    migrations: [],
    subscribers: [],
});
