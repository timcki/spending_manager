
// ta funkcja potem gdzies do ogolnego jsa jesli potrzeba usera do danej funkcjonalnosci
function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }


class Account_New_Acc extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            acc_name: null,
            acc_balance: null
        }
    }

    add_acc(event){
        event.preventDefault();
        console.log(JSON.stringify(this.state));
        fetch('http://127.0.0.1:5000/api/v1/accounts/create',{
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json", 'X-CSRF-TOKEN': getCookie('csrf_access_token')},
            body: JSON.stringify(this.state)
        }).then((response)=>{
            response.json().then((result)=>{
                alert(result.mssg);
                console.log(result.mssg);
            })
        })
    }


    render() {
        return (
            <div style={appStyle}>
                    <form style={formStyle} onSubmit={(event)=>{this.add_acc(event)}} >
                        <div>
                            <label style={labelStyle} >Nazwa konta:</label>
                            <input ref="acc_name" type="text" style={inputStyle} onChange={(event)=>{this.setState({acc_name:event.target.value})}}/>
                        </div>
                        <div>
                            <label style={labelStyle} >Obecny stan konta:</label>
                            <input ref="acc_balance" type="number" step="0.01" style={inputStyle} onChange={(event)=>{this.setState({acc_balance:event.target.value})}}/>
                        </div>
                        <div>
                          <input style={submitStyle} type="submit" value="Dodaj konto"/>
                        </div>
                  </form>
            </div>
        );
    }
}

ReactDOM.render(<Account_New_Acc/>, document.getElementById("root"));