import React, { useEffect, useState, useRef} from 'react';
import observer from 'mobx-react';

export interface IInputs {
    label?: string;
    idAndName: string;
    valid: boolean;
    required?: boolean;
    asterisk?: boolean;
    value: any;
    type: string;
    errorMsg?: string;
    className?: string;
    unitLabel?: string;
    onChange: (event: {}) => void;
    onBlur?: (event: { target: any }) => void;
    onKeyDown?: (event: {}) => void;
    onFocus?: (event: { target: any }) => void;
    autofocus?: boolean;
    step?: string | number;
    disabled?: boolean;
    wrapperClassName?: string;
    placeholder?: string;
    min?: number;
    readOnly?: boolean;
    ariaLabel?: string;
}

const InputComponent = (props: IInputs) => {
    return (
        <div className={'common-input-container'}>
            <input
            className={'usa-input ' + props.className}
            id={props.idAndName}
            data-testid="the-Input"
            name={props.idAndName}
            aria-invalid={!props.valid}
            aria-describedby={props.idAndName + '--err ' + props.idAndName + '--units'}
            aria-required={props.required}
            aria-label={props.ariaLabel}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            onBlur={(e) => {
                if (props.onBlur) props.onBlur(e);
            }}
            autoFocus={props.autofocus}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            step={props.step}
            disabled={props.disabled}
            placeholder={props.placeholder}
            min={props.min}
            readOnly={props.readOnly}
            aria-readonly={props.readOnly}
            />
        </div>
    );
};

export const Input = observer(InputComponent);