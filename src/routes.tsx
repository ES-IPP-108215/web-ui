import { lazy, Suspense, ReactNode, useEffect, useState } from 'react';
import { CleanLayout } from './layouts/CleanLayout';
import { useUserStore } from '@/stores/useUserStore';
import { Navigate } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const RedirectPage = lazy(() => import('./pages/RedirectPage'));
const GeneralError = lazy(() => import('./pages/ErrorPages/GeneralError'));
const MaintenanceError = lazy(() => import('./pages/ErrorPages/MaintenanceError'));
const NotFoundError = lazy(() => import('./pages/ErrorPages/NotFoundError'));
const TaskPage = lazy(() => import('./pages/TaskPage'));


function ProtectedRoute({
    children,
    loggedIn = true,
    redirect = import.meta.env.VITE_LOGIN_SIGN_UP

} : {
    children: ReactNode;
    loggedIn?: boolean;
    redirect?: string;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useUserStore((state: string) => state);

    useEffect(() => {
        setIsLoading(false);
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (loggedIn && !token) {
        return <Navigate to={redirect} />;
    } else if (!loggedIn && token) {
        return <Navigate to="/" />;
    }

    return children;
}


export const routes = [
    {
        path: '/',
        element: <CleanLayout />,
        children: [
            {
                path: '/',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <HomePage />
                    </Suspense>
                )
            },
            {path: '/tasks',
            element: (
                <Suspense fallback={<div>Loading...</div>}>
                    <ProtectedRoute>
                        <TaskPage />
                    </ProtectedRoute>
                </Suspense>
            )
            },
            {
                path: '/error',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <GeneralError />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/maintenance',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <MaintenanceError />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '/404',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <NotFoundError />
                    </Suspense>
                ),
                exact: true,
            },
            {
                path: '*',
                element: <Navigate to='/404' />,
            }
        ]
    },
    {
        path: '/oauth2/idpresponse',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <RedirectPage />
            </Suspense>
        )
    }
]