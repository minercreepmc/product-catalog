import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class ResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        const ctx = context.switchToRpc().getContext();
        const channel = ctx.getChannelRef();
        const originalMessage = ctx.getMessage();
        channel.ack(originalMessage);

        return result;
      }),
    );
  }
}
