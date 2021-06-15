import React from 'react';
import '../../styles/panel_amount/categoryCard.css';
import { Trash } from 'react-bootstrap-icons';

const TransactionCard = ({ name, id ,deleteFunc}) => {
	return (
		<div key={id} className="category-card-wrapper">
			<div className="category-card">
				<div className="category-name"> {name}</div>
				<div>{<Trash className="icons delete-icon" onClick={deleteFunc}/>}</div>
			</div>
		</div>
	);
};

export default TransactionCard;
