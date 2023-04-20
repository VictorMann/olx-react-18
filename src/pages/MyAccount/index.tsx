import * as C from './styles';
import { PageTitle } from '../../components/MainComponents';
import { useEffect, useState } from 'react';
import { api } from '../../Api';

import { UFType, AdType } from '../../types';
import AdItem from '../../components/AdItem';

function Page() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [uf, setUf] = useState<string>('');
  
  const [ads, setAds] = useState<AdType[]>([]);
  const [ufs, setUFs] = useState<UFType[]>([]);

  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const resp = await api.myCount();
      if (resp.error) alert(resp.error);
      
      setName(resp.name);
      setEmail(resp.email);
      setUf(resp.uf);
      setAds(resp.ads);

    })();
  }, []);

  useEffect(() => {
    (async () => {
      let resp = await api.uf();
      if (resp.error) alert(resp.error);
      else setUFs(resp);
    })();
  }, []);

  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <C.Container>
      <div className="container">
        <PageTitle>Minha Conta</PageTitle>

        <form onSubmit={handleSubmit} className=''>

          <div className="mb-3 d-flex">
            <label htmlFor="staticName" className="col-form-label">Nome</label>
            <div className="">
              <input 
                id="staticName"
                className="form-control" 
                type="text" 
                onChange={e => setName(e.target.value)}
                value={name}
                disabled={disabled}
                required />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticEmail" className="col-form-label">E-mail</label>
            <div className="">
              <input 
                id="staticEmail"
                className="form-control" 
                type="text" 
                onChange={e => setName(e.target.value)}
                value={email}
                disabled={true}
                required />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticEstado" className="col-form-label">Estado</label>
            <div className="">
              <select 
                id="staticEstado"
                className="form-select" 
                onChange={e => setUf(e.target.value)}
                value={uf}
                disabled={disabled}
                required>
                  <option></option>
                  {ufs.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
              </select>
            </div>
          </div>

        </form>

        <h5>Meus Anúncios</h5>
        <div className='ad-list mb-3'>
          {ads.length && ads.map(item => (
            <AdItem key={item.id} item={item} editable />
          ))}
        </div>

      </div>
    </C.Container>
  )
}

export default Page;