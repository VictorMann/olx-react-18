import './App.css';
import { useAppSelector } from './redux/hooks/useAppSelector';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';

import { Template } from './components/MainComponents';
import Header from './components/partials/Header';
import Footer from './components/partials/Footer';

function App() {
  const user = useAppSelector(state => state.user);
  return (
    <BrowserRouter>
      <Template>
        <Header />
        <Routes />
        <Footer />
      </Template>
    </BrowserRouter>
  );
}

export default App;
