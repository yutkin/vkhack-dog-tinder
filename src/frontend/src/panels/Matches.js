import React from 'react';
import PropTypes from 'prop-types';
import { PanelHeader, List, Cell, Avatar } from '@vkontakte/vkui';
import connect from '@vkontakte/vkui-connect';
import VKConnect, { response as res } from '@vkontakte/vkui-connect-mock';

import { getMatches } from '../api/snek';
import usersStub from '../api/stub_users.json';

res.VKWebAppCallAPIMethod.data = {
    type: 'VKWebAppCallAPIMethodResult',
    data: {
        requestId: 'wow',
        response: usersStub
    }
};
console.log(res);

export default class Matches extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            matches: [],
            usersById: null
        };
        this.handleConnectEvent = this.handleConnectEvent.bind(this);
    }

    static propTypes = {
        currentUser: PropTypes.object.isRequired,
        accessToken: PropTypes.string.isRequired
    }

    componentWillMount() {
        this.fetchMatchesAndUsers();

        VKConnect.subscribe(this.handleConnectEvent);
    }

    componentWillUnmount() {
        VKConnect.unsubscribe(this.handleConnectEvent);
    }

    handleConnectEvent(e) {
        if (e.detail.type === 'VKWebAppCallAPIMethodResult') {
            this.setState({
                usersById: e.detail.data.response.reduce((acc, user) => ({
                    ...acc,
                    [user.id]: user
                }), {})
            })
        }
    }

    async fetchMatchesAndUsers() {
        const matches = await getMatches(this.props.currentUser.id);
        this.setState({ matches });

        const userIds = matches.reduce((acc, {liked_by_one: firstUserId, liked_by_two: secondUserId}) => {
            let userId;
            if (firstUserId !== this.props.currentUser.id) {
                userId = firstUserId;
            } else {
                userId = secondUserId;
            }

            if (acc.includes(userId)) return acc;
            return acc.concat(userId);
        }, []);

        VKConnect.send('VKWebAppCallAPIMethod', {
            'method': 'users.get',
            'params': {
                'user_ids': userIds.join(','),
                'fields': 'photo_100',
                'v': '5.87',
                'access_token': this.props.accessToken
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <PanelHeader>Matches</PanelHeader>
                <List>
                    {this.state.usersById && this.state.matches.map((match) => {
                        let userId;
                        if (match.liked_by_one !== this.props.currentUser.id) {
                            userId = match.liked_by_one;
                        } else {
                            userId = match.liked_by_two;
                        }

                        const user = this.state.usersById[userId];
                        return (
                            <Cell
                                key={match.id}
                                before={
                                    <Avatar src={user.photo_100} />
                                }>
                                {`${user.first_name} ${user.last_name}`}
                            </Cell>
                        );
                    })}
                </List>
            </React.Fragment>
        );
    }
}