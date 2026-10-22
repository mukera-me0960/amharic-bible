// Polyfill ErrorUtils for React Native environment compatibility
if (typeof (global as any).ErrorUtils === 'undefined') {
  let _globalHandler: any = null;
  (global as any).ErrorUtils = {
    setGlobalHandler(fun: any) {
      _globalHandler = fun;
    },
    getGlobalHandler() {
      return _globalHandler;
    },
    reportError(error: any) {
      if (_globalHandler) {
        _globalHandler(error, false);
      }
    },
    reportFatalError(error: any) {
      if (_globalHandler) {
        _globalHandler(error, true);
      }
    },
    applyWithGuard(fun: any, context: any, args: any) {
      try {
        return fun.apply(context, args);
      } catch (e) {
        if (_globalHandler) {
          _globalHandler(e, false);
        }
      }
    },
    applyWithGuardIfNeeded(fun: any, context: any, args: any) {
      return fun.apply(context, args);
    },
    inGuard() {
      return false;
    },
    guard(fun: any, name: any, context: any) {
      return function(...args: any[]) {
        return (global as any).ErrorUtils.applyWithGuard(fun, context, args);
      };
    },
  };
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
