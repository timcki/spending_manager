class Account_Login extends React.Component {
    constructor() {
        super();
        this.state={
            username:null,
            password:null,
            is_logged:null,
            store:null
        }
    }

    login(){
        fetch('api',{//TODO wrzucic poprawne odniesienie do api
            method:'POST',
            body:JSON.stringify(this.state)
        }).then((response)=>{
            response.json().then((result)=>{
                console.warn("result",result);
                localStorage.setItem('is_logged', JSON.stringify({
                    login:true,
                    token:result.token
                }))
                this.setState({login:true})
            })
        })
    }

    render() {
        return (
            <div style={appStyle}>
                {!this.state.is_logged?
                    <form style={formStyle} >
                        <div>
                            <label style={labelStyle} >Nazwa użytkownika:</label>
                            <input ref="username" type="text" style={inputStyle} onChange={(event)=>{this.setState({username:event.target.value})}}/>
                        </div>
                        <div>
                            <label style={labelStyle} >Hasło</label>
                            <input ref="password" type="password" style={inputStyle} onChange={(event)=>{this.setState({password:event.target.value})}}/>
                        </div>
                        <div>
                          <button style={submitStyle} type="submit" onClick={this.login()}>Zaloguj</button>
                        </div>
                  </form>
                :<div>Zalogowano</div>
                }
            </div>
        );
    }
}
ReactDOM.render(<Account_Login/>, document.getElementById("root"));