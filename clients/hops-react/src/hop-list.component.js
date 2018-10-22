import React from 'react';
import Hop from './hop.component';

export default class HopsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hops: []
        };
    }

    componentDidMount() {
        fetch('https://dev.api-menuviz.net/hops')
            .then((response) => {
                if (!response.bodyUsed) {
                    return response.json();
                }
            })
            .then((hops) => {
                console.log(hops);
                this.setState({ hops: hops });
                return hops
            });
    }

    renderHop(hop) {
        return (<Hop hop={hop} key={hop.id} />);
    }

    render() {
        const hops = this.state.hops.map(this.renderHop);
        return (
            <div className="hop-list">
                <h1>Hops</h1>
                {hops}
            </div>
        );
    }
}
