import './App.css';
import React, {useState, useEffect} from "react";
import loginFacade from "./apiFacade.js"
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

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let history = useHistory();

    const setLoginStatus = status => {
        setIsLoggedIn(status);
        history.push("/");
    }
    return (
        <div>
            <Header loginMsg={
                    isLoggedIn ? "Logout" : "Login"
                }
                isLoggedIn={isLoggedIn}/>
            <Switch>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route exact path="/login">
                    <DoLogin setLoginStatus={setLoginStatus}
                        isLoggedIn={isLoggedIn}/>
                </Route>
                <Route>
                    <NoMatch/>
                </Route>
            </Switch>
        </div>

    );
}

function Header({isLoggedIn, loginMsg}) {
    return (
        <ul className="header">
            <li>
                <NavLink exact activeClassName="active" to="/">Home</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/jokes">Jokes</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/scrape">Scrape</NavLink>
            </li>
            <li>
                <li>
                    <NavLink activeClassName="active" to="/login">
                        {loginMsg}</NavLink>
                </li>
            </li>
        </ul>

    )
}

function DoLogin({setLoginStatus, isLoggedIn}) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [errorMsg, setErrorMsg] = useState('');

    const logout = () => {
        loginFacade.logout()
        setLoggedIn(false)
        setErrorMsg('')
        setLoginStatus(!isLoggedIn)
    }
    const login = (user, pass) => {


        loginFacade.login(user, pass).then(res => setLoggedIn(true)).catch(err => {
            if (err.status) {
                err.fullError.then(e => setErrorMsg(e.message));
            }
        }).then(setLoginStatus(!isLoggedIn));

    }

    return (
        <div> {
            !loggedIn ? (
                <div><LogIn login={login}/><p>{errorMsg}</p>
                </div>
            ) : (
                <div>
                    <LoggedIn/>
                    <button onClick={logout}></button>
                </div>
            )
        } </div>
    )
}

function LogIn({login}) {
    const init = {
        username: "",
        password: ""
    };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({
            ...loginCredentials,
            [evt.target.id]: evt.target.value
        })
    }

    return (
        <div>
            <h2>Login</h2>
            <form onChange={onChange}>
                <input placeholder="User Name" id="username"/>
                <input placeholder="Password" id="password"/>
                <button onClick={performLogin}>Login</button>
            </form>
        </div>
    )

}
function LoggedIn() {
    const [dataFromServer, setDataFromServer] = useState("Loading...")

    useEffect(() => {
        loginFacade.fetchData().then(data => setDataFromServer(data.msg));
    }, [])

    return (
        <div>
            <h2>Data Received from server</h2>
            <h3>{dataFromServer}</h3>
        </div>
    )

}

function Home() {
    return (
        <h2>Home</h2>
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
