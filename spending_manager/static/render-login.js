class Account_Login extends React.Component {
    constructor() {
        super();
        this.state={
            username:null,
            password:null,
            is_logged:false,
            store:null
        }
    }

    login(event){
        event.preventDefault();
        fetch('http://127.0.0.1:5000/api/v1/login',{
            method:'POST',
            body:JSON.stringify(this.state)
        }).then((response)=>{
            response.json().then((result)=>{
                console.warn("result",result);
                localStorage.setItem('logged', JSON.stringify({
                    is_logged:true,
                    token:result.token
                }))
                this.setState({is_logged:true})
            })
        })
    }


    render() {
        return (
            <div style={appStyle}>
                {!this.state.is_logged?
                    <form style={formStyle} onSubmit={(event)=>{this.login(event)}} >
                        <div>
                            <label style={labelStyle} >Nazwa użytkownika:</label>
                            <input ref="username" type="text" style={inputStyle} onChange={(event)=>{this.setState({username:event.target.value})}}/>
                        </div>
                        <div>
                            <label style={labelStyle} >Hasło</label>
                            <input ref="password" type="password" style={inputStyle} onChange={(event)=>{this.setState({password:event.target.value})}}/>
                        </div>
                        <div>
                          <input style={submitStyle} type="submit" value="Zaloguj"/>
                        </div>
                  </form>
                :<div>Zalogowano</div>
                }
            </div>
        );
    }
}
ReactDOM.render(<Account_Login/>, document.getElementById("root"));