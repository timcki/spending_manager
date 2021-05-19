import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import '../styles/Start.css';

const Start = () => {
	const [isLogin, setIsLogin] = useState(true);

	const getIsLoginClass = isLogin => {
		return isLogin ? 'isLogin' : null;
	};
	return (
		<>
			<h2>Trzymaj finanse pod kontrolą</h2>
			<p>
				Menażdzer wydatków, który pomoże nadzorować twoje aktualne
				wydatki i zarządzać twoimi płatnościami, by pomóc Ci oszczędzać
				pieniądze.
			</p>
			<div className="start-options">
				<button
					className={`options ${getIsLoginClass(!isLogin)}`}
					onClick={() => (!isLogin ? setIsLogin(true) : null)}>
					Logowanie
				</button>
				<button
					className={`options ${getIsLoginClass(isLogin)}`}
					onClick={() => (isLogin ? setIsLogin(false) : null)}>
					Rejestracja
				</button>
			</div>
			<div className="login">
				{isLogin ? <LoginForm /> : <SignUpForm />}
			</div>
			<div className="about-us">
				<p>Dowiedz się więcej o produkcie i jego twórcach</p>
				<button>O nas</button>
			</div>
		</>
	);
};

export default Start;
