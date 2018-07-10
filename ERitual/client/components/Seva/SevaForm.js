import React,{Component} from 'react';
import SevaFormContainer from '../../containers/SevaContainer/SevaFormContainer';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {userSevaFormsRequest} from '../../actions/sevaFormAction';
import {imageUploadRequest} from '../../actions/sevaFormAction';
import {rashiRequest} from '../../actions/sevaFormAction';
import {nakshatraRequest} from '../../actions/sevaFormAction';
import {tagByKeyRequest} from '../../actions/sevaFormAction';
import {audVidDetailsFormrequest} from '../../actions/sevaFormAction';
import {LargeLogo} from '../common/Logos';
import { bindActionCreators } from 'redux';
import {addToast, deleteToast} from '../../actions/Toasts';

class SevaForm extends Component {
	componentDidMount(){
		let key='ui.tab.e-Seva';
		this.props.seva;
		this.props.tagByKeyRequest(key);
		this.props.tagByKey;
		this.props.tagConfigData;
	}
    render() {
      const {userSevaFormsRequest,imageUploadRequest,tagByKey,tagByKeyRequest,value,tagConfigData, seva,addToast,audVidDetailsFormrequest} = this.props;
        return (
            <div className="row full-height">
              <div className="col-md-10 col-md-offset-1 full-height">
                <LargeLogo id="large_logo" className="large-logo"/>
                <SevaFormContainer userSevaFormsRequest={userSevaFormsRequest} tagConfigData={tagConfigData} tagByKeyRequest={tagByKeyRequest} tagByKey={tagByKey} imageUploadRequest={imageUploadRequest}  addToast={addToast} deleteToast = {deleteToast} audVidDetailsFormrequest = {audVidDetailsFormrequest}/> 
              </div>
            </div>
        );
    }
}

SevaForm.propTypes = {
		userSevaFormsRequest:React.PropTypes.func.isRequired,
		imageUploadRequest:React.PropTypes.func.isRequired,
		addToast:React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
	  return {
		  seva:state.sevaFormReducer,
		  rashi:state.rashiList,
		  nakshatra:state.nakshtraList,
		  tagValue:state.valueList,
		  tagConfig:state.tagConfigReducer,
		  tagConfigData:state.tagConfigFormReducer
	  };
	}
function mapDispatchToProps(dispatch) {
	return {
		userSevaFormsRequest: bindActionCreators({userSevaFormsRequest }, dispatch),
		imageUploadRequest: bindActionCreators({ imageUploadRequest }, dispatch),
		rashiRequest: bindActionCreators({ rashiRequest }, dispatch),
		nakshatraRequest: bindActionCreators({ nakshatraRequest }, dispatch),
		addToast:bindActionCreators({ addToast }, dispatch),
		tagByKeyRequest: bindActionCreators({ tagByKeyRequest }, dispatch),
		audVidDetailsFormrequest : bindActionCreators({ audVidDetailsFormrequest }, dispatch),
	  };
	}

export default connect(mapStateToProps, {userSevaFormsRequest,imageUploadRequest,addToast,tagByKeyRequest,audVidDetailsFormrequest} )(SevaForm)
