import {useState} from 'react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/solid'
import Logo from '@/assets/Logo.png'
import './Navbar.css'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav>
      <div className='navbar'>
        <div className='navbar-innerCont'>
          <div className='navbar-left'>
            <img alt='logo' src={Logo}/>
          </div>
          
          <div className='navbar-right'>
            <div className='navbar-right-links'> {/* NOTE 3 sections in the class name is an indication to break up in multiple components */}
              <p>Home</p>
              <p>Home</p>
              <p>Home</p>
              <p>Home</p>
              <p>Home</p>
            </div>
            
            <div className='navbar-right-membership'>
              <p>Sign In</p>
              <p>Sign In</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
