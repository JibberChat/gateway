import { green, yellow } from "chalk";
import { catchError, tap } from "rxjs";

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { LoggerService } from "./services/logger.service";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly loggerSerivce = new LoggerService();

  intercept(context: ExecutionContext, next: CallHandler) {
    const args = context.getArgs();
    const req = args[3];
    const { key, typename } = req.path;

    this.loggerSerivce.info(yellow("Request") + JSON.stringify({ key, typename }), this.constructor.name);
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
          console.log("data", data);
          this.loggerSerivce.info(green("Response") + JSON.stringify({ data }), this.constructor.name);
        })
      );
  }
}
