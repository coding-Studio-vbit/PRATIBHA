
import './App.css';
import Navbar from '../src/components/global_ui/navbar/navbar'
import Upload from '../src/components/student/uploadpra/uploadpra'
import Grading from './components/faculty/common/grading';
import { Worker } from '@react-pdf-viewer/core';


const App = ()=> {
  return (
    <div className="App">
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js">
        <Grading />
      </Worker>
    </div>
  );
}

export default App;
