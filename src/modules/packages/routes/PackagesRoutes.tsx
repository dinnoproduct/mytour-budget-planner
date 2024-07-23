import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Packages from '../containers/Packages.tsx';
import { AppPaths } from '../../../constants/constants.ts';
import PackageDetails from '../containers/PackageDetails.tsx';
import { useEffect } from 'react';

const PackagesRoutes = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route index element={<Navigate to={AppPaths.packages} />} />
      <Route path={AppPaths.packages}>
        <Route index element={<Packages />} />
        <Route path=":id" element={<PackageDetails />} />
      </Route>
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  );
};

export default PackagesRoutes;
