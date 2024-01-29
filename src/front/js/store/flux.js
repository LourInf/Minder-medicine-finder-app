const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			// demo: [
			// 	{
			// 		title: "FIRST",
			// 		background: "white",
			// 		initial: "white"
			// 	},
			// 	{
			// 		title: "SECOND",
			// 		background: "white",
			// 		initial: "white"
			// 	}
			// ],
			pharmacies: [],
			medicines: [],
			selectedMedicine: null,
			medicinesPsum: [],
			totalMedicinesPsum: 0,
			
			
			isLoggedIn: false


		},
		actions: {

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

			getPharmacies: async (city) => {
				// 1. Definir la URL que está en el env. Parámetro city. 
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

			getPharmaciesDetails: async (pharmacy_id) => {
				// 1. Definir la URL que está en el env. Parámetro city. 
				const url_pharmacy_details = `${process.env.BACKEND_URL}/api/pharmacies_details`;
				// 2. Options - Usar POST
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					// Para que la API funciona necesitamos el ID por lo tanto es lo que hay que enviar en el body
					body: JSON.stringify({ pharmacy_id: pharmacy_id }),
				}
				// 3. Response
				const response = await fetch(url_pharmacy_details, options);
				// 4. Verificar response (console log)
				if (response.ok) {
					// 5. If = ok; Tratamiento del OK - definimos el data
					const data = await response.json();
					return data;
					} else {
						console.log('Error', "No encuentra el ID de la Farmacia")
						return null;
					}
			},

			getMedicines: async (value) => {
				// Clear previous search results
				setStore({ medicines: [] });

				const url = `${process.env.BACKEND_URL}/api/medicines/search?name=`+value;
				const options = {
					method: "GET"
				};
				const response = await fetch (url,options);
				if (response.ok) {
					const data = await response.json();
					console.log(data);
			
					// We ensure that we're accessing the medicines array within the results object
					if (data.results && Array.isArray(data.results.medicines)) {
						setStore({ medicines: data.results.medicines }); // Update store with the medicines array
						localStorage.setItem("medicines", JSON.stringify(data.results.medicines));
					} else {
						console.log("No medicines found or invalid format");
						setStore({ medicines: [] });
						localStorage.setItem("medicines", JSON.stringify([]));
					}
			
					return data;
				} else {
					console.log("Error:", response.status, response.statusText);
				}
			},
			getSelectedMedicine: (medicine) => {
				setStore({ selectedMedicine: medicine });
				},
			
			getMedicinesPsum: async () => {
				const url = `${process.env.BACKEND_URL}/api/medicines-psum`;
				const options = {
					method: "GET"
				};
				const response = await fetch(url, options);
					if (response.ok) {
						const data = await response.json();
						console.log(data);
						setStore({
							medicinesPsum: data.results.medicines,
							totalMedicinesPsum: data.results.total_medicines_psum,
						});
					} else {
						console.log("Medicamento no encontrado");
						setStore({
							medicinesPsum: [],
							totalMedicinesPsum: 0,
						});
					}
				},
	
			
			// 		setStore({ medicines: data.results }); //1. if response ok, we save the data.results inside store-medicines[]. Now instead of having an empty array of medicines in store, we will have the array with the medicines
			// 		//2. we also need to save the data in the localStorage using localStorage.setItem("variable", JSON.stringify(value we want to assign to the variable));
			// 		//JSON.stringify is needed when we save in localStorage so it can read what's inside our data.results
			// 		localStorage.setItem("medicines", JSON.stringify(data.results));
			// 		console.log(store.medicines)
			// 		return data;  // Don't forget to return something, that is how the async resolves
			// 	} else {
			// 		console.log ("Error:", response.status, response.statusText);
			// 	}
			// },
			
			login: (token) => {
				setStore({isLoggedIn: true});
				localStorage.setItem("token", token);
			},

			logout: () => {
				setStore({isLoggedIn: false});
				localStorage.removeItem("token");
			},

			
			isLogged : () => {
				if(localStorage.getItem("token")){
					setStore({isLogged: true})
				}
			}

		}
	};
};


export default getState;
