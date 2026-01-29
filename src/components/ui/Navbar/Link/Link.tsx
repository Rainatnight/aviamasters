import type { AnchorHTMLAttributes, FC } from 'react';

import Icon from '@/ui/Icon/Icon.tsx';

import cn from 'classnames';
import { Link as RouterLink, useMatch } from 'react-router';

import styles from './Link.module.scss';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: string;
  to: string;
}

const Link: FC<LinkProps> = ({ className, icon, to, ...props }) => {
  const match = useMatch(to);

  return (
    <RouterLink className={cn(styles.link, to !== '' && match && styles.active, className)} to={to} {...props}>
      <Icon className={styles.icon} name={icon} width={20} height={20} />
    </RouterLink>
  );
};

export default Link;
