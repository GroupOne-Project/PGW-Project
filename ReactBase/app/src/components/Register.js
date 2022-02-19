import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'

import { auth, signInWithEmailAndPassword } from 'firebase/auth'

export default function Register(){
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');

    const hundleRegister = () => {
        const auth  = auth();

        signInWithEmailAndPassword(auth, email, password)
    }

    return (
        <div className="register-body">
            <Form>
                <Form.Field>
                    <label>Email</label>
                    <input 
                        placeholder='Enter your Email' 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input 
                        placeholder='Enter your Password' 
                        onChange={(e) => setpassword(e.target.value)}
                    />
                </Form.Field>
                <Form.Button onClick={hundleRegister}>Submit</Form.Button>
            </Form>
        </div>
    )
}