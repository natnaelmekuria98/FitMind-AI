import React from 'react';
import { motion } from 'framer-motion';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
              FIT<span className="text-blue-500">AI</span>
            </h1>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-slate-400">Sign in to continue your fitness journey</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-2xl">
          <ClerkSignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton: "bg-slate-700 hover:bg-slate-600 text-white border-slate-600",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white",
                formFieldInput: "bg-slate-900 border-slate-700 text-white focus:border-blue-500",
                formFieldLabel: "text-slate-300",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                identityPreviewText: "text-slate-300",
                identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
                dividerLine: "bg-slate-700",
                dividerText: "text-slate-400",
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-slate-500 text-sm">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;


