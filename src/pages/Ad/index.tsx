import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../Api';
import { AdType } from '../../types';
import * as C from './styles';
import { delay, formatLongDate } from '../../helpers';

import Carousel from '../../components/Carousel';
import AdItem from '../../components/AdItem';
import Breadcrumb from '../../components/Breadcrumb';


function Page() {
  const { id } = useParams();
  const [ad, setAd] = useState<AdType>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setAd({});
    const fn = async () => {
      const resp = await api.ad(Number(id), true);
      await delay(); // 500ms de espera
      if (resp.error) alert(resp.error);
      else setAd(resp);
      setLoading(false);
    };
    fn();
  }, [id]);

  return (
    <C.Container>
      <div className="container pt-3">

        {ad.categoria_id &&
          <Breadcrumb label items={[
            {name: 'Home', link: '/'},
            {name: ad.uf, link: `/ads?stateLoc=${ad.uf}`},
            {name: ad.categoria_description, link: `/ads?stateLoc=${ad.uf}&category=${ad.categoria_id}`},
            {name: ad.title}
          ]} />
        }

        <div className="area-item d-flex">
          <div className='d-flex border rounded me-3 bg-white shadow-sm'>
            <figure className='m-0'>
              {loading && <C.Fake height={200} />}
              {ad.images &&
                <Carousel images={ad.images} />}
            </figure>
            <div className='p-2 mt-5'>

              {loading && <C.Fake />}
              {ad.title && <h3>{ad.title}</h3>}

              <div className='m-0'>
                {loading && <C.Fake height={50} />}
                {ad.date_created && 
                  <span className='detail-date'>Criado em {formatLongDate(ad.date_created)}</span>}
                {ad.date_created && 
                  <span className='detail-desc'>{ad.description}</span>}
                {ad.views !== undefined && 
                  <span className='detail-views'>Visualizações: {ad.views}</span>}
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded bg-white shadow p-2 mb-3">
              {loading && <C.Fake height={15} />}
              {ad.priceNegotiable == 1 &&
                <span className='fs-6 fw-bold text-primary'>Preço Negociável</span>
              }
              {ad.price && !ad.priceNegotiable &&
                <>
                  <span className='d-block'>Preço:</span>
                  <span className="d-block fs-4 fw-bold text-primary">R$ {ad.price}</span>
                </>
              }
            </div>
            <div className="border rounded mb-3">
              {loading && <C.Fake height={15} />}
              {!loading &&
                <button className="btn btn-sm btn-primary w-100">Fale com o vendedor</button>
              }
            </div>
            <div className="border rounded bg-white shadow p-2 mb-3" style={{fontSize: '.9em'}}>
              {loading && <C.Fake height={30} />}
              {!loading && ad.user_name &&
                <>
                  <span className="d-block fw-bold mb-2 fs-6">{ad.user_name}</span>
                  <span className="d-block text-secondary mb-2">e-mail: {ad.email}</span>
                  <span className="d-block text-secondary">Estado: {ad.uf}</span>
                </>
              }
            </div>
          </div>
        </div>

        <div className="area-similares mt-3">
          {loading && <C.Fake height={15} />}
          {ad.similares?.length && <h5>Outras ofertas do vendedor</h5>}
          <div className="ad-list mt-3">
            {loading &&
              new Array(4).fill(0).map((_, index) => <C.Fake key={index} height={125} />)
            }
            {ad.similares &&
              ad.similares.map(item => (
                <AdItem key={item.id} item={item} />
              ))}
          </div>
        </div>

      </div>
    </C.Container>
  )
}

export default Page;