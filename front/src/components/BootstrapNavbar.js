import React from "react";
import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
//import FormControl from "react-bootstrap/FormControl"

export default function BootstrapNavbar() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="Home">Open Data Labeler</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#Home">Home</Nav.Link>
          <NavDropdown title="Datasets" id="collasible-nav-dropdown">
            <NavDropdown.Item href="/Datasets/View">View Datasets </NavDropdown.Item>
            <NavDropdown.Item href="/Datasets/Create">Create Dataset</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#QuickLabeler">Quick Labeler</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}
