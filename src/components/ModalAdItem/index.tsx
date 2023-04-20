import { useDispatch } from 'react-redux';
import { setOpen, setAd } from '../../redux/reducers/modalAdItemReducer';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';
import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks/useAppSelector';
import { api } from '../../Api';
import * as C from './styles';

import { delay, formatMoeda, formatNumber } from '../../helpers';
import { CategoryType } from '../../types';

function Comp() {
  const dispatch = useDispatch();
  let ad = useAppSelector(state => state.modalAdItem.ad);
  
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const fileField = useRef<HTMLInputElement>(null);
  const [imagesRemove, setImagesRemove] = useState<string[]>([]);
  

  useEffect(() => {
    (async () => {
      const resp = await api.categoria();
      if (resp.error) alert(resp.error);
      else setCategoryList(resp);
    })()
  }, []);

  useEffect(() => {
    let xAd: any = {...ad};
    xAd.price = formatMoeda(xAd.price);
    dispatch( setAd(xAd) );
    // console.log(ad);
    setTimeout(() => setActive(true), 10);
    romoveRoller();
  }, []);

  const close = async (e: any) => {
    if(e.target.classList.contains('close-modal')) {
      setActive(false);
      await delay(300);
      dispatch( setOpen(false) );
      romoveRoller(false);
    }
  };

  const romoveRoller = (status: boolean = true) => {
    if (status) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  };

  const priceMask = createNumberMask({
    prefix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ','
  });

  const handleChange = (prop: string, value: string|number|boolean) => {
    let xAd: any = {...ad};
    xAd[prop] = value;
    dispatch( setAd(xAd) );
  };

  const removeImage = (img: string, index: number) => {
    let xRemove = [...imagesRemove];
    xRemove.push(img);
    setImagesRemove(xRemove);
    let xAd: any = {...ad};
    let images = [...xAd.images].filter((_,idx) => (idx !== index));
    xAd.images = images;
    dispatch( setAd(xAd) );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData();
    console.log(ad);
    let price = formatNumber(String(ad.price));
    
    formData.append('title', String(ad.title));
    formData.append('categoria_id', String(ad.categoria_id));
    formData.append('price', String(price));
    formData.append('priceNegotiable', String(ad.priceNegotiable ? 1 : 0));
    formData.append('description', String(ad.description));

    if (fileField.current?.files) {
      Array.prototype.forEach.call(fileField.current.files, file => formData.append('images', file));
    }

    // Caso haja imagens para remover
    if (imagesRemove.length > 0) {
      let xImgs = imagesRemove
      .map(img => {
        let result = img.match(/.*\/(.*\.\w{3,4})$/);
        if (result) return result[1];
        return null;
      })
      .filter(img => img);

      console.log(xImgs);

      xImgs.forEach(img => formData.append('imagesRemove[]', String(img)));
    }

    const resp = await api.AdUpdate(Number(ad.id), formData);
    if (resp.error) alert(resp.error);
    else document.location.reload();
  };

  return (
    <C.Container className='close-modal' onClick={close}>
      <div className={active ? 'modal-content active' : 'modal-content'}>
        
      <form onSubmit={handleSubmit} className="bg-white">
          
          <div className="mb-3">
            <label htmlFor="staticName" className="col-form-label">Título</label>
            <div className="">
              <input 
                id="staticName"
                className="form-control" 
                type="text" 
                onChange={e => handleChange('title', e.target.value)}
                value={ad.title}
                disabled={disabled}
                required />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="staticCategory" className="col-form-label">Categoria</label>
            <div className="">
              <select 
                id="staticCategory"
                className="form-select" 
                onChange={e => handleChange('categoria_id', e.target.value)}
                value={Number(ad.categoria_id)}
                disabled={disabled} 
                required>
                  {categoryList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.description}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="staticPrice" className="col-form-label">Preço</label>
            <div className="">
              <MaskedInput 
                mask={priceMask}
                id="staticPrice"
                className="form-control" 
                placeholder='R$'
                onChange={e => handleChange('price', e.target.value)}
                value={ad.price}
                disabled={disabled || Boolean(ad.priceNegotiable)} />
            </div>
          </div>

          <div className="area-select mb-3">
            <label htmlFor="staticNegotiable" className="form-check-label">Preço Negociável</label>
            <div className="">
              <input 
                id="staticNegotiable"
                className="form-check-input" 
                type="checkbox" 
                onChange={e => handleChange('priceNegotiable', e.target.checked ? 1 : 0)}
                checked={Boolean(ad.priceNegotiable)}
                disabled={disabled} />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="staticDesc" className="col-form-label">Descrição</label>
            <div className="">
              <textarea 
                id="staticDesc"
                className="form-control" 
                onChange={e => handleChange('description', e.target.value)}
                value={ad.description}
                rows={5}
                disabled={disabled}></textarea>
            </div>
          </div>

          <ul className='list-images list-unstyled'>
            {ad.images && ad.images.length > 0 &&
              ad.images.map((img, index) => (
                <li key={index} style={{ backgroundImage: `url(${img})` }}>
                  <span onClick={() => removeImage(img, index)}>x</span>
                </li>
              ))
            }
          </ul>

          <div className="mb-3">
            <label className="form-check-label">Imagens (1 ou mais)</label>
            <div className="">
              <input 
                ref={fileField}
                type="file" 
                className="form-control" 
                multiple
                disabled={disabled} />
            </div>
          </div>

          <div className="">
            <label className=""></label>
            <div className="">
            <button 
                className='btn btn-sm btn-primary w-25'
                disabled={disabled}>Salvar</button>
            </div>
          </div>

        </form>

      </div>
    </C.Container>
  )
}

export default Comp;