import { AuthApplicationService } from '@application/application-services/auth';
import { authServiceDiToken } from '@domain-interfaces/services';
import { Module, Provider } from '@nestjs/common';

const providers: Provider[] = [
  {
    provide: authServiceDiToken,
    useClass: AuthApplicationService,
  },
];

@Module({
  providers,
  exports: providers,
})
export class ApplicationServiceModule {}
