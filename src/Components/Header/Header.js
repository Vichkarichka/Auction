import React, {Component} from 'react';
import { Segment, Image, Dropdown } from 'semantic-ui-react';
import logo from '../../Style/logo.jpeg';
import { Redirect, Link} from 'react-router-dom';
import { connect } from "react-redux";
import axios from "axios/index";
import { logout } from "../../Redux/Reducer";
import './Header.css'


class Header extends Component {

    constructor(props){
        super(props);
        this.state ={
            redirect: false,
            address: '',
        };
        this.handleSetting = this.handleSetting.bind(this);
    }

    componentDidUpdate () {
        if (this.state.redirect) {
            this.setState({
                redirect: false
            })
        }
    }

    handleSetting = (e) => {
        e.preventDefault();
        let address = e.target.dataset.to;
        if(address === '/')
        {
           this.props.logout();
        }
        let storedArray = JSON.parse(sessionStorage.getItem("items"));
        let postData = JSON.stringify({
            token: storedArray,
        });
        let axiosConfig = {
            headers: {
                "Content-type": "application/json",
            }
        };

        axios.post('http://127.0.0.1:8200/authorization', postData, axiosConfig)
            .then((response) => {
                if(response.data.success){
                    this.setState({
                        redirect: true,
                        address: address,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        if (this.state.redirect) {
            return (
                <Redirect push to = {this.state.address}/>
            )
        }
        return (
                <Segment raised>
            <span>
            <Link to ='/'> <Image src={logo} size='small'/></Link>
                {
                    this.props.isLoginSuccess &&
                    <Dropdown text={this.props.data.email}  floating labeled button icon={<Image src = {"http://localhost:8200/"+ this.props.data.urlImage} style = {{width:50, height:50, marginTop:-15 }} />} className='privateAccount'>
                        <Dropdown.Menu>
                            <Dropdown.Item data-to ='/newLots' onClick={this.handleSetting}>
                                New Lot
                            </Dropdown.Item>
                            <Dropdown.Item data-to ='/lotsUser' onClick={this.handleSetting}>
                                Your Lot's
                            </Dropdown.Item>
                            <Dropdown.Item data-to ={'/bid/'  + this.props.data.idUsers} onClick={this.handleSetting}>
                                Your Bid's
                            </Dropdown.Item>
                            <Dropdown.Item>Lot's History</Dropdown.Item>
                            <Dropdown.Item data-to ='/lk' onClick={this.handleSetting}>
                                Setting
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Exit</Dropdown.Header>
                            <Dropdown.Item data-to ='/' onClick={this.handleSetting}>Log out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </span>
                </Segment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoginSuccess: state.isLoginSuccess,
        email: state.email,
        data: state.data,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

