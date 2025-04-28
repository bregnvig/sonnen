export interface Command {
  name: string;
  description: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  payload: any;
}
