const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
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
			medicines: []
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
			getMedicines: async (value) => {
				const url = `${process.env.API_URL}/medicamentos?nombre=`+ value;
				const options = {
					method: "GET"
				};
				const response = await fetch (url,options);
				if (response.ok) {
					const data = await response.json ();
					console.log(data);
					setStore({ medicines: data.results }); //1. if response ok, we save the data.results inside store-medicines[]. Now instead of having an empty array of medicines in store, we will have the array with the medicines
					//2. we also need to save the data in the localStorage using localStorage.setItem("variable", JSON.stringify(value we want to assign to the variable));
					//JSON.stringify is needed when we save in localStorage so it can read what's inside our data.results
					localStorage.setItem("medicines", JSON.stringify(data.results));
				} else {
					console.log ("Error:", response.status, response.statusText);
				}
			},
		}
	};
};


export default getState;
