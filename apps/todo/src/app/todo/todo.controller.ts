import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Metadata, status as GrpcStatus } from '@grpc/grpc-js';
import {
  concatMap,
  filter,
  from,
  iif,
  map,
  Observable,
  of,
  throwError,
  toArray,
} from 'rxjs';

import {
  CompleteTodoRequest,
  CompleteTodoResponse,
  CreateTodoRequest,
  CreateTodoResponse,
  GetTodoRequest,
  GetTodoResponse,
  GetTodosRequest,
  GetTodosResponse,
  TodoServiceController,
  TodoServiceControllerMethods,
} from '@hwdc-2024/todo/domain';

import { TodoService } from './todo.service';

const isDefined = <T>(input: T): input is T => input !== undefined;

@TodoServiceControllerMethods()
@Controller()
export class TodoController implements TodoServiceController {
  constructor(private readonly todoService: TodoService) {}

  getTodo(data: GetTodoRequest, metadata: Metadata) {
    const todo$ = this.todoService.getTodoById(data.id);
    return todo$.pipe(map((todo) => <GetTodoResponse>{ todo }));
  }

  createTodo(data: CreateTodoRequest): Observable<CreateTodoResponse> {
    return this.todoService.createTodo(data).pipe(map((todo) => ({ todo })));
  }

  completeTodo(data: CompleteTodoRequest): Observable<CompleteTodoResponse> {
    return this.todoService.completeTodoById(data.id).pipe(
      concatMap((todo) =>
        iif(
          () => !!todo,
          of({ todo }),
          throwError(
            () =>
              new RpcException({
                code: GrpcStatus.NOT_FOUND,
              })
          )
        )
      )
    );
  }

  getTodosByIds(data: GetTodosRequest): Observable<GetTodoResponse> {
    const todos$ = this.todoService.getTodosByIds(data.ids);
    return todos$.pipe(
      concatMap((todos) => from(todos).pipe(map((todo) => ({ todo }))))
    );
  }

  getTodosThroughStream(
    request$: Observable<GetTodoRequest>
  ): Observable<GetTodosResponse> {
    const todos$ = request$.pipe(
      concatMap((data) => this.todoService.getTodoById(data.id)),
      filter(isDefined),
      toArray()
    );
    return todos$.pipe(map((todos) => ({ todos })));
  }

  getTodos(request$: Observable<GetTodoRequest>): Observable<GetTodoResponse> {
    const todo$ = request$.pipe(
      concatMap((data) => this.todoService.getTodoById(data.id)),
      filter(isDefined)
    );
    return todo$.pipe(map((todo) => ({ todo })));
  }
}
