import { Link } from 'react-router-dom';
import RegisterForm from '../features/auth/components/RegisterForm';
import AuthCard from '../features/auth/components/AuthCard';


const Register = () => {

  return (
    <AuthCard
      title={"Create Account"}
      subtitle={"Join the community today."}
    >
      <RegisterForm/>
    </AuthCard>

  );
};

export default Register;