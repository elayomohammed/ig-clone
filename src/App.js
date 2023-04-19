import './App.css';
import {Nav, Bio, Gallery} from './components';

const App = () =>{
  return (
    <>
    <Nav />
    <div className="container">
      <Bio />
      <Gallery />
    </div>
    </>
  );
}

export default App;
