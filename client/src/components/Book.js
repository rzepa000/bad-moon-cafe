import React, { useEffect, useState } from 'react';
import { Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import Table from './Table';

const Book = props =>{
    const [totalTables, setTotalTables]=useState([])
    //user selections
    const [selection,setSelection]=useState({
        table: {
            name: null,
            id: null
        },
        date: new Date(),
        time: null,
        gameTypes: "Game Type",
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
        "Warhammer",
        "Board games",
        "Chess"
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
        const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

        const date =
            months[selection.date.getMonth()] +
            " " +
            selection.date.getDate() +
            " " +
            selection.date.getFullYear();
        let time = selection.time.slice(0, -2);
        time = selection.time > 12 ? time + 12 + ":00" : time + ":00";
        console.log(time);
        const datetime = new Date(date + " " + time);
        return datetime;
    };
    
    const getEmptyTables = () => {
      let tables = totalTables.filter(table => table.isAvailable);
      return tables.length;
    };
  
    useEffect(() => {
      // check availibility of tables from db
      if (selection.time && selection.date) {
        (async () => {
          let datetime = getDate();
          let res = await fetch("http://localhost:3005/availability", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              date: datetime
            })
          });
          res = await res.json();
          // filter tables with gametype and size criteria
          let tables = res.tables.filter(
            table =>
            (selection.size > 0 ? table.capacity >= selection.size : true) &&
            (selection.gameTypes !== "Any game"
              ? table.gameTypes === selection.gameTypes : true
              )
          );
          setTotalTables(tables);
        })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection.time, selection.date, selection.size, selection.gameTypes]);
//make reservation if all details are filled out
const reserve = async () => {
  if (booking.name.length === 0 || booking.phone.length === 0 || booking.email.length === 0) {
    console.log("incomplete details");
    setReservationError(true);
  } else {
    const datetime = getDate();
    let res = await fetch("http://localhost:3005/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...booking,
        date: datetime,
        table: selection.table.id
      })
    });
    res = await res.text();
    console.log("reserved" + res);
    props.setPage(2);
  }
};

const selectTable =(table_name, table_id) =>{
    setSelection({
        ...selection,
        table:{
            name: table_name,
            id: table_id
        }
    })
}

const getSizes = _ =>{
    let newSizes = [];
        for(let i=1;i<8; i++){
        newSizes.push(
        <DropdownItem
            key={i}
            className='booking-dropdown-item'
            onClick={e=>{
                let newSel={
                    ...selection,
                    table:{
                        ...selection.table
                    },
                    size: i
                }
                setSelection(newSel)
            }}
        >
        {i}
        </DropdownItem>
        );
    }
return newSizes;
}

const getGameTypes = _ =>{
    let newGameTypes = [];
        gameTypes.forEach(typ =>{
            newGameTypes.push(
                <DropdownItem
                    key={typ}
                    className="booking-dropdown-item"
                    onClick={_=>{
                        let newSel={
                            ...selection,
                            table:{
                                ...selection.table
                            },
                            gameTypes: typ
                        }
                        setSelection(newSel)
                    }}
                >
                {typ}
                </DropdownItem>
                );
            
        })
        
return newGameTypes;
}

// Generate times dropdown
const getTimes = _ => {
    let newTimes = [];
    times.forEach(time => {
      newTimes.push(
        <DropdownItem
          key={time}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              time: time
            };
            setSelection(newSel);
          }}
        >
          {time}
        </DropdownItem>
      );
    });
    return newTimes;
  };

const getTables = _ => {
    console.log("Getting tables");
    if (getEmptyTables() > 0) {
      let tables = [];
      totalTables.forEach(table => {
        if (table.isAvailable) {
          tables.push(
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              empty
              selectTable={selectTable}
            />
          );
        } else {
          tables.push(
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              selectTable={selectTable}
            />
          );
        }
      });
      return tables;
    }
};

    return (
    <div>
      <Row className="text-center align-items-center badmoon-cta">
        <Col>
          <p className="looking-for-table">
            {!selection.table.id ? "Book a Table" : "Confirm Reservation"}
            <i
              className={
                !selection.table.id
                  ? "fas fa-chair badmoon-slice"
                  : "fas fa-clipboard-check badmoon-slice"
              }
            ></i>
          </p>
          <p className="selected-table">
            {selection.table.id
              ? "You are booking table " + selection.table.name
              : null}
          </p>

          {reservationError ? (
            <p className="reservation-error">
              * Please fill out all of the details.
            </p>
          ) : null}
        </Col>
      </Row>

      {!selection.table.id ? (
        <div id="reservation-stuff">
          <Row className="text-center align-items-center">
            <Col xs="12" sm="3">
              <input
                type="date"
                required="required"
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={e => {
                  if (!isNaN(new Date(new Date(e.target.value)))) {
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date(e.target.value)
                    };
                    setSelection(newSel);
                  } else {
                    console.log("Invalid date");
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date()
                    };
                    setSelection(newSel);
                  }
                }}
              ></input>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time === null ? "Select a Time" : selection.time}
                </DropdownToggle>
                <DropdownMenu end className="booking-dropdown-menu">
                  {getTimes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
                                <UncontrolledDropdown>
                                    <DropdownToggle color='none'caret className='booking-dropdown'>
                                        {selection.gameTypes}
                                    </DropdownToggle>
                                    <DropdownMenu
                                    end
                                    className='booking-dropdown-menu'
                                    
                                    >
                                        {getGameTypes()}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.size === 0
                    ? "Select a Party Size"
                    : selection.size.toString()}
                </DropdownToggle>
                <DropdownMenu end className="booking-dropdown-menu">
                  {getSizes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <Row className="tables-display">
            <Col>
              {getEmptyTables() > 0 ? (
                <p className="available-tables">{getEmptyTables()} available</p>
              ) : null}

              {selection.date && selection.time ? (
                getEmptyTables() > 0 ? (
                  <div>
                    <div className="table-key">
                      <span className="empty-table"></span> &nbsp; Available
                      &nbsp;&nbsp;
                      <span className="full-table"></span> &nbsp; Unavailable
                      &nbsp;&nbsp;
                    </div>
                    <Row >{getTables()}</Row>
                  </div>
                ) : (
                  <p className="table-display-message">No Available Tables</p>
                )
              ) : (
                <p className="table-display-message">
                  Please select a date and time for your reservation.
                </p>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <div id="confirm-reservation-stuff">
          <Row
            
            className="text-center justify-content-center reservation-details-container"
          >
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Name"
                className="reservation-input"
                value={booking.name}
                onChange={e => {
                  setBooking({
                    ...booking,
                    name: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Phone Number"
                className="reservation-input"
                value={booking.phone}
                onChange={e => {
                  setBooking({
                    ...booking,
                    phone: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Email"
                className="reservation-input"
                value={booking.email}
                onChange={e => {
                  setBooking({
                    ...booking,
                    email: e.target.value
                  });
                }}
              />
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Button
                color="none"
                className="book-table-btn"
                onClick={_ => {
                  reserve();
                }}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default Book;