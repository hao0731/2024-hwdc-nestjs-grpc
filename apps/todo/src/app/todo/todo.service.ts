import { CreateTodoRequest, Todo } from '@hwdc-2024/todo/domain';
import { Injectable } from '@nestjs/common';
import { map, timer } from 'rxjs';

@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [];

  getTodoById(id: string) {
    return this.toAsync(() => {
      return this.todos.find((todo) => todo.id === id);
    });
  }

  createTodo(payload: CreateTodoRequest) {
    return this.toAsync(() => {
      const todo: Todo = {
        id: crypto.randomUUID(),
        title: payload.title,
        description: payload.description,
        completed: false,
      };

      this.todos.push(todo);

      return todo;
    });
  }

  completeTodoById(id: string) {
    return this.toAsync(() => {
      const todo = this.todos.find((todo) => todo.id === id);

      if (!todo) {
        return;
      }

      todo.completed = true;
      return todo;
    });
  }

  getTodosByIds(ids: string[]) {
    return this.toAsync(() => {
      return this.todos.filter((todo) => ids.includes(todo.id));
    });
  }

  private toAsync<R>(fn: () => R, miliseconds = 100) {
    return timer(miliseconds).pipe(map(() => fn()));
  }
}
