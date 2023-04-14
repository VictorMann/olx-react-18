import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';
import * as C from './styles';
import { PageTitle, ErrorMessage } from '../../components/MainComponents';
import { api } from '../../Api';
import { CategoryType } from '../../types';
import { onlyTypesOfImages } from '../../helpers';

function Page() {
  const navigate = useNavigate();
  const fileField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [priceNegotiable, setPriceNegotiable] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);


  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const priceMask = createNumberMask({
    prefix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ','
  });

  useEffect(() => {
    (async () => {
      const resp = await api.categoria();
      if (resp.error) alert(resp.error);
      else setCategoryList(resp);
    })()
  }, []);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleChangeCat = (e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value);
  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value);
  const handleChangePriceNegotiable = (e: React.ChangeEvent<HTMLInputElement>) => setPriceNegotiable(!priceNegotiable);
  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (fileField.current?.files) {
      let status = Array.prototype.every.call(fileField.current.files, file => onlyTypesOfImages(file.type));
      if (status) {
        setError('');
        setDisabled(true);

        let fData = new FormData();
        fData.append('title', title);
        fData.append('category', category);
        fData.append('price', price);
        fData.append('priceNegotiable', priceNegotiable ? '1' : '0');
        fData.append('description', description);

        Array.prototype.forEach.call(fileField.current.files, file => fData.append('images', file));

        const resp = await api.AdSend(fData);
        if (resp.error) setError(resp.error);
        else navigate(`/ad/${resp.id}`);
        setDisabled(false);
      } else {
        setError('Formato de arquivo invalido! Apenas imagens é permitido');
      }
    } else {
      setError('Necessário ao menos uma imagem');
    }
  };

  return (
    <C.Container>
      <div className="container">

        <PageTitle>Poste um anúncio</PageTitle>

        {error &&
          <ErrorMessage>{error}</ErrorMessage>
        }

        <form onSubmit={handleSubmit} className="bg-white border border-secondary-subtle">
          
          <div className="mb-3 d-flex">
            <label htmlFor="staticName" className="col-form-label">Título</label>
            <div className="">
              <input 
                id="staticName"
                className="form-control" 
                type="text" 
                onChange={handleChangeTitle}
                value={title}
                disabled={disabled}
                required />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticCategory" className="col-form-label">Categoria</label>
            <div className="">
              <select 
                id="staticCategory"
                className="form-select" 
                onChange={handleChangeCat}
                value={category}
                disabled={disabled}
                required>
                  <option></option>
                  {categoryList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.description}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticPrice" className="col-form-label">Preço</label>
            <div className="">
              <MaskedInput 
                mask={priceMask}
                id="staticPrice"
                className="form-control" 
                placeholder='R$'
                onChange={handleChangePrice}
                value={price}
                disabled={disabled || priceNegotiable} />
            </div>
          </div>

          <div className="area-select mb-3 d-flex">
            <label htmlFor="staticNegotiable" className="form-check-label">Preço Negociável</label>
            <div className="">
              <input 
                id="staticNegotiable"
                className="form-check-input" 
                type="checkbox" 
                onChange={handleChangePriceNegotiable}
                checked={priceNegotiable}
                disabled={disabled} />
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label htmlFor="staticDesc" className="col-form-label">Descrição</label>
            <div className="">
              <textarea 
                id="staticDesc"
                className="form-control" 
                onChange={handleChangeDesc}
                value={description}
                disabled={disabled}></textarea>
            </div>
          </div>

          <div className="mb-3 d-flex">
            <label className="form-check-label">Imagens (1 ou mais)</label>
            <div className="">
              <input 
                ref={fileField}
                type="file" 
                className="form-control" 
                multiple
                disabled={disabled} 
                required />
            </div>
          </div>

          <div className="d-flex">
            <label className=""></label>
            <div className="">
            <button 
                className='btn btn-sm btn-primary w-25'
                disabled={disabled}>Postar</button>
            </div>
          </div>

        </form>

      </div>
    </C.Container>
  )
}

export default Page;