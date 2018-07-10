import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import Message from '../../components/Message/Message';
import {messageRenderList} from '../../actions/messageAction';
import {deleteMessage} from '../../actions/messageAction';
import TextFieldGroup from '../../components/common/TextFieldGroup';
import { Link } from 'react-router';
import {FontAwesome} from 'react-fontawesome';
import Datetime from 'react-datetime';
import {addToast, deleteToast} from '../../actions/Toasts';
import {tagByKeyRequest} from '../../actions/sevaFormAction';

class MessageListForm extends Component {
	constructor(){
		super();
		this.state = {
				activePage: 0,
				pageNum:0,
				itemsPerPage:10,
				searchByTitle: '',
				searchByMessage:'',
				errors:{},
				isLoading:false,
				firstTimeFormSubmit:false,
				index:0,
				orderByTitle:'',
				orderByUpdatedTS:'',
				creationDateGreaterThan:null,
				creationDateLesserThan:null,
				dateGreaterThan:null,
				dateLesserThan:null,
				selectedIndex:null,
				triggerDelete:false,
				confirmDelete:false,
				deleteMessageId:'',
				messageIndex:null,
				tag:'',
				showSearchBox:false

		}
		this.onCancel=this.onCancel.bind(this);
		this.onAdd=this.onAdd.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
		this.onChange = this.onChange.bind(this);//bind(this) is needed here, otherwise, this will point to the message
		this.onSubmit = this.onSubmit.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.changeSort=this.changeSort.bind(this);
		this.handleDateGreaterThanSelect=this.handleDateGreaterThanSelect.bind(this);
		this.handleDateLesserThanSelect=this.handleDateLesserThanSelect.bind(this);
		this.scrollPage=this.scrollPage.bind(this);
		this.confirmedDeletion = this.confirmedDeletion.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.SelectTag=this.SelectTag.bind(this);
	}

	scrollPage(){
		let elmnt = document.querySelector('.site-container');
		elmnt.scrollIntoView();
	}

	componentWillUpdate(){
		this.scrollPage();
	}

	onChange(message) {
		this.setState({ [message.target.name]:message.target.value}, function() {
			if(this.state.firstTimeFormSubmit) {
				this.isValid();
			}
		});
	}
	onAdd(){
		this.context.router.push('/ERitual/messageForm');
	}
	onSearch(message)
	{
		this.setState({
			activePage:0
		},()=>{
			this.onSubmit(message,this.state.itemsPerPage,this.state.activePage);
		})
	}

	SelectTag(event){
		this.setState({
			tag:event.target.value
		},()=>{
		})
	}

	onStatus(event){
		this.setState({
			available:event.target.value
		},()=>{
		})
	}

	changeSort(message){
		let sortBy=message.target.name;
		let sortByValue=message.target.value;
		this.setState({
			orderByTitle:"",
			orderByUpdatedTS:""
		},()=>{
			if(sortBy=="orderByTitle"){
				this.setState({
					orderByTitle:sortByValue
				},()=>{
					this.onSubmit();
				})
			}
			if(sortBy=="orderByUpdatedTS"){
				this.setState({
					orderByUpdatedTS:sortByValue
				},()=>{
					this.onSubmit();
				})
			}
		})
	}

	closeModal() {
		this.setState({
			triggerDelete:false,
		});
	}

	confirmedDeletion(event)
	{
		event.preventDefault();
		this.props.deleteMessage.deleteMessage(this.state.deleteMessageId,this.state.messageIndex).then(
				(res) => {
					if(!res.payload.response && res.payload.status==600) {
						this.props.addToast.addToast({  type:'error', 
							text:`Sorry,you are not authorized to delete message, please contact to your  admin`, 
							toastType:'auto'  });
						this.context.router.push('/ERitual/message');
					}
					let messageFormData= res.payload.data;
					if(res.payload.data!= true) {
						this.setState({ errors : { "form" : "Sorry not able to delete!" }, isLoading : false })
					}
					else {
						this.onSubmit();
						this.props.addToast.addToast({  type:'success', 
							text:`message deleted successfully`, 
							toastType:'auto'  });
						this.context.router.push('/ERitual/message');

					}
				},
		);
		this.setState({deleteMessageId:'',messageIndex:null});
		this.closeModal();

	}
	//For delete event by id
	deleteMessage(e,messageId,itemIndex){
		this.setState({deleteMessageId:messageId});
		this.setState({messageIndex:itemIndex});
		this.setState({triggerDelete:true});
	}

