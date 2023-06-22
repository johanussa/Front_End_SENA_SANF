import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import { AuthContext } from "./context/authContext";
import InstructorPage from "./pages/instructorPage/InstructorPage";
import ManagementShedule from "./pages/managementShedule/ManagementShedule";
import ManagementUser from "./pages/managementUser/ManagementUser";
import UserRegisterPage from "./pages/registerUser/UserRegisterPage";
import WelcomeLoginPage from "./pages/welcomeAndLogin/WelcomeLoginPage";
import { GreetingPage } from "./pages/greetingPage/GreetingPage";
import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';

const httpLink = createHttpLink({ uri: 'https://sena-sanf-back.vercel.app/' });
const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem('authentication-user-token'));
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  } 
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [authToken, setAuthToken] = useState(''); 
  const [userData, setUserData] = useState('');

  const setToken = token => {
    setAuthToken(token);
    token && localStorage.setItem('authentication-user-token', JSON.stringify(token));
  }

  useEffect(() => {
    if (authToken) {
      const dataDecoded = jwt_decode(authToken);
      setUserData(dataDecoded);
    }
  }, [authToken]);

  return (
    <ApolloProvider client={ client }>
      <AuthContext.Provider value={{ authToken, setAuthToken, setToken }}>
        <BrowserRouter>
            { authToken && userData.Active && <Sidebar userData={userData} /> }          
          <Routes>
            <Route path='/' element={ <WelcomeLoginPage /> } />
            <Route path='/greeting' element={ <GreetingPage /> } />
            <Route path='/user-register' element={ <UserRegisterPage /> } />
            <Route path='/instructor' element={ <InstructorPage userData={userData} /> } />
            <Route path='/shedule' element={ <ManagementShedule /> } />
            <Route path='/users' element={ <ManagementUser /> } />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
