import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware, ofType } from 'redux-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { PlainAction } from 'redux-typed-actions';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
// app
import { reducer as jobReducer } from './containers/job/+state/job.reducer';
import { Increment } from './containers/job/+state/job.action';

export interface Action {
    type: string;
}

const idleEpic = (action$: Observable<PlainAction>, state: {}) =>
  action$.pipe(
    ofType(Increment.type),
    map((action: PlainAction) => Increment.cast(action)),
    switchMap(() => of({type: 'bohbo', meta: 'k', error: false, payload: {counter: 1, test: 'h'}})),
  );

export const epics$ = new BehaviorSubject(idleEpic);
export const rootEpic =
    (action$: Observable<PlainAction>, state: {}) => {
       return epics$.pipe(
           mergeMap(epic => epic(action$, state))
        );
    };

const appReducer = combineReducers({
    job: jobReducer,
});

const composeEnhancers = composeWithDevTools({
    // Specify custom devTools options
});

const middlewares = [
    createEpicMiddleware(rootEpic)
];

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
);

export const store = createStore(appReducer, enhancer);
