import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js"
import { Alert } from 'react-bootstrap';

export const Notification = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (store.notification) {
      const timer = setTimeout(() => {
        actions.clearNotification();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [store.notification, actions]);

  const getVariantFromType = (type) => {
    switch (type) {
      case 'error':
        return 'danger'; 
      case 'info':
        return 'warning'; 
      case 'success':
        return 'success'; 
      default:
        return 'primary'; 
    }
  };

  return store.notification ? (
    <Alert
      variant={getVariantFromType(store.notification.type)}
      className="mx-auto"
      style={{ width: "800px", fontSize: "18px", textAlign: "center" }}
      onClose={() => actions.clearNotification()}
      dismissible>
      {store.notification.message}
    </Alert>
  ) : null;
};