import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/features/user/userSlice';

const useAuthStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (user && user?.name) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/validate`,
            {
              credentials: 'include',
            }
          );
          if (response.status === 200) {
            return; 
          } else if(response.status === 401) {
            localStorage.removeItem('user');
            dispatch(setUser(null));
            navigate('/auth');
          } else {
            throw new Error('Failed to validate user');
          } 
        } catch (error) {
          console.error('Error validating user:', error);
          localStorage.removeItem('user');
          dispatch(setUser(null));
          navigate('/auth');
        }
      } else {
        localStorage.removeItem('user');
        dispatch(setUser(null));
        navigate('/auth');
      }
    };

    checkAuthStatus();
  }, [user, dispatch, navigate]); 
};

export default useAuthStatus;
