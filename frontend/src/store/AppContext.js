import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { Redirect } from 'react-router-dom';

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	// const [token, setToken]=useState();
	const [cookies, setCookie, removeCookie] = useCookies();
	const [currentAccount, setCurrentAccount] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [modalContent, setModalContent] = useState({
		header: 'Błąd',
		content: 'Problem z działaniem aplikacji',
	});
	const history = useHistory();

	useEffect(() => {
		takeFromLocalStorage();
	});

	const isLogin = () => {
		return (
			cookies.token && cookies.token !== '' && cookies.token !== undefined
		);
	};
	const getToken = () => {
		return cookies.token;
	};
	const getCsrfToken = () => {
		return cookies.csrf_access_token;
	};

	const loginOnClickHandler = async (payload, setSubmitting) => {
		api.post('/api/v1/login', payload)
			.then(response => {
				setSubmitting(false);
				if (response.status === 200) {
					// localStorage.setItem('token', response.data.token);
					localStorage.setItem('user', response.data.username);
					setCookie('token', response.data.token);
					setUser(response.data.username);
					setCurrentAccount(response.data.account);
					console.log(response);
					history.push('/accounts');
					return true;

					// setIsAuthenticated(response.data.token !== null);
				} else {
					setModalContent({
						header: 'Błąd logowania',
						content:
							'Nieprawidłowe dane logowania. Sprawdź hasło oraz nazwę użytkownika',
					});
					setIsOpen(true);
					console.log('sdsdsada');
					return false;
				}
			})
			.catch(err => {
				//jeśli użytkownik istnieje, ale hasło jest złe to zwraca 403 Forbiden i trzeba to łapać w .catch'u
				setModalContent({
					header: 'Błąd logowania',
					content:
						'Nieprawidłowe dane logowania. Sprawdź hasło oraz nazwę użytkownika',
				});
				setIsOpen(true);
				console.log('sdsdsada');
			});
	};

	// if(!isLogin()){
	// 	<Redirect to="/"/>
	// }
	const signUpOnClickHandler = (payload, setSubmitting) => {
		api.post('/api/v1/registration', payload)
			.then(response => {
				setSubmitting(false);
				console.log(response);
				if (response.data.success) {
					setModalContent({
						header: 'Pomyślna rejestracja',
						content:
							'Udało Ci się zarejestrować. Przejdź do logowania.',
						type: true,
					});
					setIsOpen(true);
					return true;
				} else {
					setModalContent({
						header: 'Błąd rejestracji',
						content: 'Podana nazwa użytkownika jest już zajęta.',
					});
					setIsOpen(true);
					return false;
				}
			})
			.catch(err => {});
	};

	const logout = () => {
		// localStorage.removeItem("token");
		localStorage.removeItem('user');
		setUser(null);
		// setToken(null);
		removeCookie('token');
		// history.push('/');
		<Redirect to="/" />;
	};

	const takeFromLocalStorage = () => {
		// const token = localStorage.getItem("token");
		const user = localStorage.getItem('user');
		if (isLogin()) {
			setUser(user);
		}
	};

	const value = {
		user,
		signUpOnClickHandler,
		loginOnClickHandler,
		logout,
		isLogin,
		getToken,
		getCsrfToken,
		currentAccount,
		setCurrentAccount,
		isOpen,
		setIsOpen,
		modalContent,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
