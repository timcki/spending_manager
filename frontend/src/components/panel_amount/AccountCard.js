import React,{useContext} from 'react';
import '../../styles/panel_amount/accountCard.css';
import { Check, Trash } from 'react-bootstrap-icons';
import { AppContext } from '../../store/AppContext';

const AccountCard = ({ name, id, balance, clicked, isDefault,deleteFunc}) => {
	const { currentAccount} =useContext(AppContext);
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
				{console.log("marekds sadkdsakda")}
				{console.log(Object.values(currentAccount._id)[0])}
				{console.log(id)}
			
				{Object.values(currentAccount._id)[0]!==id && <div>{<Trash className="icons delete-icon" onClick={deleteFunc}/>}</div>}
			</div>
		</div>
	);
};

export default AccountCard;
