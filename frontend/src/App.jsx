import FloatingShape from "./components/Shape";
import {Navigate,Routes, Route} from "react-router-dom";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import DashboardPage from "./Pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

// Protect routes for authenticated users

const ProtectedRoute = ({ children }) => {
   const { isAuthenticated, user} = useAuthStore();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!user.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    return children;


}
// Redirect to home page if user is already authenticated


const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


export default function App() {
  const {isCheckingAuth,checkAuth} =useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth)return <LoadingSpinner/>;
  return (
    <>
      <style>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0.7;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-120vh) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      <div className="min-h-screen bg-blue-800 flex items-center justify-center relative overflow-hidden">
        {/* Bubbles container */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-blue-400 opacity-40 pointer-events-none filter drop-shadow-md"
              style={{
                width: `${15 + Math.random() * 30}px`,
                height: `${15 + Math.random() * 30}px`,
                top: '100%',
                left: `${Math.random() * 100}%`,
                animationName: 'bubble',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDuration: `${10 + Math.random() * 15}s`,
                animationDelay: `${-Math.random() * 20}s`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        {/* Your existing floating shapes */}
        <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
        <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
        <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
       <Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
        <Toaster/>
      </div>
    </>
  );
}
