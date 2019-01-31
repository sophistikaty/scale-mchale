import { Injectable } from '@angular/core';
import { ScaleConfig } from '../app/app-config.model';

@Injectable()
export class AppConfig {
    static config: ScaleConfig;
    constructor() {}
    config = {
        apiKeys: {
            edamam: {
                app_id: '[YOUR_APP_ID]',
                app_key: '[YOUR_APP_KEY]'
            }
        }
    };
    load() {
        return this.config;
    }
}
