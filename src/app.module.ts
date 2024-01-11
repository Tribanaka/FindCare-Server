import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsController } from './hospitals/hospitals.controller';
import { HospitalsService } from './hospitals/hospitals.service';
import { PractionersController } from './practioners/practioners.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'medlink.postgres.database.azure.com',
      port: 5432,
      username: 'superfly',
      password: `${process.env.DB_PASSWORD}`,
      database: 'test',
      ssl: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController, HospitalsController, PractionersController],
  providers: [AppService, HospitalsService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
