import { Link } from 'react-router-dom';
import * as C from './styles';


import { AdType } from '../../types';

type Props = {
  item: AdType;
}

function Comp({ item }: Props) {

  let price: string = item.priceNegotiable 
  ? 'Preço Negociável'
  : 'R$ ' + item.price;

  return (
    <C.Container className='border rounded p-1'>
      <Link to={`/ad/${item.id}`} className="text-decoration-none">
        <figure className='m-0 d-flex align-items-center bg-white' style={{ backgroundImage: `url(${item.image})` }}>
          <img src={item.image} alt="" className='w-100 rounded' />
        </figure>
        <ul className='list-unstyled bg-white m-0 border-top p-2 rounded'>
          <li className='fw-bold'>{item.title}</li>
          <li>{price}</li>
        </ul>
      </Link>
    </C.Container>
  )
}

export default Comp;