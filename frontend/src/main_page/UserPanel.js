import React, { useContext, useEffect, useState } from 'react';
import '../styles/UserPanel.css';
import { AppContext } from '../store/AppContext';
import api from '../utils/api';

import axios from 'axios';

const UserPanel = props => {
	const { currentAccount, getCsrfToken, getToken, setCurrentAccount } = useContext(AppContext);

	/* 	useEffect(() => {
		console.log('rerender');
	}); */

	return (
		<div className="user-panel">
			{console.log(currentAccount)}
			{currentAccount ? (
				<div>
					<p>Wybrane Konto: {currentAccount.name}</p>
					<p>Stan Konta: {currentAccount.balance} PLN</p>
				</div>
			) : (
				<div>Brak Konta</div>
			)}
		</div>
	);
};

export default UserPanel;
