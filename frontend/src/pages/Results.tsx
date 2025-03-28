import React, { Fragment, useRef, useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import { IFinalTeams, ITeamString, firstTeam, fourthTeam, secondTeam, thirdTeam } from '../components/storeFE';
import { listTeam, teamFinalList } from '../components/storeFE';
import Home from './Home';
import Table from "reactstrap";

const Result: React.FC = () => {
    const homVM = useRef(new Home).current;

    var team1: string = "Florida"
    var team2: string = "Syracuse"
    var team3: string = "Dartmouth"
    var team4: string = "Wichita State"

    return (
        <Fragment>
            <Table>
                <thead>
                    <th>
                        <span><strong>Best Performing Recommendations</strong></span>
                    </th>
                    <th>
                        <span><strong>Most Popular Recommendations</strong></span>
                    </th>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div>
                            <PerformanceComponent />
                        </div>
                    </td>
                    <td>
                        <div>
                            <PopularityComponent />
                        </div>
                    </td>
                </tr>
            </tbody>
            </Table>
        </Fragment>
    )
}

export const PerformanceComponent: React.FC = ( ) => {
    return (
        <div>
            <Fragment>
                <Table>
                    <thead>
                        <th>
                            Final Four Teams (by Performance)
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {teamFinalList.one}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {teamFinalList.two}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {teamFinalList.three}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {teamFinalList.four}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Fragment>
        </div>
        <div>
            <span>
                (Strictly data driven, based on past performances in the tournament)
            </span>
            <button onClick={}>
                Save
            </button>
            <button onClick={}>
                Share
            </button>
        </div>
    );
}; 

export const PopularityComponent: React.FC = () => {
    return (
        <div>
            <Fragment>
                <Table>
                    <thead>
                        <th>
                            Final Four Teams (by Popularity)
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {teamFinalList.three}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {teamFinalList.four}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {"Michigan State"}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {teamFinalList.one}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Fragment>
        </div>
        <div>
            <span>
                (Strictly social media driven, based on popularity)
            </span>
            <button onClick={}>
                Save
            </button>
            <button onClick={}>
                Share
            </button>
        </div>
    );
};