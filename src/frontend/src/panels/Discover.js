import React from 'react';
import { PanelHeader } from '@vkontakte/vkui';
import Cards, { Card } from 'react-swipe-deck';

import { getAnimals } from '../api/snek';

import '@vkontakte/vkui/dist/vkui.css';
import './Discover.css';

export default class Discover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animals: [],
            width: 0,
            height: 0
        };

        this.handleTinderRef = this.handleTinderRef.bind(this);
    }

    componentWillMount() {
        this.fetchAnimals();
    }

    async fetchAnimals() {
        const animals = await getAnimals();
        this.setState({ animals });
    }

    handleTinderRef(ref) {
        if (!ref) return;
        this.setState({
            width: ref.offsetWidth,
            height: ref.offsetHeight
        });
    }

    render() {
        return (
            <React.Fragment>
                <PanelHeader>Discover</PanelHeader>

                <div ref={this.handleTinderRef} className="tinder-container">
                    <Cards
                        onEnd={() => console.log('end')}
                        size={[this.state.width, this.state.height]}
                        cardSize={[this.state.width * 0.93, this.state.height * 0.86]}>
                        {this.state.animals.map(({id, name, description, photo}) => (
                            <Card
                                key={id}
                                onSwipeLeft={() => console.log('swipe left')}
                                onSwipeRight={() => console.log('swipe right')}>
                                <div className="tinder-card">
                                    <div className="tinder-card-bg" style={{
                                        backgroundImage: `url('${photo}')`
                                    }}></div>
                                    <div className="tinder-card-summary">
                                        <div className="tinder-card-summary-inner">
                                            <h2 className="tinder-card-name">
                                                {name}
                                            </h2>
                                            <div className="tinder-card-descr">
                                                {description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </Cards>
                </div>
            </React.Fragment>
        );
    }
}
