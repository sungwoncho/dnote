import React from 'react';
import { Switch, Route } from 'react-router';
import { Redirect } from 'react-router-dom';

import { useDispatch, useSelector } from '../../store';
import ClassicLogin from './Login';
import { setMessage } from '../../store/ui';
import ClassicSetPassword from './SetPassword';
import ClassicDecrypt from './Decrypt';
import {
  ClassicMigrationSteps,
  getClassicMigrationPath,
  getHomePath,
  homePathDef
} from '../../libs/paths';

interface Props {}

const Classic: React.SFC<Props> = () => {
  const { user } = useSelector(state => {
    return {
      user: state.auth.user
    };
  });
  const dispatch = useDispatch();

  if (!user.isFetched) {
    return <div>Loading</div>;
  }

  const userData = user.data;
  const loggedIn = userData.uuid !== '';

  if (loggedIn && !userData.classic) {
    dispatch(
      setMessage({
        message:
          'You are already using the latest Dnote and do not have to migrate.',
        kind: 'info',
        path: homePathDef
      })
    );

    return <Redirect to={getHomePath()} />;
  }

  return (
    <div className="container">
      <Switch>
        <Route
          path={getClassicMigrationPath(ClassicMigrationSteps.login)}
          exact
          component={ClassicLogin}
        />
        <Route
          path={getClassicMigrationPath(ClassicMigrationSteps.setPassword)}
          exact
          component={ClassicSetPassword}
        />
        <Route
          path={getClassicMigrationPath(ClassicMigrationSteps.decrypt)}
          exact
          component={ClassicDecrypt}
        />
      </Switch>
    </div>
  );
};

export default Classic;