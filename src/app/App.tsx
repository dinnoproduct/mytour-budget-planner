import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider, QueryProvider, ThemeProvider } from './providers'

import Routes from './Routes.tsx'
import '../App.css'
import Toaster from '../components/Toaster/Toaster.tsx'
import { UserProvider } from '@entities/user'
import { RouteTracker } from './RouteTracker'

function App() {
  return (
    // <GoogleOAuthProvider clientId="174037716864-g19hqju9dqo4oked1ecb9cg1antitca5.apps.googleusercontent.com">
    <RecoilRoot>
      <QueryProvider>
        <UserProvider>
          <ThemeProvider>
            <ModalProvider>
              <BrowserRouter>
                <RouteTracker />
                <Routes />
                <Toaster />
              </BrowserRouter>
            </ModalProvider>
          </ThemeProvider>
        </UserProvider>
      </QueryProvider>
    </RecoilRoot>
    // </GoogleOAuthProvider>
  )
}

export default App
