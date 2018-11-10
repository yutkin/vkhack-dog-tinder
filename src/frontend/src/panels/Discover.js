import React from 'react';
import PropTypes from 'prop-types';
import { PanelHeader } from '@vkontakte/vkui';

import Cards, { Card } from 'react-swipe-deck';

import { getAnimals, likeAnimal } from '../api/snek';

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
        this.handleSwipeLeft = this.handleSwipeLeft.bind(this);
        this.handleSwipeRight = this.handleSwipeRight.bind(this);
        this.handleStackEnd = this.handleStackEnd.bind(this);
    }

    static propTypes = {
        currentUser: PropTypes.object.isRequired,
        accessToken: PropTypes.string.isRequired
    }

    componentWillMount() {
        this.fetchAnimals();
    }

    async fetchAnimals() {
        const animals = await getAnimals(this.props.currentUser.id);
        this.setState({ animals });
    }

    async handleSwipeLeft() {
        console.log('nothing');
    }

    async handleSwipeRight(animalId) {
        likeAnimal(animalId, this.props.currentUser.id);
    }

    handleStackEnd() {
        alert('You reached the end.');
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
                        onEnd={this.handleStackEnd}
                        size={[this.state.width, this.state.height]}
                        cardSize={[this.state.width * 0.93, this.state.height * 0.86]}>
                        {this.state.animals.map(({id, name, description, photo}) => (
                            <Card
                                key={id}
                                onSwipeLeft={this.handleSwipeLeft}
                                onSwipeRight={() => this.handleSwipeRight(id)}>
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
