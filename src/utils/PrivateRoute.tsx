import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import usersSettings from './json/json-users'
import auth from './auth'

export const PrivateRoute: React.FC<any> = ({
    component: Component,
    ...rest
}) => {
    const verify = (path: string) => {
        const userStorage: any = usersSettings.find(
          (element) => element.type === auth.user!.role
        );    
        const routesUser = userStorage.settings.map((data: any) => {
          return data.route;
        });
    
        if (routesUser) {
          if (routesUser.indexOf(path) === -1) {
            return false;
          }
        }
        return true;
      };
    return (
      <Route
        {...rest}
        component={(props:any) => (
                (verify(props.match.path))
                    ? (<Component {...props} />)
                    : (<Redirect to="/dashboard" />)
            )}
      />
    )
}
