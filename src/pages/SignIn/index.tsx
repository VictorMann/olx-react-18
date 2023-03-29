import { ChangeEvent, useEffect, useState } from 'react';
import * as C from './styles';

import { ErrorMessage, PageTitle } from '../../components/MainComponents';

import { api } from '../../Api';
import { doLogin } from '../../helpers/authHandler';



function Page() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeRemember = (e: ChangeEvent<HTMLInputElement>) => setRememberPassword(!rememberPassword);
  
  useEffect(() => {
    const fn = async () => await api.myCount();
    fn();
  
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);

    const json = await api.logion(email, password);

    if (json.error) {
      setError(json.error);
    } else {
      doLogin(json.token, rememberPassword);
      window.location.href = '/';
    }

    setDisabled(false);
  };

  return (
    <div className="container">
      <C.Container>

        <PageTitle>Login</PageTitle>

        {error &&
          <ErrorMessage>{error}</ErrorMessage>
        }

        <form onSubmit={handleSubmit} className="bg-white py-5 border border-secondary-subtle">

          <div className="mb-3 row">
            <label htmlFor="staticEmail" className="col-sm-2 col-form-label text-end">Email</label>
            <div className="col-sm-4">
              <input 
                id="staticEmail"
                className="form-control" 
                type="email" 
                onChange={handleChangeEmail}
                value={email}
                disabled={disabled}
                required={true} />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="staticPass" className="col-sm-2 col-form-label text-end">Senha</label>
            <div className="col-sm-4">
              <input 
                id="staticPass"
                className="form-control" 
                type="password" 
                onChange={handleChangePassword}
                value={password}
                disabled={disabled}
                required={true} />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="staticRem" className="col-sm-2 form-check-label text-end">Lembrar Senha</label>
            <div className="col-sm-4">
              <input 
                id="staticRem"
                className="form-check-input" 
                type="checkbox" 
                onChange={handleChangeRemember}
                checked={rememberPassword}
                disabled={disabled} />
            </div>
          </div>

          <div className="row">
            <label className="col-sm-2"></label>
            <div className="col-sm-4">
            <button 
                className='btn btn-sm btn-primary'
                disabled={disabled}>Fazer Login</button>
            </div>
          </div>

        </form>
      </C.Container>
    </div>
  )
}

export default Page;