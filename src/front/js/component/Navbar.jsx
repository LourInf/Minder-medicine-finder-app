import React from "react";
import { Link } from "react-router-dom";


export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
					<Link to="/maps">
						<button className="btn btn-success m-1">Maps</button>
					</Link>
					<Link to="/citymap">
						<button className="btn btn-success m-1">Maps</button>
					</Link>
					<Link to="/findyourpharmacy">
						<button className="btn btn-info m-1">Búsqueda Farmacia Nombre</button>
					</Link>
					<Link to="/">
						<button className="btn btn-warning">Home</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
