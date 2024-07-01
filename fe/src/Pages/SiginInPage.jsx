import React from 'react'
import SignIn from '../Components/SigninComponent'
import BikeLogo from "../Assets/big-logo.png"
const SiginInPage = () => {
  return (
    <>
    <div className='logo'>
    <img src={BikeLogo} alt="bike"/>
    </div>
    <SignIn/>
    </>
  )
}

export default SiginInPage