import { green, yellow } from "chalk";
import { catchError, tap } from "rxjs";

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { LoggerService } from "./services/logger.service";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly loggerSerivce: LoggerService;

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { url, method, params, query, body } = req;

    this.loggerSerivce.info(
      yellow("Request") + JSON.stringify({ url, method, params, query, body }),
      this.constructor.name
    );
    return next
      .handle()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .pipe(
        tap((data) => {
          if (url === "/api/metrics") return;
          this.loggerSerivce.info(green("Response") + JSON.stringify({ statusCode, data }), this.constructor.name);
        })
      );
  }
}
