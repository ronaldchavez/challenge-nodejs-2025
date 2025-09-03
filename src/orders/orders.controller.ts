import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created', type: OrderResponseDto })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderResponseDto] })
  async getAll(
    @Query('exclude') exclude?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const excludeStatuses = exclude
      ? exclude.split(',').map(s => s.trim() as OrderStatus)
      : [];
    return this.ordersService.getOrders(excludeStatuses, Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Post(':id/advance')
  @ApiOperation({ summary: 'Advance order status' })
  @ApiResponse({ status: 200, description: 'Order advanced successfully', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async advance(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.advanceOrder(id);
  }
}