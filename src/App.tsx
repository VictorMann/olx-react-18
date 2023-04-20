import './App.css';
import { useAppSelector } from './redux/hooks/useAppSelector';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';

import { Template } from './components/MainComponents';
import Header from './components/partials/Header';
import Footer from './components/partials/Footer';

import ModalAdItem from './components/ModalAdItem';

function App() {
  const modalAdItem = useAppSelector(state => state.modalAdItem);
  return (
    <BrowserRouter>
      <>
        <Template>
          <Header />
          <Routes />
          <Footer />
        </Template>
        {modalAdItem.opened && <ModalAdItem />}
      </>
    </BrowserRouter>
  );
}

export default App;
