import { React} from 'react';
import AppProvider from "./store/AppContext";
import Routes from "./components/Routes";
import { CookiesProvider } from 'react-cookie';

const App = props => {
	return( 
		<CookiesProvider>
			<AppProvider>
				<div className="App">			
					<Routes/>
				</div>
			</AppProvider>
		</CookiesProvider>
	);
};

export default App;
