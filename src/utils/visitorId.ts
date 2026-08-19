import { v4 as uuidv4 } from 'uuid';

export function getVisitorId(): string {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}
