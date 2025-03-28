import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
//import T
import Table from 'reactstrap';
import { recomendationVM } from './recomendationVM';

const RecomendationComponent = () => {
    const history = useHistory();
    const vm = useRef(new recomendationVM(history)).current;

    useEffect(() => {
        return () => {/*something*/};
    }, [])

    return (
        <Table className="table-recomend">
            <thead className="headings">
                <tr>
                    <th>
                        <span><strong>Best Performing Recommendations</strong></span>
                    </th>
                    <th>
                        <span><strong>Most Popular Recommendations</strong></span>
                    </th>
                </tr>
            </thead>
        </Table>
    )
}