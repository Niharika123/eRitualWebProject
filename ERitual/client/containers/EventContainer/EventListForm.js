import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import Event from '../../components/Event/Event';
import {eventRenderList} from '../../actions/eventAction';
import {deleteEvent} from '../../actions/eventAction';
import TextFieldGroup from '../../components/common/TextFieldGroup';
import { Link } from 'react-router';
import {FontAwesome} from 'react-fontawesome';
import Datetime from 'react-datetime';
import {addToast, deleteToast} from '../../actions/Toasts';

class EventListForm extends Component {
	constructor(){
		super();
		this.state = {
				activePage: 0,
				pageNum:0,
				itemsPerPage:10,
				search: '',
				errors:{},
				isLoading:false,
				firstTimeFormSubmit:false,
				index:0,
				searchByCity:'',
				searchByLocality:'',
				orderByName:'',
				orderByCity:'',
				orderByAmount:'',
				orderByDate:'',
				orderByUpdatedTS:'',
				amountGreaterThan:null,
				amountLesserThan:null,
				dateGreaterThan:null,
				dateLesserThan:null,
				selectDate:null,
				month:null,
				year:null,
				day:null,
				available:null,
				isAvailable:'',
				selectedIndex:null,
				triggerDelete:false,
				confirmDelete:false,
				deleteEventId:'',
				eventIndex:null,
				showSearchBox:false

		}
		this.onCancel=this.onCancel.bind(this);
		this.onAdd=this.onAdd.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
		this.onChange = this.onChange.bind(this);//bind(this) is needed here, otherwise, this will point to the event
		this.onSubmit = this.onSubmit.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.changeSort=this.changeSort.bind(this);
		this.handleDateGreaterThanSelect=this.handleDateGreaterThanSelect.bind(this);
		this.handleDateLesserThanSelect=this.handleDateLesserThanSelect.bind(this);
		this.onStatus=this.onStatus.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
		this.scrollPage=this.scrollPage.bind(this);
		this.confirmedDeletion = this.confirmedDeletion.bind(this);
		this.closeModal = this.closeModal.bind(this);

	}

	onChange(event) {
		this.setState({ [event.target.name]:event.target.value}, function() {
			if(this.state.firstTimeFormSubmit) {
				//this.isValid();
			}
		});
	}
	onAdd(){
		this.context.router.push('/ERitual/eventForm');
	}
	
	onSearch(event)
	{
		this.setState({
			activePage:0
		},()=>{
			this.onSubmit(event,this.state.itemsPerPage,this.state.activePage);
		})
	}

	scrollPage(){
		let elmnt = document.querySelector('.site-container');
		elmnt.scrollIntoView();
	}

	componentWillUpdate(){
		this.scrollPage();
	}

	onStatus(event){
		event.preventDefault();
		this.setState({
			isAvailable:event.target.value,
			available:event.target.value
		},()=>{
		})
	}

