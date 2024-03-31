import {
  initializeApp,
  getApp,
  cert,
  ServiceAccount,
} from 'firebase-admin/app';
import { environment } from './environments/environment';
import {
  readMeasurements,
  readStatistics,
  writeMeasurements,
  writeStatistics,
} from './sonnen';
import { writeHistoricalWeather, readHistoricalWeather } from './weather';

initializeApp({
  credential: cert(environment.firebase as ServiceAccount),
});
console.log(environment.firebase.project_id);
console.log(getApp().name);

const bootstrap = async () => {
  const sets = Promise.all(
    environment.points.map(async (filename) => await readMeasurements(filename))
  )
    .then((sets) => sets.flat())
    .then((sets) => writeMeasurements(sets));
  const weather = readHistoricalWeather(environment.historicalWeather).then(
    (weather) => writeHistoricalWeather(weather)
  );
  const statistics = Promise.all(
    environment.statistics.map((filename) => readStatistics(filename))
  )
    .then((measurements) => measurements.flat())
    .then((measurements) => writeStatistics(measurements));
  return Promise.all([sets, weather, statistics]);
};

bootstrap().then(([measurements, weather, statistics]) =>
  console.log({
    measurements,
    weather,
    statistics,
  })
);
