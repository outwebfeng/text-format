'use client';
import {createContext, useContext, useState} from "react";


const CommonContext = createContext(undefined);
export const CommonProvider = ({ children }) => {

  const [userData, setUserData] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);

  return (
    <CommonContext.Provider
      value={{
        userData, setUserData,
        showLoginModal, setShowLoginModal,
        showLogoutModal, setShowLogoutModal,
        showLoadingModal, setShowLoadingModal,
        showGeneratingModal, setShowGeneratingModal,
      }}
    >
      {children}
    </CommonContext.Provider>
  );

}

export const useCommonContext = () => useContext(CommonContext)
