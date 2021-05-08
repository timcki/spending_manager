import React from 'react';
import Input from '../components/Input';
import {Formik,Form} from 'formik';
import * as Yup from 'yup';
import '../styles/SignUpForm.css';

const SignUpForm = ()=>{

    const signUpData = [
        {
            name:"username",
            type:"text",
            placeholder:"Nazwa użytkownika"
        },
        {
            name:"password",
            type:"password",
            placeholder:"Hasło"
        },
        {
            name:"confirmPassword",
            type:"password",
            placeholder:"Powtórz hasło"
        }
    ]


    return(
        <div className="signup-container">
            <Formik
                initialValues={{
                    username:'',
                    password:'',
                    confirmPassword:''
                }}
                validationSchema={Yup.object({
                    username: Yup.string()
                        .min(4,"Musi być conajmniej 4 znaki")
                        .max(30,"Może być conajwyżej 30 znaków")
                        .required("Pole wymagane"),
                    password: Yup.string()
                        .min(6,"Musi być conajmniej 6 znaki")
                        .max(30,"Może być conajwyżej 30 znaków")
                        .required("Pole wymagane"),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'),null],"Hasła muszą być takie same")
                        .required("Pole wymagane"),
                })}
                onSubmit={(values,{setSubmitting})=>{
                    setTimeout(()=>{
                        alert(JSON.stringify(values,null,2));
                        setSubmitting(false);
                    },400)
                }}
                validateOnBlur={false}
            >
                {(formik)=>(

                    <Form>
                        {
                            signUpData.map(data=>(
                                <Input {...data}/>
                                ))
                        }
                        <button class="login-button" type="submit" disabled={formik.isSubmitting}>Zarejestruj się</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm;