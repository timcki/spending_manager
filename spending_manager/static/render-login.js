class Account_Login extends React.Component {
  render() {
    return (
        <div style={appStyle}>
            <LoginForm/>
        </div>
        );
  }
}
ReactDOM.render(<Account_Login/>, document.getElementById("root"));