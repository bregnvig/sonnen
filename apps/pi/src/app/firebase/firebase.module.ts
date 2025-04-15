import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [
    FirebaseService,
  ],
  exports: [
    FirebaseService,
  ],
})
export class FirebaseModule implements OnModuleInit {
  readonly #logger = new Logger(FirebaseModule.name);

  constructor(private service: FirebaseService) {
  }

  async onModuleInit() {
    this.#logger.debug('FirestoreModule started');
    await this.service.init()
      .then(() => this.#logger.debug('Firestore initialized'))
      .catch(err => {
        this.#logger.error('Firestore initialization failed', err);
        process.exit(1);
      });
  }
}
