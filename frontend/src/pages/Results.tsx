import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { IFinalTeams, ITeamString, firstTeam, fourthTeam, secondTeam, thirdTeam } from '../components/storeFE';
import { listTeam, teamFinalList } from '../components/storeFE';
import { Table } from "reactstrap"; 

const Result: React.FC = () => {
    var team1: string = "Florida"
    var team2: string = "Syracuse"
    var team3: string = "Dartmouth"
    var team4: string = "Wichita State"

    return (
        <Fragment>
            <Table>
                <thead>
                    <tr>
                        <th>
                            <span><strong>Best Performing Recommendations</strong></span>
                        </th>
                        <th>
                            <span><strong>Most Popular Recommendations</strong></span>
                        </th>
                    </tr>
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

export const PerformanceComponent: React.FC = () => {
    // Placeholder save and share functions
    const handleSave = () => {
        console.log("Saving performance results");
    };
    
    const handleShare = () => {
        console.log("Sharing performance results");
    };
    
    return (
        <Fragment>
            <div>
                <Fragment>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Final Four Teams (by Performance)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {teamFinalList.one.name}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {teamFinalList.two.name}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {teamFinalList.three.name}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {teamFinalList.four.name}
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
                <button onClick={handleSave}>
                    Save
                </button>
                <button onClick={handleShare}>
                    Share
                </button>
            </div>
        </Fragment>
    );
}; 

export const PopularityComponent: React.FC = () => {
    // Placeholder save and share functions
    const handleSave = () => {
        console.log("Saving popularity results");
    };
    
    const handleShare = () => {
        console.log("Sharing popularity results");
    };
    
    return (
        <Fragment>
            <div>
                <Fragment>
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Final Four Teams (by Popularity)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {teamFinalList.three.name}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {teamFinalList.four.name}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {"Michigan State"}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {teamFinalList.one.name}
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
                <button onClick={handleSave}>
                    Save
                </button>
                <button onClick={handleShare}>
                    Share
                </button>
            </div>
        </Fragment>
    );
};

export default Result;