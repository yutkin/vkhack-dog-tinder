import React from 'react';
import { View, Epic, Tabbar, TabbarItem, Panel, PanelHeader } from '@vkontakte/vkui';
import Icon28Favorite from '@vkontakte/icons/dist/28/favorite';
import Icon28Place from '@vkontakte/icons/dist/28/place';
import Icon28More from '@vkontakte/icons/dist/28/more';
import VKConnect, { response as res } from '@vkontakte/vkui-connect-mock';

import Discover from './panels/Discover';
import Matches from './panels/Matches';

import '@vkontakte/vkui/dist/vkui.css';

const APP_ID = 6746937;
const defaultUserId = 23878107;

class App extends React.Component {
    constructor (props) {
        super(props);
    
        this.state = {
            activeStory: 'discover',
            currentUser: null,
            accessToken: null
        };
        this.handleConnectEvent = this.handleConnectEvent.bind(this);
        this.onStoryChange = this.onStoryChange.bind(this);
    }

    componentDidMount() {
        VKConnect.subscribe(this.handleConnectEvent);
        VKConnect.send('VKWebAppGetUserInfo', {});
        VKConnect.send('VKWebAppGetAuthToken', {'app_id': APP_ID, 'scope': 'notify'});
    }

    handleConnectEvent(e) {
        if (e.detail.type === 'VKWebAppGetUserInfoResult') {
            if (!e.detail.data.id) {
                e.detail.data.id = defaultUserId;
            }
            this.setState({ currentUser: e.detail.data });
        } else if (e.detail.type === 'VKWebAppAccessTokenReceived') {
            this.setState({ accessToken: e.detail.data.access_token });
        }
    }
  
    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }

    render () {
        if (!this.state.currentUser || !this.state.accessToken) return null; // must be a spinner

        return (
            <Epic activeStory={this.state.activeStory} tabbar={
                <Tabbar>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'matches'}
                        data-story="matches"
                        label="&nbsp;"
                    ><Icon28Favorite /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'discover'}
                        data-story="discover"
                    ><Icon28Place /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'tasks'}
                        data-story="tasks"
                    ><Icon28More /></TabbarItem>
                </Tabbar>
            }>
                <View id="matches" activePanel="matches">
                    <Panel id="matches">
                        <Matches currentUser={this.state.currentUser} accessToken={this.state.accessToken} />
                    </Panel>
                </View>
                <View id="discover" activePanel="discover">
                    <Panel id="discover">
                        <Discover currentUser={this.state.currentUser} accessToken={this.state.accessToken} />
                    </Panel>
                </View>
                <View id="tasks" activePanel="tasks">
                    <Panel id="tasks">
                        <PanelHeader>Tasks</PanelHeader>
                    </Panel>
                </View>
            </Epic>
        )
    }
}

export default App;
