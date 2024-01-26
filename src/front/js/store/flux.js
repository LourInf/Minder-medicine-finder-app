const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {

			// isLoggedIn: false,

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

			// isLogged : () => {
			// 	if(localStorage.getItem("token")){
			// 		setStore({isLogged: true})
			// 	}
			// }

		}
	};
};


export default getState;
