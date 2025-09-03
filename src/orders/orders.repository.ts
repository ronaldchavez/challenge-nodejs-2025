import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Op } from 'sequelize';

@Injectable()
export class OrdersRepository {
  constructor(@InjectModel(Order) private orderModel: typeof Order) {}

  create(orderData: Partial<Order>) {
    return this.orderModel.create(orderData, { include: [OrderItem] });
  }

  findAll(excludeStatuses?: OrderStatus[]) {
    const where = excludeStatuses?.length
      ? { status: { [Op.notIn]: excludeStatuses } }
      : undefined;

    return this.orderModel.findAll({ where });
  }

  async findAllWithPagination(
    excludeStatuses: OrderStatus[] = [],
    page = 1,
    limit = 10,
  ) {
    const offset = (page - 1) * limit;

    const where = excludeStatuses.length
      ? { status: { [Op.notIn]: excludeStatuses } }
      : {};

    const { rows, count } = await this.orderModel.findAndCountAll({
      where,
      include: [OrderItem],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return { rows, count };
  }

  update(order: Order, data: Partial<Order>) {
    return order.update(data);
  }

  async findById(id: number): Promise<Order | null> {
    return this.orderModel.findOne({
      where: { id },
      include: [OrderItem],
    });
  }

  async delete(id: number): Promise<void> {
    await this.orderModel.destroy({ where: { id } });
  }
}