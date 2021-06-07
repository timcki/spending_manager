import React, { useContext, useState } from 'react';
import InputNormal from '../InputNormal';

import api from '../../utils/api';
import { AppContext } from '../../store/AppContext';

const dataCategory = {
	categoryName: {
		name: 'categoryName',
		label: 'Nazwa Kategori',
		type: 'text',
	},
};
const messages = {
	categoryName: 'Nazwa musi mieć od 4 do 100 znaków',
};

const AddCategoryForm = () => {
	const { user, getToken, getCsrfToken } = useContext(AppContext);

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
				// username:user,
				name: categoryName,
			};
			console.log(payload);
			api.post('/api/v1/categories/create', payload, {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => {
					console.log(response);
					if (response.data.status === 200) {
						console.log(response);
					}
				})
				.catch(err => {});

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
