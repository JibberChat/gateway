import { green, yellow } from "chalk";
import { catchError, tap } from "rxjs";

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { LoggerService } from "./services/logger.service";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const contextType = context.getType();

    if (contextType === "http") {
    } else {
      const args = context.getArgs();
      const req = args[3];
      const { key, typename } = req.path;

      this.loggerService.info(yellow("Request ") + JSON.stringify({ key, typename }), this.constructor.name);
    }

    return next
      .handle()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .pipe(
        tap((data) => {
          // if (typename === "/api/metrics") return;
          this.loggerService.info(green("Response ") + JSON.stringify({ data }), this.constructor.name);
        })
      );
  }
}