	// This method is used to clear the search data
	onCancel(message)
	{
		this.setState({
			search:"",
			searchByTitle:"",
			searchByMessage:"",
			dateGreaterThan:"",
			dateLesserThan:"",
			tag:"",
			showSearchBox:false,
			creationDateGreaterThan:null,
			creationDateLesserThan:null,
		},()=>{
			this.onSubmit(message,this.state.itemsPerPage,this.state.activePage);
		})

	}
	onSubmit(message) {
		//message.prmessageDefault();
		this.setState({ firstTimeFormSubmit : true })
		let searchByTitle=this.state.searchByTitle;
		let searchData=this.state;
		this.props.messageRenderList.messageRenderList(searchByTitle,searchData,this.state.itemsPerPage,this.state.activePage).then(
				(res) => {
					res.payload.data=JSON.parse(decodeURIComponent(res.payload.data.replace(/\+/g,'%20')));
					let searchdata= res.payload.data;
					if(searchdata.items.length==0){
						this.state.showSearchBox=true;
					}
					if(searchdata.message!= null) {
						this.setState({ errors : { "form" : searchdata.message }, isLoading : false })
					}
					else {
						this.context.router.push('/ERitual/message');
					}
				}
		);
	}

	handlePageClick(index){
		this.setState({
			activePage:index.selected
		},()=>{
			this.onSubmit(event,this.state.itemsPerPage,this.state.activePage);
			this.scrollPage();
		})
	}

	handleDateGreaterThanSelect(selectedDate) {
		let monthFormat=new Date(selectedDate._d).getMonth()+1;
		let dayFormat=new Date(selectedDate._d).getDate();
		let yearFormat=new Date(selectedDate._d).getFullYear();
		this.setState({
			day:new Date(selectedDate._d).getDate(),
			month:new Date(selectedDate._d).getMonth()+1,
			year:new Date(selectedDate._d).getFullYear(),
			dateGreaterThan:`${(monthFormat < 10) ? "0" + monthFormat : monthFormat}/${(dayFormat < 10)? "0"+dayFormat : dayFormat}/${yearFormat}`,
			creationDateGreaterThan:`${yearFormat}-${((monthFormat) < 10) ? "0" + monthFormat : monthFormat}-${(dayFormat < 10)? "0"+dayFormat: dayFormat}`
		})
	}

	handleDateLesserThanSelect(selectedDate) {
		let monthFormat=new Date(selectedDate._d).getMonth()+1;
		let dayFormat=new Date(selectedDate._d).getDate();
		let yearFormat=new Date(selectedDate._d).getFullYear();
		this.setState({
			day:new Date(selectedDate._d).getDate(),
			month:new Date(selectedDate._d).getMonth()+1,
			year:new Date(selectedDate._d).getFullYear(),
			dateLesserThan:`${(monthFormat < 10) ? "0" + monthFormat : monthFormat}/${(dayFormat < 10)? "0"+dayFormat : dayFormat}/${yearFormat}`,
			creationDateLesserThan:`${yearFormat}-${((monthFormat) < 10) ? "0" + monthFormat : monthFormat}-${(dayFormat < 10)? "0"+dayFormat: dayFormat}`
		})
	}



	componentDidMount(){
		let pageSize=this.state.itemsPerPage;
		let pageNumber=this.state.activePage;
		let searchByTitle =this.state.searchByTitle;
		this.props.messageRenderList.messageRenderList(searchByTitle,this.state,pageSize,pageNumber);
		let key='ui.tab.sri-samsthanam';
		this.props.tagByKeyRequest.tagByKeyRequest(key);
		//For fetching tag list
		this.sriTagRenderOptions();
		//this.props.deleteMessage.deleteMessage();
	}

	//This function is used to display tag list in drop down for search
	sriTagRenderOptions() {
		if(this.props.tagConfigData!=undefined){
			if(this.props.tagConfigData.length!=0){
				let tagArr=[];
				tagArr=(this.props.tagConfigData.tagByKeyConfig.value.tags).split(",");
				const tagList = tagArr.map((tag) => 
				{
					return (<option key={tag} selected = {tag === this.state.tag}>{tag}</option>
					)
				});
				return tagList;
			}
		}    }


	componentWillReceiveProps(nextProps) {
		// if we changed routes...
		if ((
				nextProps.location.key !== this.props.location.key &&
				nextProps.location.state &&
				nextProps.location.state.modal
		)) {
			// save the old children
			this.previousChildren = this.props.children
		}
	}

