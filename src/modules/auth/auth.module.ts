import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { ClerkAuthGuard } from "./guards/jwt-auth.guard";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AuthModule {}
