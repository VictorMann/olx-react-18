import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as C from './styles';

import { AdType, CategoryType, UFType } from '../../types';
import { PageTitle } from '../../components/MainComponents';
import AdItem from '../../components/AdItem';
import { api } from '../../Api';

function Page() {
  const navigate = useNavigate();
  const [q, setQ] = useState<string>('');
  const [stateLoc, setStateLoc] = useState<string>('');

  const [ufs, setUFs] = useState<UFType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [ads, setAds] = useState<AdType[]>([]);

  useEffect(() => {
    const fn = async () => {
      const resp = await api.uf();
      if (resp.error) alert(resp.error);
      else setUFs(resp);
    };
    fn();
  }, []);

  useEffect(() => {
    const fn = async () => {
      const resp = await api.categoria();
      if (resp.error) alert(resp.error);
      else setCategories(resp);
    };
    fn();
  }, []);

  useEffect(() => {
    const fn = async () => {
      const resp = await api.ads({});
      if (resp.error) alert(resp.error);
      else setAds(resp);
    };
    fn();
  }, []);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value);
  const handleChangeStateLoc = (e: React.ChangeEvent<HTMLSelectElement>) => setStateLoc(e.target.value);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    let params: any = {q, stateLoc};
    for (let prop in params) params[prop] = window.encodeURI(params[prop]);
    let oURLParams = new URLSearchParams(params);
    navigate('/ads?' + oURLParams.toString());
  };

  return (
    <C.Container>
      <div className="area-busca py-4">
        <div className="container">
          <form onSubmit={handleSubmit} className="p-3 my-4 rounded-3">

            <div className="row">

              <div className="col-8">
                <input 
                  className="form-control" 
                  placeholder="O que você procura?"
                  value={q}
                  onChange={handleChangeSearch}
                  required />
              </div>

              <div className="col-2">
                <select 
                  className="form-select"
                  value={stateLoc}
                  onChange={handleChangeStateLoc}>
                    <option>Selecione</option>
                    {ufs.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.id}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-2">
                <button 
                  className='w-100 btn btn-info text-light fw-bold'>Pesquisar</button>
              </div>
            </div>
          </form>

          <ul className="list-unstyled d-flex justify-content-evenly">
            {categories.map(item => (
              <li key={item.id}>
                <Link to={`/ads?category=${item.id}`} className="text-decoration-none">
                  <img src={item.image} alt="" className='me-3' style={{width: '60px'}} />
                  <span>{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>

        </div>
      </div>
      <div>
        <div className="container">
          <PageTitle>Anúncios Recentes</PageTitle>
          <div className='ad-list mb-3'>
            {ads.map(item => (
              <AdItem key={item.id} item={item} />
            ))}
          </div>
          <div className='text-end pb-2 mb-4 border-bottom'><Link to="/ads" className='btn btn-sm btn-warning'>Ver todos</Link></div>
          <p className='text-justify'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged.</p>
        </div>
      </div>
    </C.Container>
  )
}

export default Page;