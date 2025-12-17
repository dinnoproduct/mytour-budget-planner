import { type FC } from 'react';
import './index.scss';
import classnames from 'classnames';

interface PreviewDetailProps {
  name: string;
  value: string;
  last?: boolean;
}

const PreviewDetail: FC<PreviewDetailProps> = ({ name, value, last }) => (
  <div className={classnames('detail-info flex space-between', { ['border-bottom']: !last })}>
    <div className="detail-name">{name}</div>
    <div className="detail-value">{value}</div>
  </div>
);

export default PreviewDetail;
