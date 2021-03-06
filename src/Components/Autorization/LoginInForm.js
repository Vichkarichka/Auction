import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { login, changeLoginToSignUp, loginValue } from '../../Redux/Reducer';
import SocialButton from '../SocialButton';
import './LoginInForm.css';
import axios from "axios/index";
import {ErrorObject} from "../ErrorObject";
import {ErrorMessage} from "../ErrorMessage";

class LoginInForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            checkSignUp: false,
            emailError: true,
            passwordError: true,
            Error: false,
        };
    }

    onSubmit = () => {

        let { email, password } = this.state;

        if(this.state.emailError && this.state.passwordError) {
           this.serverRequest().then(() =>{
               if(this.state.error) {
                   this.setState({
                       email: '',
                   });
               } else {
                   this.props.login(email, password);
                   this.props.parentMethod();
               }
           }).catch((error) =>{
               console.log(error);
           });
        } else {
            this.setState({
                email: '',
                password: '',
                Error: true,
                errorName: ErrorObject.FORM_VALID,
            });
            setTimeout(()=>this.setState({Error: false}), 3000);
        }
    };

    serverRequest = () => {
        let postData = JSON.stringify({
            email: this.state.email,
            password: this.state.password,
        });

        let axiosConfig = {
            headers: {
                "Content-type": "application/json",
            }
        };

       return axios.post('http://127.0.0.1:8200/loginIn', postData, axiosConfig)
            .then((response) => {
                window.sessionStorage.setItem("items", JSON.stringify(response.data.token));
                if(!response.data.urlImage)
                {
                    this.setState({
                        email: response.data.email,
                        firstName: response.data.firstName,
                        idUsers: response.data.idUsers,
                        lastName: response.data.lastName,
                        token: response.data.token,
                        urlImage: "public/empty-avatar.jpg",
                    });
                } else {
                    this.setState({
                        email: response.data.email,
                        firstName: response.data.firstName,
                        idUsers: response.data.idUsers,
                        lastName: response.data.lastName,
                        token: response.data.token,
                        urlImage: response.data.urlImage,
                    });
                }
                this.props.loginValue(this.state);
                this.setState({
                    error: false,
                });
            }).catch((error) => {
                console.log(error);
                this.setState({
                    error: true,
                });
            });
    };

    handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {

        let emailError = this.state.emailError;
        let passwordError = this.state.passwordError;

        switch(fieldName) {
            case 'email':
                let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                emailError = re.test(value);
                break;
            case 'password':
                let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                passwordError = reg.test(value);
                break;
            default:
                break;
        }
        this.setState({
            emailError: emailError,
            passwordError: passwordError
        });
    }

    HandleClick = () => {
        this.props.changeLoginToSignUp('SignUp');
    };

    render() {
        let {email, password} = this.state;
        return(
            <Form className = 'formLoginIn' error={this.state.formError}>
                <h1>Log in to your account</h1>
                <Form.Field>
                    <Form.Input  placeholder='Enter your Email' error={!this.state.emailError} onChange={this.handleInput} name = 'email' value={email}/>
                </Form.Field>
                <Form.Field>
                    <Form.Input  placeholder='Password' error={!this.state.passwordError} onChange={this.handleInput} name = 'password'  value={password} />
                </Form.Field>
                <div style={{position: 'relative'}}>
                    <Button  className='buttonLoginIn' type='submit' onClick = {this.onSubmit} >Login In</Button>
                    {
                        this.state.Error &&
                        ErrorMessage(this.state.errorName)
                    }
                </div>
                <p className='Text'>or signup with your social account</p>
                <SocialButton/>
                <p className='Text'>Don't have an account?
                    <a onClick={this.HandleClick}>Create now</a>
                </p>
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoginSuccess: state.isLoginSuccess,
        loginError: state.loginError,
        data: state.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (email, password) => dispatch(login(email, password)),
        changeLoginToSignUp: (location) => dispatch(changeLoginToSignUp(location)),
        loginValue: (data) => dispatch(loginValue(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginInForm);