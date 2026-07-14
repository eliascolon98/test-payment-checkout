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

  // Listen on 0.0.0.0 so the app is reachable inside a container (Railway),
  // and honor the PORT provided by the platform (defaults to 3001 locally).
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
