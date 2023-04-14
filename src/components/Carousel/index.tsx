import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '50% 0'
}

type Props = {
  images: string[];
};

function Carousel({ images }: Props) {
  return (
    <div className="slide-container">
      <Slide>
        {images.map((img, index)=> (
          <div key={index}>
            <div style={{ ...divStyle, 'backgroundImage': `url(${img})` }}>
            </div>
          </div>
        ))} 
      </Slide>
    </div>
  )
}

export default Carousel;