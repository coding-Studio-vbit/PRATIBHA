import React from 'react';
import './App.css';
import ListofStudents from './components/faculty/common/ListOfStudents';
// import LockList from './components/faculty/common/lockList';

const App = ()=> {
  return (
    <div className="App">
      <ListofStudents />
      {/* <LockList /> */}
      
    </div>
  );
}

export default App;
