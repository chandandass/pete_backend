import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { ChildrenModule } from './modules/children/children.module';
import { TimelineModule } from './modules/timeline/timeline.module';

@Module({
  imports: [
    // Load configuration from .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '**/**/*.entity{.ts,.js}')],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    
    // import local modules
    UserModule, ChildrenModule, TimelineModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
