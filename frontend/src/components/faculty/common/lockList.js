import React, { Component } from "react";
import Select from "react-select";
import Navbar from "../../global_ui/navbar/navbar";
import Button from "../../global_ui/buttons/button";
import "./lockList.css";

class LockList extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption0: {},
      selectedOption1: {},
      selectedOption2: {},
      selectedOption3: {},
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
      { value: "4", label: "4" },
    ];
    const Department = [
      { value: "CSE", label: "Computer Science & Engineering" },
      {
        value: "CSEAIML",
        label: "CSE(Artificial Intelligence & Machine Learning)",
      },
      { value: "CSEDS", label: "CSE(Data Science)" },
      { value: "CSECS", label: "CSE(Cyber Security)" },
      { value: "CSBS", label: "Computer Science & Business System" },
      { value: "ECE", label: "Electronics & Communications Engineering" },
      { value: "EEE", label: "Electrical & Electronics Engineering" },
      { value: "CE", label: "Civil Engineering" },
      { value: "ME", label: "Mechanical Engineering" },
      { value: "IT", label: "Information Technology" },
    ];
    const Sections = [
      { value: "A", label: "A", link: "CSE" },
      { value: "B", label: "B", link: "CSE" },
      { value: "C", label: "C", link: "CSE" },
      { value: "D", label: "D", link: "CSE" },
      { value: "A", label: "A", link: "ECE" },
      { value: "B", label: "B", link: "ECE" },
      { value: "A", label: "A", link: "EEE" },
      { value: "A", label: "A", link: "IT" },
      { value: "B", label: "B", link: "IT" },
    ];
    const Subjects = [
      { value: "PPS", label: "PPS", link: "CSE" },
      {
        value: "Software Engineering",
        label: "Software Engineering",
        link: "CSE",
      },
      { value: "Compiler Design", label: "Compiler Design", link: "CSE" },
      {
        value: "Engineering Mechanics",
        label: "Engineering Mechanics",
        link: "CE",
      },
    ];
    const filteredOptions0 = Sections.filter(
      (o) => o.link === this.state.selectedOption1.value
    );
    const filteredOptions1 = Subjects.filter(
      (o) => o.link === this.state.selectedOption1.value
    );


    return (
      <div className="lockList-container">
        <Navbar title="Class List" />
        <div className="flex-container">
          <div className="dropdown">
            <p>YEAR</p>
            <Select
              className="year"
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
              options={filteredOptions0}
              isDisabled={filteredOptions0.length === 0}
            />
          <p>SUBJECT</p>
            <Select
              value={this.state.selectedOption3}
              onChange={this.handleChange3}
              options={filteredOptions1}
              isDisabled={filteredOptions1.length === 0}
            />
            <Button
              className="add-button"
              width="100"
              height="50"
              children="Add"
            />
          </div>
          <div className="list-and-done">
            <div className="list-container">
              <ul>
                <li>Subject 1</li>
                <li>Subject 2</li>
                <li>Subject 3</li>
              </ul>
            </div>
            <Button
              className="done-button"
              width="100"
              height="50"
              children="Done"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default LockList;

