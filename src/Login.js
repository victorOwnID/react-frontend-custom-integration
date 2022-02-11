import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  useEffect(() => {
    window.ownid('login', {
      language: 'en',
      loginIdField: document.getElementById("email"),
      passwordField: document.getElementById("password"),
      serverUrl: 'https://759e14614jlorn.server.dev.ownid.com/ownid',
      submitButton: document.getElementById("submit-reg"),
      onLogin: function(data){
        console.log(data);
        setLoading(false);
        setUserSession(data.token);
        props.history.push('/dashboard');
      }
    });
  }, []);

  // handle button click of login form
  const handleLogin = () => {
    
    setError(null);
    setLoading(true);
    axios.post('http://ownid-custom-integration-java-gigya.eu-west-1.elasticbeanstalk.com/api/auth/login', { email: username.value, password: password.value }).then(response => {
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
      Login<br /><br />
      <div>
        Email<br />
        <input id="email" type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input id="password" type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
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

export default Login;