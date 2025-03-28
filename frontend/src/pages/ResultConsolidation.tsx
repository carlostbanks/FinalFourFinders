import React, { Fragment, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { firstTeam, secondTeam, thirdTeam, fourthTeam, listTeam } from "../components/teamStoreFE";

const ResultConsolidation: React.FC = () => {
    return (

    )
}

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