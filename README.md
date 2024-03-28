# Sonnen battery optimizer   

## Seeder

Use environment to decide which firestore database to populate.

If you need to populate the firebase emulator use `export FIRESTORE_EMULATOR_HOST="localhost:8080"`. Remember to start the emulator before executing the builder. In the same console

An environment file must be provided:

```TypeScript
export const environment = {
  firebase: {
    // Firebase service account
  },
  files: [
    '../Sonnen2022.csv',
    '../Sonnen2023.csv'
  ]
};

```

`npx nx serve seeder`

# Project Firebase

## Use v20 for both running and exporting data

---

### Seems like this is not needed any more

Start by adding a `.runtimeconfig.json` to the `apps/cloud` folder

You can create it using `firebase functions:config:get > .runtimeconfig.json`

---

1. Start by running `npx nx run firebase:watch`
2. Run emulators
   use `firebase emulators:start --only=functions,firestore,auth,pubsub --config=firebase.json --export-on-exit=./saved-data --import=./saved-data --inspect-functions`
   Delete `export`, `import` and/or `--inspect-functions` if not wanted
3. If ports are already taken, run `npm run kill-ports` 
