const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			
			isLoggedIn: false,
			user_id: ""


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
					setStore({user_id: localStorage.getItem("user_id")})
					setStore({is_pharmacy: localStorage.getItem("is_pharmacy")})

				}
			}

		}
	};
};


export default getState;
