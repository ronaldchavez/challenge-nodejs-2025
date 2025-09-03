import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from './order.entity';

@Table({ tableName: 'order_items', timestamps: true })
export class OrderItem extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare unitPrice: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  declare orderId: number;

  @BelongsTo(() => Order)
  declare order: Order;
}