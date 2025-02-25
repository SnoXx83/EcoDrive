import Image from 'next/image';
import logo from '../../public/images/6365344.jpg';
import section2 from '../../public/images/10051772.jpg'


export default function Home() {
  return (
    <>
      <div className="banner" style={{
        backgroundImage: 'url("/images/road.avif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <h1><span>ECO</span>DRIVE</h1>
        <p> Vous chercher un trajet ? </p>
        <p>Trouvez le trajet qui vous convient le mieux et réservez votre place tout de suite !</p>
        <button className='btn' onClick={(e) => e.preventDefault()}>Trouvez un trajet</button>
      </div>
      <div className="section-1">
        <div>
          <Image
            src={logo}
            alt="Description de l'image"
            width={500}
            height={300}
            style={{
              margin: '0px 100px 0px 0px'
            }}
          />
        </div>
        <div>
          <h2>qdsfsfgsdfs</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam sit totam ipsa consequatur eveniet minima magni numquam architecto tenetur nisi rem consectetur, eos nulla. Praesentium voluptates doloribus fugit et soluta?</p>
        </div>
      </div>

      <div className="section-2">
        <div>
          <h2>qdsfsfgsdfs</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam sit totam ipsa consequatur eveniet minima magni numquam architecto tenetur nisi rem consectetur, eos nulla. Praesentium voluptates doloribus fugit et soluta?</p>
        </div>
        <div>
          <Image
            src={section2}
            alt="Description de l'image"
            width={500}
            height={300}
            style={{
              margin: '0px 100px 0px 0px'
            }}
          />
        </div>

      </div>
      <div className="section-3">
        <div>
          <h3>LOREM IPSUM</h3>
          <div>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500
          </div>
        </div>
        <div>
          <h3>LOREM IPSUM</h3>
          <div>
            Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500
          </div>
        </div>
        <div>
          <h3>LOREM IPSUM</h3>
          <div>
            Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500
          </div>
        </div>
      </div>

      <footer>
        Footer @Copyright 2025-2026
      </footer>
    </>
  );
}
