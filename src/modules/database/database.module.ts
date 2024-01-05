import { Module } from '@nestjs/common';
import { configDb } from './configs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities';
import { UserRepository } from './repositories';
import { CrossExArbiEntity } from './entities/cross-ex-arbi.entity';
import { CrossExArbiRepository } from './repositories/cross-ex-arbi.repository';

const repositories = [UserRepository, CrossExArbiRepository];

const services = [];

const entities = [UserEntity, CrossExArbiEntity];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configDb],
    }),
  ],
  controllers: [],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class DatabaseModule { }
