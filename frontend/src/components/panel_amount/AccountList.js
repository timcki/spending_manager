import React, { useContext } from 'react';
import Paginate from '../Paginate';
import AccountCard from './AccountCard';
import '../../styles/panel_amount/accountList.css';
import { AppContext } from './../../store/AppContext';
import api from './../../utils/api';

const AccountList = ({
	data,
	loading,
	amountOnPage,
	totalAmount,
	onclick,
	page,
}) => {
	const { currentAccount, getCsrfToken, setCurrentAccount } =
		useContext(AppContext);

	const onAccountSelectHandler = account => {
		const oid = Object.values(account._id)[0];

		const payload = {
			account_id: oid,
		};
		api.post('/api/v1/main_account/post', payload, {
			headers: {
				'X-CSRF-TOKEN': `${getCsrfToken()}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				console.log(response);
				if (response.status === 200) {
					setCurrentAccount(response.data);
				}
			})
			.catch(err => {});
	};

	const actual = data.map(temp => {
		let isDefault = false;
		if (currentAccount) {
			isDefault =
				Object.values(temp._id)[0] ===
				Object.values(currentAccount._id)[0]
					? true
					: false;
		}
		return (
			<AccountCard
				clicked={() => onAccountSelectHandler(temp)}
				isDefault={isDefault}
				key={temp.name}
				name={temp.name}
				balance={temp.balance}
			/>
		);
	});
	return (
		<>
			{!actual.length&&<div>(<span>Dodaj swoje konta w zakładce <strong>Dodaj konto</strong></span>)</div>}
			{loading ? (
				<h3>Loading...</h3>
			) : (
				<div className="category-list">
					<div className="category-content">{actual}</div>
					<div className="category-pagination">
						<Paginate
							amountOnPage={amountOnPage}
							totalAmount={totalAmount}
							onclick={onclick}
							page={page}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default AccountList;
