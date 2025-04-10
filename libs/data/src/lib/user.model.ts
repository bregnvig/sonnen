export type Role = 'admin' | 'anonymous';

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  roles?: Role[];
  tokens?: string[];
}
