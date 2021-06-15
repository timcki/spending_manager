import { React} from 'react';
import AppProvider from "./store/AppContext";
import Routes from "./components/Routes";

const App = props => {
	return( 
		<AppProvider>
			<div className="App">			
				<Routes/>
			</div>
		</AppProvider>
	);
};

export default App;
