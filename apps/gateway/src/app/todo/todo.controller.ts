import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Payload } from '@nestjs/microservices';
import { CreateTodoDTO } from './todo';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getByIds(@Query('ids', ParseArrayPipe) ids: string[]) {
    return this.todoService.getTodosByIds(ids);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.todoService.getTodoById(id);
  }

  @Post()
  create(@Payload() dto: CreateTodoDTO) {
    return this.todoService.createTodo(dto);
  }

  @Patch(':id[:]complete')
  complete(@Param('id') id: string) {
    return this.todoService.completeTodoById(id);
  }
}
