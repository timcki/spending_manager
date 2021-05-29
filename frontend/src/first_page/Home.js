import React from 'react';
import Start from './Start';
import About from './About';
import { Route, Switch,Redirect } from 'react-router-dom';
import PublicRoute from '../components/PublicRoute'
import NotFound from './NotFound';
const Home = props => {
	return (
		<div className="start-main">
			<div className="photo"></div>
			<div className="start-content">
				<Switch>
					<PublicRoute restricted={true} path="/about" component={About} props exact/>
					<PublicRoute restricted={true} path="/" component={Start} props exact/>
					<Route path="/404" component={NotFound} status={404} />
					<Redirect to="/404" />
				</Switch>
			</div>
		</div>
	);
};

export default Home;
