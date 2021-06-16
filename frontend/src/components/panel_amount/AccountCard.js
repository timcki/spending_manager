import React,{useContext} from 'react';
import '../../styles/panel_amount/accountCard.css';
import { Check, Trash } from 'react-bootstrap-icons';
import { AppContext } from '../../store/AppContext';

const AccountCard = ({ name, id, balance, clicked, isDefault, deleteFunc}) => {
	const { currentAccount} = useContext(AppContext);
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
				{console.log("marekds sadkdsakda")}
				{console.log(Object.values(currentAccount._id)[0])}
				{console.log(id)}
			
				{Object.values(currentAccount._id)[0]!==id && <div>{<Trash className="icons delete-icon" onClick={deleteFunc}/>}</div>}
			</div>
		</div>
	);
};

export default AccountCard;
