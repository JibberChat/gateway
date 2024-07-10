import { Public } from "@decorators/public.decorator";

import { Controller, Get } from "@nestjs/common";
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator } from "@nestjs/terminus";

@Controller({ path: "health" })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Public()
  @Get("")
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.disk.checkStorage("storage", { thresholdPercent: 0.9, path: "/" }),
      // () => this.memory.checkHeap("memory_heap", 200 * 1024 * 1024),
      // () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
    ]);
  }

  @Public()
  @Get("ping")
  ping() {
    return "pong";
  }
}