	render() {
		const {messageList,deleteMessage,location,addToast,tagByKeyRequest,tagConfigData}=this.props;
		const {tag,showSearchBox,orderByTitle,orderByUpdatedTS}=this.state;
		if(messageList.messageData!=undefined){
			if(messageList.messageData.length!=0){
				this.state.pageNum=Math.ceil(messageList.numItems / this.state.itemsPerPage);
				this.state.startIndex=messageList.startIndex;
			}
		}
		if(!this.props.messageList || this.props.messageList.length==0)
			return <div>Loading</div>
			else if(this.props.messageList ){
				return (
						<div className="p30 " >
						<div className="row">
						<div className="col-md-offset-5">
						<h1 className="mt0 mb20 ">Sri Samasthanam List</h1>
						</div>
						</div>
						<div className="row">
						<div className="col-md-2 ">
						<TextFieldGroup
						label="Title "
							onChange={this.onChange}
						field="searchByTitle"
							value = {this.state.searchByTitle}
						name="searchByTitle"
							asterisk=""    
								/>
								</div>
						{/*<div className="col-md-2">
							<TextFieldGroup
							label="Message "
								onChange={this.onChange}
							field="searchByMessage"
								value = {this.state.searchByMessage}
							name="searchByMessage"
								asterisk=""    
									/>
									</div>*/}

						<div className="col-md-2">
						<label> From</label>
						<Datetime 
						onChange ={this.handleDateGreaterThanSelect}
						dateFormat={true}
						isValidDate={this.valid}
						timeFormat={false}
						value={this.state.dateGreaterThan}
						field="date"
							/>
							</div>
						<div className="col-md-2">
						<label> To</label>
						<Datetime 
						onChange ={this.handleDateLesserThanSelect}
						dateFormat={true}
						isValidDate={this.valid}
						timeFormat={false}
						value={this.state.dateLesserThan}
						field="date"
							/>
							</div>
						<div className="col-md-2">
						<label>Tags</label>
						<select name="type" className=" form-control  font-color" onChange={this.SelectTag}>
						<option value={tag}> Select Tags</option>
						{this.sriTagRenderOptions()}
						</select>
						</div>
						<div className="col-md-1">
						<button  className="btn btn-lg btn-primary mt15" onClick={this.onSearch}>
						<i className="kp-up-down blue mr_5"></i>
						Search
						</button>
						</div>
						<div className="col-md-1">
						<button  className="btn btn-lg btn-primary mt15" onClick={this.onCancel}>
						Clear
						</button>
						</div>
						<div className="col-md-1 ml10">
						<button  className="btn btn-lg  sector-division btn-primary mb15 mt15" onClick={this.onAdd}>
						Add New
						</button>
						</div>
						</div>
						{showSearchBox && <div className="mt10per ml45per">Sorry No data found !!</div>}
						{!showSearchBox && <div><div className="row mt40">
						<div className="col-md-3 filter-container">
						<h3 className="filter-color"> Filters</h3>
						<select name="orderByTitle" className=" form-control link-secondary font-color mb10" onChange={this.changeSort}>
						<option value="" selected={orderByTitle === ""}>Sort By Title</option>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
						</select>
						<select name="orderByUpdatedTS" className=" form-control link-secondary font-color mb10" onChange={this.changeSort}>
						<option value="" selected={orderByUpdatedTS === ""}>Sort By UpdatedTS</option>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
						</select>
						</div>
						<div className="col-md-9"> 
						<table className="table table-bordered table-striped">
						<thead>
						<tr className="font-color ">
						<th className="tabel-header">Title</th>
						<th className="tabel-header">Tags</th>
						<th className="tabel-header">Time</th>
						<th className="tabel-header">Actions</th>
						</tr>
						</thead>
						<Message messageRenderList ={messageList} tagByKeyRequest={tagByKeyRequest} tagConfigData={tagConfigData} deleteMessage={this.deleteMessage.bind(this)}/>
						</table>
						</div>
						</div>
						<div className="pull-left coursor-pointer">
						<ReactPaginate previousLabel={"previous"}
						nextLabel={"next"}
						breakLabel={<a href="">...</a>}
						breakClassName={"break-me"}
						pageCount={this.state.pageNum}
						marginPagesDisplayed={2}
						pageRangeDisplayed={2}
						onPageChange={this.handlePageClick}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						activeClassName={"active"} />
						</div>
						{this.state.triggerDelete && <div className="modal-bg"><div className="delete-container">
						<button className = 'close-modal' onClick = {this.closeModal}>x</button>
						<div className="delete-btn-container">
						<label> <h2>  Are you sure you want to delete the message?</h2></label>
						<button ref="chooseBtn" className="btn btn-primary mr20 col-md-4 " onClick={this.confirmedDeletion}>Delete</button>
						<button ref="uploadBtn" className="btn btn-primary pull-right col-md-4 " onClick={this.closeModal}>Cancel</button>
						</div>
						</div></div>}
						</div>}
						</div>

				)
			}
	}
}


//It's a good practice to have propTypes for components. It becomes easy to track bugs where the developer
//doesn't pass all the required props.


MessageListForm.contextTypes = {
		router:React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		messageList:state.messageReducer ,
		tagConfigData:state.tagConfigFormReducer

	}
}
function mapDispatchToProps(dispatch) {
	return {
		messageRenderList: bindActionCreators({messageRenderList}, dispatch),
		deleteMessage: bindActionCreators({deleteMessage}, dispatch),
		addToast:bindActionCreators({ addToast }, dispatch),
		tagByKeyRequest: bindActionCreators({ tagByKeyRequest }, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps )(MessageListForm)