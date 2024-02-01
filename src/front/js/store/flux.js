const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLoggedIn: false,		// indicates if user is logged in
			pharmacies: [],			//stores a list of pharmacies fetched from Google API
			medicines: [],			 // stores a list of medicines fetched from our backend
			selectedMedicine: "",  // stores the selected medicine chosen by the patient when searching
			cities:[],				// stores a list of cities, used for city search functionality
			selectedCity: "",		// stores the selected city chosen by the user
			medicinesPsum: [],		// stores all the medicines which have distrib.problems
			totalMedicinesPsum: 0, // stores the total number of medicines which have distrib.problems
			lastCreatedOrder: null, //stores the order details when an order is created so that later user can check it. NOTE FOR LATER: if order created --> ask pharmacy do you still have the stock available of that medicine? (we dont work with qty at the moment, just toggle avail/not avail, so they need to confirm)
			availablePharmacies:[]
		},
		
		actions: {
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
			},

			getPharmacies: async (cityName) => {
				// 1. Definir la URL que está en el env. Parámetro city. 
				const url_maps = `${process.env.BACKEND_URL}/api/maps?city=${cityName}`;
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

			
			
			
			getAvailablePharmacies: async (medicineId) => {
				const response = await fetch(`${process.env.BACKEND_URL}/api/pharmacies/available?medicine_id=${medicineId}`);
				if (response.ok) {
					const data = await response.json();
					console.log(data)
					setStore({ availablePharmacies: data.pharmacies });
				} else {
					console.log("Failed to fetch available pharmacies for the selected medicine");
					setStore({ availablePharmacies: [] });
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
			
			//CHANGE!!!! For now only use with Madrid example! ;)
			getSearchCities: (searchQuery) => {
				const mockCity = { id: 1, city_name: "Madrid" };
				// Check if the search query matches "Madrid" (case insensitive)
				if (mockCity.city_name.toLowerCase().includes(searchQuery.toLowerCase())) {
					setStore({ cities: [mockCity] }); // If it matches, set the store with the mock city
				} else {
					setStore({ cities: [] });
				}
			},

			getSelectedCity: (city) => {
				setStore({ selectedCity: city });
				},
			
			clearCities: () => {
				setStore({ cities: [] });
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
			
			updateMedicineAvailability : async (medicineId, availability) => {
				const store = getStore();
				// Update local store
				const updatedMedicinesPsum = store.medicinesPsum.map(medicine => {
					if (medicine.id === medicineId) {
						return { ...medicine, is_available: availability };
					}
					return medicine;
				});
				setStore({ medicinesPsum: updatedMedicinesPsum });
				
				const url = `${process.env.BACKEND_URL}/api/pharmacies/${pharmacy_id}/medicines/${medicineId}/availability`;
				const token = localStorage.getItem('token');
				const options = {
					method: "PUT",
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ medicine_id: medicineId, availability })
				};
				const response = await fetch(url, options);
					if (response.ok) {
						const data = await response.json();
						console.log(data);
						 // Success notification
						 alert("La disponibilidad se ha modificado correctamente!");
					} else {
						const errorData = await response.json();
						const errorMessage = errorData.message || "Error al editar la disponibilidad del medicamento. Por favor, pruebe de nuevo";
						console.error(errorMessage);
						// Error notification
						alert(errorMessage);
					}
				},

			createOrderReservation: async (medicineId, pharmacyId) => {
				const url = `${process.env.BACKEND_URL}/api/orders/`;
				const token = localStorage.getItem('token');
				const options = {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ 
						medicine_id: medicineId,
						pharmacy_id: pharmacyId,
						//order_quantity: 1, //hardcoded -always 1??
						requested_date: new Date().toISOString().split('T')[0]  // format YYYY-MM-DD
					})
				};
				const response = await fetch(url, options);
					if (response.ok) {
						const data = await response.json();
						console.log(data);
						 // Success notification
						 alert("La reserva se ha llevado a cabo correctamente!");
						// Save the order details in the store
						setStore({ lastCreatedOrder: data.order });
					} else {
						const errorData = await response.json();
						const errorMessage = errorData.message || "Error al hacer la reserva. Por favor, pruebe de nuevo";
						console.error(errorMessage);
						// Error notification
						alert(errorMessage);
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
			
		}
	};
};


export default getState;
