import React,{useContext} from 'react';
import Paginate from '../Paginate';
import CategoryCard from './CategoryCard';
import '../../styles/panel_amount/categoryList.css';
import {AppContext} from "../../store/AppContext"
import api from '../../utils/api'
const CategoryList = ({
	setModalData,
	setIsOpenModal,
	data,
	loading,
	amountOnPage,
	totalAmount,
	onclick,
	page,
	manageCategory,
	allCategory
}) => {
	const { getCsrfToken } = useContext(AppContext);

	let actual=null;
	if(data.length){
		actual = data.map(temp => {
			console.log(Object.values(temp._id)[0])
			return <CategoryCard key={temp.name} name={temp.name} deleteFunc={()=>{deleteCategory(Object.values(temp._id)[0])}}/>;
		});
	}else{
		actual = (<span>Dodaj swoje kategorie w zakładce <strong>Dodaj kategorie</strong></span>);
	}

	let updateCategory = null;
	const deleteCategory = id => {
		const payload = { category_id: id };
		api.post('/api/v1/categories/delete',payload, {
			headers: {
				'X-CSRF-TOKEN': `${getCsrfToken()}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (response.status === 200) {
					updateCategory=allCategory.filter(elem=>Object.values(elem._id)[0]!==id)
					manageCategory(updateCategory);
					setModalData({
						header:" Usunięto kategorie",
						content:`Kategoria została usunięta`,
						classes:"positive-info"
					})
					setIsOpenModal(true);
				}
			})
			.catch(err => {});
	};


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
