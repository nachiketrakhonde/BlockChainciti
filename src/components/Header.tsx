import React, { useState, useEffect } from 'react';
import { Menu, X, Bitcoin } from 'lucide-react';
import { auth, provider } from '../firebaseConfig';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [manualSignUp, setManualSignUp] = useState(false);
  const [manualLogin, setManualLogin] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const avatarSize = '48px';

  const getAvatarLetter = () => {
    return user?.displayName?.charAt(0).toUpperCase() || 'U';
  };

  const handleProfileOptions = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleManualSignUp = async () => {
    if (!/^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      setError('Password must be at least 8 characters long and contain a number.');
      return;
    }
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError('');
      setManualSignUp(false);
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (err) {
      console.error(err);
      setError('Error creating account. Please try again.');
    }
  };

  const handleManualLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError('');
      setManualLogin(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bitcoin className="h-8 w-8 text-blue-600 mr-2" />
          <span className={`font-bold text-2xl ${isScrolled ? 'text-blue-900' : 'text-white'}`}>BlockBank</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Solutions', 'Enterprise', 'For Customers', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className={`font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-blue-900' : 'text-white'}`}>
              {item}
            </a>
          ))}

          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative flex items-center">
                <div className="rounded-full bg-blue-600 text-white flex items-center justify-center" style={{ width: avatarSize, height: avatarSize }} onClick={handleProfileOptions}>
                  {getAvatarLetter()}
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-4 w-60">
                    <div className="text-lg font-medium mb-2">User Info</div>
                    <div className="mb-4">
                      <p>Email: {user?.email}</p>
                      <p>Display Name: {user?.displayName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all hover:shadow-lg" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all hover:shadow-lg" onClick={handleSignIn}>
                  Sign In with Google
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all hover:shadow-lg" onClick={() => { setManualSignUp(!manualSignUp); setManualLogin(false); }}>
                  {manualSignUp ? 'Cancel' : 'Manual Sign Up'}
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-all hover:shadow-lg" onClick={() => { setManualLogin(!manualLogin); setManualSignUp(false); }}>
                  {manualLogin ? 'Cancel' : 'Manual Login'}
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-blue-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Manual Sign Up Form */}
      {manualSignUp && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md" />
            <input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md" />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md" />
            <button onClick={handleManualSignUp} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Sign Up</button>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>
      )}

      {/* Manual Login Form */}
      {manualLogin && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md" />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md" />
            <button onClick={handleManualLogin} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">Login</button>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
