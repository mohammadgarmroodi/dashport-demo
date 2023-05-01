import type { FC } from 'react';
import { AuthGuard } from '../guards/auth-guard';

// eslint-disable-next-line react/display-name
export const withAuthGuard = <P extends object>(Component: FC<P>): FC<P> => (props: P) => (
  <AuthGuard>
    <Component {...props} />
  </AuthGuard>
);
