import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavItem from "react-bootstrap/esm/NavItem";
//import FormControl from "react-bootstrap/FormControl"

export default function BootstrapNavbar() {
  return (
    <>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="Home">Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="Home">Home</Nav.Link>
      <Nav.Link href="Datasets">Datasets</Nav.Link>
      <Nav.Link href="QuickLabeler">Quick Labeler</Nav.Link>
    </Nav>
  </Navbar>
    </>
  );
}
