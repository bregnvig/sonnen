import { writeProductSet } from './sonnen/sonnen.writer';
import { readProductSet } from './sonnen/sonnen.reader';
import { initializeApp, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { environment } from './environments/environment';

initializeApp({
  credential: cert(environment.firebase as ServiceAccount)
});
console.log(environment.firebase.project_id);
console.log(getApp().name);

const bootstrap = async () => {
  const sets = environment.files.map(async file => await readProductSet(file));
  return Promise.all(sets)
    .then(sets => sets.flat())
    .then(sets => writeProductSet(sets))
};

bootstrap().then(sets => console.log(sets))
