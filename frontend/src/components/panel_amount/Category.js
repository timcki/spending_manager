import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AppContext } from '../../store/AppContext';
import CategoryList from './CategoryList';

const Category = () => {
	const [category, setCategory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [amountOnPage, setAmountOnPage] = useState(10);
	const { getCsrfToken } = useContext(AppContext);

	useEffect(() => {
		const fetchCategory = async () => {
			setLoading(true);
			const res = await api.get('/api/v1/categories/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			setCategory(res.data);
			console.log(res.data);
			setLoading(false);
		};

		fetchCategory();
	}, []);

	const lastCategory = page * amountOnPage;
	const firstCategory = lastCategory - amountOnPage;
	const actualCategory = category.slice(firstCategory, lastCategory);

	const handleClickChangePage = number => {
		setPage(number);
	};

	return (
		<>
			<CategoryList
				data={actualCategory}
				loading={loading}
				amountOnPage={amountOnPage}
				totalAmount={category.length}
				onclick={handleClickChangePage}
				page={page}
			/>
			{/* <TransactionsList transactions={actualTransactions} loading={loading}/>
        <Paginate amountOnPage={amountOnPage} totalAmount={transactions.length}/> */}
		</>
	);
};

export default Category;
