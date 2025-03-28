import React, { Fragment, useRef, useState, useEffect} from 'react';
import Home from './Home';
import Table from "reactstrap";
import { teamFinalList, listTeam } from '../components/storeFE';

const ResultHardcode: React.FC = () => {
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
                            <p>
                                <ol type="a">
                                    <li>Duke</li>
                                    <li>Kansas</li>
                                    <li>North Carolina</li>
                                    <li>Kentucky</li>
                                </ol>

                                (Strictly data driven, based on past performances in the tournament)
                            </p>
                            <button onClick={}>
                                Save
                            </button>
                            <button onClick={}>
                                Share
                            </button>
                        </td>
                        <td>
                            <p>
                                <ol type="a">
                                    <li>Michigan</li>
                                    <li>North Carolina</li>
                                    <li>Kentucky</li>
                                    <li>Kansas</li>
                                </ol>

                                (Strictly data driven, based on past performances in the tournament)
                            </p>
                            <button onClick={}>
                                Save
                            </button>
                            <button onClick={}>
                                Share
                            </button>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    );
};

export default ResultHardcode