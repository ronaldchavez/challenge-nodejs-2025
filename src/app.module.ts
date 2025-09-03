import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { HealthModule } from './health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CacheModule,
    ScheduleModule.forRoot(),
    OrdersModule,
    HealthModule,
  ],
})
export class AppModule {}