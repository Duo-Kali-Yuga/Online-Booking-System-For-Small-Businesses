import { Link } from 'react-router-dom';
import AuthCard from '../features/auth/components/AuthCard';
import LoginForm from '../features/auth/components/LoginForm';

const Login = () => {

  return (
    <AuthCard
      title={"Welcome Back"}
      subtitle={"Please enter your details"}
    >
      <LoginForm/>
    </AuthCard>
  );
};



export default Login;