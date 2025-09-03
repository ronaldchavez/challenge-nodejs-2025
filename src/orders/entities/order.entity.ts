import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  INITIATED = 'initiated',
  SENT = 'sent',
  DELIVERED = 'delivered',
}

@Table({ tableName: 'orders', timestamps: true })
export class Order extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare clientName: string;

  @Column({ type: DataType.ENUM(...Object.values(OrderStatus)), defaultValue: OrderStatus.INITIATED })
  declare status: OrderStatus;

  @HasMany(() => OrderItem)
  declare items?: Partial<OrderItem>[];
}