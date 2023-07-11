import React from 'react';
import { Row, Col, Button } from 'reactstrap';

const Main = props =>{
    return(
        <div>
           <Row className='text-center align-items-center'>
                <Col>
                    
                    <p className='looking-for-table'>Book your game table here!
                    
                    </p>
                    <Button
                     className='book-table-btn'
                     onClick={_ => {
                        props.setPage(1);
                     }}
                     >
                     Book a Table
                     <i className='fa-solid fa-dice game-table'></i>

                    </Button>
                </Col>
           </Row>
           <Row className='text-center big-img-container'>

            <Col>
            <img
            src={require("../images/cafe.jpeg")}
            alt='cafe'
            className='big-img'
            />
            

            </Col>

           </Row>
        </div>
    )
}

export default Main;