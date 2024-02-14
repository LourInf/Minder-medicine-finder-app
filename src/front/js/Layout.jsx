import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
// Imports pages or views
import { Home } from "./pages/Home.jsx";
import { Results } from "./pages/Results.jsx";
import { PharmacyDashboard } from "./pages/PharmacyDashboard.jsx"; // Main pharmacy area component
import { PatientDashboard } from "./pages/PatientDashboard.jsx"; // Main patient area component
import { OrderConfirmation } from "./pages/OrderConfirmation.jsx";
// Import components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { NavigationBar } from "./component/NavigationBar.jsx";
import { Footer } from "./component/Footer.jsx";
import { PharmacyProfile } from "./component/PharmacyProfile.jsx";
import { Availability } from "./component/Availability.jsx";
import { Reservations } from "./component/Reservations.jsx";
import { PatientProfile } from "./component/PatientProfile.jsx";
import { Orders } from "./component/Orders.jsx";
import { Maps } from "./component/Maps.jsx"
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { SearchNamePharmacy } from "./component/SearchNamePharmacy.jsx";
import { DetailsPharmacyMaps } from "./component/DetailsPharmacyMaps.jsx";
import { Notification } from "./component/Notification.jsx";


// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // You can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <NavigationBar />
                    <Notification />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Results />} path="/results" />
                        <Route element={<Results />} path="/results/:medicineId/:cityName" />
                        <Route element={<OrderConfirmation />} path="/order-confirmation" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Maps />} path="/maps" />
                        <Route element={<SearchNamePharmacy />} path="/findyourpharmacy" />
                        <Route element={<DetailsPharmacyMaps />} path="/pharmacies-details/:place_id" component={DetailsPharmacyMaps} />
                         {/* React Router Outlet: 1.Define the parent route for the pharmacy dashboard */}
                         <Route path="/pharmacy" element={<PharmacyDashboard />}> 
                             {/* 2.Define the nested routes for the different sections within the pharmacy dashboard */}
                            <Route index element={<Availability />} /> {/* 3. Set the default section to render with index route: Navigating to /pharmacy will by default render Availability component */}
                            <Route path="availability" element={<Availability />} />
                            <Route path="reservations" element={<Reservations />} />
                            {/* <Route path="pharmacy-profile" element={<PharmacyProfile />} /> */}
                        </Route>
                         {/* React Router Outle for Patient dashboard */}
                         <Route path="/patient" element={<PatientDashboard />}> 
                            <Route index element={<Orders />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="patient-profile" element={<PatientProfile />} />
                        </Route>
                        <Route element={<h1>Not found!</h1>} path="*"/>
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};


export default injectContext(Layout);
