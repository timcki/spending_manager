class Account_Register extends React.Component {
  render() {
    return (
        <div >
            <input type="text" id="login" placeholder="Proszę podać login"></input>
            <input type="password"  id="password" placeholder="Proszę podać hasło"></input>
            <input type="password"  id="password-check" placeholder="Proszę ponownie podać hasło"></input>
            <button type="button"  onclick="Register(); return false;">Zarejestruj się</button>
        </div>
        );
  }
}
ReactDOM.render(<Account_Register/>, document.getElementById("register"));