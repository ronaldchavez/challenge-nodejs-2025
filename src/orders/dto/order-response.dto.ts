import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty({ description: 'ID de la orden' })
  id: number;

  @ApiProperty({ description: 'Nombre del cliente' })
  clientName: string;

  @ApiProperty({ enum: OrderStatus, description: 'Estado de la orden' })
  status: OrderStatus;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Lista de ítems de la orden' })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;
}