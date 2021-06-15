import React from 'react';
import '../../styles/panel_amount/accountCard.css';
import { Check } from 'react-bootstrap-icons';

const AccountCard = ({ name, id, balance, clicked, isDefault }) => {
	let iconClassnames = ['icons', 'check-icon'];
	if (isDefault === true) {
		iconClassnames.push('default');
	}
	return (
		<div key={id} className="account-card-wrapper">
			<div className="account-card">
				<div className="account-name">
					{' '}
					{name}: {balance}PLN{' '}
				</div>
				<div>
					{
						<Check
							onClick={clicked}
							className={iconClassnames.join(' ')}
						/>
					}
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
