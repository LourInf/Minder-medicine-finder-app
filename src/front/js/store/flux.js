const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {

			// isLoggedIn: false,

			message: null,
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
			],
			medicines: [],
			selectedMedicine: null,
			//selectedLocation: null,
			//pharmacyResults:[]
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
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				// We have to loop the entire demo array to look for the respective index and change its color
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
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
