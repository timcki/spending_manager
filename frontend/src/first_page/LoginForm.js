import { React, useContext } from 'react';
import Input from '../components/Input';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import '../styles/LoginForm.css';

import {AppContext} from "../store/AppContext";


const LoginForm = props => {

	const {loginOnClickHandler,isLogin} = useContext(AppContext);


	const loginData = [
		{
			name: 'username',
			key: 'username',
			type: 'text',
			placeholder: 'Nazwa użytkownika',
		},
		{
			name: 'password',
			key: 'password',
			type: 'text',
			placeholder: 'Hasło',
		},
	];

	return (
		<>
			<div className="login-container">
				<Formik
					initialValues={{
						username: '',
						password: '',
					}}
					validationSchema={Yup.object({
						username: Yup.string()
							.min(4, 'Musi być conajmniej 4 znaki')
							.max(30, 'Może być conajwyżej 30 znaki')
							.required('Pole wymagane'),
						password: Yup.string()
							.min(6, 'Musi być conajmniej 6 znaki')
							.max(30, 'Może być conajwyżej 30 znaki')
							.required('Pole wymagane'),
					})}
					onSubmit={async (values, { setSubmitting }) =>{

						const result = await loginOnClickHandler(values, setSubmitting)					
					}
					}
					validateOnBlur={false}>
					{formik => {
						return (
							<Form>
								{loginData.map(data => (
									<Input {...data} />
								))}
								<button
									className="login-button"
									type="submit"
									disabled={formik.isSubmitting}>
									Zaloguj się
								</button>
							</Form>
						);
					}}
				</Formik>
			</div>
		</>
	);
};

export default LoginForm;
