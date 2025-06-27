import { getSession } from '@/lib/session';
import { HeaderUI } from './HeaderUI';

export async function Header() {
  const session = await getSession();
  return <HeaderUI session={session} />;
}
