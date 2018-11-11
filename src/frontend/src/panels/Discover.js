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
        alert('You\'ve reached the end.');
    }

    handleTinderRef(ref) {
        if (!ref) return;
        const computedStyle = getComputedStyle(ref.parentNode);
        const correctHeight = (
            parseInt(computedStyle.height)
            - parseInt(computedStyle.paddingTop)
            - parseInt(computedStyle.paddingBottom)
        );
        this.setState({
            width: ref.parentNode.offsetWidth,
            height: correctHeight
        });
    }

    render() {
        return (
            <React.Fragment>
                <PanelHeader>Лента</PanelHeader>

                <div ref={this.handleTinderRef} className="tinder-container">
                    <Cards
                        onEnd={this.handleStackEnd}
                        size={[this.state.width, this.state.height]}
                        cardSize={[this.state.width * 0.93, this.state.height * 0.86]}>
                        {this.state.animals.map(({id, name, description, photo, type}) => (
                            <Card
                                key={id}
                                onSwipeLeft={this.handleSwipeLeft}
                                onSwipeRight={() => this.handleSwipeRight(id)}>
                                <div className="tinder-card">
                                    <div className="tinder-card-bg" style={{
                                        backgroundImage: `url('${photo}')`
                                    }} />
                                    <div className="tinder-card-summary">
                                        <div className="tinder-card-summary-inner">
                                            <h2 className="tinder-card-name">
                                                <span className="tinder-card-real-name">{name}</span>
                                                {type !== 'cat' && (
                                                    <span className="tinder-card-breed">&nbsp;{type}</span>
                                                )}
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
