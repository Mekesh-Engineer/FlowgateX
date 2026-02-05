

import { Outlet } from 'react-router-dom';
import { MainLayout } from './Mainlayout';

// Re-export MainLayout variants for convenience
export { MainLayout, PublicLayout, AuthLayout, MinimalLayout } from './Mainlayout';

function Layout() {
  return (
    <MainLayout 
      showNavbar={true}
      showFooter={true}
      enableTransitions={true}
      scrollToTop={true}
    >
      <Outlet />
    </MainLayout>
  );
}

export default Layout;
