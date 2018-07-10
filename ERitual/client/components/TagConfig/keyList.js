import React,{Component} from 'react';
import classnames from 'classnames';
import map from 'lodash';
import { Link } from 'react-router';
import jwt from 'jsonwebtoken';
import Dropdown from 'react-dropdown';

import validateInput from '../../validations/tagConfigValidation';
import TextFieldGroup from '../../components/common/TextFieldGroup';
import setAuthToken from '../../utils/setAuthToken';
import Autosuggest from 'react-autosuggest';
import _ from 'lodash';

export default class keyList extends Component {
	constructor(props){
		super(props);
		// We will be using the state to control the input. This will ensure
		// that the state will always hold the lastest
		this.state = {
				tagKey: '',
				value:'',
				errors:{},
				success:{},
				isLoading:false,
				firstTimeFormSubmit:false,
		        submitApplied:false,
		        scroll:'',
		        selectedTagValues:[],
		        selectedValues:[]

		}

		this.onChange = this.onChange.bind(this);// bind(this) is needed here,
		this.onSubmit = this.onSubmit.bind(this);
		this.scrollPage=this.scrollPage.bind(this);
		this.onClick=this.onClick.bind(this);
		this.removeTag = this.removeTag.bind(this);
	}


	onTagChange (event, { newValue }) {
		console.log("event",event.target.name);
		if(event.target.name=='key'){
	    this.setState({
	      value: newValue
	    });
		}
		else{
			this.setState({
			      tagValue: newValue
			    });
		}
	  };
	  
	onSuggestionsFetchRequested({ value }) {
		console.log("suggestion fetch",value);
		this.props.tagConfigRenderList(value).then(this.keyRenderOptions)
	}
	
	
	 keyRenderOptions() {
	     if(this && !this.props.tagConfig) {
	    	 return [];
	     }
	     if(this && this.props.tagConfig.tagConfigData.length==0) {
	    	 return [`Add ${this.state.value} to the list?`];
	     }
		 if(this && this.props.tagConfig.tagConfigData!=undefined){
	    	if(this.props.tagConfig.tagConfigData.length!=0){
	    		const tagList = this.props.tagConfig.tagConfigData.map((d) => 
	    		{
	    			return d.key;
	    		});
	    		return _.difference(tagList, this.state.selectedTagValues);
	    	}
		 }
	    	
	  }
	 
	 renderSuggestion(suggestion) {
		 if (suggestion.isAddNew) {
		      return (
		        <span>
		          [+] Add new: <strong>{this.state.value}</strong>
		        </span>
		      );
		    }
		 return suggestion
	 }
	 
	getSuggestionValue(suggestion) {
	    if (suggestion.isAddNew) {
	      return this.state.value;
	    }
	    
	    return suggestion;
	  };
	  
	  
	  onSuggestionSelected(event, { suggestion }){
		    if (suggestion.isAddNew) {
		      console.log('Add new:', this.state.value);
		    }
		   this.setState({
			   selectedTagValues : suggestion.toString().indexOf('to the list') == -1 ? this.state.selectedTagValues.concat(suggestion.toString()) : this.state.selectedTagValues.concat(this.state.value)
		   },() => {
			   document.querySelector('.react-autosuggest__input').value = "";
		   });
		  };
		  
	
	createTag() {
		let tagsList = this.state.selectedTagValues.map((tag) => 
		{
			return (
					<li key={tag} className = "tag"><span>{tag}</span><a className="close-tag" onClick = {(event) => {event.preventDefault();this.removeTag(tag);}}>x</a></li>
			 )
		});
		return tagsList;
		
	}
	
	removeTag(tag) {
		console.log("selected tag ",tag);
		let selectedTagList = this.state.selectedTagValues;
		selectedTagList = [...selectedTagList.slice(0,selectedTagList.indexOf(tag)),...selectedTagList.slice(selectedTagList.indexOf(tag)+1)]
		this.setState({
			   selectedTagValues : selectedTagList
		});
	}
	
	render() {
		const {errors ,success,tagKey,value,isLoading,checked} = this.state;
		const inputProps = {
	      placeholder: 'key',
	      name:'key',
	      value,
	      onChange: this.onTagChange.bind(this)
	    };
		const suggestions = ["a","b"];
		return (
				<div className="row mb10">
				  <div className="col-xs-6 ">
				  <Autosuggest
			        suggestions={this.keyRenderOptions() ? this.keyRenderOptions() : [] }
			        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
			        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
			        getSuggestionValue={this.getSuggestionValue.bind(this)}
			        renderSuggestion={this.renderSuggestion.bind(this)}
				    inputProps={inputProps}
				    focusFirstSuggestion={true}
				    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
				  />
		      	  <ul className = "selectedTags">{this.createTag()}</ul>
			  </div>
				</div>
		);
	}
}



