import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VistaCiudadano.css';
import imgprincipal from '../assets/images/imgprincipalCarrousel.png';
import fondoNegro from '../assets/images/fondoNegroCarrousel.jpg';

const VistaCiudadano = () => {
    return (
        <>
            <div style={{ position: 'relative', width: '100%' }}>
                <img src={imgprincipal} alt="Imagen principal" style={{ height: 'auto', width: '100%' }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    height: '80px',
                    width: '100%',
                    backgroundColor: '#233044',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px'
                }}></div>
            </div>
            
            <div style={{ backgroundImage: `url(${fondoNegro})`, backgroundSize: 'cover', width: '100%', height: '500px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left',fontFamily: 'Cascadia code, sans-serif' }}>
                    <h1 style={{ marginLeft:'30px',marginBottom:'10%',color: 'white', fontSize: '2.5rem', textAlign: 'left' }}>Categorías:</h1>
                    <h2 style={{ color: 'white', fontSize: '3.5rem', textAlign: 'center' }}>¡Nuestras Variedades!</h2>
                </div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div id="carouselExampleIndicators" className="carousel slide rounded" style={{ width: '60%' }}>
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://cdn.pixabay.com/photo/2022/08/29/17/45/burger-7419428_1280.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '200px', height: '200px', border: '5px solid white' }} />
                                <p className="carousel-caption">Título de la imagen</p>
                            </div>
                            <div className="carousel-item">
                                <img src="https://cdn.pixabay.com/photo/2022/08/29/17/45/burger-7419428_1280.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '200px', height: '200px', border: '5px solid white' }} />
                                <p className="carousel-caption">Título de la imagen</p>
                            </div>
                            <div className="carousel-item">
                                <img src="https://cdn.pixabay.com/photo/2022/08/29/17/45/burger-7419428_1280.jpg" className="d-block mx-auto rounded-circle" alt="..." style={{ width: '200px', height: '200px', border: '5px solid white' }} />
                                <p className="carousel-caption">Título de la imagen</p>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true" style={{ color: 'white' }}></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VistaCiudadano;
