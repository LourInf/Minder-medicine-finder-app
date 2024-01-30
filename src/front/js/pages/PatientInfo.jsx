import React from "react"


export const PatientInfo = () => {

    const examplePatient = {
        name: "Test1",
        email: "test@test.test"
    }


    return (

        <div>

            <h2>Patient information</h2>
            <p>Name: {examplePatient.name}</p>
            <p>Email: {examplePatient.email}</p>

        </div>

    )


}