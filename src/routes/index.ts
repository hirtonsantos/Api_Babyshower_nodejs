import { Express } from 'express'
import {administratorRoutes} from "./administrators.route"
import {advertsRoutes} from "./adverts.routes"
import {companiesRoutes} from "./companies.route"

export const appRoutes = (app: Express) => {

    app.use('/users', administratorRoutes())
    app.use('/products', advertsRoutes())
    app.use('/cart', companiesRoutes())
}