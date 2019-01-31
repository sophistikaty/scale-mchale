import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
    static config: object;
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
