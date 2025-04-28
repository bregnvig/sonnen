import { documentPath, Role, User } from '@sonnen/data';
import { getFirestore } from 'firebase-admin/firestore';
import { converter } from '../../pi/src/app/firebase';
import { logAndCreateError } from './firestore-utils';

const getUser = async (uid: string): Promise<User | undefined> => {
  return getFirestore().doc(documentPath.user(uid)).withConverter(converter).get().then(ref => ref.data());
};


export const validateAccess = async (uid: string | undefined, ...role: Role[]): Promise<PlayerImpl> => {
  if (uid) {
    const player: User | undefined = await getUser(uid);

    if (!player) {
      throw logAndCreateError('not-found', `${uid} tried to login. No user with specified uid exists`);
    }

    if (!player.isInRole(...role)) {
      throw logAndCreateError('permission-denied', `${player.displayName} does not have sufficient permissions. Role '${role.join(',')}' required. Has ${player.roles.join(', ')} `);
    }
    return player;
  }
  throw logAndCreateError('unauthenticated', `No user was apparently logged in`);
};

export const userService = {};
