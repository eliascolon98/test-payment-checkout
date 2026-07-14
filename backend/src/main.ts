import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionManager } from './common/exceptions/exceptions-manager.filter';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Payment Checkout API')
    .setDescription(
      'Backend API for the credit card payment checkout: product catalog, ' +
        'payment transactions and status tracking.',
    )
    .setVersion('1.0')
    .addTag('products', 'Product catalog')
    .addTag('transactions', 'Payment transactions')
    .addTag('health', 'Service health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ExceptionManager());
  setupSwagger(app);

  console.log('Attempting to listen on 0.0.0.0:3001...');
  await app.listen(3001, '0.0.0.0').catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
  console.log('✓ Server listening on 0.0.0.0:3001');
}

void bootstrap();
