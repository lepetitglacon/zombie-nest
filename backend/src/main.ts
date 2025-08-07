import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {join} from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });


  await app.listen(3001);
  console.log('Server running on http://localhost:3001');
}
bootstrap();