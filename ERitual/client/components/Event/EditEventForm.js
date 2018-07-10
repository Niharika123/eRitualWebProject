import React,{Component} from 'react';
import EditEventContainer from '../../containers/EventContainer/EditEventContainer';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {userEditEventsRequest, userEventUpdateFormsRequest, imageUploadRequest, clearEventData} from '../../actions/eventFormAction';
import {LargeLogo} from '../common/Logos';
import { bindActionCreators } from 'redux';
import {addToast, deleteToast} from '../../actions/Toasts';

class EditEventForm extends Component {
	componentDidMount(){
		this.props.event;
		this.props.userEditEventsRequest(this.props.params.id);
	}
    render() {
    	const {userEventUpdateFormsRequest,userEditEventsRequest,imageUploadRequest, event,editEvent,addToast, clearEventData} = this.props;
        return (
            <div className="row full-height">
              <div className="col-md-8 col-md-offset-2 full-height">
                <LargeLogo id="large_logo" className="large-logo"/>
                {this.props.editEvent && this.props.editEvent.length != 0 && <EditEventContainer clearEventData = {clearEventData} userEventUpdateFormsRequest={userEventUpdateFormsRequest} userEditEventsRequest={userEditEventsRequest}  event = {event} editEvent = {editEvent} id = {this.props.params.id}  imageUploadRequest={imageUploadRequest} addToast={addToast} deleteToast = {deleteToast} />} 
              </div>
            </div>
        );
    }
}

EditEventForm.propTypes = {
		userEditEventsRequest:React.PropTypes.func.isRequired,
		userEventUpdateFormsRequest:React.PropTypes.func.isRequired,
		imageUploadRequest:React.PropTypes.func.isRequired,
		addToast:React.PropTypes.func.isRequired,
}

function mapStateToProps(state) {
	  return {
		  event:state.eventFormReducer,
		  editEvent:state.eventFormReducer.editEvent,
	  };
	}
function mapDispatchToProps(dispatch) {
	return {
		userEventUpdateFormsRequest: bindActionCreators({userEventUpdateFormsRequest }, dispatch),
		userEditEventsRequest: bindActionCreators({userEditEventsRequest }, dispatch),
		imageUploadRequest: bindActionCreators({ imageUploadRequest }, dispatch),
		clearEventData: bindActionCreators({ clearEventData }, dispatch),
	  };
	}

export default connect(mapStateToProps, {userEditEventsRequest,userEventUpdateFormsRequest, imageUploadRequest,addToast,clearEventData})(EditEventForm)
