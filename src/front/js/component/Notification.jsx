import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import { Alert } from 'react-bootstrap';

export const Notification = () => {
    const { store, actions } = useContext(Context);

   useEffect(() => {
    if (store.notification) {
      const timer = setTimeout(() => {
        actions.clearNotification();
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [store.notification, actions]);

  return (
      store.notification ? (
          <Alert variant="warning" className="m-5" onClose={() => actions.clearNotification()} dismissible>
              {`${store.notification.type}: ${store.notification.message}`}
          </Alert>
      ) : null
  );
};