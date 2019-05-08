
const React = require('react');
const axios = require('axios');
import {Book} from './book.jsx';
import {IsTeacher} from '../../lib/util.jsx';
import Select from 'react-select';
import {Modal} from './modal-template.jsx';
import { _defaultBookImg } from './lib.jsx'

let selectedOption;
class BookNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            studentBooksCurrent: [],
            studentBooksFinished: [],
            currentBooksLoading: true,
            finishedBooksLoading: true,
            isTeacher: false,
            showModal: false,
            bookList: [],
            add_book_photo_url:'',
            add_book_title:'',
            add_book_id:'',
            is_added_as_finished:false,
            addButtonWorking:false,
        };
        this._deleteCurrentBook = this._deleteCurrentBook.bind(this);
        this._deleteFinishedBook = this._deleteFinishedBook.bind(this);
        this._refreshBooks = this._refreshBooks.bind(this);
        this._dropdownChangeHandler = this._dropdownChangeHandler.bind(this);
    }

    componentWillMount() {
        this._refreshBooks();
        const isTeacher = IsTeacher();
        this._getAllBookLibrary();
        this.setState({
            isTeacher: isTeacher
        })
    };

    _refreshBooks(){
        this._getCurrentStudentBooks();
        this._getFinishedStudentBooks();
    };

    //**** Get Student Books ****

    _getCurrentStudentBooks() {
        //false is for currently reading books
        this._fetchStudentBooks(false)
            .then((resp) => {
                this.setState({
                    studentBooksCurrent: resp.data.data,
               },() => {
                 this.setState({
                    currentBooksLoading: false
                })
            })
        })
    }

    _getFinishedStudentBooks() {
        //true is for finished reading books
        this._fetchStudentBooks(true)
            .then((resp) => {
                this.setState({
                    studentBooksFinished: resp.data.data,
                },() => {
                    this.setState({
                        finishedBooksLoading: false
                    })
                })
            })
    };

    _fetchStudentBooks(IsFinished){
       return axios({
            method:'GET',
            url: baseApi + "/v2/student/" + sid + "/book",
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            },
            params: {
                "IsFinished": IsFinished,
            }
        });
    };

    //**** Delete Student Book ****

    _deleteCurrentBook(index){
        let arr = this.state.studentBooksCurrent;
        arr.splice(index, 1);
        this.setState({
            studentBooksCurrent: [],
            currentBooksLoading:true
        }, () => {
            this.setState({
                studentBooksCurrent: arr,
                currentBooksLoading:false
            })
        });
    };

    _deleteFinishedBook(index){
        let arr = this.state.studentBooksFinished;
        arr.splice(index, 1);
        this.setState({
            studentBooksFinished: []
        }, () => {
            this.setState({
                studentBooksFinished: arr
            })
        });
    };

    // **** Add New Book ****

    _renderAddNewStudentBookModal() {
        let param = [];
        let combinedParam = [];

        //Combine all the student books in a single array
        if(this.state.studentBooksCurrent !== null) {
            this.state.studentBooksCurrent.map((row) => {
                combinedParam.push({
                    book_id: row.book_id,
                    title: row.title,
                })
            });
        }

        if(this.state.studentBooksFinished !== null) {
            this.state.studentBooksFinished.map((row) => {
                combinedParam.push({
                    book_id: row.book_id,
                    title: row.title,
                })
            });
        }

        if(combinedParam.length>0) {
            combinedParam.sort(function (a, b) {
                return a.book_id - b.book_id;
            });
        }

        //Map the bookList to array
        this.state.bookList.map((row, i) => {
            let flag = false;

            //Check which books exist in student history
            for(let j=0 ; j<combinedParam.length;j++) {
                if (row.id === combinedParam[j].book_id) {
                    flag = true;
                    break;
                }
            }
                param.push({
                    value: row.id,
                    label: row.title,
                    photo_url: row.photo_url,
                    isDisabled: flag,
                })
        });

        return(
        <div>
            <div className="p-20" style={{height:'400px', width:'340px'}}>
                <i className="fa-times fa pull-right fa-2x" aria-hidden="true" onClick={() => this._closeAddBookModal()}/>
                <h4>追加する楽譜を選んでください</h4>

                <div className="p-10" >
                    <div className="m-t-5">
                        <Select options={param}
                                onChange={this._dropdownChangeHandler}
                                value={selectedOption}
                                placeholder={<div>楽譜の名前で検索</div>}
                                noOptionsMessage={() => { return(<div>一致するものはありません</div>)}}
                        />
                    </div>
                </div>
                <img  className="book_photo w-100"  src={this.state.add_book_photo_url} onError={(e) => _defaultBookImg(e)}/>
            <div>
            </div>
                <button className="pull-right m-b-15" disabled={!this.state.addButtonWorking} style={{marginRight:'28%',marginTop:'10px'}} onClick={() => this.AddNewBookForStudent()}> この楽譜を登録する </button>
            </div>
        </div>
        )
    };

    //React-select dropdown selection handler
    _dropdownChangeHandler(selectedOptiontemp){
        if(selectedOptiontemp.length === 0) {
            this.setState({
                add_book_photo_url:'',
                add_book_title:'',
                add_book_id:'',
                addButtonWorking: false
            })
        }
       else {
            this.setState({
                add_book_photo_url: selectedOptiontemp.photo_url,
                add_book_id: selectedOptiontemp.value,
                add_book_title: selectedOptiontemp.label,
                addButtonWorking: true,
            });
        }
    };

    AddNewBookForStudent(){
        this._addNewBookToStudentAPI()
            .then(() =>{
            notify("楽譜を追加しました!","success");
                if(this.state.is_added_as_finished){
                    this._getFinishedStudentBooks();
                } else {
                    this._getCurrentStudentBooks();
                }
                this.setState({
                    add_book_photo_url:'',
                    add_book_title:'',
                    add_book_id:'',
                    is_added_as_finished:false,
                    showModal:false,
                    addButtonWorking:false,
                });
            }).catch((error) => {
                console.log(error);
        })
    };

    _addNewBookToStudentAPI(){
        return axios({
            method: 'POST',
            url: baseApi + "/v2/student/" + sid + "/book",
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            },
            params: {
                "IsFinished": this.state.is_added_as_finished,
                "BookId": this.state.add_book_id,
            }
        });
    }

    // Get all book(score) data for dropdown list
    _getAllBookLibrary(){
        this._fetchBookLibrary()
            .then((resp) => {
                this.setState({
                    bookList: resp.data.data,
                })
            })
    };

    _fetchBookLibrary() {
        return axios({
            method: 'GET',
            url: baseApi + "/v2/books",
            headers: {
                "X-Auth": xauth,
                "X-Tag": xtag
            }
        });
    };

     // **** Modal Control ****

    _openNewBookModal(flag)  {
        this.setState({
            showModal: true,
            is_added_as_finished:flag,
        })
    };

    _closeAddBookModal(){
        this.setState({
            showModal: false,
            add_book_photo_url:'',
            add_book_title:'',
            add_book_id:'',
            addButtonWorking:false,
        })
    };

    // **** No books present ****

    _noBooksPresent(){
            if(this.state.isTeacher) {
                return (
                    <div>
                        楽譜はまだありません。<i className="fa-plus-circle fa"/>ボタンから追加できます。
                    </div>
                )
            } else {
                return (
                    <div>
                        先生が楽譜を登録していません
                    </div>
                )
            }

    }

   _renderAddNewBookIcon(is_finished){
        if(this.state.isTeacher) {
            return(
                <div className="AddNewFinishedBook p-t-10">
                    <i className="fa fa-plus-circle fa-3x  p-l-30 p-t-30 p-b-30"
                       onClick={() => this._openNewBookModal(is_finished)}/>
                </div>
            )
        }
    }

     render() {
        // loading
        if (this.state.currentBooksLoading || this.state.finishedBooksLoading){
            return(
                <div>
                    <p className="text-center">
                        <i className="fa fa-refresh fa-spin fa-3x" />
                    </p>
                </div>
            )
        }

         let CurrentBooks;
        if(this.state.studentBooksCurrent === null || this.state.studentBooksCurrent.length === 0){
            CurrentBooks = (
                this._noBooksPresent()
            )
        } else  {
              CurrentBooks = this.state.studentBooksCurrent.map((book, i) => {
                 return (
                     <Book key={book.book_id} book={book} index={i} isTeacher={this.state.isTeacher}  deleteCurrentBook={this._deleteCurrentBook}  refreshBooks={this._refreshBooks}/>
                 )
             });
         }

        let FinishedBooks;
        if(this.state.studentBooksFinished === null || this.state.studentBooksFinished.length === 0 ){
            FinishedBooks = (
                this._noBooksPresent()
            )
        } else {
             FinishedBooks = this.state.studentBooksFinished.map((book, i) => {
                return (
                    <Book key={book.book_id} book={book} index={i} isTeacher={this.state.isTeacher} deleteFinishedBook={this._deleteFinishedBook}  refreshBooks={this._refreshBooks}/>
                )
            });
        }

         return (
        <div>
            <h3> 今利用中の楽譜 </h3>
             <div className="container">
                <div className="row">
                     {CurrentBooks}
                    {this._renderAddNewBookIcon(false)}
                </div>
                <div className="row">
                   <h3> やり終わった楽譜 </h3>
                    {FinishedBooks}
                    {this._renderAddNewBookIcon(true)}
                </div>
             </div>

            <Modal isOpen={this.state.showModal} onClose={() => this._closeAddBookModal()}>
                {this._renderAddNewStudentBookModal()}
            </Modal>
        </div>
        )
    }
}

export {BookNode}