import React, {useEffect, useRef, useState, Fragment} from 'react';
import observer from 'mobx-react';
import { Input, IInputs } from '../FormInput/Input';
import { LoginVM } from './LoginVM';

const LoginComponent = () => {
    const vm = useRef( new LoginVM()).current;
    return (
        <div>
            <Input
            label="username"
            idAndName="username"
            type="string"
            valid={true}

        </div>
    )
}