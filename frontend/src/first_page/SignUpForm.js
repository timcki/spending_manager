import React, {useContext} from 'react';
import Input from '../components/Input';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import '../styles/SignUpForm.css';

import {AppContext} from "../store/AppContext";


const SignUpForm = () => {
	
	const {signUpOnClickHandler} = useContext(AppContext);
	
	const signUpMetaData = [
		{
			name: 'username',
			key: 'username',
			type: 'text',
			placeholder: 'Nazwa użytkownika',
		},
		{
			name: 'password',
			key: 'password',
			type: 'password',
			placeholder: 'Hasło',
		},
		{
			name: 'confirmPassword',
			key: 'confirmPassword',
			type: 'password',
			placeholder: 'Powtórz hasło',
		},
	];

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
					signUpOnClickHandler(values, setSubmitting)
				}
				validateOnBlur={false}>
				{formik => {
					return (
						<Form>
							{signUpMetaData.map(data => (
								<Input {...data} />
							))}
							<button
								className="login-button"
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
