class Dbase_test extends React.Component {
  constructor() {
        super();
        this.insert_state={
            account_id: 10,
            amount: 20,
            category_id: 30,
            transaction_type: "transakcja testowa",
            other_account_id: 997,
            transaction_status: "oplacona",
            person: 20,
            recipient: "test",
            transaction_date: "dzisiaj",
            cyclic_period: "no"
        }

        this.get_state={
            account_id: 10
        }

        this.delete_state={
            transaction_id: "60a06db982149591c376d547"
        }

        this.update_state={
            transaction_id: "60a06db982149591c376d547",
            attribute: "transaction_status",
            value: "nieoplacona test"
        }
    }

    insert_t(event){
        event.preventDefault();

        fetch('http://127.0.0.1:5000/api/v1/transactions/create',{
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.insert_state)
        }).then((response)=>{
            response.json().then((result)=>{
                alert(result.mssg);
            })
        })
    }

    get_t(event){
        event.preventDefault();

        fetch('http://127.0.0.1:5000/api/v1/transactions/get',{
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.get_state)
        }).then((response)=>{
            response.json().then((result)=>{
                alert(result.mssg);
            })
        })
    }

    delete_t(event){
        event.preventDefault();

        fetch('http://127.0.0.1:5000/api/v1/transactions/delete',{
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.delete_state)
        }).then((response)=>{
            response.json().then((result)=>{
                alert(result.mssg);
            })
        })
    }

    update_t(event){
        event.preventDefault();

        fetch('http://127.0.0.1:5000/api/v1/transactions/update',{
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.update_state)
        }).then((response)=>{
            response.json().then((result)=>{
                alert(result.mssg);
            })
        })
    }


    render() {
        return (
            <div style={appStyle}>
                    <form style={formStyle} onSubmit={(event)=>{this.insert_t(event)}} >
                        <div>
                          <input style={submitStyle} type="submit" value="Insert"/>
                        </div>
                  </form>
                    <form style={formStyle} onSubmit={(event)=>{this.delete_t(event)}} >
                        <div>
                          <input style={submitStyle} type="submit" value="Delete"/>
                        </div>
                  </form>
                    <form style={formStyle} onSubmit={(event)=>{this.get_t(event)}} >
                        <div>
                          <input style={submitStyle} type="submit" value="Get"/>
                        </div>
                  </form>
                    <form style={formStyle} onSubmit={(event)=>{this.update_t(event)}} >
                        <div>
                          <input style={submitStyle} type="submit" value="Update"/>
                        </div>
                  </form>
            </div>
        );
    }
}

ReactDOM.render(<Dbase_test/>, document.getElementById("root"));