	changeSort(event){
		let sortBy=event.target.name;
		let sortByValue=event.target.value;
		this.setState({
			orderByName:"",
			orderByAmount:"",
			orderByCity:"",
			orderByDate:"",
			orderByUpdatedTS:""
		},()=>{
			this.onSubmit();
		})
		if(sortBy=="orderByName"){
			this.setState({
				orderByName:sortByValue
			},()=>{
				this.onSubmit();
			})
		}
		if(sortBy=="orderByAmount"){
			this.setState({
				orderByAmount:sortByValue
			},()=>{
				this.onSubmit();
			})
		}
		if(sortBy=="orderByCity" ){
			this.setState({
				orderByCity:sortByValue
			},()=>{
				this.onSubmit();
			})
		}
		if(sortBy=="orderByDate"){
			this.setState({
				orderByDate:sortByValue
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
		
	}

	//For delete event by id
	confirmedDeletion(event)
	{
		event.preventDefault();
		this.props.deleteEvent.deleteEvent(this.state.deleteEventId,this.state.eventIndex).then(
				(res) => {
					if(!res.payload.response && res.payload.status==600) {
						this.props.addToast.addToast({  type:'error', 
							text:`Sorry,you are not authorized to delete event, please contact to your  admin`, 
							toastType:'auto'  });
						this.context.router.push('/ERitual/event');
					}
					let eventFormData= res.payload.data;
					if(res.payload.data!= true) {
						this.setState({ errors : { "form" : "Sorry not able to delete!" }, isLoading : false })
					}
					else {
						this.onSubmit();
						this.props.addToast.addToast({  type:'success', 
							text:`Event deleted successfully`, 
							toastType:'auto'  });
						this.context.router.push('/ERitual/event');

					}
				},
		);
		this.setState({deleteEventId:'',eventIndex:null});
		this.closeModal();

	}

	deleteEvent(e,eventId,itemIndex){
		this.setState({deleteEventId:eventId});
		this.setState({eventIndex:itemIndex});
		this.setState({triggerDelete:true});

	}

	closeModal() {
		this.setState({
			triggerDelete:false,
		});

	}

	onCancel(event)
	{
		this.setState({
			search:"",
			searchByCity:"",
			searchByLocality:"",
			amountGreaterThan:"",
			amountLesserThan:"",
			dateGreaterThan:"",
			dateLesserThan:"",
			isAvailable:"",
			available:"",
			showSearchBox:false
		},()=>{
			this.onSubmit(event,this.state.itemsPerPage,this.state.activePage);
		})
	}
	
	onSubmit(event) {
		//event.preventDefault();
		this.setState({ firstTimeFormSubmit : true })
		let search=this.state.search;
		let searchData=this.state;
		this.props.eventRenderList.eventRenderList(search,searchData,this.state.itemsPerPage,this.state.activePage).then(
				(res) => {
					res.payload.data=JSON.parse(decodeURIComponent(res.payload.data.replace(/\+/g,'%20')));
					let searchdata= res.payload.data;
					console.log("searchdata",searchdata);
					if(searchdata.items.length==0){
						this.state.showSearchBox=true;
					}
					if(searchdata.message!= null) {
						this.setState({ errors : { "form" : searchdata.message }, isLoading : false })
					}
					else {
						this.context.router.push('/ERitual/event');
					}
				}
		);
	}


	onCancel(event)
	{
		this.setState({
			search:"",
			searchByCity :"",
			searchByLocality: "",
			amountGreaterThan: "",
			amountLesserThan: "",
			dateGreaterThan:"",
			dateLesserThan:"",
			isAvailable:"",
			available:"",
			showSearchBox:false,
		},()=>{
			this.onSubmit(event,this.state.itemsPerPage,this.state.activePage);
		})
	}
	
	handlePageClick(index){
		this.state.activePage=index.selected;
		this.onSubmit(event,this.state.itemsPerPage,this.state.activePage);
		this.scrollPage();
	}

	handleDateGreaterThanSelect(selectedDate) {
		let monthFormat=new Date(selectedDate._d).getMonth()+1;
		let dayFormat=new Date(selectedDate._d).getDate();
		let yearFormat=new Date(selectedDate._d).getFullYear();
		this.setState({
			day:new Date(selectedDate._d).getDate(),
			month:new Date(selectedDate._d).getMonth()+1,
			year:new Date(selectedDate._d).getFullYear(),
			selectDate:`${(monthFormat < 10) ? "0" + monthFormat : monthFormat}/${(dayFormat < 10)? "0"+dayFormat : dayFormat}/${yearFormat}`,
			dateGreaterThan:`${yearFormat}-${((monthFormat) < 10) ? "0" + monthFormat : monthFormat}-${(dayFormat < 10)? "0"+dayFormat: dayFormat}`
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
			selectDate:`${(monthFormat < 10) ? "0" + monthFormat : monthFormat}/${(dayFormat < 10)? "0"+dayFormat : dayFormat}/${yearFormat}`,
			dateLesserThan:`${yearFormat}-${((monthFormat) < 10) ? "0" + monthFormat : monthFormat}-${(dayFormat < 10)? "0"+dayFormat: dayFormat}`
		})
	}


	componentDidMount(){
		let pageSize=this.state.itemsPerPage;
		let pageNumber=this.state.activePage;
		let search =this.state.search;
		this.props.eventRenderList.eventRenderList(search,this.state,pageSize,pageNumber);
		//this.props.deleteEvent.deleteEvent();
	}

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
		const {eventList,deleteEvent,location,addToast}=this.props;
		const {showSearchBox,orderByDate,orderByName}=this.state;
		if(eventList.eventData!=undefined){
			if(eventList.eventData.length!=0){
				this.state.pageNum=Math.ceil(eventList.numItems / this.state.itemsPerPage);
				this.state.startIndex=eventList.startIndex;
			}
		}
		if(!this.props.eventList || this.props.eventList.length==0)
			return <div>Loading</div>
			else if(this.props.eventList ){
					return (
							<div className="p30 " >
							<div className="row">
							<div className="col-md-offset-5">
							<h1 className="mt0 mb20 ">Event List</h1>
							</div>
							</div>
							<div className="row">
							<div className="col-md-3 ">
							<TextFieldGroup
							label="Name "
								onChange={this.onChange}
							field="search"
								value = {this.state.search}
							name="searchByName"
								asterisk=""
									/>
									</div>
							<div className="col-md-2 ">
							<TextFieldGroup
							label="City "
								onChange={this.onChange}
							field="searchByCity"
								value = {this.state.searchByCity}
							name="searchByCity"
								asterisk=""
									/>
									</div>
							<div className="sector-division col-md-3 ">
							<span className="col-md-4"><label>Available</label></span>
							<h4><i className="kp-up-down blue "></i></h4>
							<select className=" form-control  "  onChange={this.onStatus} field = "available">
							<option value="" selected={this.state.isAvailable === ""} >--- Availability ---  </option>
							<option value={this.state.isAvailable=true} >True     </option>
							<option value={this.state.isAvailable=false} >False     </option>
							</select>
							</div>     
							<div className="col-md-1 mt20">
							<button  className="btn btn-lg btn-primary " onClick={this.onSearch}>
							<i className="kp-up-down blue mr_5"></i>
							Search
							</button>
							</div>
							<div className="col-md-1 mt20">
							<button  className="btn btn-lg btn-primary " onClick={this.onCancel}>
							Clear
							</button>
							</div>
							<div className="col-md-1 mt20 ml35">
							<button  className="btn btn-lg  sector-division btn-primary  " onClick={this.onAdd}>
							Add New
							</button>
							</div>
							</div>
							{showSearchBox && <div className="mt10per ml45per">Sorry No data found !!</div>}
							{!showSearchBox && <div><div className="row mt40">
							<div className="col-md-3  filter-container">
							<h3 className="filter-color"> Filters</h3>
							<select name="orderByDate" className=" form-control link-secondary font-color mb10" onChange={this.changeSort}>
							<option value="" selected={orderByDate === ""}>Sort By Date</option>
							<option value="asc">Ascending</option>
							<option value="desc">Descending</option>
							</select>
							<select name="orderByName" className=" form-control link-secondary font-color mb10" onChange={this.changeSort}>
							<option value="" selected={orderByName === ""}>Sort By Name</option>
							<option value="asc">Ascending</option>
							<option value="desc">Descending</option>
							</select>
							</div>
							<div className="col-md-9"> 
							<table className="table table-bordered table-striped">
							<thead>
							<tr className="font-color ">
							<th className="tabel-header">Name</th>
							<th className="tabel-header">Description</th>
							<th className="tabel-header">Date</th>
							<th className="tabel-header">City</th>
							<th className="tabel-header">Amount</th>
							<th className="tabel-header">Available</th>
							<th className="tabel-header">Actions</th>
							</tr>
							</thead>
							<Event eventRenderList ={eventList} deleteEvent={this.deleteEvent.bind(this)}/>
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
							<label> <h2>  Are you sure you want to delete the event?</h2></label>
							<button ref="chooseBtn" className="btn btn-primary mr20 col-md-4 " onClick={this.confirmedDeletion}>Delete</button>
							<button ref="uploadBtn" className="btn btn-primary pull-right col-md-4 " onClick={this.closeModal}>Cancel</button>
							</div>
							</div>
							</div>}
							</div>}
							</div>

					)
			}
	}
}


//It's a good practice to have propTypes for components. It becomes easy to track bugs where the developer
//doesn't pass all the required props.


EventListForm.contextTypes = {
		router:React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		eventList:state.eventReducer ,

	}
}
function mapDispatchToProps(dispatch) {
	return {
		eventRenderList: bindActionCreators({eventRenderList}, dispatch),
		deleteEvent: bindActionCreators({deleteEvent}, dispatch),
		addToast:bindActionCreators({ addToast }, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps )(EventListForm)
