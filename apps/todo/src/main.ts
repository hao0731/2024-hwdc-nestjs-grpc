/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from '@hwdc-2024/todo/domain';
import { join } from 'path';

async function bootstrap() {
  const url = process.env.TODO_SERVICE_URL;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: join(__dirname, './assets/proto/todo_service.proto'),
        url,
      },
    }
  );
  await app.listen();

  Logger.log(`Todo service is running at ${url}`);
}

bootstrap();
