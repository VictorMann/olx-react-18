import { useDispatch } from 'react-redux';
import { setAd, setOpen } from '../../redux/reducers/modalAdItemReducer';
import { Link } from 'react-router-dom';
import * as C from './styles';
import { api } from '../../Api';
import { AdType } from '../../types';

type Props = {
  item: AdType;
  editable?: boolean;
}

function Comp({ item, editable }: Props) {
  const dispatch = useDispatch();

  let price: string = item.priceNegotiable 
  ? 'Preço Negociável'
  : 'R$ ' + item.price;

  const handleClickEdit = async (id: number) => {
    const resp = await api.ad(id);
    if (resp.error) alert(resp.error);
    else {
      dispatch( setAd(resp) );
      dispatch( setOpen(true) );
    }
  };

  return (
    <C.Container className='border rounded p-1'>
      {editable
        ?
          <div className="editable">
            <ul className='editable-menu'>
              <li><span onClick={() => handleClickEdit(Number(item.id))}>edit</span></li>
              <li><Link to={`/ad/${item.id}`}>view</Link></li>
            </ul>
            <figure className='m-0 d-flex align-items-center bg-white' style={{ backgroundImage: `url(${item.image})` }}>
              <img src={item.image} alt="" className='w-100 rounded' />
            </figure>
            <ul className='list-unstyled bg-white m-0 border-top p-2 rounded'>
              <li className='fw-bold'>{item.title}</li>
              <li>{price}</li>
            </ul>
          </div>
        :
          <Link to={`/ad/${item.id}`} className="text-decoration-none">
            <figure className='m-0 d-flex align-items-center bg-white' style={{ backgroundImage: `url(${item.image})` }}>
              <img src={item.image} alt="" className='w-100 rounded' />
            </figure>
            <ul className='list-unstyled bg-white m-0 border-top p-2 rounded'>
              <li className='fw-bold'>{item.title}</li>
              <li>{price}</li>
            </ul>
          </Link>
      }
      
    </C.Container>
  )
}

export default Comp;