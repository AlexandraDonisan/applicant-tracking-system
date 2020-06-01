import React from 'react';

const LoadingSpinner = () => (
    // <div className="ui segment">
    //     <div className="ui active inverted dimmer">
    //         <div className="ui medium text loader">Loading</div>
    //     </div>
    //     <p></p>
    //     <p></p>
    //     <p> The computation of scores is underway! </p>
    // </div>


    <div className="ui vertical segment">
        <div className='ui container' style={{ marginTop: '4rem'}}>
            <div className="ui middle aligned center aligned grid">
                <div className="column" style={{ maxWidth: 450 }}>
                    <div className="ui active inverted dimmer">
                        <div className="ui medium text loader">Loading</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="ui vertical segment">
            <div className='ui container' style={{ marginTop: '4rem'}}>
                <div className="ui middle aligned center aligned grid">
                    <h3 className="ui olive center aligned header">
                        The computation of scores is underway!
                    </h3>
                </div>
            </div>
        </div>
    </div>
);

export default LoadingSpinner;