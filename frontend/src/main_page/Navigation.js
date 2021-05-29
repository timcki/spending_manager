import {React,useContext} from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';
import {AppContext} from "../store/AppContext";

const panels = [
	{ name: 'transakcje', path: '/transactions' },
	{ name: 'twoje konta', path: '/accounts' },
	{ name: 'statystyki', path: '/statistics' },
	{ name: 'historia', path: '/history' },
	{ name: 'ustawienia', path: '/settings' },
];

const Navigation = () => {

	const {logout} = useContext(AppContext);

	const navigation = panels.map(panel => (
		<li key={panel.name}>
			<NavLink to={panel.path}>{panel.name}</NavLink>
		</li>
	));
	navigation.push(
		<li key={'logout'}>
			<button className="logout" onClick={logout}>Wyloguj</button>
		</li>
	);
	return (
		<nav>
			<ul>{navigation}</ul>
		</nav>
	);
};

export default Navigation;
