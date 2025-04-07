import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Module({
  providers: [
    FirestoreService,
  ],
  exports: [
    FirestoreService,
  ],
})
export class FirestoreModule implements OnModuleInit {
  readonly #logger = new Logger(FirestoreModule.name);

  constructor(private service: FirestoreService) {
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
