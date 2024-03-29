/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import StopWatch from './StopWatch';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => StopWatch);
