import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [User, SetUser] = useState()

  return (
    <AuthContext.Provider value={{ User, SetUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider