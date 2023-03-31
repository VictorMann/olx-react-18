import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}

type Props = {
  images: string[];
};

function Carousel({ images }: Props) {
  return (
    <div className="slide-container" style={{width: '400px'}}>
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