import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Routes from './Routes.tsx';
import '../App.css';
import Toaster from '../components/Toaster/Toaster.tsx';

function App() {
  return (
    <GoogleOAuthProvider clientId="174037716864-g19hqju9dqo4oked1ecb9cg1antitca5.apps.googleusercontent.com">
      <RecoilRoot>
        <BrowserRouter>
          <Routes />
          <Toaster />
        </BrowserRouter>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}

export default App;
