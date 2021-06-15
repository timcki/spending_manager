import React, { useContext } from 'react';
import '../styles/UserPanel.css';
import { AppContext } from '../store/AppContext';

const UserPanel = props => {
	const { currentAccount } = useContext(AppContext);


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
