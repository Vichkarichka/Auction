import React from 'react'
import {connect} from "react-redux";
import axios from "axios/index";
import { saveAllDataLots } from "../../Redux/Reducer";
import { Link } from 'react-router-dom';
import { Item, Label, Pagination } from 'semantic-ui-react';
import './ActiveLots.css';
import CountDown from '../CountDown';
import moment from 'moment';

class ActiveLots extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 4,
            startEnd: {
                start: 0,
                end: 4
            }

        };
    }

    componentWillMount() {
        this.requestToServer();
    }

    requestToServer = () => {
        axios.get('http://127.0.0.1:8200/allLots')
            .then(res => {
               this.props.saveAllDataLots(res.data);
            }).catch(function (error) {
            console.log(error);
        });
    };

    onChange = (e, data) => {
        let startEnd = this.paginaterItem(this.props.lots.result.length, data.activePage);
        this.setState({
            startEnd: startEnd,
        })
    };

    paginaterItem = (lengthMas, activePage) => {

        const totalPages =  Math.ceil(this.props.lots.result.length/this.state.size);
        if (activePage < 1 || activePage > totalPages) return null;
        const start = (activePage - 1) * this.state.size ;
        const end = Math.min(start + this.state.size - 1, lengthMas - 1) + 1;
        return {start, end};
    };

    render() {
        console.log(this.state.totalPages);
        if(!this.props.lots) return null;

        let urlImage = this.props.lots.result.slice(this.state.startEnd.start, this.state.startEnd.end);
        let urlImages = urlImage.map((urlItem) =>
            <Item key = {urlItem.idLot} >
                <Item.Image size= "small" src={'http://localhost:8200/'+ ((urlItem.img && urlItem.img[0].imagesLotUrl) || 'ImageLot/empty.png' )  } />

                <Item.Content  key = {urlItem.idLot} >
                    <Link to={`/lotsUser/${urlItem.idLot}`}>
                        <Item.Header   key = {urlItem.idLot}>
                        {urlItem.nameLot}
                    </Item.Header>
                    </Link>
                    <Item.Meta>
                        <span>{urlItem.newBid + '$'}</span>
                    </Item.Meta>
                    <Item.Description>{urlItem.descriptionLot}</Item.Description>
                    {
                        moment(urlItem.startTime).format('DD.MM.YYYY, LTS') <= new Date(Date.now()).toLocaleString('ru') &&
                        <CountDown date={urlItem.endTime}/>
                    }
                    <Item.Extra>
                        <Label>{urlItem.categoryLot}</Label>
                    </Item.Extra>
                    <Item.Extra content={urlItem.nameUser} />
                </Item.Content>
            </Item>
        );
        return (
            <div>
                <Item.Group divided link className = "AllLots">

                {urlImages}

                    <Pagination
                        defaultActivePage={1}
                        firstItem={null}
                        lastItem={null}
                        pointing
                        secondary
                        onPageChange={this.onChange}
                        totalPages={ Math.ceil(this.props.lots.result.length/this.state.size)}
                    />
                </Item.Group>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data,
        lots: state.lots,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveAllDataLots: (lots) => dispatch(saveAllDataLots(lots)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveLots);