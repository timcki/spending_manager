import React from 'react';
import { Link } from 'react-router-dom';
import Paginate from '../Paginate';
import CategoryCard from './CategoryCard';
import '../../styles/panel_amount/categoryList.css';

const CategoryList = ({
	data,
	loading,
	amountOnPage,
	totalAmount,
	onclick,
	page,
}) => {
	console.log(data);
	const actual = data.map(temp => {
		return <CategoryCard key={temp.name} name={temp.name} />;
	});
	return (
		<>
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

export default CategoryList;
