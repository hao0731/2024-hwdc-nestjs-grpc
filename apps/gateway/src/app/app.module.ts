import { Module, ValidationPipe } from '@nestjs/common';
import { TodoModule } from './todo';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TodoModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({ transform: true, whitelist: true });
      },
    },
  ],
})
export class AppModule {}
