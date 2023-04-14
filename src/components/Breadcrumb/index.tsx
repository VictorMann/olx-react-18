import { Link } from 'react-router-dom';
import * as C from './styles';

type Props = {
  items: any[];
  label?: boolean;
};

function Comp({ items, label }: Props) {
  return (
    <C.Container className='my-breadcrumb d-flex'>
      {label && <div className='me-2'>Você está aqui:</div>}
      <ul className='list-unstyled d-flex'>
        {items.map((item, index) => (
          <li key={index}>
            {item.link
              ? <Link to={item.link}>{item.name}</Link>
              : item.name
            }
          </li>
        ))}
      </ul>
    </C.Container>
  )
}

export default Comp;