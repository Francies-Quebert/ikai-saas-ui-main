import { createStore, applyMiddleware, compose } from "redux";

// middlewares
// import thunk from "redux-thunk";
// import logger from "redux-logger";

// Import custom components
import reducers from "../reducers/index";

import thunkMiddleware from "redux-thunk";


function saveTolocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    return undefined;
  }
}

function loadFromlocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

const persistedState = loadFromlocalStorage();

/**
 * Create a Redux store that holds the app state.
 */

//const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null|| compose;
//const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : (null || compose);

//Dev
// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : (null || compose);
// const store = createStore(reducers,   compose(
//     applyMiddleware(thunkMiddleware),

//     //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
//     window.devToolsExtension ? window.devToolsExtension() : function (f) {
//         return f;
//     }
// ));

// // //Prod
const store = createStore(
  reducers,
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware(thunkMiddleware))
    : compose(
        //applyMiddleware(thunkMiddleware,logger),
        applyMiddleware(thunkMiddleware),
        window.devToolsExtension
          ? window.devToolsExtension()
          : function(f) {
              return f;
            }
      )
);

// // // //Prod
// const store = createStore(reducers,   compose(
//     applyMiddleware(thunkMiddleware, logger),

//     //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
//     window.devToolsExtension ? window.devToolsExtension() : function (f) {
//         return f;
//     }
// ));

// const store = createStore(reducers,composeEnhancers(
//     applyMiddleware(thunk)
// ));

const unsubscribe = store.subscribe(() => {
  const state = store.getState();
  saveTolocalStorage(state);
});

export default store;
