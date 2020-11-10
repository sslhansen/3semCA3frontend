import './App.css';
import React, { useState, useEffect } from "react";
import DoLogin from "./login.js"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useParams,
    useRouteMatch,
    Prompt,
    useLocation,
    useHistory
} from "react-router-dom";
import loginFacade from './apiFacade';

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    let history = useHistory();
    const setLoginStatus = status => {
        setLoggedIn(status);
        history.push("/");
    }
    return (
        <div>
            <Header loginMsg={
                isLoggedIn ? "Logout" : "Login"
            }
                isLoggedIn={isLoggedIn} />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/login">
                    <DoLogin loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
                </Route>
                <Route exact path="/externData">
                    <ExternData />
                </Route>
                <Route>
                    <NoMatch />
                </Route>
            </Switch>
        </div>

    );
}

function Header({ isLoggedIn, loginMsg }) {
    return (
        <ul className="header">
            <li>
                <NavLink exact activeClassName="active" to="/">Home</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/externData">Extern API</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/login">
                    {loginMsg}</NavLink>
            </li>

        </ul>

    )
}


function Home() {
    return (
        <h2>Home</h2>
    )
}

function ExternData() {
    const [data, setData] = useState(null);
    const { strategy } = useParams();

    //const foundData = () => loginFacade.fetchExternData().then(res => setData(res));

    useEffect(() => {
        setData(null);
        loginFacade.fetchExternData().then(res => setData(res))
            .catch(err => {
                if (err.status) {
                    console.log(err.message);
                }
            });

    }, [])

    const toShow = data ? (
        <div>
            <h3>Todo if bored:</h3>
            <p>Activity: {data.activity}</p>
            <p>Type: {data.type}</p>
            <p>Price {data.price}</p>
            <p>Reference: https://www.boredapi.com/api/activity</p>

            <h3>Random Food picture</h3>
            <p><img src={data.foodImage}></img></p>
            <p>Reference: https://foodish-api.herokuapp.com/api</p>

            <h3>Random Dog picture</h3>
            <p><img src={data.dogPicture}></img></p>
            <p>Reference: https://dog.ceo/api/breeds/image/random</p>

            <h3>Kanye Says</h3>
            <em>"{data.kanyeSays}"</em>
            <p>Reference: https://api.kanye.rest/</p>

            <h3>{data.author} Says</h3>
            <em>"{data.programmerQuote}"</em>
            <p>Reference: https://programming-quotes-api.herokuapp.com/quotes/random</p>

        </div>
    ) : "Loading..."

    return (
        <div>
            <h2>data from server</h2>
            {toShow}
        </div>
    )
}


function NoMatch() {
    let location = useLocation();
    return (
        <div>
            <h3>No match for
                <code>{
                    location.pathname
                }</code>
            </h3>
        </div>
    )
}

export default App;
