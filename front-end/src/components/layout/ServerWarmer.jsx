import { useEffect } from 'react';
import api from '../../api/axios';


const ServerWarmer = () => {
  useEffect(() => {
    // We don't care about the response, we just want to "hit" the server
    const wakeUp = async () => {
      try {
        console.log("Checking server pulse...");
        await api.get('/'); 
      } catch (err) {
        console.log("Server is waking up...");
      }
    };

    wakeUp();
  }, []);

  return null;
};

export default ServerWarmer;