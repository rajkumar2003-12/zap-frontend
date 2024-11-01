
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignUpForm } from './pages/Signup';
import { SignInForm } from './pages/Signin';
import { ZAPHOME } from './pages/ZapHome';
import { Profile } from './pages/profile';
import { Setting } from './pages/Settings';
import { OtherProfile } from './pages/OtherProfile';
import { SearchZap } from './pages/SearchZaps';
import { ProtectedRoute } from './components/ProtectRoute'; 
import { HomeRedirect } from './pages/HomeRedirect';
import { OpenZap } from './pages/OpenZap';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeRedirect/>} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/main" element={<ProtectedRoute element={<ZAPHOME />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Setting />} />} />
          <Route path="/users" element={<ProtectedRoute element={<OtherProfile />} />} />
          <Route path="/search" element={<ProtectedRoute element={<SearchZap />} />} />
          <Route path="/openzap" element ={<ProtectedRoute element={<OpenZap/>}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
