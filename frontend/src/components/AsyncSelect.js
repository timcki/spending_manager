import React, { useContext } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { AppContext } from './../store/AppContext';
import api from './../utils/api';

// const options = [
	// 	{ value: 'Zakupy', label: 'zakupy' },
	// 	{ value: 'Transport', label: 'transport' },
	// 	{ value: 'Rachunki', label: 'rachunki' },
	// ];
	
	const AsyncSelect = props => {

		const { value, onchange, name, label, placeholder } = props;
		const { getCsrfToken,currentAccount } = useContext(AppContext);

		async function loadOptions(search, loadedOptions, { page }) {
		if (props.type === 'categories') {
			const res = await api.get('/api/v1/categories/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			//tablica z kategoriami ale nie wiem co zrobić, żeby ją wyświetlic jako opcje w select'ie
			const categoriesNames = res.data.map(el => ({
				value: el.name,
				label: el.name,
			}));
			console.log(categoriesNames);

			// const hasMore = categoriesNames.length > loadedOptions.length;
			// const slicedOptions = categoriesNames.slice(
			// 	loadedOptions.length - 3,
			// 	loadedOptions.length,
			// );
			const hasMore = false;
			const slicedOptions = categoriesNames;
			return {
				options: slicedOptions,
				hasMore: hasMore,
				additional: {
					page: page + 1,
				},
			};
		} else if (props.type === 'accounts') {
			const res = await api.get('/api/v1/accounts/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			const accountNames = res.data.map(el => ({
				label: el.name,
				value: Object.values(el._id)[0],
			}));
				
			const newAccountNames=accountNames.filter(el=>el.label!==currentAccount.name)

			// const hasMore = accountNames.length > loadedOptions.length;
			// const slicedOptions = accountNames.slice(
			// 	loadedOptions.length,
			// 	loadedOptions.length+1,
			// );
			const hasMore = false;
			const slicedOptions = newAccountNames;
			return {
				options: slicedOptions,
				hasMore: hasMore,
				additional: {
					page: page + 1,
				},
			};
		}
	}


	return (
		<>
			<label htmlFor={name}>{label}</label>
			<AsyncPaginate
				name={name}
				placeholder={placeholder}
				// defaultOptions={options}
				// options={options}
				loadOptions={loadOptions}
				value={value}
				onChange={onchange}
				additional={{
					page: 1,
				}}
			/>
		</>
	);
};

export default AsyncSelect;
