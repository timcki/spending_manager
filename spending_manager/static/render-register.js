class Account_Register extends React.Component {
  render() {
    return (
        <div style={appStyle}>
            <RegisterForm/>
        </div>
        );
  }
}

ReactDOM.render(<Account_Register/>, document.getElementById("root"));