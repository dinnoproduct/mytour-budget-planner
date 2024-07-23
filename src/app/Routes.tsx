import { Outlet, Route, Routes as BaseRoutes } from 'react-router-dom';
import PackagesRoutes from '../modules/packages/routes/PackagesRoutes.tsx';
import Footer from '../components/Footer/Footer.tsx';
import useBreakpoint from '../hooks/useBreakpoint.ts';

const Routes = () => {
  useBreakpoint();

  return (
    <BaseRoutes>
      <Route
        element={
          <>
            <Outlet />
            <Footer />
          </>
        }
      >
        <Route path="/*" element={<PackagesRoutes />} />
      </Route>
    </BaseRoutes>
  );
};

export default Routes;
