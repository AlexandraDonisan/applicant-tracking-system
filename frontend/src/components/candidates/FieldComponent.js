import React, {Component} from 'react'

export default class FieldFileInput  extends Component{
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    console.log(e.target.files[0]);
    const c = {value: e.target.files[0]};
    onChange(c)
  }

  render(){
    const { input: { value } } = this.props;
    const {input,label, required, meta, } = this.props;
    return(
     <div><label>{label}</label>
     <div>
       <input
        type='file'
        accept='.jpg, .png, .jpeg, .docx, .pdf'
        onChange={this.onChange}
       />
     </div>
     </div>
    )
}
}