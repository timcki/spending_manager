class Account_Login extends React.Component {
  render() {
    return (
        <div >
            <input type="text" id="login" placeholder="Proszę podać login"></input>
            <input type="password"  id="password" placeholder="Proszę podać hasło"></input>
            <button type="button"  onclick="Login(); return false;">Zaloguj się</button>
        </div>
        );
  }
}
ReactDOM.render(<Account_Login/>, document.getElementById("login"));