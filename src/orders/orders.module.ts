import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItem]),
    CacheModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
