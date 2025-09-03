import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order, OrderStatus } from './entities/order.entity';
import { CacheService } from '../cache/cache.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';

@Injectable()
export class OrdersService {

  private readonly daysToKeep: number;

  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService
  ) {
    this.daysToKeep = +this.configService.get<number>('DAYS_TO_KEEP', 7);
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = await this.ordersRepo.create({
      clientName: dto.clientName,
      status: OrderStatus.INITIATED,
      items: dto.items,
    });
    await this.cacheService.del('orders');
    return order;
  }

  async getOrders(
    excludeStatuses: OrderStatus[] = [],
    page = 1,
    limit = 10,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const cacheKey = `orders:${excludeStatuses.join(',')}:page${page}:limit${limit}`;
    const cached = await this.cacheService.get<typeof cached>(cacheKey);
    if (cached) return cached;

    const { rows, count } = await this.ordersRepo.findAllWithPagination(
      excludeStatuses,
      page,
      limit,
    );

    const result = {
      data: rows,
      total: count,
      page,
      limit,
    };

    await this.cacheService.set(cacheKey, result);
    return result;
  }

  async getOrderById(id: number): Promise<Order> {
    const cached = await this.cacheService.get<Order>(`order:${id}`);
    if (cached) return cached;

    const order = await this.ordersRepo.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    await this.cacheService.set(`order:${id}`, order);
    return order;
  }

  async advanceOrder(id: number): Promise<Order> {
    const order = await this.ordersRepo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    switch (order.status) {
      case OrderStatus.INITIATED:
         console.log("pase");
        order.status = OrderStatus.SENT;
        break;
      case OrderStatus.SENT:
        order.status = OrderStatus.DELIVERED;
        break;
      case OrderStatus.DELIVERED:
        await this.ordersRepo.delete(id);
        await this.cacheService.del('orders');
        return order;
    }
    await order.save();
    await this.cacheService.del('orders');
    return order;
  }

  @Cron('0 0 * * *')
  async cleanOldDeliveredOrders() {

    const cutoffDate = new Date(Date.now() - this.daysToKeep * 24 * 60 * 60 * 1000);

    try {
      const deleted = await Order.destroy({
        where: {
          status: 'delivered',
          updatedAt: { [Op.lt]: cutoffDate },
        },
      });
      console.log(`[Cron] ${deleted} delivered orders older than ${this.daysToKeep} days were deleted.`);
    } catch (error) {
      console.error('[Cron] Error cleaning old delivered orders:', error);
    }
  }
}