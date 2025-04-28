// This example is based on the Firebase Functions v2 API.
// For more information, see https://firebase.google.com/docs/functions/version-comparison
import { logger } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
setGlobalOptions({
  region: 'europe-west1',
});

export const onCommandCreated = onDocumentCreated('command/{commandId}', async event => {
  logger.info('Hello logs!', {structuredData: true});
});
