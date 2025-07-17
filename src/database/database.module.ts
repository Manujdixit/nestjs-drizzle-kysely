import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './generated-types';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          ssl: {
            rejectUnauthorized: false, // For Neon and other cloud databases
          },
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'KYSELY_DB',
      useFactory: (pool: Pool) => {
        return new Kysely<DB>({
          dialect: new PostgresDialect({
            pool,
          }),
        });
      },
      inject: ['DATABASE_POOL'],
    },
  ],
  exports: ['KYSELY_DB'],
})
export class DatabaseModule {}
