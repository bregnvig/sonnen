import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase';

@Controller()
export class AppController {
  #logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private firebase: FirebaseService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('notification')
  sendTestNotification(@Query('message') message: string, @Query() token: string, @Query('badge') badge?: string, @Query('icon') icon?: string) {
    this.#logger.debug('Sending test notification', message);
    return this.firebase.sendToToken(token, 'Test notification', message, badge, icon).then(() => {
      this.#logger.debug('Test notification sent');
    }).catch(error => {
      this.#logger.error('Error sending test notification', error);
      throw error;
    });
  }
}
