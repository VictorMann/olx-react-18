import { Link, useSearchParams } from 'react-router-dom';
import * as C from './styles';

type Props = {
  page: number;
  totalPage: number;
  url: string;
  onClick: (page: number) => void;
}

function Comp({ url, page, totalPage, onClick }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const makePaginationURL = (page: number): string => {
    searchParams.set('page', String(page));
    return searchParams.toString();
  };

  return (
    <C.Container>
      <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm justify-content-center">
          <li className={page === 1 ? 'page-item disabled' : 'page-item'}>
            <Link
              to={`${url}?${makePaginationURL(page - 1)}`}
              onClick={() => onClick(page - 1)} 
              className="page-link">

                Previous

            </Link>
          </li>
          {new Array(totalPage).fill(0).map((_, index) =>
            <li key={index} className={page === (index + 1) ? 'page-item active' : 'page-item'}>
              <Link 
                to={`${url}?${makePaginationURL(index + 1)}`}
                onClick={() => onClick(index + 1)} 
                className="page-link">

                  {index + 1}

              </Link>
            </li>
          )}
          <li className={page === totalPage ? 'page-item disabled' : 'page-item'}>
            <Link 
              to={`${url}?${makePaginationURL(page + 1)}`}
              onClick={() => onClick(page + 1)} 
              className="page-link">
                
                Next

            </Link>
          </li>
        </ul>
      </nav>
    </C.Container>
  )
}

export default Comp;