import { ChangeEvent, useEffect, useState } from 'react';
import * as C from './styles';

import { ErrorMessage, PageTitle } from '../../components/MainComponents';

import { api } from '../../Api';
import { doLogin } from '../../helpers/authHandler';
import { ErrorType, UFType } from '../../types';



function Page() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [stateLoc, setStateLoc] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  
  const [ufs, setUFs] = useState<UFType[]>([]);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangeState = (e: ChangeEvent<HTMLSelectElement>) => setStateLoc(e.target.value);
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeConfirm = (e: ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value);
  
  useEffect(() => {
    const fn = async () => {
      let resp = await api.uf();
      if (resp.error) setError(resp.error);
      else setUFs(resp);
    };
    fn();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password === confirmPass) {
      setDisabled(true);
  
      const resp = await api.register(name, email, stateLoc, password);
      
      if (resp.token) {
        doLogin(resp.token);
        window.location.href = '/';
      } else if (resp.error) {
        setError(resp.error);
      }
      setDisabled(false);
    } else {
      setError('As senhas devem coincidir');
    }
  };

  return (
    <div className="container">
      <C.Container>

        <PageTitle>Cadastrar-se</PageTitle>

        {error &&
          <ErrorMessage>{error}</ErrorMessage>
        }

        <form onSubmit={handleSubmit} className="bg-white border border-secondary-subtle">

          <div className="mb-3 d-flex">
            <label htmlFor="staticName" className="col-form-label">Nome</label>
            <div className="">
              <input 
                id="staticName"
                className="form-control" 
                type="text" 
                onChange={handleChangeName}
                value={name}
                disabled={disabled}
                required />
            </div>
          </div>

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
                required />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticEstado" className="col-form-label">Estado</label>
            <div className="">
              <select 
                id="staticEstado"
                className="form-select" 
                onChange={handleChangeState}
                value={stateLoc}
                disabled={disabled}
                required>
                  <option></option>
                  {ufs.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
              </select>
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
                required />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticConfirm" className="col-form-label">Confirmar Senha</label>
            <div className="">
              <input 
                id="staticConfirm"
                className="form-control" 
                type="password" 
                onChange={handleChangeConfirm}
                value={confirmPass}
                disabled={disabled}
                required />
            </div>
          </div>


          <div className="d-flex">
            <label className=""></label>
            <div className="">
            <button 
                className='btn btn-sm btn-primary'
                disabled={disabled}>Cadastrar</button>
            </div>
          </div>

        </form>
      </C.Container>
    </div>
  )
}

export default Page;