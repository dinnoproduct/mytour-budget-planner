import { type FC } from 'react';
import RCPagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import './index.scss';

interface IPagination {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onChange: (page: number) => void;
}

const Pagination: FC<IPagination> = ({ currentPage, totalItems, itemsPerPage, onChange }) => {
  const handlePageChange = (page: number) => {
    onChange(page);
  };

  return <RCPagination onChange={handlePageChange} current={currentPage} total={totalItems} pageSize={itemsPerPage} />;
};

export default Pagination;
