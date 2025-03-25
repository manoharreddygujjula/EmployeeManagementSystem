import React from 'react'

const PrivateRoute = ({children}) => {
    return localStorage.getItem("valid") ? children : <Navigate to="/" />;
}

export default PrivateRoute