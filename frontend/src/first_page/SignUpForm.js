import React, { useState } from 'react';
import Input from '../components/Input';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import '../styles/SignUpForm.css';

const SignUpForm = () => {
	const signUpMetaData = [
		{
			name: 'username',
			type: 'text',
			placeholder: 'Nazwa użytkownika',
		},
		{
			name: 'password',
			type: 'password',
			placeholder: 'Hasło',
		},
		{
			name: 'confirmPassword',
			type: 'password',
			placeholder: 'Powtórz hasło',
		},
	];

	const signUpOnClickHandler = (payload, setSubmitting) => {
		axios
			.post('https://api:5000/api/v1/registration', payload)
			.then(response => {
				setSubmitting(false);
				console.log(response);
			})
			.catch(err => {});
	};

	return (
		<div className="signup-container">
			<Formik
				initialValues={{
					username: '',
					password: '',
					confirmPassword: '',
				}}
				validationSchema={Yup.object({
					username: Yup.string()
						.min(4, 'Musi być conajmniej 4 znaków')
						.max(30, 'Może być conajwyżej 30 znaków')
						.required('Pole wymagane'),
					password: Yup.string()
						.min(6, 'Musi być conajmniej 6 znaków')
						.max(30, 'Może być conajwyżej 30 znaków')
						.required('Pole wymagane'),
					confirmPassword: Yup.string()
						.oneOf(
							[Yup.ref('password'), null],
							'Hasła muszą być takie same',
						)
						.required('Pole wymagane'),
				})}
				onSubmit={(values, { setSubmitting }) =>
					signUpOnClickHandler(values, { setSubmitting })
				}
				validateOnBlur={false}>
				{formik => {
					return (
						<Form>
							{signUpMetaData.map(data => (
								<Input {...data} />
							))}
							<button
								class="login-button"
								type="submit"
								disabled={formik.isSubmitting}>
								Zarejestruj się
							</button>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};


export default SignUpForm;

