import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, updateProfile, signOut } from '../firebase';
import { toast } from 'react-toastify';

const Signup = () => {
   const [inputs, setInputs] = useState({ username: '', email: '', password: '' });
   const { username, email, password } = inputs;

   const handleInputChange = e => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
   };

   const handleSubmit = e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      if (username && email && password) {
         createUserWithEmailAndPassword(auth, email, password)
            .then(async userCredential => {
               // autheticated user
               toast.success('Sign up successfully.');
               e.target.classList.remove('was-validated');
               setInputs({ username: '', email: '', password: '' });

               // update profile set the displayName as username
               await updateProfile(userCredential.user, { displayName: username });
               // signout user to avoid automatically signin
               return await signOut(auth);
            })
            .catch(err => {
               switch (err.code) {
                  case 'auth/invalid-email':
                     toast.error('Invalid email.');
                     break;
                  case 'auth/weak-password':
                     toast.error('Password should be at least 6 characters.');
                     break;
                  case 'auth/email-already-in-use':
                     toast.error('Email already in use.');
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
                     <h1 className='text-center fw-bold text-primary'>Sign up</h1>
                  </div>
                  <div className='mt-5 mb-4'>
                     <input
                        className='form-control py-2'
                        value={username}
                        type='username'
                        id='username'
                        name='username'
                        required
                        onChange={handleInputChange}
                        placeholder='Username'
                     />
                     <div className='invalid-feedback my-2'>Username can't be empty.</div>
                  </div>
                  <div className='mb-4'>
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
                     Sign Up
                  </button>

                  <div className='my-4'>
                     Already have an account? &nbsp;
                     <Link className=' no-underline text-primary' to='/signin'>
                        Sign In
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

export default Signup;
