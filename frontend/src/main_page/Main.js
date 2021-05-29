import React from 'react';
import Navigation from './Navigation';
import MainPanel from './MainPanel';
import UserPanel from './UserPanel';
import Avatar from './Avatar';
import '../styles/Main.css';

const Main = props => {
	return (
		<div className="main-container">
			<aside>
				{<Avatar {...props} />}
				{<Navigation {...props} />}
			</aside>
			<main>
				{/* <section className="user-panel"> */}
				{<UserPanel {...props} />}
				{/* </section> */}
				<section className="main-panel">
					{<MainPanel {...props} />}
				</section>
			</main>
		</div>
	);
};

export default Main;
