import PackagesPagination from '../components/PackagesPagination/PackagesPagination.tsx';
import PackageList from '../components/PackageList/PackageList.tsx';
import Filters from '../components/Filters/Filters.tsx';
import PackagesHeader from '../components/PackagesHeader/PackagesHeader.tsx';
import PackageSlider from '../components/PackageSlider/PackageSlider.tsx';
import NoResult from '../components/NoResult/NoResult.tsx';
import usePackages from '../hooks/usePackages.ts';
import Loader from '../../../components/Loader/Loader.tsx';
import { useQueryParams } from '../../../hooks/useQueryParams.ts';
import BookAfterPaymentModal from '../components/BookAfterPaymentModal/BookAfterPaymentModal.tsx';

const Packages = () => {
  const { filteredPackages, loading } = usePackages();

  const { searchParams } = useQueryParams();

  const showPackageSlider = !(
    searchParams.search ||
    searchParams.cities ||
    (searchParams.page && searchParams.page !== '1')
  );

  return (
    <div>
      <BookAfterPaymentModal />
      <Loader loading={loading} />
      <PackagesHeader />
      <Filters />{' '}
      {filteredPackages.length ? (
        <>
          {showPackageSlider ? <PackageSlider /> : null}
          <PackageList />
          <PackagesPagination />
        </>
      ) : (
        <NoResult />
      )}
    </div>
  );
};

export default Packages;
