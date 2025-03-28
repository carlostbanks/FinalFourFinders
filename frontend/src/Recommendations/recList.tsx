import React, { useEffect, useRef, useState} from 'react';
import observer from 'mobx-react';

const RecListComponent = (props: {type?: number}) => {
    if(props.type === undefined || null || 0) {
        return;
    }
    else {
        return (
            <div>
                {props.type === 6 && PerformingComponent /*Component below*/}
                {props.type === 7 && PopularityComponent /*Component below*/}
            </div>
        )
    };
};

export const recList = observer(RecListComponent);

export const PerformingComponent = () => {
    return (
        <div>
            <p>
                <ol type='a'>
                    <li>
                        Florida
                    </li>
                    <li>
                        Syracuse
                    </li>
                    <li>
                        Whichita State
                    </li>
                    <li>
                        Dartmouth
                    </li>
                </ol>
            </p>
            <p>
                <br />
                (Strictly data driven, based on past performances in the tournament)
            </p>
            <button onClick={}>
                Save
            </button>
            <button onClick={}>
                Share
            </button>
        </div>
    );
};

export const PopularityComponent = () => {
    return (
        <div>
            <span>(Strictly social media driven, based on popularity)</span>
            <button onClick={}>
                Save
            </button>
            <button onClick={}>
                Share
            </button>
        </div>
    )
}