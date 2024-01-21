import { AUTH_LOGOUT } from '../auth/auth.types';
import * as docTypes from './docs.types';

/** 
 * * Using 'fetch' instead of 'axios' because when I'm sending error from the backend at
 * * that time axios is not able to catch the response messages with error status codes
 * * like 400 and above codes, but fetch is able get the errors with message and the 
 * * status properly,
 * * But for accessing the status we will get it from the first 'response' and for 
 * * the data we need to do 'response.json()'
 * */


/**
 * - GET ALL DOCUMENTS
 * @param {String} queryString - send the query for searching and filtering
 * */
export const getAllPublicDocsAction = (queryString = "") => async (dispatch) => {

     dispatch({ type: docTypes.DOC_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/docs?${queryString}`, {
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN")
               }
          })

          const data = await res.json();

          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \nPlease Login again.. ${window.location.replace('/auth') || ""}`);
               return;
          }

          if (res.ok) dispatch({ type: docTypes.DOC_GET_PUBLIC_DOCS_SUCCESS, payload: data.data })
          else dispatch({ type: docTypes.DOC_ERROR });

     } catch (error) {
          console.log('error:', error)
          alert(error.message)
          dispatch({ type: docTypes.DOC_ERROR });
     }
}


export const getAllPrivateDocsAction = (queryString = "") => async (dispatch) => {
     
     dispatch({ type: docTypes.DOC_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/docs/user?${queryString}`, {
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN")
               }
          })

          const data = await res.json();

 
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \nPlease Login again.. ${window.location.replace('/auth') || ""}`);
               return;
          }

          if (res.ok) dispatch({ type: docTypes.DOC_GET_PRIVATE_DOCS_SUCCESS, payload: data.data })
          else dispatch({ type: docTypes.DOC_ERROR });

     } catch (error) {
          console.log('error:', error)
          alert(error.message)
          dispatch({ type: docTypes.DOC_ERROR });
     }
}



/**
 * - CREATE NEW DOCUMENT
 * @param {Object} doc - doc object for the creation
 * @param {Function} cb - callback function for execution in success
 * */
export const createDocAction = ({ doc, cb }) => async (dispatch) => {
     if (Object.keys(doc).length === 0) return;

     dispatch({ type: docTypes.DOC_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/docs`, {
               method: 'POST',
               body: JSON.stringify(doc),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN")
               }
          })

          const data = await res.json();

          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \nPlease Login again.. ${window.location.replace('/auth') || ""}`);
               return;
          }

          if (res.ok) {
               dispatch({ type: docTypes.DOC_SUCCESS })
               cb(data.data._id);
          }
          else dispatch({ type: docTypes.DOC_ERROR });

          alert(data.message)

     } catch (error) {
          console.log('error:', error)
          alert(error.message)
          dispatch({ type: docTypes.DOC_ERROR });
     }
}





/**
 * - UDPATE DOCUMENT DETAILS
 * @param {String} docId - doc id for which you want the changes should apply
 * @param {Object} update - Object with update fields
 * @param {Function} updateDocState - fucntion to set doc data locally
 * */
export const updateDocAction = ({ docId, update, updateDocState }) => async (dispatch) => {
     console.log({ docId, update })
     if (!docId || Object.keys(update).length === 0) return;
     dispatch({ type: docTypes.DOC_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/docs/${docId}`, {
               method: 'PATCH',
               body: JSON.stringify(update),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN")
               }
          })

          const data = await res.json();

          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \nPlease Login again.. ${window.location.replace('/auth') || ""}`);
               return;
          }

          if (res.ok) {
               dispatch({ type: docTypes.DOC_SUCCESS })
               updateDocState((update.isPublic === undefined ? data.data.title : data.data.isPublic));
          }
          else dispatch({ type: docTypes.DOC_ERROR });

          alert(data.message)

     } catch (error) {
          console.log('error:', error)
          alert(error.message)
          dispatch({ type: docTypes.DOC_ERROR });
     }
}


/**
 * - DELETE DOCUMENT
 * @param {String} docId - doc id for which you want to delete
 * @param {Function} cb - execute the cb function if the request succed
 * */
export const deleteDocAction = ({ docId, cb }) => async (dispatch) => {
     if (!docId) return;

     dispatch({ type: docTypes.DOC_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/docs/${docId}`, {
               method: 'DELETE',
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN")
               }
          })

          const data = await res.json()

          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \nPlease Login again.. ${window.location.replace('/auth') || ""}`);
               return;
          }

          if (res.ok) {
               dispatch({ type: docTypes.DOC_SUCCESS });
               cb();
          }
          else dispatch({ type: docTypes.DOC_ERROR });

          alert(data.message)

     } catch (error) {
          console.log('error:', error)
          alert(error.message)
          dispatch({ type: docTypes.DOC_ERROR });
     }
}