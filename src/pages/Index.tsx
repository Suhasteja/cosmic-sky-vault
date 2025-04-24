
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cloud } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Cloud className="h-8 w-8 text-sky-600" />
          <span className="text-2xl font-bold text-sky-600">Sky Cloud</span>
        </div>
        <nav>
          <Button asChild variant="outline" className="mr-2">
            <Link to="/dashboard">Login</Link>
          </Button>
          <Button asChild className="bg-sky-600 hover:bg-sky-700">
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Store, Share, and Collaborate with Sky Cloud
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personal cloud storage solution. Access your files anywhere, anytime,
            and share them with anyone.
          </p>
          <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-lg px-8 py-6">
            <Link to="/dashboard">Get Started for Free</Link>
          </Button>

          <div className="mt-16">
            <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2000" 
                alt="Sky Cloud Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-sky-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">Keep your files safe with our encrypted cloud storage solution.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-sky-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Share files with friends and colleagues with just a few clicks.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-sky-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Protection</h3>
              <p className="text-gray-600">Advanced encryption and security features to protect your data.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-8 px-4 border-t mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Cloud className="h-6 w-6 text-sky-600" />
            <span className="text-xl font-bold text-sky-600">Sky Cloud</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2025 Sky Cloud. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
