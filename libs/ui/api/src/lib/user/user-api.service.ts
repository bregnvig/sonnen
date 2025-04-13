import { Injectable, isDevMode } from '@angular/core';
import { doc, docData, DocumentReference, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { documentPath, User } from '@sonnen/data';
import { truthy } from '@sonnen/utils';
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut, UserInfo } from 'firebase/auth';
import { arrayUnion } from 'firebase/firestore';
import { firstValueFrom, merge, Observable, ReplaySubject } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { converter } from '../converter';
import { FCMService } from './fcm.service';


@Injectable({
  providedIn: 'root',
})
export class UserApiService {

  readonly user$: Observable<User | undefined>;
  private currentUser$ = new ReplaySubject<UserInfo | null>(1);
  private auth = getAuth();

  constructor(private afs: Firestore, fcm: FCMService) {
    this.user$ = merge(
      this.currentUser$.pipe(
        truthy(),
        switchMap(user => docData(doc(this.afs, `${documentPath.user(user.uid)}`).withConverter(converter.timestamp<User>()))),
      ),
      this.currentUser$.pipe(
        filter(user => !user?.uid),
        map(() => undefined),
      ),
    );
    getRedirectResult(this.auth)
      .then(result => {
        if (result && result.user) {
          this.updateBaseInformation(result.user).then(() => console.log('Base information updated'));
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        onAuthStateChanged(this.auth, async firestoreUser => {
          this.currentUser$.next(firestoreUser ? ({...firestoreUser}) : null);
          if (firestoreUser) {
            await this.updateBaseInformation(firestoreUser).then(() => isDevMode() && console.log('Base information updated'));
            await fcm.setupMessaging().then(
              async token => {
                const user = await firstValueFrom(this.user$);
                if (token && user && !user.tokens?.includes(token)) {
                  await firstValueFrom(this.updatePlayer({tokens: [token]})).then(
                    () => console.log('Token added', token),
                  );
                }
              },
              error => Notification.permission !== 'denied' && console.error('Unable to setup messaging', error),
            );
          }
          isDevMode() && console.log(firestoreUser);
        });
      });
  }


  signInWithGoogle(): Promise<void> {
    return signInWithRedirect(this.auth, new GoogleAuthProvider()).then(
      _ => console.log('Signed in using google'),
      error => console.error('Unable to sign in', error),
    );
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }

  updatePlayer(partialUser: Partial<User>): Observable<Partial<User>> {
    let payload: any = partialUser;
    if (partialUser.tokens) {
      payload = {
        ...partialUser,
        tokens: arrayUnion(...partialUser.tokens),
      };
    }
    return this.user$.pipe(
      truthy(),
      switchMap(user => updateDoc(doc(this.afs, documentPath.user(user.uid)), payload).then(() => user)),
      switchMap(user => docData(doc(this.afs, documentPath.user(user.uid)) as DocumentReference<User>)),
      truthy(),
      first(),
    );
  }

  private async updateBaseInformation(user: UserInfo): Promise<void> {
    const _player = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    } as User;
    const docRef = doc(this.afs, documentPath.user(user.uid)).withConverter(converter.timestamp<User>());
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? updateDoc(docRef, {..._player}) : setDoc(docRef, _player);
  }
}
