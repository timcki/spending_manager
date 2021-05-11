import React from 'react';
import Input from '../components/Input';
import {Formik,Form} from 'formik';
import * as Yup from 'yup';
import '../styles/LoginForm.css';


const LoginForm = ()=>{

    const loginData = [
        {
            name:"username",
            type:"text",
            placeholder:"Nazwa użytkownika"
        },
        {
            name:"password",
            type:"text",
            placeholder:"Hasło"
        }
    ]


    return(
        <div className="login-container">
            <Formik
                initialValues={{
                    username:'',
                    password:''
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
                })}
                onSubmit={(values,{setSubmitting})=>{
                    setTimeout(()=>{
                        alert(JSON.stringify(values,null,2));
                        setSubmitting(false);
                    },400)
                }}
                validateOnBlur={false}
            >
                {(formik)=>{
                    console.log(formik);
                    return(

                        <Form>
                            {
                                loginData.map(data=>(
                                    <Input {...data}/>
                                ))
                            }
                            <button className="login-button" type="submit" disabled={formik.isSubmitting}>Zaloguj się</button>
                        </Form>
                        )
                }}
            </Formik>
        </div>
    )
}

export default LoginForm;