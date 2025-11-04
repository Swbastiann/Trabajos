import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 HABILITAR CORS - Esto es crucial para que el frontend se comunique con el backend
  app.enableCors({
    origin: 'http://localhost:4200', // URL de tu frontend Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventario API')
    .setDescription('Documentación del API de Inventario')
    .setVersion('1.0')
    .addTag('items')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      displayRequestDuration: true,
    },
  });

  await app.listen(3000);
  console.log(`🚀 Backend corriendo en: http://localhost:3000/api`);
  console.log(`✅ CORS habilitado para: http://localhost:4200`);
}
bootstrap();
