import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './providers'

import Routes from './Routes.tsx'
import '../App.css'
import Toaster from '../components/Toaster/Toaster.tsx'

function App() {
	return (
		<GoogleOAuthProvider clientId="174037716864-g19hqju9dqo4oked1ecb9cg1antitca5.apps.googleusercontent.com">
			<RecoilRoot>
				<ThemeProvider>
					<BrowserRouter>
						<Routes/>
						<Toaster/>
					</BrowserRouter>
				</ThemeProvider>
			</RecoilRoot>
		</GoogleOAuthProvider>
	)
}

export default App
