import { Link } from 'react-router-dom';
import * as C from './styles';

import { isLogged, doLogout } from '../../../helpers/authHandler';
import { api } from '../../../Api';


function Comp() {
  let logged = isLogged();

  const handleLogout = async () => {
    await api.logout();
    doLogout();
    window.location.href = '/';
  };

  return (
    <C.Container className='border border-secondary-subtle bg-white'>
      <div className='container d-flex justify-content-between align-items-center py-2'>
        <div className='logo'>
          <Link to="/" className='text-decoration-none'>
            <span className='logo-1'>O</span>
            <span className='logo-2'>L</span>
            <span className='logo-3'>X</span>
          </Link>
        </div>
        <nav>
          <ul className='list-unstyled d-flex align-items-center'>
            {logged &&
              <>
                <li><Link to="/my-account" className='text-decoration-none pe-5'>Minha Conta</Link></li>
                <li><button 
                  type="button" 
                  className='btn btn-link text-decoration-none pe-5'
                  onClick={() => handleLogout()}>Sair</button></li>
                <li><Link className='btn btn-sm btn-warning' to="/post-an-ad">Poste um anúncio</Link></li>
              </>
            }
            {!logged &&
              <>
                <li><Link to="/signin" className='text-decoration-none pe-5'>Login</Link></li>
                <li><Link to="/signup" className='text-decoration-none pe-5'>Cadastrar</Link></li>
                <li><Link className='btn btn-sm btn-warning shadow-sm text-white' to="/signin">Poste um anúncio</Link></li>
              </>
            }
          </ul>
        </nav>
      </div>
    </C.Container>
  )
}

export default Comp;