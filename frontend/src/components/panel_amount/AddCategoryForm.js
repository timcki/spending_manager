import React, { useContext, useState } from 'react';
import InputNormal from '../InputNormal';

import api from '../../utils/api';
import { AppContext } from '../../store/AppContext';
import '../../styles/panel_amount/addCategoryForm.css';

const dataCategory = {
	categoryName: {
		name: 'categoryName',
		label: 'Nazwa kategorii',
		type: 'text',
		placeholder:'Wpisz swoją kategorię'
	},
};
const messages = {
	categoryName: 'Nazwa musi mieć od 4 do 100 znaków',
};

const AddCategoryForm = ({
	setModalData,
	setIsOpenModal
	}) => {
	const { getCsrfToken } = useContext(AppContext);

	const [categoryName, setCategoryName] = useState('');

	const [errors, setErrors] = useState({
		category: false,
	});

	const validationFun = () => {
		let correct = true;
		let errCategoryName = false;

		if (categoryName.length < 4 || categoryName.length > 100) {
			errCategoryName = true;
		}
		if (errCategoryName) {
			correct = false;
		}
		return {
			correct,
			categoryName: errCategoryName,
		};
	};

	const handleCategoryName = e => {
		setCategoryName(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		let { correct, ...valid } = validationFun();

		if (correct) {
			const payload = {
				name: categoryName.toLowerCase(),
			};
			console.log(payload);
			api.post('/api/v1/categories/create', payload, {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => {
					console.log(response)
					if (response.status === 200) {
						setModalData({
							header:"Dodano kategorie",
							content:`Nazwa dodanej kategorii to ${categoryName.toLowerCase()}`,
							classes:"positive-info"
						})
						setIsOpenModal(true);
					}
				})
				.catch(err => {
					setModalData({
						header:"Nie dodano kategorii",
						content:`Upewnij się czy kategoria ${categoryName.toLowerCase()} nie istnieje`,
						classes:"negative-info"
					})
					setIsOpenModal(true);
				});

			setCategoryName('');

			setErrors({
				categoryName: false,
			});
		} else {
			setErrors({
				...valid,
			});
		}
	};

	return (
		<div className="form-add-category">
			<h1>Dodaj własną kategorię:</h1>
			<form onSubmit={handleSubmit} noValidate>
				<div className="name-category">
					<InputNormal
						value={categoryName}
						onchange={handleCategoryName}
						{...dataCategory.categoryName}
					/>
					{errors.categoryName && (
						<div className="error-add-category">
							{messages.categoryName}
						</div>
					)}
				</div>

				<div className="save-add-category">
					<button>Zapisz</button>
				</div>
			</form>
		</div>
	);
};

export default AddCategoryForm;
