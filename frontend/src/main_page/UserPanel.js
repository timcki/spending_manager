import React, { useContext } from 'react';
import '../styles/UserPanel.css';
import { AppContext } from '../store/AppContext';

const UserPanel = props => {
	const { currentAccount } = useContext(AppContext);

	return (
		<div className="user-panel">
			{console.log(currentAccount)}
			{currentAccount ? (
				<div className="current-account-data-container">
					<div className="current-account-name-wrapper">
						<p className="current-account-name-label">
							Korzystasz z konta
						</p>
						<p className="current-account-name-value">
							{currentAccount.name}
						</p>
					</div>

					<div className="current-account-balance-wrapper">
						<p className="current-account-balance-label">
							Bieżący stan konta
						</p>
						<p className="current-account-balance-value">
							{currentAccount.balance} PLN
						</p>
					</div>
				</div>
			) : (
				<div className="no-account-notification">
					Dodaj Swoje pierwsze konto a następnie wybierz je jako
					aktualne w panelu Twoje konta
				</div>
			)}
		</div>
	);
};

export default UserPanel;
