import React from 'react'
import SignupPage from '../components/signup'
import LoginPage from '../components/login'

function PayhausAuth() {

  const [isLogin, setIsLogin] = React.useState(true)

  const toggleAuthMode = () => {
    setIsLogin(prev => !prev)
  }

  return (
    <div>
      {isLogin ? <LoginPage signup={toggleAuthMode} /> : <SignupPage login={toggleAuthMode} />}
    </div>
  )
}

export default PayhausAuth