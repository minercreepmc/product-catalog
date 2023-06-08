import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { VERSION_METADATA_KEY } from './version.decorator';

@Injectable()
export class VersioningInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const target = context.getHandler();
    const version = Reflect.getMetadata(
      VERSION_METADATA_KEY,
      target.constructor,
    );
    const request = context.switchToHttp().getRequest();

    // Adjust the base URL to include the version if it's not already present
    if (version && !request.baseUrl.includes(`/v${version}`)) {
      request.baseUrl = `/v${version}${request.baseUrl}`;
      request.originalUrl = `/v${version}${request.originalUrl}`;
    }

    return next.handle().pipe(map((data) => data));
  }
}
