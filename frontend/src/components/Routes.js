import { React } from 'react';
import { Switch, Route,Redirect } from 'react-router-dom';
import Home from '../first_page/Home';
import Main from '../main_page/Main';
import NotFound from '../first_page/NotFound';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Routes = props => {

	let routes = (
		<Switch>
			<PrivateRoute path="/transactions"  component={Main} props/>
			<PrivateRoute path="/accounts"  component={Main} props/>
			<PrivateRoute path="/statistics"  component={Main} props/>
			<PrivateRoute path="/history"  component={Main} props/>
			<PrivateRoute path="/settings"  component={Main} props/>
			<PublicRoute restricted={true} path="/about"  component={Home} props exact/>
			<PublicRoute restricted={true} path="/" component={Home} props exact/>
			<Route path="/404" component={NotFound} status={404} />
			<Redirect to="/404" />
		</Switch>
	);

	return(
        <>
			{routes}
		</>
	);
};

export default Routes;
