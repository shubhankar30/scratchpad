const React = require('react');
const axios = require('axios');
import {Modal} from './modal-template.jsx';
import { _defaultBookImg } from './lib.jsx'

class AttendeeBooks extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            title: '',
            book_id: 0,
            photo_url: '',
            showModal: false,
            deleteBook: false,
            moveBook: false,
            is_finished: false,
            student_id: 0,
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
            student_id:book.id,

            // Convert to bool as API returns is_finished as string
            is_finished: (book.is_finished === '1'),
        })
    };

    // **** Delete Book ****

    _deleteBook(){
        //Delete Book confirmation here
        if(!this.state.moveBook){
            if(this.state.deleteBook){
                return(
                    <div style={{paddingLeft:20}}>
                        <p> よろしいですか? </p>
                        <div style={{position:'relative',right:10}}>
                            <button className="m-5" onClick={() => this.setState({
                                deleteBook:false
                            })}> いいえ </button>
                            <button className="m-5" onClick={() => this._deleteBookEndpoint(this.state.book_id).then(() => {
                                notify("楽譜を削除しました!","success");
                                this._closeModal();

                                //To splice the array
                                this.props.deleteCurrentBook(this.state.index)

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
        return axios({
            url: baseApi + "/v2/student/" + this.props.getStudentId(this.state.index) + "/book",
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
                        <p> よろしいですか? </p>
                        <div style={{position:'relative',right:10}}>
                            <button className="m-5" onClick={() => this.setState({
                                moveBook:false
                            })}> いいえ </button>
                            <button className="m-5" onClick={() => this._moveBookEndpoint(this.state.book_id).then(() => {
                                notify("楽譜を移動しました!","success");
                                this._closeModal();

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
        return axios({
            url: baseApi + "/v2/student/" + this.props.getStudentId(this.state.index) + "/book",
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

    //Modal Design
    _renderModalData(){
        return(
            <div className="p-20" style={{width:'max-content'}}>
                <i className="fa-times fa pull-right fa-2x" aria-hidden="true" onClick={() => this._closeModal()}/>
                <div className= "pull-left book_title" style={{fontSize: 17}} > {this.state.title} </div>
                <div>
                    <img  className="book_photo m-15"  src={this.state.photo_url} onError={(e) => _defaultBookImg(e)}/>
                    <div className="row" style={{display:'flex',justifyContent:'space-between'}}>
                        {this._deleteBook()}
                        {this._moveBook()}
                    </div>
                </div>
            </div>
        )
    }

    // **** Modal Control ****

    _openModal()  {
        if(this.props.isTeacher) {
            this.setState({
                showModal: true
            })
        }
    }

    _closeModal(){
        this.setState({
            showModal: false
        })
    }

    _renderBook(){
        return(
                <div className="col-xs-3 col-sm-2 col-md-2 p-10" >
                    <img  className="book_photo" style={{minWidth: '60px', minHeight: '60px'}} src={this.state.photo_url}
                          onClick={() => this._openModal(this.state.title)}
                          onError={(e) => _defaultBookImg(e)}
                    />
                </div>
        )}

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
export {AttendeeBooks}
