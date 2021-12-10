import React, { Component } from "react";
import Select from "react-select";
import Navbar from '../global_ui/navbar/navbar';
import Button from '../global_ui/buttons/button';
import './enroll.css';


class Conditionaldropdown extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption0: {},
      selectedOption1:{},
      selectedOption2: {},
      selectedOption3:{}
    };
  }
  
  handleChange0 = (selectedOption0) => {
    this.setState({ selectedOption0 });
  };
  
  handleChange1 = (selectedOption1) => {
    this.setState({ selectedOption1 });
  };

  handleChange2 = (selectedOption1) => {
    this.setState({ selectedOption2: selectedOption1 });
  };
  handleChange3 = (selectedOption3) => {
    this.setState({ selectedOption3 });
  };
  render() {
    const Year = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" }
      ];
      const Department = [
        { value: "CSE", label: "Computer Science & Engineering" },
        { value: "CSEAIML", label: "CSE(Artificial Intelligence & Machine Learning)" },
        { value: "CSEDS", label: "CSE(Data Science)" },
        { value: "CSECS", label: "CSE(Cyber Security)" },
        { value: "CSBS", label: "Computer Science & Business System" },
        { value: "ECE", label: "Electronics & Communications Engineering" },
        { value: "EEE", label: "Electrical & Electronics Engineering" },
        { value: "CE", label: "Civil Engineering" },
        { value: "ME", label: "Mechanical Engineering" },
        { value: "IT", label: "Information Technology" },
      ];

    const Semester = [
        { value: "1", label: "1" },
        { value: "2", label: "2" }
      ];

    const Sections = [
      { value: "A", label: "A", link: "CSE" },
      { value: "B", label: "B", link: "CSE" },
      { value: "C", label: "C", link: "CSE" },
      { value: "D", label: "D", link: "CSE" },
      { value: "A", label: "A", link: "ECE" },
      { value: "B", label: "B", link: "ECE" },
      { value: "A", label: "A", link: "EEE" },
   
    ];

    const filteredOptions = Sections.filter(
      (o) => o.link === this.state.selectedOption1.value
    );
    return (
        <div className="enroll-container">
      

        <Navbar title ='Enrollment Screen'/>
     
    <div className="dropdown">


     <p>
         YEAR
     </p>
     <Select className="year"
            value={this.state.selectedOption0}
            onChange={this.handleChange0}
            options={Year}
          />
          <p> DEPARTMENT</p>
          <Select
            value={this.state.selectedOption1}
            onChange={this.handleChange1}
            options={Department}
          />
          <p>SECTION</p>
          <Select
            value={this.state.selectedOption2}
            onChange={this.handleChange2}
            options={filteredOptions}
            isDisabled={filteredOptions.length===0}
          />
          <p>SEMESTER</p>
           <Select
            value={this.state.selectedOption3}
            onChange={this.handleChange3}
            options={Semester}
          />
    </div>

      
          <Button className="button" width='150' height='50' children='Enroll'/>
        </div>
      );
    }
}

export default Conditionaldropdown;
