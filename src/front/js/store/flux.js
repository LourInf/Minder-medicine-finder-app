const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			pharmacies: [],
			pharmacyDetails: [],
			autocompleteSuggestions: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");  // Use getActions to call a function within a fuction
			},
			getMessage: async () => {
				try {
					// Fetching data from the backend
					const response = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await response.json()
					setStore({message: data.message})
					return data;  // Don't forget to return something, that is how the async resolves
				} catch(error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				// We have to loop the entire demo array to look for the respective index and change its color
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},
			// Get Pharmacies y Details...
			getPharmacies: async (city) => {
				// 1. Definir la URL que está en el env. Parámetro city. 
				// const url_maps = `${https://redesigned-carnival-vxg7gq6x7v4c6wv9-3001.app.github.dev/api/maps?city=${city}`;
				const url_maps = `${process.env.BACKEND_URL}/api/maps?city=${city}`;
				// 2. Options - únicamente GET del listado de Farmacias
				const options = {
					method: 'GET'
				};
				// 3. Response
				const response = await fetch(url_maps, options);
				// 4. Verificar response (console log)
				if (response.ok) {
					// 5. If = ok; Tratamiento del OK - definimos el data
					const data = await response.json();
					// Grabar los datos en el store y en local Storage
					setStore({ "pharmacies": data.results })
					localStorage.setItem('pharmacies', JSON.stringify(data.results))
					console.log(data),
						console.log(data.results) // para ver qué trae

				} else {
					console.log('Error:', "No encuentra Farmacias Cercanas")
				}
			},


			// Extraer Info de las Farmacias desde Api Places Details
            getPharmaciesDetails: async (place_pharmacy_id) => {
                // 1. Definir la URL + el dato de place_id que necesita google.
                const url_pharmacy_details = `${process.env.BACKEND_URL}/api/pharmacies_details?${place_pharmacy_id}`; // es OK. Funciona correctamente en Postman
                // 2. Options - Usar POST porque lo requiere la API
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Para que la API funciona necesitamos el ID por lo tanto es lo que hay que enviar en el body
                    body: JSON.stringify({ place_id: place_pharmacy_id }),
                }
                const response = await fetch(url_pharmacy_details, options);
                if (response.ok) {
					// Tratamiento del IF = Ok. 
                 	const data = await response.json();
                    setStore({ "pharmacyDetails": data.results });
                 	localStorage.setItem('pharmacies', JSON.stringify(data.results));
                } else {
                        console.log('Error', "No encuentra el ID de la Farmacia")
                    	 }
            },

			// Autocompletar:
			getAutocomplete: async (city) => {
				const response = await fetch(`${process.env.BACKEND_URL}/api/maps?city=${city}`);
				if (!response.ok) {
				  console.error('Error al obtener sugerencias de autocompletar');
				  return [];
				}
				const data = await response.json();
				setStore({ autocompleteSuggestions: data.suggestions });
				return data.suggestions
			  },
		}
	};
};


export default getState;