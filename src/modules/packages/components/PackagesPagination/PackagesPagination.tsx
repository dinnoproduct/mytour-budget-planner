import Pagination from '../../../../components/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filteredPackagesAtom, packagesCurrentPageAtom, screenBreakpointAtom } from '../../store/store';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { useEffect } from 'react';

const PackagesPagination = () => {
  const [currentPage, setCurrentPage] = useRecoilState(packagesCurrentPageAtom);
  const filteredPackages = useRecoilValue(filteredPackagesAtom);

  const { searchParams, setSearchParams } = useQueryParams();

  const screenBreakpoint = useRecoilValue(screenBreakpointAtom);

  const onPageChange = (page: number) => {
    setSearchParams({ ...searchParams, page: page.toString() });
  };

  useEffect(() => {
    setCurrentPage(+searchParams.page! || 1);
  }, [searchParams.page]);

  if (!filteredPackages.length) {
    return null;
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalItems={filteredPackages.length}
      itemsPerPage={screenBreakpoint === 'large' ? 9 : 8}
      onChange={onPageChange}
    />
  );
};

export default PackagesPagination;
