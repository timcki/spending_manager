import React from 'react';
import '../../styles/panel_amount/accountCard.css';
import { Check } from 'react-bootstrap-icons';

const AccountCard = ({ name, id, balance, clicked, isDefault }) => {
	let iconClassNames = ['icons', 'check-icon'];
	let cardClassNames = ['account-card'];
	if (isDefault === true) {
		iconClassNames.push('default');
		cardClassNames.push('default');
	}
	return (
		<div key={id} className="account-card-wrapper">
			<div className={cardClassNames.join(' ')}>
				<div className="account-name">
					<div className="account-name-value">{name}</div>
					<div className="account-name-balance">{balance}PLN </div>
				</div>
				<div>
					{
						<Check
							onClick={clicked}
							className={iconClassNames.join(' ')}
						/>
					}
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
