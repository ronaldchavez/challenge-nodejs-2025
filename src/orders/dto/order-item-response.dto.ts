import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ description: 'Descripción del ítem' })
  description: string;

  @ApiProperty({ description: 'Cantidad del ítem' })
  quantity: number;

  @ApiProperty({ description: 'Precio unitario del ítem' })
  unitPrice: number;
}