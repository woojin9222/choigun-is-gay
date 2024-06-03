import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import { auth, signInWithGoogle, signOutFromGoogle } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Container, Box } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutFromGoogle();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Container>
      <Box textAlign="left" margin="20px">
        {user && (
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Box>
      <Box textAlign="center" margin="50px">
        {user ? (
          <Chat user={user} />
        ) : (
          <Button variant="contained" color="primary" onClick={signInWithGoogle}>
            Sign In with Google
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default App;
