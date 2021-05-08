import React from 'react';
import Start from './Start';
import { BrowserRouter as Router } from 'react-router-dom';
const Home = () => {
	return (
		<Router>
			<div className="start-main">
				<div className="photo"></div>
				<div className="start-content">
					<Start />
				</div>
			</div>
		</Router>
	);
};

export default Home;
