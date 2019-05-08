const React = require('react');
const axios = require('axios');
import {Modal} from './modal-template.jsx';
import { _defaultBookImg } from './lib.jsx'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class Book extends React.Component{
    constructor(props){
        super(props);
        this.state={
            index: 0,
            title: '',
            book_id:0,
            photo_url:'',
            showModal: false,
            deleteBook: false,
            moveBook: false,
            is_finished: false,
            pageList:[],
        };
    }

    componentWillMount(){
        this._setBookProps();
    }

    _setBookProps(){
        const book = this.props.book;
        this.setState({
            index: this.props.index,
            book_id:book.book_id,
            title: book.title,
            photo_url: book.photo_url,
            created:book.created,
            updated:book.updated,
            start_date:book.start_date,
            end_date:book.end_date,

            // API returns is_finished as string
            is_finished: (book.is_finished === '1' ),
        })
    }

   // **** Delete Book ****

    _deleteBook(){
        //Delete Book confirmation here
        if(!this.state.moveBook){
            if(this.state.deleteBook){
                return(
                    <div style={{paddingLeft:20}}>
                        <p className="m-b-0"> よろしいですか? </p>
                        <div style={{position:'relative',right:10}}>
                            <button className="m-5" onClick={() => this.setState({
                                deleteBook:false
                            })}> いいえ </button>
                            <button className="m-5" onClick={() => this._deleteBookEndpoint(this.state.book_id).then(() => {
                                notify("楽譜を削除しました!","success");

                                //To splice the respective array
                                if(this.state.is_finished) {
                                    this.props.deleteFinishedBook(this.state.index)
                                } else {
                                    this.props.deleteCurrentBook(this.state.index)
                                }
                            }).catch((resp) => {
                                console.log(resp);
                                notify("エラーが発生しました!","danger");
                            })
                            }> はい </button>

                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <button onClick={() => this.setState({
                            deleteBook: true
                        })}> 削除する
                        </button>
                    </div>
                )
            }
        }
    }

    _deleteBookEndpoint(bookId){
        this._closeModal();
        return axios({
            url: baseApi + "/v2/student/" + sid + "/book",
            method: 'DELETE',
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            },
            params: {
                "book_id": bookId,
            }
        });
    }

    // **** Move Book  ****

    _moveBook(){
        //Handle confirmation of move book
        if(!this.state.deleteBook){
            if(this.state.moveBook) {
                return(
                    <div style={{paddingLeft:20}}>
                        <p className="m-b-0"> よろしいですか? </p>
                        <div style={{position:'relative',right:10}}>
                            <button className="m-5" onClick={() => this.setState({
                                moveBook:false
                            })}> いいえ </button>
                            <button className="m-5" onClick={() => this._moveBookEndpoint(this.state.book_id).then(() => {
                                notify("楽譜を移動しました!","success");
                                this.props.refreshBooks();
                            }).catch((resp) => {
                                console.log(resp);
                                notify("エラーが発生しました!","danger");
                            })
                            }> はい </button>
                        </div>
                    </div>
                )

            } else {
                if(this.state.is_finished){
                    return (
                        <div>
                            <button onClick={() => this.setState({
                                moveBook: true
                            })}>使用中楽譜にする
                            </button>
                        </div>
                    )} else {
                    return (
                        <div>
                            <button onClick={() => this.setState({
                                moveBook: true
                            })}>終わりにする
                            </button>
                        </div>
                    )
                }
            }
        }
    }


    _moveBookEndpoint(bookId){
        this._closeModal();
        return axios({
            url: baseApi + "/v2/student/" + sid + "/book",
            method: 'PATCH',
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            },
            params: {
                "book_id": bookId,
            }
        });
    }

    //Retrieve and render Page List according to Book selected
    _onPageDropdownOpened(){
        if(this.state.book_id > 0) {
            this._fetchPageListForBook()
                .then((resp) => {
                    this.setState({
                        pageList: resp.data.data,
                        isLoading:true,
                    },() => {
                        this.setState({
                            isLoading:false,
                        })
                    });
                });
        }
    }

    _fetchPageListForBook() {
        return axios({
            method: 'GET',
            url: baseApi + "/v2/books/" + this.state.book_id + "/pieces",
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            },
        });
    }

    _renderPieceList(){
        if(!this.state.isLoading){
            if (this.state.pageList !== null) {
                return(
                <div style={{paddingTop:'10px',display:'inline-block'}}>
                    <table style={{height:'150px',display:'block',overflowY:'scroll',border:'1px solid #e6e6e6', borderRadius:'5px'}}>
                        <tbody style={{width:'100%',display:'grid'}}>
                        {this.state.pageList.map((item, i)=> {
                            return [
                                <tr key={i} style={{borderBottom:'1px solid #f2f2f2'}}>
                                    <td> p.{item.page_number} / {item.title}</td>
                                </tr>
                            ];
                        })}
                        </tbody>
                    </table>
                </div>
                )
            }
        }
    }

    // Show start date and end Date functionality
    _renderDates(){

        let startDate;
        if(this.state.start_date !== null){
            startDate = moment(this.state.start_date);
        } else {
            startDate = moment(this.state.created);
        }

        let endDate;
        if(this.state.end_date !== null){
            endDate =  moment(this.state.end_date);
        } else {
            endDate =  moment(this.state.updated);
        }
        
        if(this.state.is_finished){
            return(
                <div>
                    <div className="col-xs-6 p-l-0 p-r-0 p-t-10 text-center">
                        <div className="text-center"> 使用開始日</div>
                        <DatePicker
                        dateFormat="YYYY/MM/DD"
                        selected={startDate}
                        disabled={!this.props.isTeacher}
                        readOnly={true}
                        onChange={(e)=>this._updateDateEndpoint(e,true).then(() => {
                            notify("日付情報を更新しました","success");
                        }).catch((resp) => {
                            console.log(resp);
                            notify("更新に失敗しました。もう一度お試しください","danger");
                        })}
                        style={{display:'inline-block'}}
                        />
                    </div>
                    <div className="col-xs-6 p-l-0 p-r-0 p-t-10">
                        <div className="text-center"> 終了日</div>
                        <div style={{paddingLeft:'23px'}}>
                            <DatePicker
                            selected={endDate}
                            dateFormat="YYYY/MM/DD"
                            readOnly={true}
                            disabled={!this.props.isTeacher}
                            onChange={(e)=>this._updateDateEndpoint(e, false).then(() => {
                                notify("日付情報を更新しました","success");
                            }).catch((resp) => {
                                console.log(resp);
                                notify("更新に失敗しました。もう一度お試しください","danger");
                            })}
                            style={{display:'inline-block'}}
                            /></div>
                     </div>
                 </div>
            )
        } else {
            return (
                <div className="p-t-10 p-l-0 p-r-0 text-center">
                    使用開始日
                    <DatePicker
                        disabled={!this.props.isTeacher}
                        selected={startDate}
                        dateFormat="YYYY/MM/DD"
                        readOnly={true}
                        onChange={(e)=>this._updateDateEndpoint(e, true).then(() => {
                            notify("日付情報を更新しました","success");
                        }).catch((resp) => {
                            console.log(resp);
                            notify("更新に失敗しました。もう一度お試しください","danger");
                        })}
                /></div>
            )
        }
    }

    _updateDateEndpoint(newDate, isStartDateChange) {
        newDate.set({hour:0,minute:0,second:0,millisecond:0});

        if (isStartDateChange) {
            this.setState({
                start_date: newDate._d,
            })
        } else {
            this.setState({
                end_date: newDate._d,
            })
        }

        return axios({
            url: baseApi + "/v2/student/" + sid + "/book-date",
            method: 'PATCH',
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            },
            params: {
                "book_id": this.state.book_id,
                "date": newDate._d,
                "is_start_date": isStartDateChange,
            }
        });
    }

    //Modal Design
    _renderModalData(){
        if (this.props.isTeacher) {
            return (
                <div className="p-20">
                    <i className="fa-times fa pull-right fa-2x" aria-hidden="true" onClick={() => this._closeModal()}/>
                    <div className="text-center book_title" style={{fontSize: 17}}> {this.state.title} </div>
                    <div>
                        <div className="row p-b-15">
                            <img className="col-sm-12 col-md-6 custom-height-of-photo" src={this.state.photo_url}
                                 onError={(e) => _defaultBookImg(e)}/>

                            <div className="col-sm-12 col-md-6">
                                {this._renderDates()}
                                {this._renderPieceList()}
                            </div>
                        </div>
                        <div className="row" style={{display: 'flex', justifyContent: 'space-between'}}>
                            {this._deleteBook()}
                            {this._moveBook()}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="p-20">
                    <i className="fa-times fa pull-right fa-2x" aria-hidden="true" onClick={() => this._closeModal()}/>
                    <div className="text-center book_title" style={{fontSize: 17}}> {this.state.title} </div>
                    <div>
                        <div className="row p-b-15">
                            <img className="col-sm-12 col-md-6 custom-height-of-photo" src={this.state.photo_url}
                                 onError={(e) => _defaultBookImg(e)}/>

                            <div className="col-sm-12 col-md-6">
                                {this._renderDates()}
                                {this._renderPieceList()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    // **** Modal Control ****

    _openModal()  {
            this.setState({
                showModal: true
            });
        {this._onPageDropdownOpened()}
    }

    _closeModal(){
            this.setState({
                showModal: false
            })
    }

    _renderBook(){
            return(
            <div className="col-xs-4 col-md-4 p-10">
                <img  className="book_photo" style={{maxWidth: '90px', maxHeight: '90px'}} src={this.state.photo_url} onClick={() => this._openModal(this.state.title)} onError={(e) => _defaultBookImg(e)}/>
                <div className="book_title show-ellipsis" style={{fontSize: '1em', height:'35px'}} onClick={() => this._openModal(this.state.title)}> {this.state.title} </div>
            </div>
            )
    }

    render(){

       return(
        <div>
            {this._renderBook()}
            <Modal isOpen={this.state.showModal} onClose={() => this._closeModal()}>
                {this._renderModalData()}
            </Modal>
        </div>
        )}
}

export {Book}