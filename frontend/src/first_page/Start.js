import React, { useState, useContext } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import '../styles/Start.css';
import { NavLink } from 'react-router-dom';
import ModelComponent from '../components/ModelComponent'
import { AppContext } from '../store/AppContext';

const Start = props => {
	const { isOpen,setIsOpen,modalContent } = useContext(AppContext);
	const [isLogin, setIsLogin] = useState(true);

	const getIsLoginClass = isLogin => {
		return isLogin ? 'isLogin' : null;
	};
	return (
		<>
			<ModelComponent handleFunc={setIsOpen} modalIsOpen={isOpen} modalContent={modalContent}/>
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
				{isLogin ? <LoginForm {...props} /> : <SignUpForm {...props} />}
			</div>
			<div className="about-us">
				<p>Dowiedz się więcej o produkcie i jego twórcach</p>
				<button>
					<NavLink to={'/about'}>O nas</NavLink>
				</button>
			</div>
		</>
	);
};

export default Start;
