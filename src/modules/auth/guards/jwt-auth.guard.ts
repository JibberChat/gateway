import { clerkClient } from "@clerk/clerk-sdk-node";
import { IS_PUBLIC_KEY } from "@decorators/public.decorator";

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

import { ConfigurationService } from "@infrastructure/configuration/services/configuration.service";
import { LoggerService } from "@infrastructure/logger/services/logger.service";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigurationService,
    private logger: LoggerService
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = this.getRequest(context);

    if (!req?.cookies?.__session) throw new UnauthorizedException();

    try {
      const verify = await clerkClient.verifyToken(req.cookies.__session, {
        jwtKey: this.configService.authConfig.jwtKey,
      });

      if (verify) {
        req.user = verify;
        return true;
      }
    } catch (error) {
      this.logger.error(String(error), this.constructor.name);
    }

    throw new UnauthorizedException();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
