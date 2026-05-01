import { useNavigate, useLocation } from 'react-router-dom';

export function useBackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    // Check if there is a realistic internal history entry
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return goBack;
}
