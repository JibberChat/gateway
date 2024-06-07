import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  APP_NAME,
  APP_PORT,
  APP_VERSION,
  AppConfiguration,
  NODE_ENV,
} from '../model/app-configuration';
import {
  USER_SERVICE_HOST,
  USER_SERVICE_PORT,
  UserServiceConfiguration,
} from '../model/user-service.configuration';
import { LoggerService } from '@infrastructure/logger/services/logger.service';
import {
  CHAT_SERVICE_HOST,
  CHAT_SERVICE_PORT,
} from '../model/chat-service.configuration';
import {
  MEDIA_SERVICE_HOST,
  MEDIA_SERVICE_PORT,
} from '../model/media-service.configuration';

@Injectable()
export class ConfigurationService {
  private logger = new LoggerService();

  private _appConfig!: AppConfiguration;
  private _userServiceConfig!: UserServiceConfiguration;
  private _chatServiceConfig!: UserServiceConfiguration;
  private _mediaServiceConfig!: UserServiceConfiguration;

  public isProd!: boolean;

  get appConfig(): AppConfiguration {
    return this._appConfig;
  }

  get userServiceConfig(): UserServiceConfiguration {
    return this._userServiceConfig;
  }

  get chatServiceConfig(): UserServiceConfiguration {
    return this._chatServiceConfig;
  }

  get mediaServiceConfig(): UserServiceConfiguration {
    return this._mediaServiceConfig;
  }

  constructor(private nestConfigService: ConfigService) {
    this.setupEnvironment();
    this.logger.log(
      'Configuration service initialized.',
      this.constructor.name,
    );
    this.logger.log(`App name: ${this._appConfig.name}`, this.constructor.name);
  }

  private setupEnvironment(): void {
    // APP
    const appEnv = this.getVariableFromEnvFile(NODE_ENV);

    this._appConfig = {
      name: this.getVariableFromEnvFile(APP_NAME),
      version: this.getVariableFromEnvFile(APP_VERSION),
      port: parseInt(this.getVariableFromEnvFile(APP_PORT)),
      env: appEnv,
    };

    this.isProd = appEnv.includes('prod');

    // USER SERVICE
    this._userServiceConfig = {
      host: this.getVariableFromEnvFile(USER_SERVICE_HOST),
      port: parseInt(this.getVariableFromEnvFile(USER_SERVICE_PORT)),
    };

    // CHAT SERVICE
    this._chatServiceConfig = {
      host: this.getVariableFromEnvFile(CHAT_SERVICE_HOST),
      port: parseInt(this.getVariableFromEnvFile(CHAT_SERVICE_PORT)),
    };

    // MEDIA SERVICE
    this._mediaServiceConfig = {
      host: this.getVariableFromEnvFile(MEDIA_SERVICE_HOST),
      port: parseInt(this.getVariableFromEnvFile(MEDIA_SERVICE_PORT)),
    };
  }

  private getVariableFromEnvFile(key: string): string {
    const variable = this.nestConfigService.get<string>(key);
    if (!variable) {
      this.logger.error(
        `No ${key} could be found from env file.`,
        this.constructor.name,
      );
      throw new Error(`No ${key} could be found from env file.`);
    }
    return variable;
  }
}
