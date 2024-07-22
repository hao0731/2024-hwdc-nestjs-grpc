import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TODO_SERVICE_PACKAGE_NAME } from '@hwdc-2024/todo/domain';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TODO_SERVICE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: TODO_SERVICE_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets/proto/todo_service.proto'),
          url: process.env.TODO_SERVICE_URL,
        },
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
