class Account_Register extends React.Component {
  constructor() {
        super();
        this.state={
            username:null,
            password:null,
            password_check: null
        }
    }

    register(event){
        event.preventDefault();
        if(this.state.password !== this.state.password_check){
            alert("Podane hasła się nie zgadzają!");
            return;
        }
        fetch('http://127.0.0.1:5000/api/v1/registration',{
            method:'POST',
            body:JSON.stringify(this.state)
        }).then((response)=>{
            response.json().then((result)=>{
                //TODO wyswietlic jakis komunikat
            })
        })
    }


    render() {
        return (
            <div style={appStyle}>
                    <form style={formStyle} onSubmit={(event)=>{this.register(event)}} >
                        <div>
                            <label style={labelStyle} >Nazwa użytkownika:</label>
                            <input ref="username" type="text" style={inputStyle} onChange={(event)=>{this.setState({username:event.target.value})}}/>
                        </div>
                        <div>
                            <label style={labelStyle} >Hasło</label>
                            <input ref="password" type="password" style={inputStyle} onChange={(event)=>{this.setState({password:event.target.value})}}/>
                        </div>
                        <div>
                            <label style={labelStyle} >Powtórz hasło</label>
                            <input ref="password_check" type="password" style={inputStyle} onChange={(event)=>{this.setState({password_check:event.target.value})}}/>
                        </div>
                        <div>
                          <input style={submitStyle} type="submit" value="Zarejestruj"/>
                        </div>
                  </form>
            </div>
        );
    }
}

ReactDOM.render(<Account_Register/>, document.getElementById("root"));