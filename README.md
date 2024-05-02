# react-stations
Anti redux complexibility

1. <h3>This package uses the following patterns:</h3>

    - Singleton pattern
    - Observer pattern

2. <h3>Introduction:</h3>

    Are you tired of managing redux producers, actions, selectors, stores and are looking for a package to simplify the state update operations common to React components? Maybe react-stations is a solution to solve your nightmare with just a single file for a function, avoid dozens of functions that you have to create with redux, apply your processing with any promise synchronization and freedom to customize your ideas.

3. <h3>Package idea:</h3>

    ![Alt text](/idea.svg?raw=true "React stations idea")

4. <h3>How to use?</h3>

    - __FIRST__: Initialize your singleton station (Example: ```auth.station.ts```)

    ``` typescript
    import { Station } from "react-stations";

    /**
     * Your state structure for common use in station
     * (modify to match with your state structure)
     */
    export type TState = {
        status: "LOGGED_IN";
        token: string;
    } | {
        status: "ANONYMOUS";
        token: null;
    } | {
        status: "INITIALIZING";
        token: undefined;
    };

    /**
     * Define your singleton station
     */
    export class AuthStation extends Station<TState> {

        /**
         * Define PRIVATE STATIC variable to store
         * your singleton station
         */
        private static _instance: AuthStation;

        /**
         * Define PRIVATE constructor of the station to makesure 100%
         * only 1 object typeof AuthStation create on memory
         */
        private constructor() {
            super();

            // Example to init fisrt data of your state.
            // Maybe use for loading effect on your component
            // when component load in the same time verify user token
            this.setState({
                status: "INITIALIZING";
                token: undefined;
            });
        }

        /**
         * Define PUBLIC STATIC function to init and get an instance
         * of singleton station
         * @returns 
         */
        public static instance() {
            if (this._instance) {
                return this._instance;
            }

            return this._instance = new AuthStation();
        }



        // CREATE YOU LOGIC FUNCTIONS HERE.
        // EXAMPLE:
        public async login(
            args: Required<{
                account: string;
                password: string;
            }>
        ) {
            const loginResponse = await fetch(`<YOUR_LOGIN_API>`);

            if (!loginResponse.ok) {
                this.setState({
                    status: "ANONYMOUS",
                    token: null
                });

                throw Error("Login failed.");
            }

            this.setState({
                status: "LOGGED_IN",
                token: (await loginResponse.json()).jwtToken
            });
        }
    
    }

    export default AuthStation;

    ```

    - __SECOND__: Use station in your React Component(s)

    With ```React Function Component``` style (Example: ```LoginComponent.tsx```)

    ``` typescript
    import { useState, useEffect } from "react";
    import { AuthStation, TState } from "<YOUR_PATH_TO>/auth.station.ts";

    const authStation = AuthStation.instance();

    export default LoginComponent() {
        const [authState, setAuthState] = useState(authStation.$state);
        const [loginData, setLoginData] = useState({
            account: "",
            password: ""
        });

        const authStateListener = (args: TState) => {
            // Your additional logics
            // ...

            setAuthState(args);
        }

        useEffect(() => {
            authStation.subcribe({
                listeners: authStateListener
            });

            // Or maybe multiple listeners
            // if you have more handle with state change
            // authStation.subcribe({
            //     listeners: [
            //         authStateListener01,
            //         authStateListener02
            //     ]
            // });

            return () => authStation.unsubscribe({
                listeners: authStateListener
            });
        }, []);

        /**
         * Submit login form listener
         */
        const onSubmitLogin = () => {
            // Validation logic before submit

            authStation.login(loginData);
        }

        return (
            <form onSubmit={onSubmitLogin}>
                <input name="account" type="text" />
                <input name="password" type="password" />
            </from>
        );
    }

    ```
    <br/>

    With ```React Class Component``` style (Example: ```LoginComponent.tsx```)

    ``` typescript
    import { Component } from "react";
    import { AuthStation, TState as TAuthState } from "<YOUR_PATH_TO>/auth.station.ts";

    type TProps = {}
    type TState = {
        authState: TAuthState;
        loginData: {
            account: string;
            password: string;
        }
    }


    const authStation = AuthStation.instance();

    export default class LoginComponent extends Component {

        // Sign a constant of listener(s)
        private _authStateListener = this._authStateHandler.bind(this);

        /**
         * Class constructor
         */
        constructor(
            props: TProps
        ) {
            super(props);

            this.state = {
                authState: authStation.$state,
                loginData: {
                    account: "",
                    password: ""
                }
            };
        }

        /**
         * React lifecycle handler
         */
        componentDidMount() {
            authStation.subcribe({
                listeners: this._authStateListener
            });
        }

        /**
         * React lifecycle handler
         */
        componentWillUnmount() {
            authStation.unsubcribe({
                listeners: this._authStateListener
            });
        }

        /**
         * AuthState handler
         */
        private _authStateHandler(
            args: TState
        ) {
            // Your additional logics
            // ...

            this.setState({
                authState: args
            });
        }

        /**
         * Submit login form listener
         */
        private _onSubmitLogin() {
            // Validation logic before submit

            authStation.login(loginData);
        }

        /**
         * React lifecycle handler
         */
        render() {
            return (
                <form onSubmit={this._onSubmitLogin.bind(this)}>
                    <input name="account" type="text" />
                    <input name="password" type="password" />
                </from>
            );
        }

    }

    ```

    - __FINAL__: Enjoy your station and inject into your component(s) want to listen state change(s)
5. <h3>Advanced for class component(s):</h3>
    With class components, to decrease initialize lines when you have multiple stations in each component file.

    ``` typescript
    const authStation = AuthStation.instance();
    const someNewStation = SomeNewStation.instance();
    ...
    ```
    You can create your core Component class extends base on React Component Class

    ``` typescript
    import React from "react";

    import { AuthStation } from "<YOUR_PATH_TO>/auth.station.ts";
    import { SomeNewStation } from "<YOUR_PATH_TO>/someNew.station.ts";

    // Your core component class (Example: <YOUR_PATH_TO>/core/component.ts)
    export class Component<
        TProps,
        TState
    > extends React.Component<
        TProps,
        TState
    > {
        protected readonly stations = Object.freeze({
            auth: AuthStation.instance(),
            someNewStation: SomeNewStation.instance()
        });
    }

    // And in your class component(s) file(s)
    import { Component } from "<YOUR_PATH_TO>/core/component.ts";
    import { TState as TAuthState } from "<YOUR_PATH_TO>/auth.station.ts";

    type TProps = {}
    type TState = {
        authState: TAuthState;
    }


    export default class YourComponent extends Component<{}, {}> {

        constructor(
            props: TProps
        ) {
            super(props);

            // You can access to stations
            this.state = {
                authState: this.stations.auth.$state,
                // ...
            };
        }

        componentDidMount() {
            this.stations.auth.subcribe({
                listeners: ...
            });
        }

        // ...

    }
    ```