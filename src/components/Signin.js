import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, signInWithEmailAndPassword } from '../firebase';

const Signin = () => {
   const [inputs, setInputs] = useState({ email: '', password: '' });
   const { email, password } = inputs;

   const handleInputChange = e => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
   };

   const handleSubmit = e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      if (email && password) {
         signInWithEmailAndPassword(auth, email, password)
            .then(() => toast.success('Sign in successfully.'))
            .catch(err => {
               switch (err.code) {
                  case 'auth/invalid-email':
                     toast.error('Invalid email.');
                     break;
                  case 'auth/wrong-password':
                     toast.error('Password incorrect.');
                     break;
                  case 'auth/user-not-found':
                     toast.error("User doesn't exist.");
               }
            });
      } else {
         toast.error('Please complete all required fields.');
      }
   };
   return (
      <div className='page-signin-signup-container'>
         <div className='p-5 p-lg-4 my-auto'>
            <div className='container my-5'>
               <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                  <div>
                     <h1 className='text-center fw-bold text-primary'>Sign In</h1>
                  </div>
                  <div className='mt-5 mb-4'>
                     <input
                        className='form-control py-2'
                        value={email}
                        type='email'
                        id='email'
                        name='email'
                        required
                        onChange={handleInputChange}
                        placeholder='Email'
                     />
                     {!email && <div className='invalid-feedback my-2'>Email can't be empty</div>}
                  </div>
                  <div className='mb-4'>
                     <input
                        className='form-control py-2'
                        value={password}
                        type='password'
                        id='password'
                        name='password'
                        required
                        onChange={handleInputChange}
                        placeholder='Password'
                     />
                     <div className='invalid-feedback my-2'>Password can't be empty.</div>
                  </div>
                  <button className='btn btn-primary w-100 mt-2 py-2' type='submit'>
                     Sign In
                  </button>
                  <div className='my-4'>
                     Don't have an account yet? &nbsp;
                     <Link className='no-underline text-primary' to='/signup'>
                        Sign Up
                     </Link>
                  </div>
               </form>
            </div>
         </div>

         <footer className='footer bg-primary py-2 text-center'>
            <small>Tech Quiz &copy; 2021 Power by Quiz API</small>
         </footer>
      </div>
   );
};

export default Signin;
