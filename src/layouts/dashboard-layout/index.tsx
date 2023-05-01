import { VerticalLayout } from 'layouts/vertical-layout';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { withAuthGuard } from '../../hocs/with-auth-guard';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = withAuthGuard((props) => {

  return (
    <VerticalLayout
      {...props}
    />
  );
});

Layout.propTypes = {
  children: PropTypes.node
};
