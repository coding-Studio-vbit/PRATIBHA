import React, { useContext, useState } from 'react'
import {auth} from '../../firebase'

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setcurrentUser] = useState()

    

    const value={
        currentUser
    }

    return (
       <AuthContext.Provider value ={value}>
        {children}
       </AuthContext.Provider>
    )
}
