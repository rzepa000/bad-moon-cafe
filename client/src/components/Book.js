import React, { useState } from 'react';
import { Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import Table from './Table';

const Book = _ =>{
    const [totalTables, setTotalTables]=useState([])
    //user selections
    const [selection,setSelection]=useState({
        table: {
            name: null,
            id: null
        },
        date: new Date(),
        time: null,
        location: "Game Type",
        size: 0
    });

    //user booking details
    const [booking, setBooking]=useState({
        name: "",
        phone: "",
        email: ""
    });

    //Game types and times
    const [gameTypes]=useState([
        "warhammer",
        "board games",
        "chess"
    ])
    const [times]=useState([
        "10AM",
        "12AM",
        "2PM" , 
        "4PM"
    ])
    // reservation validation
    const [reservationError, setReservationError]= useState(false);

    const getDate = _=>{
        const months =["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
        const date = months[selection.date.getMonth()] + " " + selection.date.getDate() + " " + selection.date.getFullYear();
        let time = selection.time > 12 ? time + 12 + ":00" : time;
        console.log(time);
        const datetime= new Date(date + " " + time);
        return datetime;
    };
    
    const getEmptyTables= _ =>{
        let tables = totalTables.filter(table => table.isAvailable);
        return tables.length;
    }

    return(
        <div>
            <p>bookking</p>
        </div>
    )
}

export default Book;