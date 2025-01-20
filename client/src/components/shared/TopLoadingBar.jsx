import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 

NProgress.configure({ showSpinner: false, speed: 500 });

const TopLoadingBar = () => {
  const location = useLocation(); 

  useEffect(() => {
    NProgress.start(); 
    NProgress.done(); 
  }, [location.pathname]);

  return null; 
};

export default TopLoadingBar;
