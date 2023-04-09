import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdType, CategoryType, UFType } from '../../types';
import * as C from './styles';
import { delay, get } from '../../helpers';
import { api } from '../../Api';

import AdItem from '../../components/AdItem';
import { useQueryString } from '../../hooks';


function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState<string>(get(searchParams.get('q')));
  const [uf, setUf] = useState<string>(get(searchParams.get('stateLoc')));
  const [category, setCategory] = useState<number|any>(get(searchParams.get('category'), 'number'));
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  
  const [ufs, setUfs] = useState<UFType[]>([]);
  const [cats, setCats] = useState<CategoryType[]>([]);
  const [ads, setAds] = useState<AdType[]>([]);
  
  useEffect(() => {
    (async () => {
      const resp = await api.uf();
      if (resp.error) alert(resp.error);
      else setUfs(resp);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const resp = await api.categoria();
      if (resp.error) alert(resp.error);
      else setCats(resp);
    })();
  }, []);

  useEffect(() => {
    if (q.length > 2) searchParams.set('q', q);
    else if (q === '') searchParams.delete('q');
    if (uf) searchParams.set('stateLoc', uf);
    else searchParams.delete('stateLoc');
    if (category) searchParams.set('category', category);
    else searchParams.delete('category');
    setSearchParams(searchParams);
  }, [q, uf, category]);

  const handleChangeQ = (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value);
  const handleChangeUf = (e: React.ChangeEvent<HTMLSelectElement>) => setUf(e.target.value);
  // const handleChangeCat = (e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <C.Container>
      <div className="container pt-3">
        <div className="row">
          <form className='col-3 pe-2' onSubmit={handleSubmit}>

            <div className="mb-2">
              <input 
                id="staticQ"
                className="form-control form-control-sm" 
                type="text"
                placeholder='O que você procura?' 
                onChange={handleChangeQ}
                value={q}
                disabled={disabled}
                required />
            </div>

            <div className="mb-2">
              <label htmlFor="staticUf" className="mb-1">Estado:</label>
              <div className="">
                <select 
                  id="staticUf"
                  className="form-select form-select-sm" 
                  onChange={handleChangeUf}
                  value={uf}
                  disabled={disabled}>
                    <option></option>
                    {ufs.map(item => 
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    )}
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="staticUf" className="mb-1">Categoria:</label>
              <ul className="list-unstyled">
                {cats.map(item => 
                  <li 
                    key={item.id}
                    className={item.id === category ? 'selected cat-item' : 'cat-item'}
                    onClick={() => setCategory(item.id !== category ? item.id : '')}>
                      <span className='fig' style={{backgroundImage: `url(${item.image})`}}></span>
                      <span>{item.description}</span>
                  </li>
                )}
              </ul>
            </div>


          </form>

          <div className="ad-list col-9 border">
            ...
            {ads.map(item => <AdItem key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </C.Container>
  )
}

export default Page;