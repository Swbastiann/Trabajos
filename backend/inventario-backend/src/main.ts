import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Inventario API')
    .setDescription('Documentación del API de Inventario')
    .setVersion('1.0')
    .addTag('items')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🔥 Swagger ahora está en /docs, no interfiere con /api
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log('🚀 Backend corriendo en: http://localhost:3000/api');
  console.log('📘 Swagger: http://localhost:3000/docs');
}

bootstrap();
