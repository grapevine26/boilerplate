import React, {useEffect} from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'

function LandingPage(props) {
  console.log(Cookies.get('x_auths'))

  const onClickHandler = () => {
    axios.get('/api/users/logout')
    .then(response => {
      if(response.data.success) {
        Cookies.remove('x_auth')
        props.history.push('/')
      } else {
        alert('로그아웃')
      }
    })
  }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'}}>
      <h2>시작 페이지</h2>
      {Cookies.get('x_auth')
      ? <button onClick={onClickHandler}>로그아웃</button>
      : <Link to="/login">로그인</Link>
      }
    </div>
  )

}

export default withRouter(LandingPage)