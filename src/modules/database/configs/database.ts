import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';

const clientCertStag = [];
const clientKeyStag = [];
const serverCaStag = [];

// const clientCertProd = fs.readFileSync(
//   path.join(__dirname, '../../../ssl/database/prod/client-cert.pem'),
// );
// const clientKeyProd = fs.readFileSync(
//   path.join(__dirname, '../../../ssl/database/prod/client-key.pem'),
// );
// const serverCaProd = fs.readFileSync(
//   path.join(__dirname, '../../../ssl/database/prod/server-ca.pem'),
// );

export const configDb = registerAs(
  'db',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'test',
    synchronize: Boolean(process.env.DB_SYNC) || false,
    autoLoadEntities: true,
    logging: false,
    // ssl:
    //   process.env.APP_ENV == 'production'
    //     ? {
    //         ca:
    //           process.env.APP_ENV == 'production' ? serverCaProd : serverCaStag,
    //         key:
    //           process.env.APP_ENV == 'production'
    //             ? clientKeyProd
    //             : clientKeyStag,
    //         cert:
    //           process.env.APP_ENV == 'production'
    //             ? clientCertProd
    //             : clientCertStag,
    //         rejectUnauthorized: false,
    //       }
    //     : null,
  }),
);
