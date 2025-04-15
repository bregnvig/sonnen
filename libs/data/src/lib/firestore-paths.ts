export const documentPath = {
  averageConsumption: (id: string) => `${collectionPath.averageConsumption}/${id}`,
  user: (id: string) => `users/${id}`,
};

export const collectionPath = {
  averageConsumption: 'average-consumption',
  production: 'production',
  events: 'events',
  users: 'users',
};
