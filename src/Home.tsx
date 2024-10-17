import { BrowserRouter,Route, Routes } from 'react-router-dom';
import { SignUpForm } from './pages/Signup';
import { SignInForm} from './pages/Signin';
import { ZAPHOME } from './pages/ZapHome';
import {Profile} from "./pages/profile";
import { Setting} from './pages/Settings';
import { OtherProfile } from './pages/OtherProfile';
import {SearchZap} from "./pages/SearchZaps"

function App() {

return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/signin" element={<SignInForm/>}/>
      <Route path="/signup" element={<SignUpForm/>}/>
      <Route path ="/main" element ={<ZAPHOME/>}/>
      <Route path = "/profile" element ={<Profile/>}/>
      <Route path ="/settings" element ={<Setting/>}/>
      <Route path ="/users" element ={<OtherProfile/>}/>
      <Route path ="/search" element ={<SearchZap/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App


