import { FC, PropsWithChildren } from 'react';
import classnames from 'classnames';

interface ILinkProps {
  children: any;
  filter: string;
  visibilityFilter: string;
  setVisibilityFilter: (arg0: string) => void;
}

const Link: FC<ILinkProps> = (props: PropsWithChildren<ILinkProps>) => {
  return (
    <a
      href="/#"
      className={classnames({
        selected: props.filter === props.visibilityFilter,
      })}
      style={{ cursor: 'pointer' }}
      onClick={() => props.setVisibilityFilter(props.filter)}
    >
      {props.children}
    </a>
  );
};

export default Link;
