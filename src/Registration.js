import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';

function Registration(props) {
  const [loading, setLoading] = useState(false);
  const username = React.createRef();
  const password = React.createRef();
  const [error, setError] = useState(null);
  useEffect(() => {
    window.ownid('register', {
      language: 'en',
      loginIdField: username.current,
      passwordField: password.current,
      serverUrl: 'https://vtvi9y8pqbh6zt.server.dev.ownid.com/ownid',
      onError:(error) => setError(error),
    });
  }, []);

  // handle button click of login form
  const handleRegistration = () => {
    
    setError(null);
    setLoading(true);
    
    window.ownid("getOwnIDData", "register").then((ownIdResponse) => {
      if(ownIdResponse.error){
        //The error message is available as ownIdResponse.message
        return;
      }
  
      if (ownIdResponse.data) {
        var ownIdData = btoa(JSON.stringify([ownIdResponse.data]));
        //var ownIdData = Buffer.from(JSON.stringify([ownIdResponse.data]),'base64');
      }
  
      //Call your existing registration logic in the backend
      return register(document.getElementById('email').value, document.getElementById('password').value, ownIdData );
    })
    
  }

  const register = (username,password,ownIdData) => {

    axios.post('https://custom-java-integration.estrategic.es/api/auth/register', { email: username, password: password, ownIdData: ownIdData }).then(response => {
      setLoading(false);
      setUserSession(response.data.token);
      props.history.push('/dashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });

  }

  return (
    <div>
      Registration<br /><br />
      <div>
        Email<br />
        <input id="email" ref={username} type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input id="password" ref={password} type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Register'} onClick={handleRegistration} disabled={loading} /><br />
    </div>
  );
}



const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Registration;