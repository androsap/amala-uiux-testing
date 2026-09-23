import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/Index";
import { Middleware, PermissionMiddleware } from "../middleware/Middleware";

const middleWares = [Middleware, PermissionMiddleware];
export default createStore(rootReducer, applyMiddleware(...middleWares));