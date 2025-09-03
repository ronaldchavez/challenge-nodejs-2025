import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Filtro de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptor de logging
  app.useGlobalInterceptors(new LoggingInterceptor());


  // Swagger
  const config = new DocumentBuilder()
    .setTitle('OlaClick Orders API')
    .setDescription('API RESTful para manejo de órdenes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();