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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);

    const resp = await api.login(email, password);

    if (resp.error) {
      setError(resp.error);
    } else {
      doLogin(resp.token, rememberPassword);
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

        <form onSubmit={handleSubmit} className="bg-white border border-secondary-subtle">

          <div className="mb-3 d-flex">
            <label htmlFor="staticEmail" className="col-form-label">Email</label>
            <div className="">
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

          <div className="mb-3 d-flex">
            <label htmlFor="staticPass" className="col-form-label">Senha</label>
            <div className="">
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

          <div className="area-remember-pass mb-3 d-flex">
            <label htmlFor="staticRem" className="form-check-label">Lembrar Senha</label>
            <div className="">
              <input 
                id="staticRem"
                className="form-check-input" 
                type="checkbox" 
                onChange={handleChangeRemember}
                checked={rememberPassword}
                disabled={disabled} />
            </div>
          </div>

          <div className="d-flex">
            <label className=""></label>
            <div className="">
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