import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./controllers/health.controller";

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: "pretty",
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
