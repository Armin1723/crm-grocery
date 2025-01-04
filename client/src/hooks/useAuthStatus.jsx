import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../redux/features/user/userSlice';

const useAuthStatus = () => {

  useEffect(() => {
    const checkAuthStatus = async () => {
      const user = useSelector(state=> state.user);

      const dispatch = useDispatch();
      const navigate = useNavigate();

      if (user) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/validate`, {
            credentials: 'include', 
          });

          if (response.status === 200) {
            return
          } else {
            localStorage.removeItem('user'); 
            dispatch(setUser(null))
            navigate('/auth')
          }
        } catch (error) {
          console.error('Error validating user:', error);
          localStorage.removeItem('user');
        }
      } else {
        navigate('/auth')
        localStorage.removeItem('user')
        toast.error({
          render: "Login Expired",
          message: "Kindly login again.",
        })
      }
    };

    checkAuthStatus();
  }, []); 
};

export default useAuthStatus;
