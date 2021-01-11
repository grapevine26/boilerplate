import React, {useEffect} from 'react';
import { useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action'


export default function(SepcificCompononet, option, adminRoute = null) {
  // option null = 아무나
  // option true = 로그인한 사람
  // option false = 로그인한 사람은 출입이 불가
  function AuthenticationCheck(props) {

    const dispatch = useDispatch();
    
    useEffect(() => {

      dispatch(auth()).then(response => {
        console.log(response)

        if(!response.payload.isAuth) {
          if(option) {
            props.history.push('/login')
          }
        } else {
          if(adminRoute && !response.payload.isAdmin) {
            props.history.push('/')
          } else {
            if(option === false) {
              props.history.push('/')
            }
          }
        }
      })

    }, [])

    return (
      <SepcificCompononet />
    )
  }
  return AuthenticationCheck
}