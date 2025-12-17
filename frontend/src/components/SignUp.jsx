import React from 'react';
import { motion } from 'framer-motion';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              FIT<span className="text-blue-500">AI</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-slate-400">Start your personalized fitness journey today</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <ClerkSignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
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
          Already have an account?{' '}
          <Link to="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;


