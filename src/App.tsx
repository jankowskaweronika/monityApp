import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { supabase } from './db/supabase.client';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUser } from './store/authSlice';
import { router } from './router';

const App = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const setupAuth = async () => {
      // Check current auth state
      const { data: { session } } = await supabase.auth.getSession();
      dispatch(setUser(session?.user || null));

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        dispatch(setUser(session?.user || null));
      });

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, [dispatch]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;