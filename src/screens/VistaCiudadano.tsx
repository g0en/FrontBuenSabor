import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Toolbar } from '@mui/material';
import './VistaCiudadano.css'
const VistaCiudadano = () => {
    return (
        <>
       <Container maxWidth="False" className="main-container" >
            <div id="carouselExampleIndicators" className="carousel slide rounded" >
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://cdn.pixabay.com/photo/2022/08/29/17/45/burger-7419428_1280.jpg" className="d-block w-100" alt="..." style={{ width:'50%',height: '400px' , objectFit: 'contain'  }} />
                    </div>
                    <div className="carousel-item">
                        <img src="https://i.pinimg.com/736x/8a/c4/0e/8ac40e49184747a1756f54260d418b52.jpg" className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'contain'  }} />
                    </div>
                    <div className="carousel-item">
                        <img src="https://cdn.pixabay.com/photo/2022/08/29/17/45/burger-7419428_1280.jpg" className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'contain'  }} />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{color:'black'}}></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            </Container>
        </>
    );
};

export default VistaCiudadano;
