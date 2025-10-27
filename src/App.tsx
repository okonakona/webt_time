import React from 'react'
import './App.css'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Route,
    RouterProvider,
} from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'

const MainLayout: React.FC = () => {

    return (
        <main>
            <Outlet />
        </main>
    )
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/detail" element={<Detail />} />
            </Route>
        </>,
    ),
)

export const App: React.FC = () => (
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
