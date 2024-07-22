import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Metadata } from '@grpc/grpc-js';
import { concatMap, delay, from, map, of, toArray } from 'rxjs';

import {
  CreateTodoRequest,
  GetTodoRequest,
  TODO_SERVICE_NAME,
  TODO_SERVICE_PACKAGE_NAME,
  TodoServiceClient,
} from '@hwdc-2024/todo/domain';

@Injectable()
export class TodoService implements OnModuleInit {
  private todoServiceClient: TodoServiceClient;

  constructor(
    @Inject(TODO_SERVICE_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  getTodoById(id: string) {
    const metadata = new Metadata();
    return this.todoServiceClient.getTodo({ id }, metadata);
  }

  createTodo(payload: CreateTodoRequest) {
    const metadata = new Metadata();
    return this.todoServiceClient.createTodo(payload, metadata);
  }

  completeTodoById(id: string) {
    const metadata = new Metadata();
    return this.todoServiceClient.completeTodo({ id }, metadata);
  }

  // NOTE: Server Streaming
  getTodosByIds(ids: string[]) {
    const metadata = new Metadata();
    return this.todoServiceClient.getTodosByIds({ ids }, metadata).pipe(
      toArray(),
      map((responses) => responses.flatMap((response) => response.todo)),
      map((todos) => ({ todos }))
    );
  }

  // NOTE: Client Streaming
  // getTodosByIds(ids: string[]) {
  //   const request$ = from(ids.map<GetTodoRequest>((id) => ({ id })));
  //   const metadata = new Metadata();
  //   return this.todoServiceClient.getTodosThroughStream(request$, metadata);
  // }

  // NOTE: Bidirectional Streaming
  // getTodosByIds(ids: string[]) {
  //   const request$ = from(ids).pipe(
  //     concatMap((id) => of<GetTodoRequest>({ id }).pipe(delay(100)))
  //   );
  //   const metadata = new Metadata();
  //   return this.todoServiceClient.getTodos(request$, metadata).pipe(
  //     toArray(),
  //     map((responses) => responses.flatMap((response) => response.todo)),
  //     map((todos) => ({ todos }))
  //   );
  // }

  onModuleInit() {
    this.todoServiceClient = this.client.getService(TODO_SERVICE_NAME);
  }
}
