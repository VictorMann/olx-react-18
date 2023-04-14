import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdType, CategoryType, UFType } from '../../types';
import * as C from './styles';
import { delay, get } from '../../helpers';
import { api } from '../../Api';

import { Fake } from '../../components/MainComponents';
import AdItem from '../../components/AdItem';
import Pagination from '../../components/Pagination';

var timerDigitando: any = 0;
var liberaEffect1: boolean = false;
var liberaEffect2: boolean = false;
var flagExecuteSearchPagination: boolean = true;

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

  const [currentPage, setCurrentPage] = useState<number>(+get(searchParams.get('page'), 'number', 1));
  const [totalPage, setTotalPage] = useState<number>(1);

  // provoca um delay para fazer a pesquisa na Api de 2s
  const [digitando, setDigitando] = useState<boolean>(false);
  
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
    if (!liberaEffect2) { liberaEffect2 = true; return; }
    flagExecuteSearchPagination = false;
    setLoading(true);

    /**
     * Mudança na URL
     */
    searchParams.delete('page');
    if (uf) searchParams.set('stateLoc', uf);
    else searchParams.delete('stateLoc');
    if (category) searchParams.set('category', category);
    else searchParams.delete('category');
    setSearchParams(searchParams);
    setCurrentPage(1);

    /**
     * Busca dos Itens
     */
    (async () => {
      await searchAds(1);
      setLoading(false);
    })();


  }, [uf, category]);

  useEffect(() => {
    if (!liberaEffect1) { liberaEffect1 = true; return; } 
    flagExecuteSearchPagination = false;
    setLoading(true);
    (async () => {
      if (!digitando) {
        if (q.length > 2 || q === '') {
          if (q === '') searchParams.delete('q');
          else searchParams.set('q', q);
          setSearchParams(searchParams);
          setCurrentPage(1);
          await searchAds(1);
        }
        setLoading(false);
      }
    })();
  }, [digitando, q]);

  useEffect(() => {
    if (!flagExecuteSearchPagination) return;
    setLoading(true);
    (async () => {
      await searchAds();
      setLoading(false);
    })();
  }, [currentPage]);

  async function searchAds(page: number = currentPage) {
    const resp = await api.ads({ category, uf, q, page });
    await delay(200); // 200ms de espera
    if (resp.error) alert(resp.error);
    else {
      setAds(resp.result);
      setCurrentPage(+resp.currentPage);
      setTotalPage(+resp.totalPage);
    }
  }

  const handleChangeQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerDigitando);
    timerDigitando = setTimeout(() => setDigitando(false), 700);
    setDigitando(true);
    setQ(e.target.value);
  };
  const handleChangeUf = (e: React.ChangeEvent<HTMLSelectElement>) => setUf(e.target.value);
  // const handleChangeCat = (e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClickPaginate = (page: number) => {
    flagExecuteSearchPagination = true;
    setCurrentPage(page);
  };

  return (
    <C.Container>
      <div className="container pt-3">
        <div className="row">
          <form className='col-sm-3' onSubmit={handleSubmit}>

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

          <div className="col-sm-9">
            <div className="ad-list mb-4">
              {loading &&
                new Array(4).fill(0).map((_, index) => <Fake key={index} height={'70%'} />)
              }
              {!loading && ads && ads.map(item => <AdItem key={item.id} item={item} />)}
            </div>
            
            {ads && ads.length > 0 && totalPage > 1 &&
              <Pagination 
                url='/ads' 
                page={currentPage} 
                totalPage={totalPage} 
                onClick={handleClickPaginate} />
            }
          </div>
        </div>
      </div>
    </C.Container>
  )
}

export default Page;