import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @ApiProperty({ example: 'Ceviche' })
  @IsString()
  description: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Ana López' })
  @IsString()
  clientName: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}