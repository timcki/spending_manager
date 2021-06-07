import React, { useState, useContext, useEffect } from 'react';
import Navigation from './Navigation';
import MainPanel from './MainPanel';
import UserPanel from './UserPanel';
import Avatar from './Avatar';
import '../styles/Main.css';

import { AppContext } from './../store/AppContext';
import api from './../utils/api';

const Main = props => {
	const { currentAccount, getCsrfToken, getToken, setCurrentAccount } =
		useContext(AppContext);
	const [accountData, setAccountData] = useState(null);

	useEffect(() => {
		const getAccountData = async () => {
			const res = await api.get('/api/v1/main_account/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			setCurrentAccount(res.data);
			setAccountData(res.data);
			console.log(accountData);
		};
		getAccountData();
	}, []);

	return (
		<div className="main-container">
			<aside>
				{<Avatar {...props} />}
				{<Navigation {...props} />}
			</aside>
			<main>
				{/* <section className="user-panel"> */}
				{<UserPanel {...props} accountData={accountData} />}
				{/* </section> */}
				<section className="main-panel">
					{<MainPanel {...props} />}
				</section>
			</main>
		</div>
	);
};

export default Main;
