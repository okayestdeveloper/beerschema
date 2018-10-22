import React from 'react';

export default class Hop extends React.Component {
    render() {
        return (
            <div className="hop-item">
                <h2>{this.props.hop.label}</h2>
                <p>{this.props.hop.description}</p>
                <ul>
                    <li>AKA: {this.props.hop.aka}</li>
                    <li>Country: {this.props.hop.countryOfOrigin.label}</li>
                </ul>
            </div>
        );
    }
}
