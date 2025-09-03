import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { OrderStatus } from '../src/orders/entities/order.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdOrderId: number;

  it('should create a new order', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send({
        clientName: 'Ana López',
        items: [
          { description: 'Ceviche', quantity: 2, unitPrice: 50 },
          { description: 'Chicha morada', quantity: 1, unitPrice: 10 },
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe(OrderStatus.INITIATED);
    createdOrderId = response.body.id;
  });

  it('should list orders', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some(o => o.id === createdOrderId)).toBe(true);
  });

  it('should advance order status', async () => {
    let response = await request(app.getHttpServer())
      .post(`/orders/${createdOrderId}/advance`)
      .expect(201);

    expect(response.body.status).toBe(OrderStatus.SENT);

    response = await request(app.getHttpServer())
      .post(`/orders/${createdOrderId}/advance`)
      .expect(201);

    expect(response.body.status).toBe(OrderStatus.DELIVERED);
  });
});