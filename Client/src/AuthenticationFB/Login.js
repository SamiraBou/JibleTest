import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import './server';

export default class Login extends Component {
    
    state={
		name:'',
        email:'',
        login:'false',
        token:'',
        confirm:'' 
    }

    signup(res, type) {
       
        if (type === 'facebook' && res.email) {
            this.setState({
             name: res.name,
             email: res.email,
             login:'true',
             
            });
       }
    }
    
    
    EventHand=(response)=>{
        console.log("facebook console");
        console.log(response);
        this.signup(response, 'facebook');
        console.log(response.accessToken);

		if(response.accessToken===''){console.log("hello 111111111");
			return false;
            
		}else{console.log("hello 222222");
		var bodyRequest={
			token:response.token,
        }
        console.log("hello from the eventHand");
		fetch("http://localhost:3000/auth/facebook",{
			method:'POST',
			headers:{
				'Accept':'application/json',
				'Content-Type':'application/json'
			},
			body:JSON.stringify(bodyRequest)
		}).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response");
            }
            return response.json();
          })
          .then(function(data) {
            console.log(data)
          });}
    }

    /*changename=(e)=>{
		this.setState({
			name:e.target.value
		}); 
    }

    changeEmail=(e)=>{
		this.setState({
			email:e.target.value
		}); 
    }*/

    render() {
     if(this.state.confirm==='' ){
           return(
                   <div >
                           
                         <FacebookLogin
                            appId="822187658147777"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.EventHand}/>
                         <br/><br/>
                   </div>   
           );
         }else{
            return(
                <div>
                 name={this.state.name} <br/>
                 email={this.state.email} 
                </div>                
            );
        }
     
    
    }
}
