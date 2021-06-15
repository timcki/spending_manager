import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AppContext } from '../../store/AppContext';
import AccountList from './AccountList';

const MyAccounts = () => {
	const [accounts, setAccounts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { getCsrfToken } = useContext(AppContext);

	const [amountOnPage, setAmountOnPage] = useState(10);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchAccounts = async () => {
			setLoading(true);
			api.get('/api/v1/accounts/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			})
				.then(res => {
					setAccounts(res.data);
					console.log(res.data);
				})
				.catch();

			setLoading(false);
		};

		fetchAccounts();
	}, []);

	const lastAccount = page * amountOnPage;
	const firstAccount = lastAccount - amountOnPage;
	const actualAccount = accounts.slice(firstAccount, lastAccount);

	const handleClickChangePage = number => {
		setPage(number);
	};

	return (
		<>
			<AccountList
				data={actualAccount}
				loading={loading}
				amountOnPage={amountOnPage}
				totalAmount={accounts.length}
				onclick={handleClickChangePage}
				page={page}
			/>
		</>
	);
};

export default MyAccounts;
