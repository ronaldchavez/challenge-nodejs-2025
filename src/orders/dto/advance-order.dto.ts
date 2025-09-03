import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

export class AdvanceOrderDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.SENT })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}